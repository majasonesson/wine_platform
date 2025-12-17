import { config } from './config/config.mjs';
import sql from 'mssql';

// Single shared pool instance
let pool = null;

/**
 * Connects to the SQL database using static admin credentials.
 * Reuses the same pool if already connected.
 */
export default async function connectToDatabase() {
  if (!pool || !pool.connected) {
    const dbConfig = {
      server: config.server,
      database: config.database,
      user: process.env.SQL_ADMIN,
      password: process.env.SQL_PASSWORD,
      options: config.options,
    };

    pool = await sql.connect(dbConfig);
    console.log('Connected using SQL admin credentials.');
  }

  return pool;
}
