import axios from 'axios';
import { Platform } from 'react-native';
import { getItemAsync } from '../utils/storage';

// Backend always runs on port 8080.
// On web: derive hostname from the browser's current location so that when
// accessed from a remote machine (e.g. 167.71.66.188:8081), requests go to
// 167.71.66.188:8080 — avoiding Chrome's Private Network Access CORS block
// that prevents public-origin → localhost requests.
// On Android emulator: 10.0.2.2 maps to the host machine's localhost.
const getApiUrl = (): string => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return `http://${hostname}:8080/api`;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api';
  }
  // iOS simulator / other
  return 'http://localhost:8080/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('Error fetching token for request', e);
  }
  return config;
});

export default api;
