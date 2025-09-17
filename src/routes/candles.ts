import express from "express"
import yahooFinance from "yahoo-finance2"

const router = express.Router();

router.get("/", async (req, res) => {
    let candles;
    // Get historical data from Yahoo Finance from start to end, representing different candles
    try {
        const result = await yahooFinance.chart(req.body.symbol, {
            period1: req.body.period1,
            period2: req.body.period2,
            interval: req.body.interval
        })

        candles = result.quotes.map(q => ({
            date: q.date,
            open: q.open,
            high: q.high,
            low: q.low,
            close: q.close,
            volume: q.volume,
        }));
    } catch (error: any) {
        console.error(error);
        // Inspect error and decide what to do; often, you may want to just abort:
        console.warn(
            `Skipping yf.quote("${req.body.symbol}"): [${error.name}] ${error.message}`,
        );
        return;
    }

    // send candles
    res.send(candles)
})

export default router;