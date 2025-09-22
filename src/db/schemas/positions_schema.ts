const createPositionsTable = `
CREATE TABLE IF NOT EXISTS positions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  ticker VARCHAR(10) NOT NULL,
  quantity NUMERIC NOT NULL,
  avg_buy_price NUMERIC NOT NULL,
  total_return NUMERIC,
  percent_of_account NUMERIC,
  buy_date DATE,
  status VARCHAR(10) DEFAULT 'open',
  notes TEXT,
  currency VARCHAR(3) DEFAULT 'USD',
  exchange VARCHAR(10),
  sector VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP );`

const getPositionsQuery = `
SELECT *
FROM positions
WHERE user_id = $1;`

export { createPositionsTable, getPositionsQuery }