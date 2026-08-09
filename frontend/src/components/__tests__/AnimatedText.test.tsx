import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AnimatedText, AnimatedReveal, GlowPulse } from '../AnimatedText';

// Mock react-intersection-observer
vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}));

describe('AnimatedText components', () => {
  it('renders AnimatedText correctly', () => {
    render(<AnimatedText text="Hello World" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
  });

  it('renders AnimatedReveal correctly', () => {
    render(
      <AnimatedReveal>
        <div>Revealed Content</div>
      </AnimatedReveal>
    );
    expect(screen.getByText('Revealed Content')).toBeInTheDocument();
  });

  it('renders GlowPulse correctly', () => {
    const { container } = render(<GlowPulse className="test-glow" />);
    expect(container.firstChild).toHaveClass('test-glow');
  });
});
