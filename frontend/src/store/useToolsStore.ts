import { create } from 'zustand';
import api from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';
import { useAppStore } from './useAppStore';

interface ToolsState {
  estimateVoiceToText: (data: any) => Promise<any>;
  generateVoiceToText: (data: any) => Promise<any>;
  estimateTextToVoice: (data: any) => Promise<any>;
  generateTextToVoice: (data: any) => Promise<any>;
  startAvatar: (formData: FormData) => Promise<any>;
  startLipsync: (formData: FormData) => Promise<any>;
  startMotionControl: (formData: FormData) => Promise<any>;
}

export const useToolsStore = create<ToolsState>((set) => ({
  estimateVoiceToText: async (data) => {
    const res = await api.post(API_ENDPOINTS.VOICE_TO_TEXT_ESTIMATE, data);
    return res.data;
  },

  generateVoiceToText: async (data) => {
    const res = await api.post(API_ENDPOINTS.VOICE_TO_TEXT_GENERATE, data);
    if (res.data.newBalance !== undefined) {
      useAppStore.getState().updateUser({ availableCredits: res.data.newBalance });
    }
    return res.data;
  },

  estimateTextToVoice: async (data) => {
    const res = await api.post(API_ENDPOINTS.TEXT_TO_VOICE_ESTIMATE, data);
    return res.data;
  },

  generateTextToVoice: async (data) => {
    const res = await api.post(API_ENDPOINTS.TEXT_TO_VOICE_GENERATE, data);
    if (res.data.newBalance !== undefined) {
      useAppStore.getState().updateUser({ availableCredits: res.data.newBalance });
    }
    return res.data;
  },

  startAvatar: async (formData) => {
    const res = await api.post(API_ENDPOINTS.VIDEO_START_AVATAR, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.newBalance !== undefined) {
      useAppStore.getState().updateUser({ availableCredits: res.data.newBalance });
    }
    return res.data;
  },

  startLipsync: async (formData) => {
    const res = await api.post(API_ENDPOINTS.VIDEO_START_LIPSYNC, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.newBalance !== undefined) {
      useAppStore.getState().updateUser({ availableCredits: res.data.newBalance });
    }
    return res.data;
  },

  startMotionControl: async (formData) => {
    const res = await api.post(API_ENDPOINTS.VIDEO_START_MOTION, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.newBalance !== undefined) {
      useAppStore.getState().updateUser({ availableCredits: res.data.newBalance });
    }
    return res.data;
  }
}));
