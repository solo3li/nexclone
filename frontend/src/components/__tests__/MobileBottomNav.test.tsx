import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MobileBottomNav from '../MobileBottomNav';

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
}));

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion') as any;
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, className, layoutId }: any) => (
        <div className={className} data-testid={`motion-div-${layoutId || 'none'}`}>
          {children}
        </div>
      ),
    },
  };
});

describe('MobileBottomNav', () => {
  it('renders all navigation tabs', () => {
    render(<MobileBottomNav />);
    expect(screen.getByText('home')).toBeInTheDocument();
    expect(screen.getByText('tools')).toBeInTheDocument();
    expect(screen.getByText('pricing')).toBeInTheDocument();
    expect(screen.getByText('account')).toBeInTheDocument();
  });

  it('updates active state on click', () => {
    render(<MobileBottomNav />);
    const links = screen.getAllByTestId('link');
    fireEvent.click(links[1]);
    expect(links[1].innerHTML).toContain('text-violet-400');
  });
});
