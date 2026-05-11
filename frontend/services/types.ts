export interface PayRequest {
  qr_data: string;
  inr_amount: number;
  sns_username: string;
}

export interface PayResponse {
  txn_id: string;
  usdc_amount: number;
  fee_usdc: number;
  status: string;
  merchant_name: string;
  merchant_vpa: string;
  settled_at: string;
}

export interface BalanceResponse {
  usdc_balance: number;
  inr_equivalent: number;
  sns_username: string;
  wallet_address: string;
}

export interface Transaction {
  txn_id: string;
  merchant_name: string;
  inr_amount: number;
  usdc_amount: number;
  status: string;
  timestamp: string;
}
