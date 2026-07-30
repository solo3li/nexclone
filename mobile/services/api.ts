import axios from 'axios';
import { getItemAsync } from '../utils/storage';

// We use the backend URL seen in logs
const API_URL = 'http://167.71.66.188:5208/api'; 

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
