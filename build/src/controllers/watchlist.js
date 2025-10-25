var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from "../db/pool.js";
import { addToWatchlist, createWatchlistTable, deleteFromWatchlist, getWatchlistQuery } from "../db/schemas/watchlist_schema.js";
import yahooFinance from "yahoo-finance2";
/**
 * Creates the watchlist table if it does not exist.
 * @returns {Promise<void>} The result of the query.
 */
function createWatchlistTableFn() {
    return __awaiter(this, void 0, void 0, function* () {
        return pool.query(createWatchlistTable);
    });
}
/**
 * Takes symbol(s) from req.body and sends API request per symbol to yahoo finance, which returns array of objects with more info for each symbol
 * @param user_id
 */
function getWatchlist(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const symbols = yield pool.query(getWatchlistQuery, [user_id]);
        const watchlist = yield Promise.allSettled(symbols.rows.map((row) => __awaiter(this, void 0, void 0, function* () {
            const res = yield yahooFinance.search(row.symbol);
            return res.quotes.find((q) => q.symbol === row.symbol);
        })));
        return watchlist;
    });
}
/**
 * Adds a stock to the watchlist.
 * @param {string} user_id - The id of the user.
 * @param {string} symbol - The symbol of the stock.
 * @returns {Promise<object[]>} The result of the query.
 */
function addToWatchlistFn(user_id, symbol) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield pool.query(addToWatchlist, [user_id, symbol]);
        return result.rows;
    });
}
//Delete from watchlist. Error handling will take place in the router, controller will throw error via pool.query
function deleteFromWatchlistFn(user_id, symbol) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield pool.query(deleteFromWatchlist, [user_id, symbol]);
        return result.rows;
    });
}
export { createWatchlistTableFn, getWatchlist, addToWatchlistFn, deleteFromWatchlistFn };
