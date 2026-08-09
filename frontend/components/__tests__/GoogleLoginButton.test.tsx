import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GoogleLoginButton } from '../GoogleLoginButton';

const mockPush = vi.fn();

vi.mock('../../src/i18n/routing', () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

const mockGoogleLogin = vi.fn();
vi.mock('../../src/store/useAuthStore', () => ({
  useAuthStore: () => ({
    googleLogin: mockGoogleLogin
  })
}));

let mockUseGoogleOAuthThrows = false;
vi.mock('@react-oauth/google', () => ({
  useGoogleOAuth: () => {
    if (mockUseGoogleOAuthThrows) throw new Error('No provider');
  },
  GoogleLogin: ({ onSuccess }: any) => (
    <button data-testid="google-login" onClick={() => onSuccess({ credential: 'mock-token' })}>
      Google Login
    </button>
  )
}));

describe('GoogleLoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGoogleOAuthThrows = false;
  });

  it('renders nothing if useGoogleOAuth throws (no provider)', () => {
    mockUseGoogleOAuthThrows = true;
    const { container } = render(<GoogleLoginButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders login button and handles success', async () => {
    render(<GoogleLoginButton refCode="ref123" />);
    const button = screen.getByTestId('google-login');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockGoogleLogin).toHaveBeenCalledWith({ token: 'mock-token', refCode: 'ref123' });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
