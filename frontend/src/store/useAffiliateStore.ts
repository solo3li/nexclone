import { create } from 'zustand';
import api from '../utils/api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AffiliateProfile {
  id: number;
  affiliateDisplayId: string;
  referralCode: string;
  referralLink: string;
  isActive: boolean;
  totalClicks: number;
  createdAt: string;
}

export interface AffiliateCurrencyBalance {
  currency: string;
  available: number;
  pending: number;
}

export interface AffiliateStats {
  totalClicks: number;
  totalSignups: number;
  paidCustomers: number;
  activeSubscriptions: number;
  conversionRate: number;
  balances: AffiliateCurrencyBalance[];
}

export interface AffiliateReferral {
  referralId: number;
  referredUser: { name: string | null; email: string | null } | null;
  clickedAt: string;
  hasConverted: boolean;
  activeSubscription: { planName: string; status: string } | null;
}

export interface AffiliateCommission {
  id: number;
  type: 'FIRST_PURCHASE' | 'RECURRING' | 'REVERSAL';
  amount: number;
  currency: string;
  rate: number;
  status: 'PENDING' | 'AVAILABLE' | 'CANCELLED' | 'REVERSED' | 'PAID';
  createdAt: string;
  availableAt: string;
  paidAt: string | null;
  plan: { name: string; nameAr: string };
  customerName: string;
}

export interface AffiliatePayout {
  id: number;
  amount: number;
  currency: string;
  payoutMethod: string;
  payoutAccount: string;
  status: string;
  rejectionReason: string | null;
  transferReceiptUrl: string | null;
  requestedAt: string;
  processedAt: string | null;
}

export interface PayoutRequest {
  amount: number;
  currency: string;
  payoutMethod: string;
  payoutAccount: string;
  message?: string;
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface AffiliateStore {
  profile: AffiliateProfile | null;
  balances: AffiliateCurrencyBalance[];
  stats: AffiliateStats | null;
  referrals: AffiliateReferral[];
  commissions: AffiliateCommission[];
  payouts: AffiliatePayout[];
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  fetchBalances: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchReferrals: () => Promise<void>;
  fetchCommissions: () => Promise<void>;
  fetchPayouts: () => Promise<void>;
  requestPayout: (data: PayoutRequest) => Promise<{ success: boolean; error?: string }>;
  onboardProfile: (data: { mobileNumber: string; telegramUsername?: string; whatsappNumber?: string; facebookAccount?: string }) => Promise<{ success: boolean; error?: string }>;
}

export const useAffiliateStore = create<AffiliateStore>((set, get) => ({
  profile: null,
  balances: [],
  stats: null,
  referrals: [],
  commissions: [],
  payouts: [],
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/api/affiliate/profile');
      set({ profile: res.data, isLoading: false });
    } catch (e: any) {
      set({ error: e?.response?.data?.error || 'Failed to load profile', isLoading: false });
    }
  },

  fetchBalances: async () => {
    try {
      const res = await api.get('/api/affiliate/balances');
      set({ balances: res.data });
    } catch {}
  },

  fetchStats: async () => {
    try {
      const res = await api.get('/api/affiliate/stats');
      set({ stats: res.data });
    } catch {}
  },

  fetchReferrals: async () => {
    try {
      const res = await api.get('/api/affiliate/referrals');
      set({ referrals: res.data });
    } catch {}
  },

  fetchCommissions: async () => {
    try {
      const res = await api.get('/api/affiliate/commissions');
      set({ commissions: res.data });
    } catch {}
  },

  fetchPayouts: async () => {
    try {
      const res = await api.get('/api/affiliate/payouts');
      set({ payouts: res.data });
    } catch {}
  },

  requestPayout: async (data) => {
    try {
      await api.post('/api/affiliate/payouts', data);
      await get().fetchBalances();
      await get().fetchPayouts();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.response?.data?.error || 'Failed to submit payout request' };
    }
  },

  onboardProfile: async (data) => {
    try {
      const res = await api.post('/api/affiliate/onboard', data);
      set({ profile: res.data, error: null });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.response?.data?.error || 'Failed to onboard affiliate profile' };
    }
  },
}));
