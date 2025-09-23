import { addPositionQuery, createPositionsTable, getPositionsQuery } from "../db/schemas/positions_schema";
import pool from "../db/pool";
import Position from "../types/express/positions";

const createPositionsTableFn = async () => {
    const result = await pool.query(createPositionsTable);
    return result.rows[0];
}

const getPositions = async (userId: number) => {
    const result = await pool.query(getPositionsQuery, [userId]);

    if (result.rows.length === 0) {
        return "User has no positions";
    }
    return result.rows[0];
}

const addPosition = async (position: Position) => {
    const {
        user_id,
        ticker,
        quantity,
        avg_buy_price,
        total_return,
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
        total_return,
        percent_of_account,
        buy_date,
        status,
        notes,
    ]);

    return result.rows[0];
}
export { createPositionsTableFn, getPositions, addPosition }