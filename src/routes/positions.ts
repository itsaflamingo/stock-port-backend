import express from "express";
import { addPosition, createPositionsTableFn, getPositions, editPosition } from "../controllers/positions.js";
import Position from "../types/express/positions.d.js";
import { updatePortfolio } from "../helper/positions_helper.js";

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
    let positions: Position[];

    try {
        positions = await getPositions(req.body.user_id);

        if (positions === undefined) {
            res.send("User positions has returned undefined");
        }
        else if (positions.length === 0) {
            res.send("Oops, looks like you have no positions");
        }

        const updatedPortfolio = updatePortfolio(positions);

        res.send(updatedPortfolio)
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

router.patch("/", async (req, res) => {

    const { id, ticker, quantity, avg_buy_price, buy_date, status, notes } = req.body;

    let position;

    try {
        position = await editPosition(id, ticker, quantity, avg_buy_price, buy_date, status, notes);

        if (position.length === 0) {
            res.send("Oops, looks like you have no positions");
        }
    } catch (err) {
        res.send(err);
    }

    res.send(position);
})

export default router;