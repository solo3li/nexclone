import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ProfilePage from '../page';
import { useAuthStore } from '../../../../src/store/useAuthStore';
import { useProfileStore } from '../../../../src/store/useProfileStore';
import { useHistoryStore } from '../../../../src/store/useHistoryStore';

// Mock dependencies
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('../../../../src/store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../../../../src/store/useProfileStore', () => ({
  useProfileStore: vi.fn(),
}));

vi.mock('../../../../src/store/useHistoryStore', () => ({
  useHistoryStore: vi.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('ProfilePage', () => {
  const mockUpdateProfile = vi.fn();
  const mockChangePassword = vi.fn();
  const mockFetchHistory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useAuthStore as any).mockReturnValue({
      user: { fullName: 'Test User', email: 'test@example.com', imageUrl: null },
      isAuthenticated: true,
      isInitializing: false,
    });
    
    (useProfileStore as any).mockReturnValue({
      updateProfile: mockUpdateProfile,
      changePassword: mockChangePassword,
    });
    
    (useHistoryStore as any).mockReturnValue({
      fetchHistory: mockFetchHistory.mockResolvedValue([{ id: 1 }]),
    });
    
    // Mock global alert
    global.alert = vi.fn();
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
  });

  it('renders loading state when initializing', () => {
    (useAuthStore as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isInitializing: true,
    });
    
    const { container } = render(<ProfilePage />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders login prompt when not authenticated', () => {
    (useAuthStore as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isInitializing: false,
    });
    
    render(<ProfilePage />);
    expect(screen.getByText('Login to continue')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Join Now')).toBeInTheDocument();
  });

  it('renders profile data when authenticated', async () => {
    render(<ProfilePage />);
    
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(mockFetchHistory).toHaveBeenCalled();
    });
  });

  it('handles profile update', async () => {
    mockUpdateProfile.mockResolvedValue({ fullName: 'Updated User', imageUrl: null });
    
    render(<ProfilePage />);
    
    const nameInput = screen.getByDisplayValue('Test User');
    fireEvent.change(nameInput, { target: { value: 'Updated User' } });
    
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('Profile updated successfully');
    });
  });

  it('handles password change', async () => {
    mockChangePassword.mockResolvedValue({});
    
    render(<ProfilePage />);
    
    // Find password inputs by matching their parent labels or index
    // Since there are two password inputs without explicit accessible names, we query by type
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    expect(passwordInputs.length).toBe(2);
    
    fireEvent.change(passwordInputs[0], { target: { value: 'oldpass' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'newpass' } });
    
    const updateBtn = screen.getByText('Update Password');
    fireEvent.click(updateBtn);
    
    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith({
        currentPassword: 'oldpass',
        newPassword: 'newpass'
      });
      expect(global.alert).toHaveBeenCalledWith('Password changed successfully');
    });
  });
});
