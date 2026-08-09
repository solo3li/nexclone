import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePlansStore } from '../usePlansStore';
import api from '../../utils/api';

vi.mock('../../utils/api');

describe('usePlansStore', () => {
  beforeEach(() => {
    usePlansStore.setState({ plans: [], isLoading: false, error: null });
    vi.clearAllMocks();
  });

  it('should fetch plans successfully', async () => {
    const mockPlans = [{ id: 1, name: 'Basic' }];
    vi.mocked(api.get).mockResolvedValue({ data: mockPlans });
    
    const promise = usePlansStore.getState().fetchPlans();
    expect(usePlansStore.getState().isLoading).toBe(true);
    
    await promise;
    
    expect(api.get).toHaveBeenCalledWith('/api/platform/plans');
    expect(usePlansStore.getState().plans).toEqual(mockPlans);
    expect(usePlansStore.getState().isLoading).toBe(false);
    expect(usePlansStore.getState().error).toBeNull();
  });

  it('should handle fetch plans error', async () => {
    const error = { response: { data: { message: 'Custom error' } } };
    vi.mocked(api.get).mockRejectedValue(error);
    
    await usePlansStore.getState().fetchPlans();
    
    expect(usePlansStore.getState().plans).toEqual([]);
    expect(usePlansStore.getState().isLoading).toBe(false);
    expect(usePlansStore.getState().error).toBe('Custom error');
  });

  it('should handle fallback error message', async () => {
    const error = new Error('Network error');
    vi.mocked(api.get).mockRejectedValue(error);
    
    await usePlansStore.getState().fetchPlans();
    
    expect(usePlansStore.getState().error).toBe('Network error');
  });
});
