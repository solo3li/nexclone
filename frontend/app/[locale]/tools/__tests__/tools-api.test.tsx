import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TextToVideoPage from '../text-to-video/page';
import api from '../../../../src/utils/api';

vi.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

vi.mock('../../../../src/store/useAppStore', () => ({
  useAppStore: () => ({
    user: { standardCredits: 1000, premiumCredits: 1000 },
  }),
}));

vi.mock('../../../../src/utils/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('TextToVideoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls correct API endpoint /api/video/start-tool/text-to-video when generating', async () => {
    (api.post as any).mockResolvedValue({ data: { message: 'Success' } });
    
    render(<TextToVideoPage />);
    
    // Find the textarea and type a prompt
    const textarea = screen.getByPlaceholderText(/Describe the video scene/i);
    fireEvent.change(textarea, { target: { value: 'A beautiful sunset over the mountains' } });
    
    // Find generate button
    const generateBtn = screen.getByRole('button', { name: /Generate Video/i });
    expect(generateBtn).not.toBeDisabled();
    
    // Click generate
    fireEvent.click(generateBtn);
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
      // Verify the endpoint
      expect(api.post).toHaveBeenCalledWith('/api/video/start-tool/text-to-video', expect.any(FormData));
    });
  });
});
