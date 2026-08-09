import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Footer from '../Footer';
import api from '@/utils/api';

vi.mock('@/utils/api', () => ({
  default: {
    get: vi.fn()
  }
}));

vi.mock('next-intl', () => {
  const t = (key: string) => key;
  t.raw = () => ['Link 1', 'Link 2', 'Link 3'];
  return {
    useTranslations: () => t,
    useLocale: () => 'en'
  };
});

vi.mock('../../i18n/routing', () => ({
  Link: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>
}));

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders footer and fetches social links', async () => {
    (api.get as any).mockResolvedValue({ data: { twitter: 'twitter.com/test' } });
    render(<Footer />);
    
    expect(api.get).toHaveBeenCalledWith('/api/platform/social-links');
    
    await waitFor(() => {
      expect(screen.getByLabelText('twitter')).toBeInTheDocument();
    });
  });

  it('renders footer links', () => {
    (api.get as any).mockResolvedValue({ data: {} });
    render(<Footer />);
    expect(screen.getByText('products.title')).toBeInTheDocument();
    expect(screen.getByText('company.title')).toBeInTheDocument();
    expect(screen.getByText('legal.title')).toBeInTheDocument();
  });
});
