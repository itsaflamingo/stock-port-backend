import { createPositionsTable, getPositionsQuery } from "../db/schemas/positions_schema";
import pool from "../db/pool";

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

export { createPositionsTableFn, getPositions }