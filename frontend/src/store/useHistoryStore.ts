import { create } from 'zustand';
import api from '../lib/axios';

export interface HistoryRecord {
  id: string;
  type: string;
  title: string;
  date: string;
  duration: string;
  status: string;
  lang: string;
  voice: string;
  fileUrl: string;
  resultText: string;
}

interface HistoryState {
  history: HistoryRecord[];
  isLoading: boolean;
  error: string | null;
  fetchHistory: () => Promise<void>;
  deleteHistory: (id: string) => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  isLoading: false,
  error: null,

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/history');
      set({ history: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch history', 
        isLoading: false 
      });
    }
  },

  deleteHistory: async (id: string) => {
    try {
      await api.delete(`/history/${id}`);
      // Remove it from the local state
      set((state) => ({
        history: state.history.filter((record) => record.id !== id)
      }));
    } catch (error: any) {
      console.error('Failed to delete history record', error);
      throw error;
    }
  }
}));
