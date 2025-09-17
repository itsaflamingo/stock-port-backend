import express from "express"

const router = express.Router();

router.get("/", (_req, res) => {
    res.send("watchlist");
})

router.post("/", (_req, res) => {
    res.send("post watchlist");
})

export default router;