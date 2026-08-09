import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ToolsAuthGuard from '../ToolsAuthGuard';
import { NextIntlClientProvider } from 'next-intl';
import api from '../../utils/api';

const mockPush = vi.fn();
vi.mock('../../i18n/routing', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('../../utils/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('../../store/useAppStore', () => ({
  useAppStore: () => ({
    setUser: vi.fn(),
  }),
}));

describe('ToolsAuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login on auth error', async () => {
    (api.get as any).mockRejectedValue(new Error('unauthorized'));
    render(<ToolsAuthGuard><div>Content</div></ToolsAuthGuard>);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('redirects to complete-profile if no phone number', async () => {
    (api.get as any).mockResolvedValue({ data: { hasPhoneNumber: false } });
    render(<ToolsAuthGuard><div>Content</div></ToolsAuthGuard>);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/complete-profile');
    });
  });

  it('renders children if authenticated and has phone number', async () => {
    (api.get as any).mockResolvedValue({ data: { hasPhoneNumber: true } });
    render(<ToolsAuthGuard><div>Content</div></ToolsAuthGuard>);
    
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
