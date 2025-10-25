import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { UserService } from './ports/userService.js';
import { PostgresUserRepository } from './adapters/postgresUserRepo.js';
import { PostgresBookRepository } from './adapters/bookRepo.js';
import { createPool } from './adapters/db.js';
import { RabbitPublisher } from './rabbit/publisher.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/library';
const pool = createPool(databaseUrl);

const userRepo = new PostgresUserRepository(pool);
await userRepo.init();
const bookRepo = new PostgresBookRepository(pool);
await bookRepo.init();

// seed sample books if empty
const existing = await pool.query('SELECT count(*) FROM books');
if (parseInt(existing.rows[0].count,10) === 0) {
  await bookRepo.save({ id: uuidv4(), title: 'Cien Años de Soledad', author: 'Gabriel García Márquez', isbn: '978-0307474728', description: 'Novela emblemática latinoamericana', createdAt: new Date().toISOString() });
  await bookRepo.save({ id: uuidv4(), title: 'El Aleph', author: 'Jorge Luis Borges', isbn: '978-0142437804', description: 'Cuentos breves y densos', createdAt: new Date().toISOString() });
  console.log('Seeded sample books');
}

const publisher = new RabbitPublisher(process.env.RABBITMQ_URL || 'amqp://localhost');
const service = new UserService(userRepo, publisher);
const jwtSecret = process.env.JWT_SECRET || 'please_change_me';

// Register
app.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await service.register({ name, email, password });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await service.verifyCredentials(email, password);
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const token = jwt.sign({ sub: user.id, email: user.email }, jwtSecret, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Protected example
app.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await userRepo.findByEmail(payload.email);
    res.json({ id: user.id, name: user.name, email: user.email, createdAt: user.created_at });
  } catch (err) {
    res.status(401).json({ error: 'invalid token' });
  }
});

// BOOKS endpoints (public list, protected create/delete)
app.get('/books', async (req, res) => {
  try {
    const list = await bookRepo.list(100);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/books', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'missing token' });
    const token = auth.split(' ')[1];
    jwt.verify(token, jwtSecret); // throws if invalid
    const { title, author, isbn, description } = req.body;
    const book = { id: uuidv4(), title, author, isbn, description, createdAt: new Date().toISOString() };
    await bookRepo.save(book);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'missing token' });
    const token = auth.split(' ')[1];
    jwt.verify(token, jwtSecret);
    await bookRepo.delete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log('Users & Books service listening on', port);
});
