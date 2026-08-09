import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PricingSection from '../PricingSection';

vi.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string) => key;
    t.raw = (key: string) => ['feature 1', 'feature 2'];
    return t;
  },
  useLocale: () => 'en',
}));

vi.mock('../../store/usePlansStore', () => ({
  usePlansStore: () => ({
    plans: [],
    fetchPlans: vi.fn(),
  }),
}));

vi.mock('../AnimatedText', () => ({
  AnimatedText: ({ text }: any) => <div data-testid="animated-text">{text}</div>,
  AnimatedReveal: ({ children }: any) => <div data-testid="animated-reveal">{children}</div>,
}));

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion') as any;
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, className }: any) => (
        <div className={className} data-testid="motion-div">
          {children}
        </div>
      ),
    },
  };
});

describe('PricingSection', () => {
  it('renders pricing section', () => {
    render(<PricingSection />);
    expect(screen.getByText('freePlan.name')).toBeInTheDocument();
    expect(screen.getByText('proPlan.name')).toBeInTheDocument();
  });

  it('toggles yearly pricing', () => {
    render(<PricingSection />);
    const yearlyButton = screen.getByText('yearly');
    fireEvent.click(yearlyButton);
    expect(yearlyButton.className).toContain('bg-violet-600');
  });
});
