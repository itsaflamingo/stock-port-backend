import dotenv from 'dotenv';

dotenv.config();

const username = process.env.PSQL_USER;
const email = process.env.ADMIN_USER_EMAIL;
const password = process.env.ADMIN_USER_PASS;

const insertAdminUser = `
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM users WHERE username = $1 OR email = $2
  ) THEN
    INSERT INTO users (username, email, password) 
    VALUES ($1, $2, $3);
  END IF;
END
$$;
`;


const params = [username, email, password];

export {
    insertAdminUser,
    params
}