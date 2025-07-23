import { QueryResult } from "pg";
import pool from "./../db/pool";
import dotenv from "dotenv";
import create_users, { create_type, select } from "../db/schemas/user_schema";

dotenv.config();


async function setUpUsersTable(): Promise<boolean> {
    await pool.query(create_type);
    await pool.query(create_users);

    //Confirm that users table has been created
    const status: QueryResult<any> = await pool.query(select)

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