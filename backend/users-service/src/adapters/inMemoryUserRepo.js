export class InMemoryUserRepository {
  constructor() {
    this.users = new Map();
  }
  async save(user) {
    this.users.set(user.id, user);
    return user;
  }
  async findByEmail(email) {
    for (const u of this.users.values()) if (u.email === email) return u;
    return null;
  }
}
