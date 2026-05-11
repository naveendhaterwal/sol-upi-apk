import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';

const USER_ID_KEY = 'solupi_user_id';
const PUBKEY_KEY = 'solupi_pubkey';

interface WalletState {
  userId: string | null;
  publicKey: string | null;
  balance: number;
  isLoading: boolean;
  balanceError: string | null;
  initError: string | null;
  rpcStatus: 'idle' | 'checking' | 'ok' | 'error';

  checkWallet: () => Promise<boolean>;
  initializeWallet: () => Promise<void>;
  createWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  logout: () => Promise<void>;
  clearErrors: () => void;
}

const storage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') localStorage.setItem(key, value);
    else await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') localStorage.removeItem(key);
    else await SecureStore.deleteItemAsync(key);
  },
};

export const useWalletStore = create<WalletState>((set, get) => ({
  userId: null,
  publicKey: null,
  balance: 0,
  isLoading: false,
  balanceError: null,
  initError: null,
  rpcStatus: 'idle',

  checkWallet: async () => {
    const userId = await storage.getItem(USER_ID_KEY);
    return !!userId;
  },

  createWallet: async () => {
    set({ isLoading: true, initError: null, rpcStatus: 'checking' });
    try {
      const { user_id, wallet_address } = await api.createWallet();
      await storage.setItem(USER_ID_KEY, user_id);
      await storage.setItem(PUBKEY_KEY, wallet_address);
      
      set({ userId: user_id, publicKey: wallet_address, rpcStatus: 'ok' });
    } catch (e: any) {
      console.error('Wallet creation error', e);
      set({ initError: e?.message || 'Failed to create custodial wallet on backend.' });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  initializeWallet: async () => {
    set({ isLoading: true, initError: null, rpcStatus: 'checking' });
    try {
      const userId = await storage.getItem(USER_ID_KEY);
      const publicKey = await storage.getItem(PUBKEY_KEY);
      
      if (!userId) throw new Error("No wallet found");
      
      set({ userId, publicKey });
      
      const health = await api.checkHealth();
      set({ rpcStatus: health ? 'ok' : 'error' });
      
      if (health) {
        await get().refreshBalance();
      }
    } catch (e: any) {
      console.error('Wallet init error', e);
      set({ initError: e?.message || 'Failed to initialize wallet.' });
    } finally {
      set({ isLoading: false });
    }
  },

  refreshBalance: async () => {
    const { userId } = get();
    if (!userId) return;
    set({ balanceError: null });
    try {
      const data = await api.getBalance(userId);
      set({ balance: data.sol_balance, rpcStatus: 'ok' });
    } catch (e: any) {
      console.error('Balance fetch error', e);
      set({
        balanceError: 'Could not fetch balance. Backend may be unavailable.',
        rpcStatus: 'error',
      });
    }
  },

  logout: async () => {
    await storage.removeItem(USER_ID_KEY);
    await storage.removeItem(PUBKEY_KEY);
    set({ userId: null, publicKey: null, balance: 0, balanceError: null, initError: null, rpcStatus: 'idle' });
  },

  clearErrors: () => {
    set({ balanceError: null, initError: null });
  },
}));
