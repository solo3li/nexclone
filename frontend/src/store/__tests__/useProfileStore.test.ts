import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProfileStore } from '../useProfileStore';
import { useAuthStore } from '../useAuthStore';
import api from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/endpoints';

vi.mock('../../utils/api');

describe('useProfileStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update profile and fetch me', async () => {
    const formData = new FormData();
    formData.append('name', 'John Doe');
    
    vi.mocked(api.put).mockResolvedValue({ data: { success: true } });
    
    // Mock useAuthStore fetchMe
    const mockFetchMe = vi.fn().mockResolvedValue({});
    useAuthStore.setState({ fetchMe: mockFetchMe } as any);

    const result = await useProfileStore.getState().updateProfile(formData);
    
    expect(api.put).toHaveBeenCalledWith(API_ENDPOINTS.PROFILE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    expect(mockFetchMe).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it('should change password', async () => {
    const data = { oldPassword: 'old', newPassword: 'new' };
    vi.mocked(api.post).mockResolvedValue({ data: { success: true } });
    
    const result = await useProfileStore.getState().changePassword(data);
    
    expect(api.post).toHaveBeenCalledWith(API_ENDPOINTS.CHANGE_PASSWORD, data);
    expect(result).toEqual({ success: true });
  });
});
