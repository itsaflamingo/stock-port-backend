"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromWatchlist = exports.getWatchlistQuery = exports.addToWatchlist = exports.createWatchlistTable = void 0;
const createWatchlistTable = `
    CREATE TABLE IF NOT EXISTS watchlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        -- e.g. AAPL
        symbol VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW());`;
exports.createWatchlistTable = createWatchlistTable;
const getWatchlistQuery = `
SELECT symbol FROM watchlist WHERE user_id = $1;`;
exports.getWatchlistQuery = getWatchlistQuery;
const addToWatchlist = `
    INSERT INTO watchlist (user_id, symbol)
    VALUES ($1, $2)
    RETURNING *;`;
exports.addToWatchlist = addToWatchlist;
const deleteFromWatchlist = `
    DELETE FROM watchlist
    WHERE user_id = $1 AND symbol = $2
    RETURNING *;`;
exports.deleteFromWatchlist = deleteFromWatchlist;
