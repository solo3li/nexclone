import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.169.58.204.169.nip.io',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const TokenRefreshManager = (() => {
  let isRefreshing = false;
  let queue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

  return {
    async refresh(): Promise<string> {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        });
      }

      isRefreshing = true;
      try {
        const res = await api.post('/api/auth/refresh-token');
        const newToken = res.data?.token || '';
        queue.forEach((q) => q.resolve(newToken));
        return newToken;
      } catch (err) {
        queue.forEach((q) => q.reject(err));
        throw err;
      } finally {
        queue = [];
        isRefreshing = false;
      }
    },
  };
})();

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== '/api/auth/login' &&
      originalRequest.url !== '/api/auth/refresh-token'
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await TokenRefreshManager.refresh();
        if (newToken && originalRequest.headers) {
          if (typeof originalRequest.headers.set === 'function') {
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
          } else {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          }
        }
        return api(originalRequest);
      } catch {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:unauthorized'));
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;