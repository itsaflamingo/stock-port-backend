import dotenv from 'dotenv';

dotenv.config();

const username = process.env.PSQL_USER;
const email = process.env.ADMIN_USER_EMAIL;
const password = process.env.ADMIN_USER_PASS;

const insertAdminUser = (
    `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`
)
const params = [username, email, password];

export {
    insertAdminUser,
    params
}