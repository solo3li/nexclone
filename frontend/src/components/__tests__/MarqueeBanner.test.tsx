import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MarqueeBanner from '../MarqueeBanner';

vi.mock('next-intl', () => {
  const t = (key: string) => key;
  t.raw = () => Array(9).fill('Item');
  return {
    useTranslations: () => t,
    useLocale: () => 'en'
  };
});

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  }
}));

describe('MarqueeBanner', () => {
  it('renders banner items', () => {
    render(<MarqueeBanner />);
    const items = screen.getAllByText('Item');
    expect(items).toHaveLength(18);
  });
});
