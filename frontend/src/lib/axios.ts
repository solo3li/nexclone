import axios from 'axios';

// Get the base URL from environment variables, fallback to localhost for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This ensures cookies (like the HttpOnly JWT) are sent with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor: Handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If we receive a 401 Unauthorized, the token is invalid or expired.
      if (typeof window !== 'undefined') {
        // You can dispatch a logout event or redirect to login here if needed
      }
    }
    return Promise.reject(error);
  }
);

export default api;
