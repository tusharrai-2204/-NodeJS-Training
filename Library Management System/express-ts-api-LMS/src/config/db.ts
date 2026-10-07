import mysql from 'mysql2/promise';

const pool = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'lms',
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;