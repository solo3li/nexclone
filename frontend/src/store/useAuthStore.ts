import { create } from 'zustand';
import api from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import type { AppState } from './useAppStore';

type AuthUser = AppState['user'];

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
  country?: string;
  refCode?: string;
}

interface AuthState {
  user: AuthUser;
  isAuthenticated: boolean;
  hasPhoneNumber: boolean;
  isInitializing: boolean;
  
  // Actions
  setUser: (user: AuthUser) => void;
  login: (credentials: LoginCredentials) => Promise<any>;
  register: (data: RegisterData) => Promise<any>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<any>;
  googleLogin: (data: { token: string, refCode?: string }) => Promise<any>;
  verifyEmail: (email: string, token: string) => Promise<any>;
  resendVerification: (email: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (data: any) => Promise<any>;
  checkCooldown: (email: string) => Promise<any>;
  addPhone: (data: any) => Promise<any>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  hasPhoneNumber: false,
  isInitializing: true,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user, 
    hasPhoneNumber: user?.hasPhoneNumber ?? false 
  }),

  login: async (credentials) => {
    const res = await api.post(API_ENDPOINTS.LOGIN, credentials);
    await get().fetchMe();
    return res.data;
  },

  register: async (data) => {
    const res = await api.post(API_ENDPOINTS.REGISTER, data);
    return res.data;
  },

  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (e) {
      console.error("Logout API failed", e);
    } finally {
      set({ user: null, isAuthenticated: false, hasPhoneNumber: false });
    }
  },

  fetchMe: async () => {
    try {
      const res = await api.get(API_ENDPOINTS.ME);
      set({ 
        user: res.data, 
        isAuthenticated: true, 
        hasPhoneNumber: res.data?.hasPhoneNumber ?? false,
        isInitializing: false
      });
      return res.data;
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        hasPhoneNumber: false,
        isInitializing: false
      });
      throw error;
    }
  },

  googleLogin: async (data: { token: string, refCode?: string }) => {
    const res = await api.post(API_ENDPOINTS.GOOGLE_LOGIN, data);
    await get().fetchMe();
    return res.data;
  },

  verifyEmail: async (email, token) => {
    const res = await api.post(API_ENDPOINTS.VERIFY_EMAIL, { email, token });
    return res.data;
  },

  resendVerification: async (email) => {
    const res = await api.post(API_ENDPOINTS.RESEND_VERIFICATION, { email });
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    return res.data;
  },

  resetPassword: async (data) => {
    const res = await api.post(API_ENDPOINTS.RESET_PASSWORD, data);
    return res.data;
  },

  checkCooldown: async (email) => {
    const res = await api.get(API_ENDPOINTS.RESEND_COOLDOWN(email));
    return res.data;
  },

  addPhone: async (data) => {
    const res = await api.post(API_ENDPOINTS.ADD_PHONE, data);
    await get().fetchMe();
    return res.data;
  }
}));
