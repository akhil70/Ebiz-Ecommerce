import axios from 'axios';

const API_BASE = 'https://valley-moms-awards-represent.trycloudflare.com';

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

export default API;
