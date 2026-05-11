import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

export const useTransactions = (userId: string | null) => {
  return useQuery({
    queryKey: ['transactions', userId],
    queryFn: async () => {
      if (!userId) return [];
      return api.getTransactions(userId);
    },
    enabled: !!userId,
    staleTime: 10_000,
    retry: 1,
  });
};

export const useChainHistory = (userId: string | null) => {
  return useQuery({
    queryKey: ['chain-history', userId],
    queryFn: async () => {
      if (!userId) return [];
      return api.getChainHistory(userId);
    },
    enabled: !!userId,
    staleTime: 30_000,
    retry: 1,
  });
};

export const usePrice = () => {
  return useQuery({
    queryKey: ['price'],
    queryFn: () => api.getPrice(),
    staleTime: 60_000,
    retry: 1,
  });
};

export const useBackendHealth = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => api.checkHealth(),
    staleTime: 30_000,
    retry: 0,
  });
};

export const useRecordPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      userId: string;
      to_address: string;
      upi_id?: string;
      merchant_name?: string;
      amount_inr: number;
      amount_crypto: number;
    }) => {
      const { userId, ...payload } = data;
      return api.sendSol(userId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useAirdrop = () => {
  return useMutation({
    mutationFn: (data: { userId: string; amount_sol?: number }) => {
      return api.requestAirdrop(data.userId, data.amount_sol);
    },
  });
};
