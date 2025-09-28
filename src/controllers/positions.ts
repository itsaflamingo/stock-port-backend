import { addPositionQuery, createPositionsTable, getPositionsQuery } from "../db/schemas/positions_schema";
import pool from "../db/pool";
import Position from "../types/express/positions";
import yahooFinance from "yahoo-finance2";
import { QuoteResponseObject, QuoteResponseArray } from "yahoo-finance2/dist/esm/src/modules/quote";
import { Q } from "vitest/dist/chunks/reporters.d.BFLkQcL6";

const createPositionsTableFn = async () => {
    const result = await pool.query(createPositionsTable);
    return result.rows[0];
}

function calculateDynamicValues() {

    const getTotal = (positions: Array<{ quantity: number, avg_buy_price: number }>) => {
        return positions.reduce((accumulator, position) => {
            return accumulator + position.quantity * position.avg_buy_price;
        }, 0);
    }

    const getPercentOfAccount = (position: { quantity: number, avg_buy_price: number }, total: number) => {
        const percentOfPortfolio = position.quantity * position.avg_buy_price / total * 100;
        console.log("PERCENT OF PORTFOLIO: ", percentOfPortfolio, "TOTAL: ", total, "QUANTITY: ", position.quantity, "AVG BUY PRICE: ", position.avg_buy_price)
        return percentOfPortfolio;
    }

    return {
        getTotal,
        getPercentOfAccount
    }

}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Retrieves an array of Position objects for a given user id.
 * The objects contain the ticker symbol, quantity, average buy price, and total return.
 * @param {number} userId - The id of the user.
 * @returns {Promise<Position[]>} A promise that resolves with an array of Position objects.
 */
/*******  dec6f99a-34ca-47d6-be2e-8bba075f7884  *******/
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
            const quote = await yahooFinance.quote(row.ticker) as unknown as QuoteResponseObject;

            return {
                ...row,
                name: (stockInfo as any).shortname,
                current_price: quote.regularMarketPrice ?? quote.postMarketPrice ?? null
            } as Position;
        })
    )
    return positions;
}

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

export { calculateDynamicValues, createPositionsTableFn, getPositions, addPosition }