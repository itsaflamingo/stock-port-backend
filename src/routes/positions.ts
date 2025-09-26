import express from "express";
import { calculateDynamicValues, addPosition, createPositionsTableFn, getPositions } from "../controllers/positions";

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
    let result;

    try {
        result = await getPositions(req.body.id);

        if (result === undefined) {
            res.send("User positions has returned undefined");
        }

        const portfolioPercent = (calculateDynamicValues().getTotal(result));

        res.send(portfolioPercent)
    } catch (err) {
        res.send(err);
    }
    res.send(result);
})

router.post("/", async (req, res) => {
    let result;

    try {
        result = await addPosition(req.body.position);
    } catch (err) {
        res.send(err);
    }
    res.send(result);
})

export default router;