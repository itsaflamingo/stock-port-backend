var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { addPositionQuery, createPositionsTable, editPositionQuery, getPositionsQuery } from "../db/schemas/positions_schema.js";
import pool from "../db/pool.js";
import yahooFinance from "yahoo-finance2";
import { calculateDynamicValues } from "../helper/positions_helper.js";
/**
 * Creates the positions table in the database if it doesn't already exist.
 * @returns {Promise<QueryResult>} The result of the query.
 */
const createPositionsTableFn = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query(createPositionsTable);
    return result.rows[0];
});
/**
 * Retrieves an array of Position objects for a given user id.
 * The objects contain the ticker symbol, quantity, average buy price, and total return.
 * @param {number} userId - The id of the user.
 * @returns {Promise<Position[]>} A promise that resolves with an array of Position objects.
 * Error handling occurs in the router
 */
const getPositions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const symbols = yield pool.query(getPositionsQuery, [userId]);
    const positions = yield Promise.all(symbols.rows.map((row) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield yahooFinance.search(row.ticker);
        console.log(res.quotes);
        const stockInfo = res.quotes.find((q) => "symbol" in q && q.symbol === row.ticker);
        const price = yield calculateDynamicValues().getRealTimePrice(row.ticker);
        return Object.assign(Object.assign({}, row), { name: stockInfo.shortname, current_price: price });
    })));
    return positions;
});
/**
 * @param position object, can include all or some of the following properties: user_id, ticker, quantity, avg_buy_price, buy_date, status, notes
 * @returns new position object, error handling occurs in the router
 */
const addPosition = (position) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, ticker, quantity, avg_buy_price, buy_date, status, notes, } = position;
    const result = yield pool.query(addPositionQuery, [
        user_id,
        ticker,
        quantity,
        avg_buy_price,
        buy_date,
        status,
        notes,
    ]);
    return result.rows[0];
});
/**
 *
 * @param id
 * @param ticker
 * @param quantity
 * @param avg_buy_price
 * @param buy_date
 * @param status
 * @param notes
 * @returns updated position object, error handling occurs in the router
 */
const editPosition = (id, ticker, quantity, avg_buy_price, buy_date, status, notes) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query(editPositionQuery, [Number(quantity), avg_buy_price, buy_date, status, notes, ticker, Number(id)]);
    return result.rows[0];
});
export { createPositionsTableFn, getPositions, addPosition, editPosition };
