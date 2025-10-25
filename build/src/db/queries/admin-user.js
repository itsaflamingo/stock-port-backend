import dotenv from 'dotenv';
dotenv.config();
const username = process.env.PSQL_USER;
const email = process.env.ADMIN_USER_EMAIL;
const password = process.env.ADMIN_USER_PASS;
const insertAdminUser = (`
    WITH new_user AS (
        INSERT INTO users (username, email, password) 
        SELECT $1::text, $2, $3
        WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = $1::text)
        RETURNING *)
    SELECT username, email, role 
    FROM new_user
    UNION ALL
    SELECT username, email, role 
    FROM users WHERE username = $1::text;`);
const params = [username, email, password];
export { insertAdminUser, params };
