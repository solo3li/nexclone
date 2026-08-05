import { create } from 'zustand';
import api from '../utils/api';
import { API_ENDPOINTS } from '../utils/endpoints';

interface BlogState {
  fetchBlogPost: (id: string) => Promise<any>;
  postComment: (id: string, content: string) => Promise<any>;
}

export const useBlogStore = create<BlogState>((set) => ({
  fetchBlogPost: async (id) => {
    const res = await api.get(API_ENDPOINTS.BLOG_DETAILS(id));
    return res.data;
  },

  postComment: async (id, content) => {
    const res = await api.post(API_ENDPOINTS.BLOG_COMMENT(id), { content });
    return res.data;
  }
}));
