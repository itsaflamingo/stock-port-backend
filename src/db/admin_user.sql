import pool from "../db/pool";
import dotenv from 'dotenv';

dotenv.config();

pool.query(
    "DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('user', 'admin');
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;
")

const username = process.env.ADMIN_USERNAME;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

const SQL = 'CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password TEXT NOT NULL,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)';

await pool.query(SQL);

await pool.query(
    'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)', [username, email, password, 'admin']
)