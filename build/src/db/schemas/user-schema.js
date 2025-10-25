const createType = `
    DO $$ BEGIN 
        CREATE TYPE user_role AS ENUM ('user', 'admin');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$`;
const alterTableUsers = `
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'unique_username_email'
        ) THEN
            ALTER TABLE users 
            ADD CONSTRAINT unique_username_email UNIQUE (username, email);
        END IF;
    END $$;`;
const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        password TEXT NOT NULL,
        role user_role DEFAULT ' user ',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
const select = `
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'users'
    ) AS table_existence;`;
const findUser = `
    SELECT EXISTS (
        SELECT 1
        FROM users
        WHERE username = $1 OR email = $2
    ) AS user_existence;`;
const addUser = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    ON CONFLICT (username, email) DO NOTHING
    RETURNING *;`;
const updateUser = `
    UPDATE users
    SET
    username = COALESCE($2, username),
    email = COALESCE($3, email),
    password = COALESCE($4, password)
    WHERE id = $1
    RETURNING id, username, email;`;
const deleteUser = `DELETE FROM users WHERE id = $1 RETURNING id;`;
export default createUsersTable;
export { createType, select, findUser, addUser, alterTableUsers, updateUser, deleteUser };
