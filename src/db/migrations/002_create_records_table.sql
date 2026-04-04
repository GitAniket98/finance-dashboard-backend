CREATE TYPE record_type AS ENUM('income', 'expense');

CREATE TABLE IF NOT EXISTS financial_records (
    id SERIAL PRIMARY KEY,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    type record_type NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)