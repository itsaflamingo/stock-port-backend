interface Position {
    user_id: number;
    ticker: string;
    quantity: number;
    avg_buy_price: number;
    current_price?: number | null;
    percent_of_account?: number | null;
    buy_date: string; // or Date
    status?: string;
    notes?: string | null;
}

export default Position;
