import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HowItWorks from '../HowItWorks';

vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true })
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en'
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  }
}));

vi.mock('../AnimatedText', () => ({
  AnimatedText: ({ text }: any) => <div>{text}</div>,
  AnimatedReveal: ({ children }: any) => <div>{children}</div>
}));

describe('HowItWorks', () => {
  it('renders steps correctly', () => {
    render(<HowItWorks />);
    
    expect(screen.getByText('steps.s1.title')).toBeInTheDocument();
    expect(screen.getByText('steps.s2.title')).toBeInTheDocument();
    expect(screen.getByText('steps.s3.title')).toBeInTheDocument();
  });
});
