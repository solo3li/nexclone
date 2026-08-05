import { create } from 'zustand';

interface AppState {
  user: any | null;
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
