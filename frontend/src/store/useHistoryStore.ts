import { create } from 'zustand';
import api from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';

interface HistoryState {
  historyItems: any[];
  invoices: any[];
  isLoading: boolean;
  
  fetchHistory: () => Promise<any>;
  fetchHistoryItem: (id: string) => Promise<any>;
  deleteHistoryItem: (id: string) => Promise<any>;
  fetchInvoices: () => Promise<any>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  historyItems: [],
  invoices: [],
  isLoading: false,

  fetchHistory: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get(API_ENDPOINTS.HISTORY);
      set({ historyItems: res.data });
      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHistoryItem: async (id) => {
    const res = await api.get(API_ENDPOINTS.HISTORY_DETAILS(id));
    return res.data;
  },

  deleteHistoryItem: async (id) => {
    await api.delete(API_ENDPOINTS.HISTORY_DETAILS(id));
    await get().fetchHistory();
  },

  fetchInvoices: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get(API_ENDPOINTS.MY_INVOICES);
      set({ invoices: res.data.invoices || [] });
      return res.data.invoices || [];
    } finally {
      set({ isLoading: false });
    }
  }
}));
