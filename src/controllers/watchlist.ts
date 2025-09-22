import pool from "../db/pool";
import { addToWatchlist, createWatchlistTable, deleteFromWatchlist } from "../db/schemas/watchlist_schema";
import { Sparkline } from "../types/express/sparkline";

/**
 * Creates the watchlist table if it does not exist.
 * @returns {Promise<void>} The result of the query.
 */
async function createWatchlistTableFn() {
    const result = pool.query(createWatchlistTable)
    return result;
}
/**
 * Adds a stock to the watchlist.
 * @param {string} user_id - The id of the user.
 * @param {string} symbol - The symbol of the stock.
 * @param {string} name - The name of the stock.
 * @param {string} current_price - The current price of the stock.
 * @param {Sparkline} sparkline - The sparkline of the stock.
 * @returns {Promise<object[]>} The result of the query.
 */
async function addToWatchlistFn(user_id: string, symbol: string, name: string, current_price: string, sparkline: Sparkline) {
    let result
    try {
        result = await pool.query(addToWatchlist, [user_id, symbol, name, current_price, JSON.stringify(sparkline)])
    } catch (err) {
        console.error(err);
        throw new Error("API error");
    }
    return result.rows
}
//Delete from watchlist. Error handling will take place in the router, controller will throw error via pool.query
async function deleteFromWatchlistFn(user_id: string, symbol: string) {
    const result = await pool.query(deleteFromWatchlist, [user_id, symbol])
    return result.rows
}
export { createWatchlistTableFn, addToWatchlistFn, deleteFromWatchlistFn }