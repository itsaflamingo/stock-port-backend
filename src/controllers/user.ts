import { QueryResult } from "pg";
import pool from "../db/pool";
import dotenv from "dotenv";
import createUsersTable, { createType, select, findUser, addUser, alterTableUsers, updateUser, deleteUser } from "../db/schemas/user-schema";
import { insertAdminUser, params } from "../db/queries/admin-user";

dotenv.config();

async function setUpUsersTable(): Promise<boolean> {
    await pool.query(createType);
    await pool.query(createUsersTable);

    //Confirm that users table has been created
    const status: QueryResult<any> = await pool.query(select)

    return status.rows[0]
}

async function setUpAdmin(): Promise<object[]> {
    const result = await pool.query(insertAdminUser, params);
    if (result.rows.length === 0) {
        throw new Error("Admin user already exists")
    }
    return result.rows[0]
}

async function isUserInDb(username: string, email: string): Promise<boolean> {
    //query database for username
    const result = await pool.query(findUser, [username, email])
    //return bool - true if user exists, false if not
    return result.rows[0]
}

async function getAllUsernames(): Promise<object[]> {
    const { rows } = await pool.query("SELECT * from usernames")
    return rows
}

async function addUserIfNotExists(username: string, email: string, password: string): Promise<any> {
    console.log("USERNAME", username, email, password)
    await pool.query(alterTableUsers)
    const result = await pool.query(addUser, [username.toString(), email.toString(), password.toString()])
    console.log("RESULT: ", result.rows[0])
    return result.rows[0]
}

async function updateUserFn(id: number, username: string, email: string, password: string) {
    const result = await pool.query(updateUser, [username, email, password, id])
    return result.rows[0]
}

async function deleteUserFn(id: number) {
    const result = await pool.query(deleteUser, [id])
    return result.rows[0]
}

export {
    setUpUsersTable,
    setUpAdmin,
    getAllUsernames,
    addUserIfNotExists,
    isUserInDb,
    updateUserFn,
    deleteUserFn
}