use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use std::env;
use std::str::FromStr;
use std::sync::Arc;
use tower_http::cors::CorsLayer;
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig,
    native_token::LAMPORTS_PER_SOL,
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    transaction::Transaction as SolanaTransaction,
    system_instruction,
};

pub mod models;
pub mod prisma;

use prisma::PrismaClient;
use models::{
    HealthResponse, PriceResponse, WalletResponse, BalanceResponse, 
    SendRequest, SendResponse, Transaction as ModelTransaction, AirdropRequest, AirdropResponse,
    ChainTransaction, BackupResponse
};

#[derive(Clone)]
pub struct AppState {
    pub db: Arc<PrismaClient>,
    pub rpc: Arc<RpcClient>,
}

pub async fn create_app() -> Router {
    let client = prisma::new_client()
        .await
        .expect("Failed to create Prisma client. Check DATABASE_URL in .env");

    let rpc_url = env::var("SOLANA_RPC_URL").unwrap_or_else(|_| "https://api.devnet.solana.com".to_string());
    let rpc_client = RpcClient::new_with_commitment(rpc_url, CommitmentConfig::confirmed());

    let state = AppState { 
        db: Arc::new(client),
        rpc: Arc::new(rpc_client),
    };

    Router::new()
        .route("/health", get(health))
        .route("/price", get(get_price))
        .route("/wallet/create", post(create_wallet))
        .route("/wallet/:user_id/balance", get(get_balance))
        .route("/wallet/:user_id/transactions", get(get_transactions))
        .route("/wallet/:user_id/chain-history", get(get_chain_history))
        .route("/wallet/:user_id/send", post(send_sol))
        .route("/wallet/:user_id/airdrop", post(request_airdrop))
        .route("/wallet/:user_id/backup", get(get_wallet_backup))
        .layer(CorsLayer::permissive())
        .with_state(state)
}

pub async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        timestamp: chrono::Utc::now().to_rfc3339(),
    })
}

pub async fn get_price() -> Json<PriceResponse> {
    let client = reqwest::Client::new();
    let price = match client
        .get("https://api.coinbase.com/v2/exchange-rates?currency=SOL")
        .header("User-Agent", "solupi-backend")
        .send()
        .await
    {
        Ok(resp) => {
            if let Ok(json) = resp.json::<serde_json::Value>().await {
                json["data"]["rates"]["INR"]
                    .as_str()
                    .and_then(|s| s.parse::<f64>().ok())
                    .filter(|&p| p > 0.0)
                    .unwrap_or(0.0)
            } else {
                0.0
            }
        }
        Err(_) => 0.0,
    };

    let price = if price > 0.0 {
        price
    } else {
        match client
            .get("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT")
            .send()
            .await
        {
            Ok(resp) => {
                if let Ok(json) = resp.json::<serde_json::Value>().await {
                    let usdt = json["price"]
                        .as_str()
                        .and_then(|s| s.parse::<f64>().ok())
                        .unwrap_or(0.0);
                    if usdt > 0.0 { usdt * 84.0 } else { 14200.0 }
                } else {
                    14200.0
                }
            }
            Err(_) => 14200.0,
        }
    };
    Json(PriceResponse { sol_inr: price })
}

pub async fn create_wallet(
    State(state): State<AppState>,
) -> Result<Json<WalletResponse>, StatusCode> {
    let keypair = Keypair::new();
    let pubkey = keypair.pubkey().to_string();
    let privkey_b58 = bs58::encode(keypair.to_bytes()).into_string();

    let user = state.db
        .user()
        .create(
            pubkey.clone(),
            privkey_b58,
            vec![]
        )
        .exec()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(WalletResponse {
        user_id: user.id,
        wallet_address: user.wallet_address,
    }))
}

pub async fn get_balance(
    State(state): State<AppState>,
    Path(user_id): Path<String>,
) -> Result<Json<BalanceResponse>, StatusCode> {
    let user = state.db
        .user()
        .find_unique(prisma::user::id::equals(user_id))
        .exec()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    let pubkey = Pubkey::from_str(user.wallet_address.as_str())
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let lamports = state.rpc.get_balance(&pubkey)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    let sol_balance = lamports as f64 / LAMPORTS_PER_SOL as f64;

    let transactions = state.db
        .transaction()
        .find_many(vec![
            prisma::transaction::wallet_address::equals(user.wallet_address.clone()),
            prisma::transaction::status::equals("success".to_string()),
        ])
        .exec()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let count = transactions.len() as i64;
    let total_inr: f64 = transactions.iter().map(|t| t.amount_inr).sum();
    let total_sol: f64 = transactions.iter().map(|t| t.amount_crypto).sum();

    Ok(Json(BalanceResponse {
        wallet_address: user.wallet_address,
        sol_balance,
        transaction_count: count,
        total_spent_inr: total_inr,
        total_spent_sol: total_sol,
    }))
}

pub async fn get_transactions(
    State(state): State<AppState>,
    Path(user_id): Path<String>,
) -> Result<Json<Vec<ModelTransaction>>, StatusCode> {
    let user = state.db
        .user()
        .find_unique(prisma::user::id::equals(user_id))
        .exec()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    let transactions = state.db
        .transaction()
        .find_many(vec![prisma::transaction::wallet_address::equals(user.wallet_address)])
        .order_by(prisma::transaction::created_at::order(prisma_client_rust::Direction::Desc))
        .exec()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let mapped = transactions.into_iter().map(|t| ModelTransaction {
        id: uuid::Uuid::parse_str(&t.id).unwrap_or_default(),
        wallet_address: t.wallet_address,
        upi_id: t.upi_id,
        merchant_name: t.merchant_name,
        amount_inr: t.amount_inr,
        amount_crypto: t.amount_crypto,
        txn_hash: t.txn_hash,
        status: t.status,
        created_at: chrono::DateTime::parse_from_rfc3339(&t.created_at.to_rfc3339())
            .unwrap_or_default()
            .with_timezone(&chrono::Utc),
    }).collect();

    Ok(Json(mapped))
}

pub async fn get_chain_history(
    State(state): State<AppState>,
    Path(user_id): Path<String>,
) -> Result<Json<Vec<ChainTransaction>>, StatusCode> {
    let user = state.db
        .user()
        .find_unique(prisma::user::id::equals(user_id))
        .exec()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    let pubkey = Pubkey::from_str(&user.wallet_address)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let sigs = state.rpc
        .get_signatures_for_address(&pubkey)
        .unwrap_or_default();

    let mut result: Vec<ChainTransaction> = Vec::new();

    for sig_info in sigs.into_iter().take(30) {
        let sig_str = sig_info.signature.clone();
        let (direction, amount_sol, counterparty) = parse_chain_tx(
            &state, &sig_str, &user.wallet_address
        ).await;

        result.push(ChainTransaction {
            signature: sig_str,
            slot: sig_info.slot,
            timestamp: sig_info.block_time,
            direction,
            amount_sol,
            counterparty,
            status: if sig_info.err.is_some() { "failed".to_string() } else { "success".to_string() },
        });
    }

    Ok(Json(result))
}

async fn parse_chain_tx(
    state: &AppState,
    sig_str: &str,
    wallet_address: &str,
) -> (String, f64, String) {
    let url = state.rpc.url();
    let body = serde_json::json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTransaction",
        "params": [sig_str, {"encoding": "json", "commitment": "confirmed", "maxSupportedTransactionVersion": 0}]
    });

    let client = reqwest::Client::new();
    let resp = match client.post(&url).json(&body).send().await {
        Ok(r) => r,
        Err(_) => return ("unknown".to_string(), 0.0, "Unknown".to_string()),
    };

    let json: serde_json::Value = match resp.json().await {
        Ok(j) => j,
        Err(_) => return ("unknown".to_string(), 0.0, "Unknown".to_string()),
    };

    let result = &json["result"];
    if result.is_null() {
        return ("unknown".to_string(), 0.0, "Unknown".to_string());
    }

    let pre_balances = result["meta"]["preBalances"].as_array().cloned().unwrap_or_default();
    let post_balances = result["meta"]["postBalances"].as_array().cloned().unwrap_or_default();
    let accounts = result["transaction"]["message"]["accountKeys"].as_array().cloned().unwrap_or_default();

    let our_idx = accounts.iter().position(|a| a.as_str().map(|s| s == wallet_address).unwrap_or(false));

    match our_idx {
        None => ("unknown".to_string(), 0.0, "Unknown".to_string()),
        Some(idx) => {
            let pre = pre_balances.get(idx).and_then(|v| v.as_u64()).unwrap_or(0);
            let post = post_balances.get(idx).and_then(|v| v.as_u64()).unwrap_or(0);
            let delta = post as i64 - pre as i64;

            if delta > 0 {
                ("received".to_string(), delta as f64 / LAMPORTS_PER_SOL as f64, "External".to_string())
            } else {
                ("sent".to_string(), (-delta) as f64 / LAMPORTS_PER_SOL as f64, "External".to_string())
            }
        }
    }
}

pub async fn request_airdrop(
    State(state): State<AppState>,
    Path(user_id): Path<String>,
    Json(payload): Json<AirdropRequest>,
) -> Result<Json<AirdropResponse>, StatusCode> {
    let user = state.db
        .user()
        .find_unique(prisma::user::id::equals(user_id))
        .exec()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    let pubkey = Pubkey::from_str(user.wallet_address.as_str())
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let lamports = (payload.amount_sol * LAMPORTS_PER_SOL as f64) as u64;
    let signature = state.rpc.request_airdrop(&pubkey, lamports)
        .map_err(|_| StatusCode::TOO_MANY_REQUESTS)?;

    Ok(Json(AirdropResponse { signature: signature.to_string() }))
}

pub async fn send_sol(
    State(state): State<AppState>,
    Path(user_id): Path<String>,
    Json(payload): Json<SendRequest>,
) -> Result<Json<SendResponse>, (StatusCode, String)> {
    let user = state.db
        .user()
        .find_unique(prisma::user::id::equals(user_id))
        .exec()
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "DB Error".to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "User not found".to_string()))?;

    let keypair = Keypair::from_base58_string(&user.private_key);
    let to_pubkey = Pubkey::from_str(&payload.to_address)
        .map_err(|e| (StatusCode::BAD_REQUEST, format!("Invalid address: {}", e)))?;

    let lamports = (payload.amount_crypto * LAMPORTS_PER_SOL as f64) as u64;
    let recent_blockhash = state.rpc.get_latest_blockhash()
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Blockhash error: {}", e)))?;

    let ix = system_instruction::transfer(&keypair.pubkey(), &to_pubkey, lamports);
    let tx = SolanaTransaction::new_signed_with_payer(&[ix], Some(&keypair.pubkey()), &[&keypair], recent_blockhash);

    let signature = state.rpc.send_and_confirm_transaction(&tx)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Tx failed: {}", e)))?;

    let t = state.db
        .transaction()
        .create(
            payload.upi_id.unwrap_or_else(|| "N/A".to_string()),
            payload.merchant_name.unwrap_or_else(|| "Direct Transfer".to_string()),
            payload.amount_inr,
            payload.amount_crypto,
            signature.to_string(),
            prisma::user::wallet_address::equals(user.wallet_address.clone()),
            vec![prisma::transaction::status::set("success".to_string())]
        )
        .exec()
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Receipt error: {}", e)))?;

    Ok(Json(SendResponse { 
        transaction: ModelTransaction {
            id: uuid::Uuid::parse_str(&t.id).unwrap_or_default(),
            wallet_address: t.wallet_address,
            upi_id: t.upi_id,
            merchant_name: t.merchant_name,
            amount_inr: t.amount_inr,
            amount_crypto: t.amount_crypto,
            txn_hash: t.txn_hash,
            status: t.status,
            created_at: chrono::Utc::now(),
        }
    }))
}

pub async fn get_wallet_backup(
    State(state): State<AppState>,
    Path(user_id): Path<String>,
) -> Result<Json<BackupResponse>, StatusCode> {
    let user = state.db
        .user()
        .find_unique(prisma::user::id::equals(user_id))
        .exec()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    let keypair = Keypair::from_base58_string(&user.private_key);
    Ok(Json(BackupResponse {
        private_key_b58: user.private_key,
        private_key_array: keypair.to_bytes().to_vec(),
        message: "Keep this safe!".to_string(),
    }))
}
