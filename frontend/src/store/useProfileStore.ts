import { create } from 'zustand';
import api from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { useAuthStore } from './useAuthStore';

interface ProfileState {
  updateProfile: (formData: FormData) => Promise<any>;
  changePassword: (data: any) => Promise<any>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  updateProfile: async (formData) => {
    const res = await api.put(API_ENDPOINTS.PROFILE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // Refresh user in auth store
    await useAuthStore.getState().fetchMe();
    return res.data;
  },

  changePassword: async (data) => {
    const res = await api.post(API_ENDPOINTS.CHANGE_PASSWORD, data);
    return res.data;
  }
}));
