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
const positions_js_1 = require("../controllers/positions.js");
const positions_helper_js_1 = require("../helper/positions_helper.js");
const router = express_1.default.Router();
router.get("/create-table", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        result = yield (0, positions_js_1.createPositionsTableFn)();
        if (result === undefined) {
            res.send("Table already exists");
        }
    }
    catch (err) {
        res.send(err);
    }
    res.send(result);
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let positions;
    try {
        positions = yield (0, positions_js_1.getPositions)(req.body.user_id);
        if (positions === undefined) {
            res.send("User positions has returned undefined");
        }
        else if (positions.length === 0) {
            res.send("Oops, looks like you have no positions");
        }
        const updatedPortfolio = (0, positions_helper_js_1.updatePortfolio)(positions);
        res.send(updatedPortfolio);
    }
    catch (err) {
        res.send(err);
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        result = yield (0, positions_js_1.addPosition)(req.body.position);
        console.log(result);
    }
    catch (err) {
        res.send(err);
    }
    res.send(result);
}));
router.patch("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, ticker, quantity, avg_buy_price, buy_date, status, notes } = req.body;
    let position;
    try {
        position = yield (0, positions_js_1.editPosition)(id, ticker, quantity, avg_buy_price, buy_date, status, notes);
        if (position.length === 0) {
            res.send("Oops, looks like you have no positions");
        }
    }
    catch (err) {
        res.send(err);
    }
    res.send(position);
}));
exports.default = router;
