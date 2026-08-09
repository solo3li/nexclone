import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ToolInstructions from '../ToolInstructions';

vi.mock('next-intl', () => ({
  useLocale: () => 'en'
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

describe('ToolInstructions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('opens automatically if not seen before', () => {
    render(<ToolInstructions toolId="test-tool" title="Test Tool" instructions={['Step 1', 'Step 2']} />);
    expect(screen.getByText('Test Tool')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(localStorage.getItem('tool_onboard_test-tool')).toBe('true');
  });

  it('does not open automatically if seen before', () => {
    localStorage.setItem('tool_onboard_test-tool', 'true');
    render(<ToolInstructions toolId="test-tool" title="Test Tool" instructions={['Step 1', 'Step 2']} />);
    expect(screen.queryByText('Test Tool')).not.toBeInTheDocument();
  });

  it('can be opened manually', () => {
    localStorage.setItem('tool_onboard_test-tool', 'true');
    render(<ToolInstructions toolId="test-tool" title="Test Tool" instructions={['Step 1', 'Step 2']} />);
    const helpBtn = screen.getByTitle('How to use?');
    fireEvent.click(helpBtn);
    expect(screen.getByText('Test Tool')).toBeInTheDocument();
  });
});
