import axios from 'axios';
const swagger_url = 'https://testing-direction-travis-loose.trycloudflare.com/swagger-ui/index.html';
const API_BASE = 'https://testing-direction-travis-loose.trycloudflare.com';

export const getAuthToken = () => {
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

/** Relative paths that must not send Authorization (public auth, public lists). */
const shouldSkipAuth = (config) => {
  if (config.skipAuth) return true;
  const raw = config.url || '';
  const path = (raw.startsWith('/') ? raw : `/${raw}`).split('?')[0];

  if (path === '/auth/login') return true;

  const method = (config.method || 'get').toLowerCase();
  if (method !== 'get') return false;
  return (
    path === '/categories' ||
    path.startsWith('/categories/with-subcategories')
  );
};

const attachAuth = (config) => {
  if (shouldSkipAuth(config)) {
    delete config.headers.Authorization;
    return config;
  }
  const token = getAuthToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

API.interceptors.request.use(attachAuth, (error) => Promise.reject(error));
PublicAPI.interceptors.request.use(attachAuth, (error) => Promise.reject(error));

export default API;
