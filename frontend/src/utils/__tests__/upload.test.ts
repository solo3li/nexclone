import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadDirectToMinio } from '../upload';
import api from '../api';
import axios from 'axios';

vi.mock('../api', () => ({
  default: {
    post: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  }
}));
vi.mock('axios');

describe('uploadDirectToMinio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should upload file and return objectName successfully', async () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const mockResponse = {
      data: {
        url: 'http://minio-url/upload',
        objectName: 'test-obj-name-123',
      }
    };
    vi.mocked(api.post).mockResolvedValue(mockResponse);
    vi.mocked(axios.put).mockResolvedValue({});

    const onProgress = vi.fn();

    const result = await uploadDirectToMinio(mockFile, 'test-tool', onProgress);

    expect(api.post).toHaveBeenCalledWith('/api/media/upload-url', {
      fileName: 'test.txt',
      contentType: 'text/plain',
      toolName: 'test-tool',
    });

    expect(axios.put).toHaveBeenCalledWith(
      'http://minio-url/upload',
      mockFile,
      expect.objectContaining({
        headers: { 'Content-Type': 'text/plain' },
        onUploadProgress: expect.any(Function),
      })
    );

    expect(result).toBe('test-obj-name-123');
  });

  it('should call onProgress correctly', async () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    vi.mocked(api.post).mockResolvedValue({
      data: { url: 'http://minio-url/upload', objectName: 'obj' }
    });
    
    vi.mocked(axios.put).mockImplementation((url, data, config) => {
      if (config?.onUploadProgress) {
        config.onUploadProgress({ loaded: 50, total: 100 } as any);
      }
      return Promise.resolve({});
    });

    const onProgress = vi.fn();

    await uploadDirectToMinio(mockFile, 'uploads', onProgress);

    expect(onProgress).toHaveBeenCalledWith(50);
  });

  it('should handle upload error gracefully', async () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const error = new Error('Network Error');
    vi.mocked(api.post).mockRejectedValue(error);

    await expect(uploadDirectToMinio(mockFile)).rejects.toThrow('Network Error');
  });
});
