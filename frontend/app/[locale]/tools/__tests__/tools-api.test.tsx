import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TextToVideoPage from '../text-to-video/page';
import TextToImagePage from '../text-to-image/page';
import ImageToVideoPage from '../image-to-video/page';
import ReferenceToVideoPage from '../reference-to-video/page';
import AdvancedLipSyncPage from '../advanced-lip-sync/page';

import api from '../../../../src/utils/api';
import { useToolsStore } from '../../../../src/store/useToolsStore';

// Mock next-intl
vi.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

// Mock app store
vi.mock('../../../../src/store/useAppStore', () => ({
  useAppStore: () => ({
    user: { standardCredits: 1000, premiumCredits: 1000 },
    isAuthenticated: true,
  }),
}));

// Mock tools store
vi.mock('../../../../src/store/useToolsStore', () => ({
  useToolsStore: () => ({
    startLipsync: vi.fn().mockResolvedValue({ taskId: '123' }),
  }),
}));

// Mock api calls
vi.mock('../../../../src/utils/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

// Mock HTMLMediaElement functions to avoid errors in JSDOM
beforeAll(() => {
  window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
  window.HTMLMediaElement.prototype.play = async () => { /* do nothing */ };
  window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
});

describe('Frontend Tool Pages API Bindings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TextToVideoPage calls /api/video/start-tool/text-to-video', async () => {
    (api.post as any).mockResolvedValue({ data: { message: 'Success' } });
    render(<TextToVideoPage />);
    
    const textarea = screen.getByPlaceholderText(/Describe the video scene/i);
    fireEvent.change(textarea, { target: { value: 'A beautiful sunset over the mountains' } });
    
    const generateBtn = screen.getByRole('button', { name: /Generate Video/i });
    expect(generateBtn).not.toBeDisabled();
    
    fireEvent.click(generateBtn);
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/video/start-tool/text-to-video', expect.any(FormData));
    });
  });

  it('TextToImagePage calls /api/image/start-tool/text-to-image', async () => {
    (api.post as any).mockResolvedValue({ data: { message: 'Success' } });
    render(<TextToImagePage />);
    
    const textarea = screen.getByPlaceholderText(/Describe the image/i);
    fireEvent.change(textarea, { target: { value: 'A cute cat' } });
    
    const generateBtn = screen.getByRole('button', { name: /Generate Image/i });
    expect(generateBtn).not.toBeDisabled();
    
    fireEvent.click(generateBtn);
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/image/start-tool/text-to-image', expect.any(FormData));
    });
  });

  it('ImageToVideoPage mounts correctly', () => {
    render(<ImageToVideoPage />);
    expect(screen.getByText(/Source Image/i)).toBeInTheDocument();
  });

  it('ReferenceToVideoPage mounts correctly', () => {
    render(<ReferenceToVideoPage />);
    expect(screen.getByText(/Reference Video/i) || screen.getByText(/Reference/i)).toBeInTheDocument();
  });

  it('AdvancedLipSyncPage mounts correctly', async () => {
    render(<AdvancedLipSyncPage />);
    await waitFor(() => {
      expect(screen.getByText(/Lip Sync Media Pairing/i) || screen.getByText(/Media Pairing/i)).toBeInTheDocument();
    });
  });
});

