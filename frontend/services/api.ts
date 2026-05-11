import axios, { AxiosError } from 'axios';

const API_BASE_URL =
  (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001').trim();

const COINGECKO_SOL_PRICE_URL =
  (process.env.EXPO_PUBLIC_SOL_PRICE_URL ||
  'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=inr').trim();

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000, // Increased timeout for blockchain txs
});

function extractMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    if (err.code === 'ECONNABORTED') return 'Request timed out.';
    if (!err.response) return 'Cannot reach SolUPI backend.';
    return err.response.data?.message || err.message || 'Server error.';
  }
  if (err instanceof Error) return err.message;
  return 'Unknown error.';
}

export const api = {
  checkHealth: async (): Promise<boolean> => {
    try {
      const res = await client.get('/health', { timeout: 5_000 });
      return res.data?.status === 'ok';
    } catch {
      return false;
    }
  },

  createWallet: async () => {
    try {
      const response = await client.post('/wallet/create');
      return response.data as { user_id: string; wallet_address: string };
    } catch (err) {
      throw new Error(extractMessage(err));
    }
  },

  getTransactions: async (userId: string) => {
    try {
      const response = await client.get(`/wallet/${userId}/transactions`);
      return response.data as any[];
    } catch (err) {
      throw new Error(extractMessage(err));
    }
  },

  getBalance: async (userId: string) => {
    try {
      const response = await client.get(`/wallet/${userId}/balance`);
      return response.data as {
        wallet_address: string;
        sol_balance: number;
        transaction_count: number;
        total_spent_inr: number;
        total_spent_sol: number;
      };
    } catch (err) {
      throw new Error(extractMessage(err));
    }
  },

  sendSol: async (userId: string, data: {
    to_address: string;
    upi_id?: string;
    merchant_name?: string;
    amount_inr: number;
    amount_crypto: number;
  }) => {
    try {
      const response = await client.post(`/wallet/${userId}/send`, data);
      return response.data;
    } catch (err) {
      throw new Error(extractMessage(err));
    }
  },

  requestAirdrop: async (userId: string, amount_sol: number = 1.0) => {
    try {
      const response = await client.post(`/wallet/${userId}/airdrop`, { amount_sol });
      return response.data as { signature: string };
    } catch (err) {
      throw new Error(extractMessage(err));
    }
  },

  getBackup: async (userId: string) => {
    try {
      const response = await client.get(`/wallet/${userId}/backup`);
      return response.data as {
        private_key_b58: string;
        private_key_array: number[];
        message: string;
      };
    } catch (err) {
      throw new Error(extractMessage(err));
    }
  },

  getChainHistory: async (userId: string): Promise<Array<{
    signature: string;
    slot: number;
    timestamp: number | null;
    direction: string;
    amount_sol: number;
    counterparty: string;
    status: string;
  }>> => {
    try {
      const response = await client.get(`/wallet/${userId}/chain-history`, { timeout: 15_000 });
      return response.data;
    } catch (err) {
      console.warn('[api.getChainHistory] Failed:', extractMessage(err));
      return [];
    }
  },

  getPrice: async (): Promise<{ sol_inr: number }> => {
    try {
      const res = await client.get('/price', { timeout: 4_000 });
      if (typeof res.data?.sol_inr === 'number' && res.data.sol_inr > 0) {
        return { sol_inr: res.data.sol_inr };
      }
    } catch {}

    try {
      const response = await axios.get(COINGECKO_SOL_PRICE_URL, { timeout: 8_000 });
      const solInr = response.data?.solana?.inr;
      if (typeof solInr !== 'number' || !Number.isFinite(solInr) || solInr <= 0) {
        throw new Error('Invalid SOL/INR response from CoinGecko');
      }
      return { sol_inr: solInr };
    } catch (err) {
      console.warn('[api.getPrice] All price sources failed, using fallback rate.');
      return { sol_inr: 14000.0 }; // More realistic fallback for SOL
    }
  },
};
