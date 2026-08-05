import { create } from 'zustand';
import api from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';

interface TicketState {
  tickets: any[];
  currentTicket: any | null;
  isLoading: boolean;
  
  fetchTickets: () => Promise<any>;
  fetchTicketDetails: (id: string) => Promise<any>;
  createTicket: (data: { subject: string, message: string }) => Promise<any>;
  replyTicket: (id: string, formData: FormData) => Promise<any>;
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [],
  currentTicket: null,
  isLoading: false,

  fetchTickets: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get(API_ENDPOINTS.TICKETS);
      set({ tickets: res.data });
      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTicketDetails: async (id) => {
    set({ isLoading: true });
    try {
      const res = await api.get(API_ENDPOINTS.TICKET_DETAILS(id));
      set({ currentTicket: res.data });
      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },

  createTicket: async (data) => {
    const res = await api.post(API_ENDPOINTS.TICKETS, data);
    await get().fetchTickets();
    return res.data;
  },

  replyTicket: async (id, formData) => {
    const res = await api.post(API_ENDPOINTS.TICKET_MESSAGE(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await get().fetchTicketDetails(id);
    return res.data;
  }
}));
