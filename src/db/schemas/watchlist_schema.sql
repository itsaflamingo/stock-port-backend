CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    -- e.g. AAPL
    symbol VARCHAR(10) NOT NULL,
    -- e.g. Apple Inc.
    name VARCHAR(255) NOT NULL,
    -- last known price
    current_price DECIMAL(10, 2),
    -- mini graph data (past day prices)
    sparkline JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);