const createType = `
DO $$ BEGIN 
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$`;

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        password TEXT NOT NULL,
        role user_role DEFAULT ' user ',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

const select = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = 'users'
        ) AS table_existence;`

const findUser = `
    SELECT EXISTS (
        SELECT 1
        FROM users
        WHERE username = $1 OR email = $2
    ) AS user_existence;`

const addUser = `
    INSERT INTO users (username, email, password)
        SELECT $1::VARCHAR, $2::VARCHAR, $3::VARCHAR
            WHERE NOT EXISTS (
                SELECT 1 FROM users WHERE username = $1 OR email = $2
            )
        RETURNING *;
    `

export default createUsersTable
export { createType, select, findUser, addUser }