import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import { requireAuth } from "./middleware/auth";
import usersRouter from "./routes/user";
import signUp from "./routes/sign-up";
import pool from "./db/pool";
import index from "./routes/index";

dotenv.config();

const app = express();

app.use(express.json());
const port = 3000;

pool.query('SELECT NOW()')
  .then(res => console.log('✅ Connected to DB:', res.rows[0]))
  .catch(err => {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  });


app.get('/api/positions', requireAuth, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userId = req.user.id;

    // Query DB, return data
    res.json({ positions: [], userId });
  } catch (err) {
    console.error('Error in /positions:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  return;
});

app.use("/", index);
app.use("/user", usersRouter);
app.use("/signup", signUp);

app.listen(port, () => {
  console.log("Server running on port", port);
});
