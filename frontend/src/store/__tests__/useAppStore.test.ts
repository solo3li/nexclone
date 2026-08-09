import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAppStore } from '../useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({ user: null, isAuthenticated: false, hasPhoneNumber: false });
    vi.stubGlobal('localStorage', { removeItem: vi.fn() });
    vi.stubGlobal('window', {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should initialize with default state', () => {
    const state = useAppStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.hasPhoneNumber).toBe(false);
  });

  it('should set user and update isAuthenticated and hasPhoneNumber', () => {
    const mockUser = { id: '123', hasPhoneNumber: true };
    useAppStore.getState().setUser(mockUser);
    
    const state = useAppStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.hasPhoneNumber).toBe(true);
  });

  it('should set user to null and update states', () => {
    useAppStore.getState().setUser(null);
    
    const state = useAppStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.hasPhoneNumber).toBe(false);
  });

  it('should update user partially', () => {
    const initialUser = { id: '123', email: 'test@example.com', hasPhoneNumber: false };
    useAppStore.getState().setUser(initialUser);
    
    useAppStore.getState().updateUser({ hasPhoneNumber: true, email: 'new@example.com' });
    
    const state = useAppStore.getState();
    expect(state.user).toEqual({ id: '123', email: 'new@example.com', hasPhoneNumber: true });
  });

  it('should not throw on updateUser if user is null', () => {
    useAppStore.getState().setUser(null);
    useAppStore.getState().updateUser({ email: 'new@example.com' });
    const state = useAppStore.getState();
    expect(state.user).toBeNull();
  });

  it('should logout correctly', () => {
    useAppStore.getState().setUser({ id: '123' });
    useAppStore.getState().logout();
    
    const state = useAppStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.hasPhoneNumber).toBe(false);
    expect(localStorage.removeItem).toHaveBeenCalledWith('jwt_token');
  });
});
