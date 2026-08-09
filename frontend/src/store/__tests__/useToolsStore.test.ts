import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useToolsStore } from '../useToolsStore';
import { useAppStore } from '../useAppStore';
import api from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/endpoints';

vi.mock('../../utils/api');

describe('useToolsStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should estimate voice to text', async () => {
    const data = { fileId: '123' };
    vi.mocked(api.post).mockResolvedValue({ data: { cost: 10 } });
    
    const result = await useToolsStore.getState().estimateVoiceToText(data);
    
    expect(api.post).toHaveBeenCalledWith(API_ENDPOINTS.VOICE_TO_TEXT_ESTIMATE, data);
    expect(result).toEqual({ cost: 10 });
  });

  it('should generate voice to text and update user balance', async () => {
    const data = { fileId: '123' };
    vi.mocked(api.post).mockResolvedValue({ data: { newBalance: 90 } });
    
    const mockUpdateUser = vi.fn();
    useAppStore.setState({ updateUser: mockUpdateUser } as any);
    
    const result = await useToolsStore.getState().generateVoiceToText(data);
    
    expect(api.post).toHaveBeenCalledWith(API_ENDPOINTS.VOICE_TO_TEXT_GENERATE, data);
    expect(mockUpdateUser).toHaveBeenCalledWith({ availableCredits: 90 });
    expect(result).toEqual({ newBalance: 90 });
  });

  it('should start avatar and update user balance', async () => {
    const formData = new FormData();
    formData.append('video', 'file');
    vi.mocked(api.post).mockResolvedValue({ data: { newBalance: 80 } });
    
    const mockUpdateUser = vi.fn();
    useAppStore.setState({ updateUser: mockUpdateUser } as any);
    
    const result = await useToolsStore.getState().startAvatar(formData);
    
    expect(api.post).toHaveBeenCalledWith(API_ENDPOINTS.VIDEO_START_AVATAR, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    expect(mockUpdateUser).toHaveBeenCalledWith({ availableCredits: 80 });
    expect(result).toEqual({ newBalance: 80 });
  });
});
