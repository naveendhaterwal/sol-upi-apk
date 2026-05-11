import { create } from 'zustand';

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export interface PaymentResult {
  txnId: string;
  usdcAmount: number;
  feeUsdc: number;
  status: string;
  merchantName: string;
  settledAt: string;
}

interface PaymentState {
  qrData: string | null;
  merchantName: string;
  merchantVpa: string;
  inrAmount: number;
  usdcAmount: number;
  fee: number;
  txnId: string | null;
  status: PaymentStatus;

  setQrData: (data: string) => void;
  setAmount: (inr: number, usdc: number, fee: number) => void;
  setPaymentResult: (result: PaymentResult) => void;
  setStatus: (status: PaymentStatus) => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  qrData: null,
  merchantName: '',
  merchantVpa: '',
  inrAmount: 0,
  usdcAmount: 0,
  fee: 0,
  txnId: null,
  status: 'idle',

  setQrData: (data: string) => {
    // Basic mock parser
    let name = "Mock Merchant";
    let vpa = "merchant@upi";
    
    if (data.includes("pn=")) {
        const match = data.split("pn=")[1];
        if (match) name = match.split('&')[0].replace(/%20/g, " ");
    }
    if (data.includes("pa=")) {
        const match = data.split("pa=")[1];
        if (match) vpa = match.split('&')[0];
    }
    
    set({ qrData: data, merchantName: name, merchantVpa: vpa });
  },

  setAmount: (inr, usdc, fee) => set({ inrAmount: inr, usdcAmount: usdc, fee }),
  
  setPaymentResult: (result) => set({ 
    txnId: result.txnId, 
    status: 'success' 
  }),
  
  setStatus: (status) => set({ status }),

  reset: () => set({
    qrData: null, merchantName: '', merchantVpa: '',
    inrAmount: 0, usdcAmount: 0, fee: 0,
    txnId: null, status: 'idle'
  }),
}));
