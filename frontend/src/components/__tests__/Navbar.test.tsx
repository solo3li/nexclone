import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '../Navbar';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

vi.mock('../../i18n/routing', () => ({
  Link: ({ children, href, onClick, className }: any) => (
    <a href={href} onClick={onClick} className={className} data-testid="link">
      {children}
    </a>
  ),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
}));

vi.mock('../../store/useAppStore', () => ({
  useAppStore: () => ({
    isAuthenticated: false,
    user: null,
    setUser: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: {
    getState: () => ({
      fetchMe: vi.fn().mockResolvedValue({}),
    }),
  },
}));

vi.mock('../../utils/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('../FreezeWarningBanner', () => ({
  FreezeWarningBanner: () => <div data-testid="freeze-warning" />,
}));

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navbar correctly', () => {
    render(<Navbar />);
    expect(screen.getByText('Nex')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
    expect(screen.getByTestId('freeze-warning')).toBeInTheDocument();
  });
});
