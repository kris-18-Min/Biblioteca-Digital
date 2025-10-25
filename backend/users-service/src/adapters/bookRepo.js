export class PostgresBookRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async init() {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS books (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          author TEXT,
          isbn TEXT,
          description TEXT,
          created_at TIMESTAMP
        );
      `);
    } finally {
      client.release();
    }
  }

  async save(book) {
    const q = `INSERT INTO books(id,title,author,isbn,description,created_at)
               VALUES($1,$2,$3,$4,$5,$6)
               ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title`;
    await this.pool.query(q, [book.id, book.title, book.author, book.isbn, book.description, book.createdAt]);
    return book;
  }

  async list(limit=50) {
    const res = await this.pool.query('SELECT * FROM books ORDER BY created_at DESC LIMIT $1', [limit]);
    return res.rows;
  }

  async findById(id) {
    const res = await this.pool.query('SELECT * FROM books WHERE id=$1 LIMIT 1', [id]);
    return res.rows[0] || null;
  }

  async delete(id) {
    await this.pool.query('DELETE FROM books WHERE id=$1', [id]);
    return true;
  }
}
