const pool = require("../db/pool");

    async function getAllUsernames(): Promise<object[]> {
        const { rows } = await pool.query("SELECT * from usernames")
        return rows;
    }

    async function returnUsername(username: string): Promise<void> {
        await pool.query("INSERT INTO usernames (username) VALUES ($1)", [username]);
    }

    module.exports = {
        getAllUsernames,
        returnUsername
    }