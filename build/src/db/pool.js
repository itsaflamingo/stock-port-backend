"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
exports.default = new pg_1.Pool({
    host: "localhost", // or wherever the db is hosted
    user: process.env.PSQL_USER,
    // password: process.env.PSQL_PASSWORD,
    database: "stock_port",
    port: 5432, // The default port
});
