export class PostgresUserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async init() {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT,
          email TEXT UNIQUE,
          password TEXT,
          created_at TIMESTAMP
        );
      `);
    } finally {
      client.release();
    }
  }

  async save(user) {
    const q = `INSERT INTO users(id,name,email,password,created_at) VALUES($1,$2,$3,$4,$5)
               ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name`;
    await this.pool.query(q, [user.id, user.name, user.email, user.password, user.createdAt]);
    return user;
  }

  async findByEmail(email) {
    const res = await this.pool.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [email]);
    return res.rows[0] || null;
  }
}
