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
exports.editPosition = exports.addPosition = exports.getPositions = exports.createPositionsTableFn = void 0;
const positions_schema_js_1 = require("../db/schemas/positions_schema.js");
const pool_js_1 = __importDefault(require("../db/pool.js"));
const yahoo_finance2_1 = __importDefault(require("yahoo-finance2"));
const positions_helper_js_1 = require("../helper/positions_helper.js");
/**
 * Creates the positions table in the database if it doesn't already exist.
 * @returns {Promise<QueryResult>} The result of the query.
 */
const createPositionsTableFn = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool_js_1.default.query(positions_schema_js_1.createPositionsTable);
    return result.rows[0];
});
exports.createPositionsTableFn = createPositionsTableFn;
/**
 * Retrieves an array of Position objects for a given user id.
 * The objects contain the ticker symbol, quantity, average buy price, and total return.
 * @param {number} userId - The id of the user.
 * @returns {Promise<Position[]>} A promise that resolves with an array of Position objects.
 * Error handling occurs in the router
 */
const getPositions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const symbols = yield pool_js_1.default.query(positions_schema_js_1.getPositionsQuery, [userId]);
    const positions = yield Promise.all(symbols.rows.map((row) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield yahoo_finance2_1.default.search(row.ticker);
        console.log(res.quotes);
        const stockInfo = res.quotes.find((q) => "symbol" in q && q.symbol === row.ticker);
        const price = yield (0, positions_helper_js_1.calculateDynamicValues)().getRealTimePrice(row.ticker);
        return Object.assign(Object.assign({}, row), { name: stockInfo.shortname, current_price: price });
    })));
    return positions;
});
exports.getPositions = getPositions;
/**
 * @param position object, can include all or some of the following properties: user_id, ticker, quantity, avg_buy_price, buy_date, status, notes
 * @returns new position object, error handling occurs in the router
 */
const addPosition = (position) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, ticker, quantity, avg_buy_price, buy_date, status, notes, } = position;
    const result = yield pool_js_1.default.query(positions_schema_js_1.addPositionQuery, [
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
exports.addPosition = addPosition;
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
    const result = yield pool_js_1.default.query(positions_schema_js_1.editPositionQuery, [Number(quantity), avg_buy_price, buy_date, status, notes, ticker, Number(id)]);
    return result.rows[0];
});
exports.editPosition = editPosition;
