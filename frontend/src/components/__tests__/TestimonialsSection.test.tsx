import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TestimonialsSection from '../TestimonialsSection';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}));

vi.mock('../AnimatedText', () => ({
  AnimatedText: ({ text }: any) => <div>{text}</div>,
  AnimatedReveal: ({ children }: any) => <div>{children}</div>,
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

describe('TestimonialsSection', () => {
  it('renders testimonials', () => {
    render(<TestimonialsSection />);
    expect(screen.getByText('reviews.r1.author')).toBeInTheDocument();
  });
});
