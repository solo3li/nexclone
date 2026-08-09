import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FeaturesSection from '../FeaturesSection';
import { NextIntlClientProvider } from 'next-intl';

vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}));

vi.mock('../AnimatedText', () => ({
  AnimatedText: ({ text }: any) => <div>{text}</div>,
  AnimatedReveal: ({ children }: any) => <div>{children}</div>,
}));

const messages = {
  Features: {
    badge: 'Features',
    title: 'Our Features',
    subtitle: 'Awesome features',
    list: {
      f1: { title: 'F1 Title', desc: 'F1 Desc' },
      f2: { title: 'F2 Title', desc: 'F2 Desc' },
      f3: { title: 'F3 Title', desc: 'F3 Desc' },
      f4: { title: 'F4 Title', desc: 'F4 Desc' },
      f5: { title: 'F5 Title', desc: 'F5 Desc' },
      f6: { title: 'F6 Title', desc: 'F6 Desc' },
      f7: { title: 'F7 Title', desc: 'F7 Desc' },
      f8: { title: 'F8 Title', desc: 'F8 Desc' },
    },
    stats: {
      s1: { val: '10', label: 'Ten' },
      s2: { val: '20', label: 'Twenty' },
      s3: { val: '30', label: 'Thirty' },
      s4: { val: '40', label: 'Forty' },
    }
  }
};

describe('FeaturesSection', () => {
  it('renders correctly', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <FeaturesSection />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Our Features')).toBeInTheDocument();
    expect(screen.getByText('Awesome features')).toBeInTheDocument();
    expect(screen.getByText('F1 Title')).toBeInTheDocument();
    expect(screen.getByText('Ten')).toBeInTheDocument();
  });
});
