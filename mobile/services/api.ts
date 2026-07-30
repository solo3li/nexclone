import axios from 'axios';
import { Platform } from 'react-native';
import { getItemAsync } from '../utils/storage';

// Local Docker backend runs on port 8080.
// On web (browser), use localhost. For physical device testing, replace with your machine's LAN IP.
// Remote server (offline): 167.71.66.188:5208
const API_URL = Platform.OS === 'web'
  ? 'http://localhost:8080/api'
  : 'http://10.0.2.2:8080/api'; // Android emulator: 10.0.2.2 maps to host localhost

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
