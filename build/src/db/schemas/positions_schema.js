const createPositionsTable = `
CREATE TABLE IF NOT EXISTS positions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  ticker VARCHAR(10) NOT NULL,
  quantity NUMERIC NOT NULL,
  avg_buy_price NUMERIC NOT NULL,
  percent_of_account NUMERIC,
  buy_date DATE,
  status VARCHAR(10) DEFAULT 'open',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ),
  current_price NUMERIC;`;
const getPositionsQuery = `
SELECT *
FROM positions
WHERE user_id = $1;`;
const addPositionQuery = `
INSERT INTO positions (
  user_id,
  ticker,
  quantity,
  avg_buy_price,
  current_price,
  buy_date,
  status,
  notes
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8
)
RETURNING *;`;
const editPositionQuery = `
UPDATE positions
SET 
  quantity = COALESCE($1, quantity),
  avg_buy_price = COALESCE($2, avg_buy_price),
  buy_date = COALESCE($3, buy_date),
  status = COALESCE($4, status),
  notes = COALESCE($5, notes),
  ticker = COALESCE($6, ticker),
  last_updated = CURRENT_TIMESTAMP
WHERE id = $7
RETURNING *;
`;
const deletePositionQuery = `DELETE FROM positions WHERE id = $1 RETURNING id;`;
export { createPositionsTable, getPositionsQuery, addPositionQuery, editPositionQuery, deletePositionQuery };
