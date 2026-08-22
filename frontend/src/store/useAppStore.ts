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
  toolConfigs: Record<string, any> | null;
  setToolConfigs: (configs: Record<string, any>) => void;
  fetchToolConfigs: () => Promise<Record<string, any>>;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapse: () => void;
  setUser: (user: any | null) => void;
  updateUser: (data: any) => void;
  setInitializing: (isInit: boolean) => void;
  logout: () => void;
  logoutAll: () => Promise<void>;
  isLogoutModalOpen: boolean;
  setLogoutModalOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  hasPhoneNumber: false,
  isInitializing: true,
  isSidebarCollapsed: false,
  isLogoutModalOpen: false,
  toolConfigs: null,
  setToolConfigs: (configs) => set({ toolConfigs: configs }),
  fetchToolConfigs: async () => {
    try {
      const { default: api } = await import('../utils/api');
      const res = await api.get('/api/platform/tools-config');
      set({ toolConfigs: res.data });
      return res.data;
    } catch (err) {
      console.error('[Store] Failed to fetch tool configs:', err);
      return get().toolConfigs || {};
    }
  },
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleSidebarCollapse: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setUser: (user) => set({ user, isAuthenticated: !!user, hasPhoneNumber: user?.hasPhoneNumber ?? false, isInitializing: false }),
  updateUser: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
  setInitializing: (isInit) => set({ isInitializing: isInit }),
  logout: () => {
    set({ user: null, isAuthenticated: false, hasPhoneNumber: false, isInitializing: false });
  },
  logoutAll: async () => {
    try {
      const { default: api } = await import('../utils/api');
      await api.post('/api/auth/logout-all');
    } catch (err) {
      console.error('[Store] Logout all failed:', err);
    } finally {
      get().logout();
    }
  },
  setLogoutModalOpen: (isOpen) => set({ isLogoutModalOpen: isOpen })
}));
