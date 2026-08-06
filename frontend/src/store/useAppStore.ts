import { create } from 'zustand';

interface AppState {
  user: {
    id: string;
    email: string;
    fullName: string | null;
    country: string;
    imageUrl: string | null;
    isVerified: boolean;
    hasPhoneNumber: boolean;
    availableCredits: number;
    isStaff: boolean;
    wallets: Array<{
      code: string;
      balance: number;
      subscriptionId: number | null;
    }>;
    activePlan: {
      name: string;
      nameAr: string;
      status: string;
      endDate: string;
      freezeEndDate?: string;
      ttsCustomInstructionsEnabled: boolean;
      avatarVideoCostPerGeneration: number;
      avatarVideoProCost: number;
      lipSyncCostPerGeneration: number;
      sttCostPerMinute: number;
      ttsCostPerChar: number;
      ttsCostPerCharHigh: number;
      isFreeTrial: boolean;
      isDefaultRegistrationPlan: boolean;
    } | null;
    activeSubscriptions: Array<{
      id: number;
      name: string;
      nameAr: string;
      status: string;
      endDate: string;
      freezeEndDate?: string;
      isFreeTrial: boolean;
      isDefaultRegistrationPlan: boolean;
      wallets: Array<{
        code: string;
        balance: number;
      }>;
    }>;
  } | null;
  isAuthenticated: boolean;
  hasPhoneNumber: boolean;
  setUser: (user: any | null) => void;
  updateUser: (data: any) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  hasPhoneNumber: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, hasPhoneNumber: user?.hasPhoneNumber ?? false }),
  updateUser: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
  logout: () => set({ user: null, isAuthenticated: false, hasPhoneNumber: false }),
}));
