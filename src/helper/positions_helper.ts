import yahooFinance from "yahoo-finance2";
import { QuoteResponseObject } from "yahoo-finance2/dist/esm/src/modules/quote";
import Position from "../types/express/positions.js";
/**
 * @returns helper functions that calculate dynamic values for positions
 * for example: total return: (current price - avg buy price) * quantity
 * dailyReturn: (current price - prev close) * quantity
 * realTimePrice: current price
 * getTotal: total of all positions
 * getPercentOfAccount: percent that each position makes up of account
 */
function calculateDynamicValues() {

    const getDailyReturn = (positions: Array<{ current_price: number, prev_close: number, quantity: number }>) => {
        return positions.reduce((acc, pos) => {
            const dailyChange = (pos.current_price - pos.prev_close) * pos.quantity;
            return acc + dailyChange
        }, 0)
    }

    const getTotalReturn = (currentPrice: any, avgBuyPrice: number, quantity: number) => {
        return (currentPrice - avgBuyPrice) * quantity;
    };


    const getRealTimePrice = async (ticker: string) => {
        const quote = await yahooFinance.quote(ticker) as unknown as QuoteResponseObject;
        return quote.regularMarketPrice ?? quote.postMarketPrice ?? null
    }

    const getTotal = (positions: Array<{ quantity: number, avg_buy_price: number }>) => {
        return positions.reduce((accumulator, position) => {
            return accumulator + position.quantity * position.avg_buy_price;
        }, 0);
    }

    const getPercentOfAccount = (position: { quantity: number, avg_buy_price: number }, total: number) => {
        const percentOfPortfolio = position.quantity * position.avg_buy_price / total * 100;
        return percentOfPortfolio;
    }

    return {
        getDailyReturn,
        getTotalReturn,
        getRealTimePrice,
        getTotal,
        getPercentOfAccount
    }

}

/**
 * 
 * @param positions 
 * @returns portfolio object updated with dynamic values percent_of_account and total_return
 */
function updatePortfolio(positions: Position[]) {
    const totalEarnings = (calculateDynamicValues().getTotal(positions));
    console.log("TOTAL EARNINGS:", totalEarnings)

    const updatedPortfolio = positions.map((position: Position) => {
        return {
            ...position,
            percent_of_account: calculateDynamicValues().getPercentOfAccount(position, totalEarnings),
            total_return: calculateDynamicValues().getTotalReturn(position.current_price, position.avg_buy_price, position.quantity)
        }
    });

    return updatedPortfolio;
}

export { calculateDynamicValues, updatePortfolio }