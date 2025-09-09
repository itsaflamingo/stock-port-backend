import express, { Request, Response } from "express";
import dotenv from 'dotenv';
// import { requireAuth } from "./middleware/auth";
import usersRouter from "./routes/user";
import signUp from "./routes/register";
import pool from "./db/pool";
import index from "./routes/index";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

dotenv.config();

const app = express();

app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET as string, resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

const port = 3000;

pool.query('SELECT NOW()')
  .then(res => console.log('✅ Connected to DB:', res.rows[0]))
  .catch(err => {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  });

interface User extends Express.User {
  id: number;
  username: string;
  password: string;
}

// Use LocalStratefy to authenticate users
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = await rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get('/api/positions', async (req: Request, res: Response) => {

  interface User {
    id: number;
    username: string;
    password: string;
  }
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userId = (req.user as User).id;

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
app.use("/register", signUp);

// src/index.ts
app.post('/login', (req, res, next) => {
  passport.authenticate('local')(req, res, next);
}, (req, res) => {
  res.status(200).json({ message: 'Login successful', user: req.user });
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
