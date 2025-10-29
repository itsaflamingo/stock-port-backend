"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.alterTableUsers = exports.addUser = exports.findUser = exports.select = exports.createType = void 0;
const createType = `
    DO $$ BEGIN 
        CREATE TYPE user_role AS ENUM ('user', 'admin');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$`;
exports.createType = createType;
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
exports.alterTableUsers = alterTableUsers;
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
exports.select = select;
const findUser = `
    SELECT EXISTS (
        SELECT 1
        FROM users
        WHERE username = $1 OR email = $2
    ) AS user_existence;`;
exports.findUser = findUser;
const addUser = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    ON CONFLICT (username, email) DO NOTHING
    RETURNING *;`;
exports.addUser = addUser;
const updateUser = `
    UPDATE users
    SET
    username = COALESCE($2, username),
    email = COALESCE($3, email),
    password = COALESCE($4, password)
    WHERE id = $1
    RETURNING id, username, email;`;
exports.updateUser = updateUser;
const deleteUser = `DELETE FROM users WHERE id = $1 RETURNING id;`;
exports.deleteUser = deleteUser;
exports.default = createUsersTable;
