const create_type = `
DO $$ BEGIN 
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$`;

const create_users_table = `
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

export default create_users_table
export { create_type, select }