// import { createClient } from '@supabase/supabase-js'
// import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';

dotenv.config();

// const client = new Client({
//   connectionString: process.env.DATABASE_URL
// })
// Create a single supabase client for interacting with database
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default supabase;