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
const watchlist_js_1 = require("../controllers/watchlist.js");
const router = express_1.default.Router();
router.get("/create-table", (_req, res) => {
    const result = (0, watchlist_js_1.createWatchlistTableFn)();
    res.send(result);
});
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        result = yield (0, watchlist_js_1.getWatchlist)(req.body.user_id);
    }
    catch (err) {
        res.send(err);
    }
    res.send(result);
}));
// Sends user_id and symbol to addToWatchlistFn, if successful returns array containing object with stock info, otherwise sends status 500 with error 
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        result = yield (0, watchlist_js_1.addToWatchlistFn)(req.body.user_id, req.body.symbol);
    }
    catch (err) {
        console.error(err);
        res.status(500).send(`API error: ${err}`);
    }
    res.send(result);
}));
// Sends user id and symbol to db, where stock matching symbol is deleted if success, otherwise sends status 500 with error 
router.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        result = yield (0, watchlist_js_1.deleteFromWatchlistFn)(req.body.user_id, req.body.symbol);
    }
    catch (err) {
        res.status(500).send(`API error: ${err}`);
    }
    res.send(result);
}));
exports.default = router;
