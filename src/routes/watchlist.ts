import express from "express"
import { addToWatchlistFn, createWatchlistTableFn } from "../controllers/watchlist";

const router = express.Router();

router.get("/", (_req, res) => {
    const result = createWatchlistTableFn()
    res.send(result)
})

router.post("/", async (req, res) => {
    let result;
    try {
        result = await addToWatchlistFn(req.body.user_id, req.body.symbol, req.body.name, req.body.current_price, req.body.sparkline)
    }
    catch (err) {
        console.error(err);
        res.status(500).send("API error");
    }
    res.send(result);
})

export default router;