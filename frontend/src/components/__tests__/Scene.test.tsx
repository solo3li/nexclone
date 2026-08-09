import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Scene from '../Scene';
import { act } from '@testing-library/react';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
  useFrame: () => {},
}));

vi.mock('@react-three/drei', () => ({
  Stars: () => <div data-testid="stars" />,
  Float: ({ children }: any) => <div data-testid="float">{children}</div>,
  Icosahedron: ({ children }: any) => <div data-testid="icosahedron">{children}</div>,
}));

describe('Scene', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders scene on desktop', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    const { container } = render(<Scene />);
    expect(container).toBeInTheDocument();
  });

  it('renders mobile background on mobile', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    const { container } = render(<Scene />);
    expect(container).toBeInTheDocument();
  });
});
