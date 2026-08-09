import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MediaTrimmer from '../MediaTrimmer';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

describe('MediaTrimmer', () => {
  let file: File;
  beforeEach(() => {
    file = new File(['mock data'], 'test.mp4', { type: 'video/mp4' });
    global.URL.createObjectURL = vi.fn(() => 'blob:test');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('renders the trimmer', () => {
    render(<MediaTrimmer file={file} type="video" onTrimmed={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Trim File')).toBeInTheDocument();
    expect(screen.getByText('(test.mp4)')).toBeInTheDocument();
  });

  it('handles cancel', () => {
    const mockCancel = vi.fn();
    render(<MediaTrimmer file={file} type="video" onTrimmed={vi.fn()} onCancel={mockCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockCancel).toHaveBeenCalled();
  });
});
