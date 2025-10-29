import express from "express";
import dotenv from 'dotenv';
// import { requireAuth } from "./middleware/auth";
import usersRouter from "./routes/user.js";
import signUp from "./routes/register.js";
import searchRouter from "./routes/search.js";
import candlesRouter from "./routes/candles.js";
import watchlistRouter from "./routes/watchlist.js";
import positionsRouter from "./routes/positions.js"
import pool from "./db/pool.js";
import index from "./routes/index.js";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./types/express/user.d.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET as string, resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

const port = 5000;

pool.query('SELECT NOW()')
  .then(res => console.log('✅ Connected to DB:', res.rows[0]))
  .catch(err => {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  });

// Use LocalStratefy to authenticate users
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = await rows[0];
      console.log(user)

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      console.log(match)
      if (match == false) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
// To make sure user is logged in and stays logged in passport calls function from express-session that uses data to create cookie called connect.sid, stored in browser 
// serializeUser and deserializeUser are used to make sure that whatever bit of data it’s looking for actually exists in our Database
// serializeUser takes a callback which contains the information we wish to store in the session data
passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).id);
});
// deserializeUser is called when retrieving a session, where it will extract the data we “serialized” then attach something to the .user property of the request object (req.user) for use in the rest of the request.
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use("/", index);
app.use("/user", usersRouter);
app.use("/register", signUp);
app.use("/search", searchRouter);
app.use("/candles", candlesRouter);
app.use("/watchlist", watchlistRouter);
app.use("/positions", positionsRouter);

// src/index.ts
app.post('/login', (req, res, next) => {
  passport.authenticate('local')(req, res, next);
}, (req, res) => {
  try {
    res.status(200).json({ message: 'Login successful', user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.send("logged out");
  });
});


app.listen(port, () => {
  console.log("Server running on port", port);
});
