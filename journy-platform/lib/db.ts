import sql from 'mssql';

const config = {
  server: process.env.SQL_SERVER as string,
  database: process.env.SQL_DATABASE as string,
  user: process.env.SQL_ADMIN as string,
  password: process.env.SQL_PASSWORD as string,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

let pool: sql.ConnectionPool | null = null;

/**
 * Connects to the SQL database using admin credentials.
 * Reuses the same pool if already connected.
 */
export async function connectToDatabase(): Promise<sql.ConnectionPool> {
  if (!pool || !pool.connected) {
    pool = await sql.connect(config);
    console.log('Connected to SQL Server using admin credentials.');
  }
  return pool;
}

export default connectToDatabase;

