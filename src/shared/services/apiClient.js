import axios from 'axios';

// Base API URL configuration
const resolveBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // If explicitly set to a relative path like '/api', use it directly
  if (envUrl && envUrl.startsWith('/')) {
    return envUrl.replace(/\/+$/, '');
  }
  // When running in the browser on Vercel or any non-localhost host:
  // always route through the same-origin '/api' proxy so SameSite=Strict HttpOnly cookies work
  if (
    typeof window !== 'undefined' &&
    window.location.hostname &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return '/api';
  }
  // If an envUrl is provided (and ends with / or not), normalize it to /api
  if (envUrl) {
    const trimmed = envUrl.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  return '/api';
};

const API_BASE_URL = resolveBaseUrl();

// Create Axios Client Instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

// Authentication is cookie-based. Session JWTs are HttpOnly and are never read by JavaScript.
// `withCredentials` above sends the correct portal cookie with API requests.
// The non-secret role context only helps the server select between admin and superadmin
// cookies when both portals are open; the server still verifies the JWT and required role.
const inferAuthScope = (config) => {
  const explicit = config.authScope || config.headers?.['X-Role-Context'];
  if (explicit) return explicit === 'owner' ? 'admin' : explicit;
  const url = config.url || '';
  if (url.includes('/superadmin/')) return 'superadmin';
  if (url.includes('/admin/') || url.includes('/bookings/owner') || url.includes('/finance/owner') || url.includes('/reviews/owner') || url.includes('/customers/owner') || url.includes('/turfs/owner') || url.includes('/promo-codes')) return 'admin';
  return 'player';
};

apiClient.interceptors.request.use((config) => {
  config.headers['X-Role-Context'] = inferAuthScope(config);
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use((response) => response.data, (error) => {
  const responseData = error.response?.data;
  let errorMessage = responseData?.message;
  if (!errorMessage && Array.isArray(responseData?.errors)) errorMessage = responseData.errors.map((e) => e.message).join(', ');
  if (!errorMessage) errorMessage = error.message || 'An unexpected error occurred. Please try again.';
  return Promise.reject(new Error(errorMessage));
});

export default apiClient;
