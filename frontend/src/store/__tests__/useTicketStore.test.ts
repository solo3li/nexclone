import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTicketStore } from '../useTicketStore';
import api from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/endpoints';

vi.mock('../../utils/api');

describe('useTicketStore', () => {
  beforeEach(() => {
    useTicketStore.setState({ tickets: [], currentTicket: null, isLoading: false });
    vi.clearAllMocks();
  });

  it('should fetch tickets', async () => {
    const mockData = [{ id: '1' }];
    vi.mocked(api.get).mockResolvedValue({ data: mockData });
    
    const promise = useTicketStore.getState().fetchTickets();
    expect(useTicketStore.getState().isLoading).toBe(true);
    
    const result = await promise;
    
    expect(api.get).toHaveBeenCalledWith(API_ENDPOINTS.TICKETS);
    expect(result).toEqual(mockData);
    expect(useTicketStore.getState().tickets).toEqual(mockData);
    expect(useTicketStore.getState().isLoading).toBe(false);
  });

  it('should fetch ticket details', async () => {
    const mockTicket = { id: '1', subject: 'Test' };
    vi.mocked(api.get).mockResolvedValue({ data: mockTicket });
    
    const promise = useTicketStore.getState().fetchTicketDetails('1');
    expect(useTicketStore.getState().isLoading).toBe(true);
    
    const result = await promise;
    
    expect(api.get).toHaveBeenCalledWith(API_ENDPOINTS.TICKET_DETAILS('1'));
    expect(result).toEqual(mockTicket);
    expect(useTicketStore.getState().currentTicket).toEqual(mockTicket);
    expect(useTicketStore.getState().isLoading).toBe(false);
  });

  it('should create ticket and refresh list', async () => {
    const data = { subject: 'Help', message: 'I need help' };
    vi.mocked(api.post).mockResolvedValue({ data: { id: '2' } });
    vi.mocked(api.get).mockResolvedValue({ data: [] });
    
    const result = await useTicketStore.getState().createTicket(data);
    
    expect(api.post).toHaveBeenCalledWith(API_ENDPOINTS.TICKETS, data);
    expect(api.get).toHaveBeenCalledWith(API_ENDPOINTS.TICKETS); // fetchTickets called
    expect(result).toEqual({ id: '2' });
  });

  it('should reply ticket and refresh details', async () => {
    const formData = new FormData();
    formData.append('message', 'Thanks');
    
    vi.mocked(api.post).mockResolvedValue({ data: { success: true } });
    vi.mocked(api.get).mockResolvedValue({ data: { id: '1' } });
    
    const result = await useTicketStore.getState().replyTicket('1', formData);
    
    expect(api.post).toHaveBeenCalledWith(API_ENDPOINTS.TICKET_MESSAGE('1'), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    expect(api.get).toHaveBeenCalledWith(API_ENDPOINTS.TICKET_DETAILS('1'));
    expect(result).toEqual({ success: true });
  });
});
