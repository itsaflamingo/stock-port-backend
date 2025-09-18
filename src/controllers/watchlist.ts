import pool from "../db/pool";
import { addToWatchlist, createWatchlistTable } from "../db/schemas/watchlist_schema";
import { Sparkline } from "../types/express/sparkline";

/**
 * Creates the watchlist table if it does not exist.
 * @returns {Promise<void>} The result of the query.
 */
async function createWatchlistTableFn() {
    const result = pool.query(createWatchlistTable)
    return result;
}
async function addToWatchlistFn(user_id: string, symbol: string, name: string, current_price: string, sparkline: Sparkline) {
    const result = await pool.query(addToWatchlist, [user_id, symbol, name, current_price, JSON.stringify(sparkline)])
    return result.rows
}

export { createWatchlistTableFn, addToWatchlistFn }