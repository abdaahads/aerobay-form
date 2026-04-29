import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject JWT token for admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aerobay_admin_token');
  if (token && config.url?.includes('/api/admin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses (401 redirect disabled for now)
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
