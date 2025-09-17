import express from "express";
import yahooFinance from "yahoo-finance2";

const router = express.Router();

router.get("/", async (req, res) => {
    let result;

    try {
        result = await yahooFinance.search(req.body.symbol);
    } catch (err) {
        console.error(err);
        res.status(500).send("API error");
    }

    res.send(result);
})

export default router;