import express from 'express';
import dotenv from 'dotenv';
import { AuditConsumer } from './rabbit/consumer.js';
import fs from 'fs';
dotenv.config();
const app = express();

const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://rabbitmq';

// Función para intentar conectar a RabbitMQ
const connectWithRetry = async () => {
  const maxRetries = 10;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const consumer = new AuditConsumer(rabbitUrl);
      await consumer.start();
      console.log('✅ Conectado a RabbitMQ');
      return consumer;
    } catch (err) {
      retries++;
      console.log(`⏳ Intentando conectar a RabbitMQ... intento ${retries}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  throw new Error('No se pudo conectar a RabbitMQ después de varios intentos');
};

await connectWithRetry();

app.get('/health', (req,res) => res.json({ ok: true }));

// endpoint to read recent audit logs
app.get('/audit/recent', (req, res) => {
  try {
    const path = 'logs/audit.log';
    if (!fs.existsSync(path)) return res.json({ entries: [] });
    const data = fs.readFileSync(path, 'utf-8').trim().split('\n').reverse().slice(0,50);
    res.json({ entries: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log('Admin service listening on', port));
