import { addPositionQuery, createPositionsTable, editPositionQuery, getPositionsQuery } from "../db/schemas/positions_schema.js";
import pool from "../db/pool.js";
import Position from "../types/express/positions.js";
import yahooFinance from "yahoo-finance2";
import { calculateDynamicValues } from "../helper/positions_helper.js";

/**
 * Creates the positions table in the database if it doesn't already exist.
 * @returns {Promise<QueryResult>} The result of the query.
 */
const createPositionsTableFn = async () => {
    const result = await pool.query(createPositionsTable);
    return result.rows[0];
}

/**
 * Retrieves an array of Position objects for a given user id.
 * The objects contain the ticker symbol, quantity, average buy price, and total return.
 * @param {number} userId - The id of the user.
 * @returns {Promise<Position[]>} A promise that resolves with an array of Position objects.
 * Error handling occurs in the router
 */
const getPositions = async (userId: number): Promise<Position[]> => {
    const symbols = await pool.query(getPositionsQuery, [userId]);

    const positions = await Promise.all(
        symbols.rows.map(async (row) => {
            const res = await yahooFinance.search(row.ticker);
            console.log(res.quotes)
            const stockInfo = res.quotes.find(
                (q): any =>
                    "symbol" in q && q.symbol === row.ticker
            );
            const price = await calculateDynamicValues().getRealTimePrice(row.ticker);

            return {
                ...row,
                name: (stockInfo as any).shortname,
                current_price: price
            } as Position;
        })
    )
    return positions;
}
/**
 * @param position object, can include all or some of the following properties: user_id, ticker, quantity, avg_buy_price, buy_date, status, notes
 * @returns new position object, error handling occurs in the router
 */
const addPosition = async (position: Position) => {

    const {
        user_id,
        ticker,
        quantity,
        avg_buy_price,
        buy_date,
        status,
        notes,
    } = position;

    const result = await pool.query(addPositionQuery, [
        user_id,
        ticker,
        quantity,
        avg_buy_price,
        buy_date,
        status,
        notes,
    ]);

    return result.rows[0];
}

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
const editPosition = async (id: number, ticker: string, quantity: number, avg_buy_price: number, buy_date: string, status: string, notes: string): Promise<Position[]> => {
    const result = await pool.query(editPositionQuery, [Number(quantity), avg_buy_price, buy_date, status, notes, ticker, Number(id)]);
    return result.rows[0];
}

export { createPositionsTableFn, getPositions, addPosition, editPosition }