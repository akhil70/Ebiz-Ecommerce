import axios from 'axios';

const API_BASE = 'https://processors-king-tri-city.trycloudflare.com';

const getAuthToken = () => {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken') ||
    ''
  );
};

// Admin API (for admin panel)
const API = axios.create({
  baseURL: `${API_BASE}/api/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public API (for storefront - products, etc.)
export const PublicAPI = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const attachAuth = (config) => {
  const token = getAuthToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

API.interceptors.request.use(attachAuth, (error) => Promise.reject(error));
PublicAPI.interceptors.request.use(attachAuth, (error) => Promise.reject(error));

export default API;
