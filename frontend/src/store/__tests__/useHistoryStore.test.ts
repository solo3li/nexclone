import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useHistoryStore } from '../useHistoryStore';
import api from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/endpoints';

vi.mock('../../utils/api');

describe('useHistoryStore', () => {
  beforeEach(() => {
    useHistoryStore.setState({ historyItems: [], invoices: [], isLoading: false });
    vi.clearAllMocks();
  });

  it('should fetch history', async () => {
    const mockData = [{ id: 1 }, { id: 2 }];
    vi.mocked(api.get).mockResolvedValue({ data: mockData });
    
    const promise = useHistoryStore.getState().fetchHistory();
    expect(useHistoryStore.getState().isLoading).toBe(true);
    
    const result = await promise;
    
    expect(api.get).toHaveBeenCalledWith(API_ENDPOINTS.HISTORY);
    expect(result).toEqual(mockData);
    expect(useHistoryStore.getState().historyItems).toEqual(mockData);
    expect(useHistoryStore.getState().isLoading).toBe(false);
  });

  it('should fetch history item', async () => {
    const mockItem = { id: '1' };
    vi.mocked(api.get).mockResolvedValue({ data: mockItem });
    
    const result = await useHistoryStore.getState().fetchHistoryItem('1');
    expect(api.get).toHaveBeenCalledWith(API_ENDPOINTS.HISTORY_DETAILS('1'));
    expect(result).toEqual(mockItem);
  });

  it('should delete history item and refresh', async () => {
    vi.mocked(api.delete).mockResolvedValue({});
    vi.mocked(api.get).mockResolvedValue({ data: [] });
    
    await useHistoryStore.getState().deleteHistoryItem('1');
    
    expect(api.delete).toHaveBeenCalledWith(API_ENDPOINTS.HISTORY_DETAILS('1'));
    expect(api.get).toHaveBeenCalledWith(API_ENDPOINTS.HISTORY);
  });

  it('should fetch invoices', async () => {
    const mockInvoices = [{ id: 'inv1' }];
    vi.mocked(api.get).mockResolvedValue({ data: { invoices: mockInvoices } });
    
    const promise = useHistoryStore.getState().fetchInvoices();
    expect(useHistoryStore.getState().isLoading).toBe(true);
    
    const result = await promise;
    
    expect(api.get).toHaveBeenCalledWith(API_ENDPOINTS.MY_INVOICES);
    expect(result).toEqual(mockInvoices);
    expect(useHistoryStore.getState().invoices).toEqual(mockInvoices);
    expect(useHistoryStore.getState().isLoading).toBe(false);
  });
});
