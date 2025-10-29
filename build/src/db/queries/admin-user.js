"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.params = exports.insertAdminUser = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
exports.insertAdminUser = insertAdminUser;
const params = [username, email, password];
exports.params = params;
