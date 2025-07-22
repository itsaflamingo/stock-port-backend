import { QueryResult } from "pg";
import pool from "./../db/pool";
import dotenv from "dotenv";

dotenv.config();

async function setUpUsersTable(): Promise<boolean> {

    const SQL = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        password TEXT NOT NULL,
        role VARCHAR(255) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    await pool.query(SQL);

    const status: QueryResult<any> = await pool.query(`
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = 'users'
        ) AS table_existence;`)

    return status.rows[0];
}

async function setUpAdmin(): Promise<object[]> {

    await pool.query(
        `DO $$ BEGIN
            CREATE TYPE user_role AS ENUM ('user', 'admin');
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END $$;
    `)

    const username = process.env.ADMIN_USERNAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;


    const result = await pool.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *', [username, email, password, 'admin']
    )
    return result.rows[0];
}

async function getAllUsernames(): Promise<object[]> {
    const { rows } = await pool.query("SELECT * from usernames")
    return rows;
}

async function returnUsername(username: string): Promise<void> {
    await pool.query("INSERT INTO usernames (username) VALUES ($1)", [username]);
}

export {
    setUpUsersTable,
    setUpAdmin,
    getAllUsernames,
    returnUsername
}