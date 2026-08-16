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
    // Fallback: If third-party cookies are blocked (Incognito over Cloudflare Tunnel), 
    // send the token via Authorization header as well.
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        if (!config.headers) {
          config.headers = {} as any;
        }
        if (typeof config.headers.set === 'function') {
          config.headers.set('Authorization', `Bearer ${token}`);
        } else {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log the error here, let the components handle the redirects themselves
    // if (error.response?.status === 401) {
    //   console.log("[Axios Interceptor] 401 Unauthorized for URL:", error.config?.url);
    // }
    return Promise.reject(error);
  }
);

export default api;
