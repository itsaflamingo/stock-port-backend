import { DefaultApi } from "finnhub-ts"

const finnhubClient = new DefaultApi({
    apiKey: process.env.FINNHUB_API,
    isJsonMime: (input) => {
        try {
            JSON.parse(input)
            return true
        } catch (error) { }
        return false
    },
})

export default finnhubClient;