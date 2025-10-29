"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
exports.default = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL, // or wherever the db is hosted
    ssl: { rejectUnauthorized: false }, // 👈 important for Supabase
});
