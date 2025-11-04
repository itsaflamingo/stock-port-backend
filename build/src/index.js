"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// import { requireAuth } from "./middleware/auth";
const user_js_1 = __importDefault(require("./routes/user.js"));
const register_js_1 = __importDefault(require("./routes/register.js"));
const search_js_1 = __importDefault(require("./routes/search.js"));
const candles_js_1 = __importDefault(require("./routes/candles.js"));
const watchlist_js_1 = __importDefault(require("./routes/watchlist.js"));
const positions_js_1 = __importDefault(require("./routes/positions.js"));
const pool_js_1 = __importDefault(require("./db/pool.js"));
const index_js_1 = __importDefault(require("./routes/index.js"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_local_1 = require("passport-local");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, express_session_1.default)({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport_1.default.session());
app.use(express_1.default.urlencoded({ extended: false }));
const port = 8080;
pool_js_1.default.query('SELECT NOW()')
    .then(res => console.log('✅ Connected to DB:', res.rows[0]))
    .catch(err => {
        console.error('❌ DB connection failed:', err);
        process.exit(1);
    });
// Use LocalStratefy to authenticate users
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield pool_js_1.default.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = yield rows[0];
        console.log(user);
        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }
        const match = yield bcryptjs_1.default.compare(password, user.password);
        console.log(match);
        if (match == false) {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
})));
// To make sure user is logged in and stays logged in passport calls function from express-session that uses data to create cookie called connect.sid, stored in browser 
// serializeUser and deserializeUser are used to make sure that whatever bit of data it’s looking for actually exists in our Database
// serializeUser takes a callback which contains the information we wish to store in the session data
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
// deserializeUser is called when retrieving a session, where it will extract the data we “serialized” then attach something to the .user property of the request object (req.user) for use in the rest of the request.
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield pool_js_1.default.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = rows[0];
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
app.use("/", index_js_1.default);
app.use("/user", user_js_1.default);
app.use("/register", register_js_1.default);
app.use("/search", search_js_1.default);
app.use("/candles", candles_js_1.default);
app.use("/watchlist", watchlist_js_1.default);
app.use("/positions", positions_js_1.default);
// src/index.ts
app.post('/login', (req, res, next) => {
    passport_1.default.authenticate('local')(req, res, next);
}, (req, res) => {
    try {
        res.status(200).json({ message: 'Login successful', user: req.user });
    }
    catch (err) {
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
