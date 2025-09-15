import express from "express";
import finnhubClient from "../api/finnhub";

const router = express.Router();

router.get("/", (_req, res) => {
    finnhubClient.symbolSearch('apple').then((response) => {
        console.log(response.data)
        res.send(response.data)
    })
})

export default router;