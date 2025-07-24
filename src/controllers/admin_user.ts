import { QueryResult } from "pg";
import pool from "./../db/pool";
import dotenv from "dotenv";
import create_users, { create_type, select } from "../db/schemas/user-schema";
import { insertAdminUser, params } from "../db/queries/admin-user";

dotenv.config();


async function setUpUsersTable(): Promise<boolean> {
    await pool.query(create_type);
    await pool.query(create_users);

    //Confirm that users table has been created
    const status: QueryResult<any> = await pool.query(select)

    return status.rows[0];
}

async function setUpAdmin(): Promise<object[]> {
    const result = await pool.query(insertAdminUser, params);
    if (result.rows.length === 0) {
        throw new Error("Admin user already exists");
    }
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