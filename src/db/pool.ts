import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
export default new Pool({
  connectionString: process.env.DATABASE_URL, // or wherever the db is hosted
  ssl: { rejectUnauthorized: false },  // 👈 important for Supabase
});




