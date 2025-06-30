import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});

pool.connect()
    .then(() => console.log('🟢 Connected to PostgreSQL'))
    .catch((err) => console.error('🔴 DB connection error:', err));

export default pool;
