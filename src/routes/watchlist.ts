import express from "express"
import { addToWatchlistFn, createWatchlistTableFn, deleteFromWatchlistFn, getWatchlist } from "../controllers/watchlist.js";

const router = express.Router();

router.get("/create-table", (_req, res) => {
    const result = createWatchlistTableFn();
    res.send(result);
})
router.get("/", async (req, res) => {
    let result;

    try {
        result = await getWatchlist(req.body.user_id);
    } catch (err) {
        res.send(err);
    }
    res.send(result);
})
// Sends user_id and symbol to addToWatchlistFn, if successful returns array containing object with stock info, otherwise sends status 500 with error 
router.post("/", async (req, res) => {
    let result;

    try {
        result = await addToWatchlistFn(req.body.user_id, req.body.symbol)
    }
    catch (err) {
        console.error(err);
        res.status(500).send(`API error: ${err}`);
    }
    res.send(result);
})
// Sends user id and symbol to db, where stock matching symbol is deleted if success, otherwise sends status 500 with error 
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