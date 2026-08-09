import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CTASection from '../CTASection';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}));

vi.mock('../../i18n/routing', () => ({
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

vi.mock('../AnimatedText', () => ({
  AnimatedText: ({ text }: any) => <div>{text}</div>,
  AnimatedReveal: ({ children }: any) => <div>{children}</div>,
  GlowPulse: () => <div />,
}));

const messages = {
  CTA: {
    title: 'Start now',
    subtitle: 'Join us today',
    button: 'Get Started'
  }
};

describe('CTASection', () => {
  it('renders correctly', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CTASection />
      </NextIntlClientProvider>
    );

    expect(screen.getAllByText('Start now').length).toBeGreaterThan(0);
    expect(screen.getByText(/Join us today/i)).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });
});
