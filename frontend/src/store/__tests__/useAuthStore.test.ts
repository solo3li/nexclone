import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useAuthStore } from '../useAuthStore';
import api from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/endpoints';

vi.mock('../../utils/api');

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, hasPhoneNumber: false, isInitializing: true });
    vi.stubGlobal('localStorage', { setItem: vi.fn(), removeItem: vi.fn() });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should initialize with default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.hasPhoneNumber).toBe(false);
    expect(state.isInitializing).toBe(true);
  });

  it('should set user and update states', () => {
    useAuthStore.getState().setUser({ id: '1', hasPhoneNumber: true });
    const state = useAuthStore.getState();
    expect(state.user).toEqual({ id: '1', hasPhoneNumber: true });
    expect(state.isAuthenticated).toBe(true);
    expect(state.hasPhoneNumber).toBe(true);
  });

  it('should handle fetchMe successfully', async () => {
    const mockUser = { id: '1', hasPhoneNumber: false };
    vi.mocked(api.get).mockResolvedValue({ data: mockUser });

    const result = await useAuthStore.getState().fetchMe();
    
    expect(api.get).toHaveBeenCalledWith(API_ENDPOINTS.ME);
    expect(result).toEqual(mockUser);
    
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.hasPhoneNumber).toBe(false);
    expect(state.isInitializing).toBe(false);
  });

  it('should handle fetchMe failure', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('Auth failed'));

    await expect(useAuthStore.getState().fetchMe()).rejects.toThrow('Auth failed');
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.hasPhoneNumber).toBe(false);
    expect(state.isInitializing).toBe(false);
  });

  it('should login successfully', async () => {
    const credentials = { email: 'test@example.com', password: 'password' };
    const mockResponse = { token: 'test-token', user: { id: '1' } };
    vi.mocked(api.post).mockResolvedValue({ data: mockResponse });
    vi.mocked(api.get).mockResolvedValue({ data: mockResponse.user }); // for fetchMe

    const result = await useAuthStore.getState().login(credentials);
    
    expect(api.post).toHaveBeenCalledWith(API_ENDPOINTS.LOGIN, credentials);
    expect(localStorage.setItem).toHaveBeenCalledWith('jwt_token', 'test-token');
    expect(result).toEqual(mockResponse);
  });

  it('should logout correctly', async () => {
    vi.mocked(api.post).mockResolvedValue({});
    useAuthStore.setState({ user: { id: '1' }, isAuthenticated: true });

    await useAuthStore.getState().logout();
    
    expect(api.post).toHaveBeenCalledWith(API_ENDPOINTS.LOGOUT);
    expect(localStorage.removeItem).toHaveBeenCalledWith('jwt_token');
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
