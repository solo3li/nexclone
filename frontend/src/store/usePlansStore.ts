import { create } from 'zustand';
import api from '../utils/api';

export interface Plan {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  priceUsd: number;
  priceEgp: number;
  durationDays: number;
  monthlyCredits: number;
  ttsEnabled: boolean;
  ttsMaxCharsPerRequest: number;
  ttsCostPerChar: number;
  sttEnabled: boolean;
  sttMaxFileSizeMb: number;
  sttCostPerMinute: number;
  avatarVideoEnabled: boolean;
  avatarVideoCostPerGeneration: number;
  lipSyncEnabled: boolean;
  lipSyncCostPerGeneration: number;
  isFreeTrial: boolean;
}

interface PlansState {
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
}

export const usePlansStore = create<PlansState>((set) => ({
  plans: [],
  isLoading: false,
  error: null,
  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/platform/plans');
      set({ plans: response.data, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching plans:', error);
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to fetch plans', 
        isLoading: false 
      });
    }
  },
}));
