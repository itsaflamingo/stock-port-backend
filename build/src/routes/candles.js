"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const yahoo_finance2_1 = __importDefault(require("yahoo-finance2"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let candles;
    // Get historical data from Yahoo Finance from start to end, representing different candles
    try {
        const result = yield yahoo_finance2_1.default.chart(req.body.symbol, {
            period1: req.body.period1,
            period2: req.body.period2,
            interval: req.body.interval
        });
        candles = result.quotes.map(q => ({
            date: q.date,
            open: q.open,
            high: q.high,
            low: q.low,
            close: q.close,
            volume: q.volume,
        }));
    }
    catch (error) {
        console.error(error);
        // Inspect error and decide what to do; often, you may want to just abort:
        res.status(500).send(`Skipping yf.quote("${req.body.symbol}"): [${error.name}] ${error.message}`);
        return;
    }
    // send candles
    res.send(candles);
}));
exports.default = router;
