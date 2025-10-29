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
exports.calculateDynamicValues = calculateDynamicValues;
exports.updatePortfolio = updatePortfolio;
const yahoo_finance2_1 = __importDefault(require("yahoo-finance2"));
/**
 * @returns helper functions that calculate dynamic values for positions
 * for example: total return: (current price - avg buy price) * quantity
 * dailyReturn: (current price - prev close) * quantity
 * realTimePrice: current price
 * getTotal: total of all positions
 * getPercentOfAccount: percent that each position makes up of account
 */
function calculateDynamicValues() {
    const getDailyReturn = (positions) => {
        return positions.reduce((acc, pos) => {
            const dailyChange = (pos.current_price - pos.prev_close) * pos.quantity;
            return acc + dailyChange;
        }, 0);
    };
    const getTotalReturn = (currentPrice, avgBuyPrice, quantity) => {
        return (currentPrice - avgBuyPrice) * quantity;
    };
    const getRealTimePrice = (ticker) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const quote = yield yahoo_finance2_1.default.quote(ticker);
        return (_b = (_a = quote.regularMarketPrice) !== null && _a !== void 0 ? _a : quote.postMarketPrice) !== null && _b !== void 0 ? _b : null;
    });
    const getTotal = (positions) => {
        return positions.reduce((accumulator, position) => {
            return accumulator + position.quantity * position.avg_buy_price;
        }, 0);
    };
    const getPercentOfAccount = (position, total) => {
        const percentOfPortfolio = position.quantity * position.avg_buy_price / total * 100;
        return percentOfPortfolio;
    };
    return {
        getDailyReturn,
        getTotalReturn,
        getRealTimePrice,
        getTotal,
        getPercentOfAccount
    };
}
/**
 *
 * @param positions
 * @returns portfolio object updated with dynamic values percent_of_account and total_return
 */
function updatePortfolio(positions) {
    const totalEarnings = (calculateDynamicValues().getTotal(positions));
    console.log("TOTAL EARNINGS:", totalEarnings);
    const updatedPortfolio = positions.map((position) => {
        return Object.assign(Object.assign({}, position), { percent_of_account: calculateDynamicValues().getPercentOfAccount(position, totalEarnings), total_return: calculateDynamicValues().getTotalReturn(position.current_price, position.avg_buy_price, position.quantity) });
    });
    return updatedPortfolio;
}
