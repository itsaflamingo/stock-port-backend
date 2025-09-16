import express from "express";
import finnhubClient from "../api/finnhub";

const router = express.Router();

router.get("/", (req, res) => {
    try {
        finnhubClient.companyBasicFinancials(req.body.symbol, "all").then((response) => {
            res.send(response.data)
        })
    } catch (err) {
        console.error(err);
        res.status(500).send("API error");
    }
})

export default router;