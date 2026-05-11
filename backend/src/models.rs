use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: String,
    pub timestamp: String,
}

#[derive(Debug, Serialize)]
pub struct PriceResponse {
    pub sol_inr: f64,
}

#[derive(Debug, Serialize)]
pub struct WalletResponse {
    pub user_id: String,
    pub wallet_address: String,
}

#[derive(Debug, Serialize)]
pub struct BalanceResponse {
    pub wallet_address: String,
    pub sol_balance: f64,
    pub transaction_count: i64,
    pub total_spent_inr: f64,
    pub total_spent_sol: f64,
}

#[derive(Debug, Deserialize)]
pub struct SendRequest {
    pub to_address: String,
    #[serde(default)]
    pub upi_id: Option<String>,
    #[serde(default)]
    pub merchant_name: Option<String>,
    pub amount_inr: f64,
    pub amount_crypto: f64, // SOL amount
}

#[derive(Debug, Serialize, Clone)]
pub struct Transaction {
    pub id: Uuid,
    pub wallet_address: String,
    pub upi_id: String,
    pub merchant_name: String,
    pub amount_inr: f64,
    pub amount_crypto: f64,
    pub txn_hash: String,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct SendResponse {
    pub transaction: Transaction,
}

#[derive(Debug, Serialize)]
pub struct ChainTransaction {
    pub signature: String,
    pub slot: u64,
    pub timestamp: Option<i64>,
    pub direction: String, // "sent" or "received"
    pub amount_sol: f64,
    pub counterparty: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BackupResponse {
    pub private_key_b58: String,
    pub private_key_array: Vec<u8>,
    pub message: String,
}

#[derive(Debug, Deserialize)]
pub struct AirdropRequest {
    pub amount_sol: f64,
}

#[derive(Debug, Serialize)]
pub struct AirdropResponse {
    pub signature: String,
}
