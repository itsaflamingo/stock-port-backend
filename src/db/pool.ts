import { Pool } from "pg";
// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
export default new Pool({
  host: "localhost", // or wherever the db is hosted
  user: process.env.PSQL_USER,
  // password: process.env.PSQL_PASSWORD,
  database: "stock_port",
  port: 5432, // The default port
});



