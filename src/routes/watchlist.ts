import express from "express"
import { addToWatchlistFn, createWatchlistTableFn, deleteFromWatchlistFn } from "../controllers/watchlist";

const router = express.Router();

router.get("/create-table", (_req, res) => {
    const result = createWatchlistTableFn();
    res.send(result);
})
// Make post request to add to watchlist
router.post("/", async (req, res) => {
    let result;
    try {
        result = await addToWatchlistFn(req.body.user_id, req.body.symbol, req.body.name, req.body.current_price, req.body.sparkline)
    }
    catch (err) {
        console.error(err);
        res.status(500).send(`API error: ${err}`);
    }
    res.send(result);
})
// Make delete request to remove from watchlist
router.delete("/", async (req, res) => {
    let result;
    try {
        result = await deleteFromWatchlistFn(req.body.user_id, req.body.symbol)
    } catch (err) {
        res.status(500).send(`API error: ${err}`)
    }
    res.send(result)
})

export default router;