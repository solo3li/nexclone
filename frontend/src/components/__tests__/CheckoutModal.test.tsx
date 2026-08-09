import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CheckoutModal from '../CheckoutModal';
import { NextIntlClientProvider } from 'next-intl';

// Mock API
vi.mock('@/utils/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
  }
}));

const plan: any = {
  id: 1,
  name: 'Pro',
  nameAr: 'برو',
  priceUsd: 10,
  priceEgp: 300,
  features: [],
  interval: 'month'
};

const messages = {};

describe('CheckoutModal', () => {
  it('renders correctly', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CheckoutModal plan={plan} currency="USD" onClose={() => {}} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
  });
});
