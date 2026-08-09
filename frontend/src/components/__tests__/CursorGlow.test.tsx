import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CursorGlow from '../CursorGlow';

describe('CursorGlow', () => {
  it('renders without crashing', () => {
    const { container } = render(<CursorGlow />);
    expect(container).toBeDefined();
  });
});
