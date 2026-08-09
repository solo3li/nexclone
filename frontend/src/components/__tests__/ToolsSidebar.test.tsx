import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ToolsSidebar from '../ToolsSidebar';
import { NextIntlClientProvider } from 'next-intl';

vi.mock('../../i18n/routing', () => ({
  Link: ({ children, href, onClick }: any) => <a href={href} onClick={onClick}>{children}</a>,
  usePathname: () => '/tools/image-to-video',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('../../store/useAppStore', () => ({
  useAppStore: () => ({
    user: { fullName: 'Test User', email: 'test@example.com', wallets: [] },
    setUser: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('../../utils/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

vi.mock('../../../lib/signalr-client', () => ({
  signalRNotificationService: {
    startConnection: vi.fn(),
    stopConnection: vi.fn(),
    onNotification: vi.fn(),
    onWalletUpdate: vi.fn(),
  },
}));

describe('ToolsSidebar', () => {
  const renderWithIntl = (ui: React.ReactElement, locale = 'en') => {
    return render(
      <NextIntlClientProvider locale={locale} messages={{}}>
        {ui}
      </NextIntlClientProvider>
    );
  };

  it('renders user information', () => {
    renderWithIntl(<ToolsSidebar />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithIntl(<ToolsSidebar />);
    expect(screen.getByText('Text to Voice')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
