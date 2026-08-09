import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HeroSection from '../HeroSection';
import { useAppStore } from '../../store/useAppStore';
import { useRouter } from '../../i18n/routing';

vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn()
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en'
}));

vi.mock('../../i18n/routing', () => ({
  Link: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
  useRouter: vi.fn()
}));

vi.mock('framer-motion', () => ({
  motion: {
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  }
}));

vi.mock('../Scene', () => ({ default: () => <div data-testid="scene">Scene</div> }));
vi.mock('../AnimatedText', () => ({
  AnimatedText: ({ text }: any) => <div>{text}</div>,
  GlowPulse: () => <div>GlowPulse</div>
}));

describe('HeroSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders hero section correctly', () => {
    (useAppStore as any).mockReturnValue({ user: null, isAuthenticated: false, hasPhoneNumber: false });
    (useRouter as any).mockReturnValue({ push: vi.fn() });
    
    render(<HeroSection />);
    expect(screen.getByTestId('scene')).toBeInTheDocument();
    expect(screen.getByText(/The Power of AI at/)).toBeInTheDocument();
  });

  it('navigates on CTA click (desktop)', () => {
    const pushMock = vi.fn();
    (useRouter as any).mockReturnValue({ push: pushMock });
    (useAppStore as any).mockReturnValue({ user: null, isAuthenticated: false, hasPhoneNumber: false });
    
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });

    render(<HeroSection />);
    const cta = screen.getByText('ctaPrimary');
    fireEvent.click(cta);
    
    expect(pushMock).toHaveBeenCalledWith('/tools/text-to-voice');
  });
});
