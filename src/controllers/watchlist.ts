import pool from "../db/pool";
import { addToWatchlist, createWatchlistTable, deleteFromWatchlist, getWatchlistQuery } from "../db/schemas/watchlist_schema";
import yahooFinance from "yahoo-finance2";
/**
 * Creates the watchlist table if it does not exist.
 * @returns {Promise<void>} The result of the query.
 */
async function createWatchlistTableFn() {
    return pool.query(createWatchlistTable);
}
/**
 * Takes symbol(s) from req.body and sends API request per symbol to yahoo finance, which returns array of objects with more info for each symbol 
 * @param user_id 
 */
async function getWatchlist(user_id: string) {
    const symbols = await pool.query(getWatchlistQuery, [user_id]);

    const watchlist = await Promise.allSettled(
        symbols.rows.map(async (row) => {
            const res = await yahooFinance.search(row.symbol);
            return res.quotes.find((q: any) => q.symbol === row.symbol);
        }))

    return watchlist;
}
/**
 * Adds a stock to the watchlist.
 * @param {string} user_id - The id of the user.
 * @param {string} symbol - The symbol of the stock.
 * @returns {Promise<object[]>} The result of the query.
 */
async function addToWatchlistFn(user_id: string, symbol: string) {
    const result = await pool.query(addToWatchlist, [user_id, symbol])
    return result.rows;
}
//Delete from watchlist. Error handling will take place in the router, controller will throw error via pool.query
async function deleteFromWatchlistFn(user_id: string, symbol: string) {
    const result = await pool.query(deleteFromWatchlist, [user_id, symbol])
    return result.rows;
}
export { createWatchlistTableFn, getWatchlist, addToWatchlistFn, deleteFromWatchlistFn }