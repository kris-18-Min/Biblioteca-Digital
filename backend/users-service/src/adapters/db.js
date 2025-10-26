import pkg from 'pg';
const { Pool } = pkg;

export function createPool(databaseUrl) {
  // Si se proporciona DATABASE_URL, usarlo
  if (databaseUrl) {
    return new Pool({ connectionString: databaseUrl });
  }

  // Si no, usar variables individuales
  return new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'library'
  });
}
