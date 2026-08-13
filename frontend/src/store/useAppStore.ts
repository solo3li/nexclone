import { create } from 'zustand';

export interface AppState {
  user: {
    id: string;
    email: string;
    fullName: string | null;
    country: string;
    imageUrl: string | null;
    isVerified: boolean;
    hasPhoneNumber: boolean;
    isStaff: boolean;
    standardCredits: number;
    premiumCredits: number;
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

    }>;
  } | null;
  isAuthenticated: boolean;
  hasPhoneNumber: boolean;
  isInitializing: boolean;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapse: () => void;
  setUser: (user: any | null) => void;
  updateUser: (data: any) => void;
  setInitializing: (isInit: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  hasPhoneNumber: false,
  isInitializing: true,
  isSidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleSidebarCollapse: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setUser: (user) => set({ user, isAuthenticated: !!user, hasPhoneNumber: user?.hasPhoneNumber ?? false, isInitializing: false }),
  updateUser: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
  setInitializing: (isInit) => set({ isInitializing: isInit }),
  logout: () => {
    set({ user: null, isAuthenticated: false, hasPhoneNumber: false, isInitializing: false });
  }
}));
