import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CostEstimateCard from '../CostEstimateCard';

describe('CostEstimateCard', () => {
  it('renders estimated cost correctly', () => {
    render(<CostEstimateCard estimatedCost={12.34} chargedWallet="general wallet" />);
    expect(screen.getByText('12.34')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<CostEstimateCard estimatedCost={null} chargedWallet={null} error="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<CostEstimateCard estimatedCost={null} chargedWallet={null} isLoading={true} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
