import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FreezeWarningBanner } from '../FreezeWarningBanner';
import { useAppStore } from '../../store/useAppStore';

vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn()
}));

vi.mock('../../i18n/routing', () => ({
  Link: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>
}));

describe('FreezeWarningBanner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders nothing when there is no frozen plan', () => {
    (useAppStore as any).mockReturnValue({ user: null });
    const { container } = render(<FreezeWarningBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders banner when frozen plan exists and countdown works', () => {
    const futureDate = new Date(Date.now() + 100000).toISOString();
    (useAppStore as any).mockReturnValue({
      user: {
        activeSubscriptions: [{ status: 'freeze', freezeEndDate: futureDate }]
      }
    });

    render(<FreezeWarningBanner />);
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/حسابك في فترة التجميد/)).toBeInTheDocument();
  });
});
