import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5208',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for sending and receiving cookies in CORS requests
});

// ─── Request Interceptor ────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — Auto Refresh Token ─────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(null)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already retried this request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/refresh-token') &&
      !originalRequest.url?.includes('/api/auth/login')
    ) {
      if (isRefreshing) {
        // Queue the request until the token is refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to get a new access token using the refresh token cookie
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5208'}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        processQueue(null);
        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        processQueue(refreshError);
        // Refresh failed — redirect to login
        if (typeof window !== 'undefined') {
          const locale = document.documentElement.lang || 'ar';
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            window.location.href = `/${locale}/login`;
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
