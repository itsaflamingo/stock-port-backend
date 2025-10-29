"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const finnhub_ts_1 = require("finnhub-ts");
const finnhubClient = new finnhub_ts_1.DefaultApi({
    apiKey: process.env.FINNHUB_API,
    isJsonMime: (input) => {
        try {
            JSON.parse(input);
            return true;
        }
        catch (error) { }
        return false;
    },
});
exports.default = finnhubClient;
