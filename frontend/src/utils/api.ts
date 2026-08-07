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
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, redirect to login
    if (
      error.response?.status === 401 &&
      !error.config.url?.includes('/api/auth/login') &&
      !error.config.url?.includes('/api/auth/register') &&
      !error.config.url?.includes('/api/auth/me')
    ) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt_token');
        const locale = document.documentElement.lang || 'ar';
        const path = window.location.pathname;
        if (!path.includes('/login') && 
            !path.includes('/register') && 
            !path.includes('/forgot-password') && 
            !path.includes('/reset-password')) {
          window.location.href = `/${locale}/login`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
