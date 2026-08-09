import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBlogStore } from '../useBlogStore';
import api from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/endpoints';

vi.mock('../../utils/api');

describe('useBlogStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch blog post', async () => {
    const mockPost = { id: '123', title: 'Test Post' };
    vi.mocked(api.get).mockResolvedValue({ data: mockPost });
    
    const result = await useBlogStore.getState().fetchBlogPost('123');
    
    expect(api.get).toHaveBeenCalledWith(API_ENDPOINTS.BLOG_DETAILS('123'));
    expect(result).toEqual(mockPost);
  });

  it('should post comment', async () => {
    const mockComment = { id: 'c1', content: 'Test comment' };
    vi.mocked(api.post).mockResolvedValue({ data: mockComment });
    
    const result = await useBlogStore.getState().postComment('123', 'Test comment');
    
    expect(api.post).toHaveBeenCalledWith(API_ENDPOINTS.BLOG_COMMENT('123'), { content: 'Test comment' });
    expect(result).toEqual(mockComment);
  });
});
