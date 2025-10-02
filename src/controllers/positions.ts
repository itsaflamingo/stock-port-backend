import { addPositionQuery, createPositionsTable, editPositionQuery, getPositionsQuery } from "../db/schemas/positions_schema";
import pool from "../db/pool";
import Position from "../types/express/positions";
import yahooFinance from "yahoo-finance2";
import { QuoteResponseObject } from "yahoo-finance2/dist/esm/src/modules/quote";

const createPositionsTableFn = async () => {
    const result = await pool.query(createPositionsTable);
    return result.rows[0];
}

function calculateDynamicValues() {

    const getDailyReturn = (positions: Array<{ current_price: number, prev_close: number, quantity: number }>) => {
        return positions.reduce((acc, pos) => {
            const dailyChange = (pos.current_price - pos.prev_close) * pos.quantity;
            return acc + dailyChange
        }, 0)
    }

    const getTotalReturn = (currentPrice: any, avgBuyPrice: number, quantity: number) => {
        return (currentPrice - avgBuyPrice) * quantity;
    };


    const getRealTimePrice = async (ticker: string) => {
        const quote = await yahooFinance.quote(ticker) as unknown as QuoteResponseObject;
        return quote.regularMarketPrice ?? quote.postMarketPrice ?? null
    }

    const getTotal = (positions: Array<{ quantity: number, avg_buy_price: number }>) => {
        return positions.reduce((accumulator, position) => {
            return accumulator + position.quantity * position.avg_buy_price;
        }, 0);
    }

    const getPercentOfAccount = (position: { quantity: number, avg_buy_price: number }, total: number) => {
        const percentOfPortfolio = position.quantity * position.avg_buy_price / total * 100;
        return percentOfPortfolio;
    }

    return {
        getDailyReturn,
        getTotalReturn,
        getRealTimePrice,
        getTotal,
        getPercentOfAccount
    }

}

/**
 * Retrieves an array of Position objects for a given user id.
 * The objects contain the ticker symbol, quantity, average buy price, and total return.
 * @param {number} userId - The id of the user.
 * @returns {Promise<Position[]>} A promise that resolves with an array of Position objects.
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
 * @param user_id 
 * @param symbol 
 * @returns individual position object
 */
const editPosition = async (id: number, ticker: string, quantity: number, avg_buy_price: number, buy_date: string, status: string, notes: string): Promise<Position[]> => {
    const result = await pool.query(editPositionQuery, [Number(quantity), avg_buy_price, buy_date, status, notes, ticker, Number(id)]);
    return result.rows;
}

export { calculateDynamicValues, createPositionsTableFn, getPositions, addPosition, editPosition }