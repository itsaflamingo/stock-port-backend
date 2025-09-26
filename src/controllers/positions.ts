import { addPositionQuery, createPositionsTable, getPositionsQuery } from "../db/schemas/positions_schema";
import pool from "../db/pool";
import Position from "../types/express/positions";
import yahooFinance from "yahoo-finance2";

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

        return percentOfPortfolio;
    }

    return {
        getTotal,
        getPercentOfAccount
    }

}

const getPositions = async (userId: number) => {
    const symbols = await pool.query(getPositionsQuery, [userId]);

    if (symbols.rows.length === 0) {
        return "User has no positions";
    }

    const positions = await Promise.allSettled(
        symbols.rows.map(async (row) => {
            const res = await yahooFinance.search(row.ticker);
            return res.quotes.find((q: any) => q.symbol === row.ticker);
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
        percent_of_account,
        buy_date,
        status,
        notes,
    } = position;

    const result = await pool.query(addPositionQuery, [
        user_id,
        ticker,
        quantity,
        avg_buy_price,
        percent_of_account,
        buy_date,
        status,
        notes,
    ]);

    return result.rows[0];
}
export { calculateDynamicValues, createPositionsTableFn, getPositions, addPosition }