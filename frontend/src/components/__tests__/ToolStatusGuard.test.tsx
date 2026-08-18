import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ToolStatusGuard from '../ToolStatusGuard';
import { NextIntlClientProvider } from 'next-intl';
import api from '../../utils/api';

import { useAppStore } from '../../store/useAppStore';

vi.mock('../../utils/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('../../i18n/routing', () => ({
  usePathname: () => '/tools/image-to-video',
}));

describe('ToolStatusGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({ toolConfigs: null });
  });

  const renderWithIntl = (ui: React.ReactElement, locale = 'en') => {
    return render(
      <NextIntlClientProvider locale={locale} messages={{}}>
        {ui}
      </NextIntlClientProvider>
    );
  };

  it('shows loading state initially', () => {
    (api.get as any).mockResolvedValue(new Promise(() => {})); // pending promise
    const { container } = renderWithIntl(<ToolStatusGuard><div>Content</div></ToolStatusGuard>);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders children when tool is active', async () => {
    (api.get as any).mockResolvedValue({ data: { kling_avatar_image2video: { isActive: true } } });
    renderWithIntl(<ToolStatusGuard><div>Content</div></ToolStatusGuard>);
    
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('shows maintenance mode', async () => {
    (api.get as any).mockResolvedValue({ data: { kling_avatar_image2video: { isMaintenanceMode: true } } });
    renderWithIntl(<ToolStatusGuard><div>Content</div></ToolStatusGuard>);
    
    await waitFor(() => {
      expect(screen.getByText('System Update')).toBeInTheDocument();
    });
  });

  it('shows coming soon mode', async () => {
    (api.get as any).mockResolvedValue({ data: { kling_avatar_image2video: { isComingSoon: true } } });
    renderWithIntl(<ToolStatusGuard><div>Content</div></ToolStatusGuard>);
    
    await waitFor(() => {
      expect(screen.getByText('Coming Soon!')).toBeInTheDocument();
    });
  });
});
