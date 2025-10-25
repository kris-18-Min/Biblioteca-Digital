import pkg from 'pg';
const { Pool } = pkg;

export function createPool(databaseUrl) {
  return new Pool({ connectionString: databaseUrl });
}
