import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  constructor(userRepo, publisher, bookRepo) {
    this.userRepo = userRepo;
    this.publisher = publisher;
    this.bookRepo = bookRepo;
  }

  async register({ name, email, password }) {
    if (!email || !password) throw new Error('email and password required');
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error('email already registered');
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: uuidv4(), name, email, password: hashed, createdAt: new Date().toISOString() };
    await this.userRepo.save(user);
    // publish event
    await this.publisher.publish('user.created', { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt });
    return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
  }

  async verifyCredentials(email, password) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;
    return user;
  }
}
