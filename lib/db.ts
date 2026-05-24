import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.DB_HOST,
      port:     Number(process.env.DB_PORT ?? 3306),
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
    });
  }
  return pool;
}

export async function query<T = unknown>(sql: string, values?: (string | number | null)[]): Promise<T[]> {
  const [rows] = await getPool().execute(sql, values);
  return rows as T[];
}
