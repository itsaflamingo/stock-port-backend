import express from "express";
import { calculateDynamicValues, addPosition, createPositionsTableFn, getPositions } from "../controllers/positions";
import Position from "../types/express/positions";

const router = express.Router();

router.get("/create-table", async (_req, res) => {
    let result;

    try {
        result = await createPositionsTableFn();

        if (result === undefined) {
            res.send("Table already exists");
        }
    } catch (err) {
        res.send(err);
    }
    res.send(result);
})

router.get("/", async (req, res) => {
    let result: Position[];

    try {
        result = await getPositions(req.body.user_id);

        if (result === undefined) {
            res.send("User positions has returned undefined");
        }
        else if (result.length === 0) {
            res.send("Oops, looks like you have no positions");
        }

        const totalEarnings = (calculateDynamicValues().getTotal(result));
        console.log(totalEarnings)
        const portfolioPercent = result.map((position: Position) => {
            return {
                ...position,
                percent_of_account: calculateDynamicValues().getPercentOfAccount(position, totalEarnings)
            }
        });

        res.send(portfolioPercent)
    } catch (err) {
        res.send(err);
    }
})

router.post("/", async (req, res) => {
    let result;

    try {
        result = await addPosition(req.body.position);
        console.log(result)
    } catch (err) {
        res.send(err);
    }
    res.send(result);
})

export default router;