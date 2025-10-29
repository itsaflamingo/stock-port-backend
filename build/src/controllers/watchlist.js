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
exports.createWatchlistTableFn = createWatchlistTableFn;
exports.getWatchlist = getWatchlist;
exports.addToWatchlistFn = addToWatchlistFn;
exports.deleteFromWatchlistFn = deleteFromWatchlistFn;
const pool_js_1 = __importDefault(require("../db/pool.js"));
const watchlist_schema_js_1 = require("../db/schemas/watchlist_schema.js");
const yahoo_finance2_1 = __importDefault(require("yahoo-finance2"));
/**
 * Creates the watchlist table if it does not exist.
 * @returns {Promise<void>} The result of the query.
 */
function createWatchlistTableFn() {
    return __awaiter(this, void 0, void 0, function* () {
        return pool_js_1.default.query(watchlist_schema_js_1.createWatchlistTable);
    });
}
/**
 * Takes symbol(s) from req.body and sends API request per symbol to yahoo finance, which returns array of objects with more info for each symbol
 * @param user_id
 */
function getWatchlist(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const symbols = yield pool_js_1.default.query(watchlist_schema_js_1.getWatchlistQuery, [user_id]);
        const watchlist = yield Promise.allSettled(symbols.rows.map((row) => __awaiter(this, void 0, void 0, function* () {
            const res = yield yahoo_finance2_1.default.search(row.symbol);
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
        const result = yield pool_js_1.default.query(watchlist_schema_js_1.addToWatchlist, [user_id, symbol]);
        return result.rows;
    });
}
//Delete from watchlist. Error handling will take place in the router, controller will throw error via pool.query
function deleteFromWatchlistFn(user_id, symbol) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield pool_js_1.default.query(watchlist_schema_js_1.deleteFromWatchlist, [user_id, symbol]);
        return result.rows;
    });
}
