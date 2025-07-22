import pool from "../db/pool";

const username = process.env.ADMIN_USERNAME;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

await pool.query(
    'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)', [username, email, password, 'admin']
)