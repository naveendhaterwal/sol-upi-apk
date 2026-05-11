CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(255) NOT NULL,
    upi_id VARCHAR(255) NOT NULL,
    merchant_name VARCHAR(255) NOT NULL,
    amount_inr DOUBLE PRECISION NOT NULL,
    amount_crypto DOUBLE PRECISION NOT NULL,
    txn_hash VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'success',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wallet FOREIGN KEY (wallet_address) REFERENCES users(wallet_address) ON DELETE CASCADE
);
