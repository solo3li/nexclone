import { create } from 'zustand';
import api from '../lib/axios';

interface User {
  email: string;
  isVerified: boolean;
  fullName?: string;
  country?: string;
  imageUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateProfile: (data: { fullName?: string; country?: string }) => Promise<void>;
  changePassword: (data: any) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start loading as we might need to fetch user on mount
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      // The browser automatically sends the HttpOnly cookie
      const response = await api.get('/Auth/me');
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/Auth/login', credentials);
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials.',
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/Auth/register', userData);
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.join(', ') 
        || error.response?.data?.message 
        || 'Registration failed.';
        
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/Auth/logout');
    } catch (error) {
      console.error('Logout API failed', error);
    }
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.put('/Account/profile', data);
      set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
        isLoading: false
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update profile.',
      });
      throw error;
    }
  },

  changePassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/Account/change-password', data);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to change password.',
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
