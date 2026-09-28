import axios from 'axios';

// Base API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

// Create Axios Client Instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const parseSessionToken = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    if (raw.startsWith('{')) {
      const parsed = JSON.parse(raw);
      return parsed.token || null;
    }
    return raw;
  } catch {
    return null;
  }
};

const sessionKeyForScope = (scope) => ({
  player: 'turfio_player_session',
  admin: 'turfio_admin_session',
  superadmin: 'turfio_superadmin_session',
}[scope] || 'turfio_player_session');

const inferAuthScope = (config) => {
  const explicit = config.authScope || config.headers?.['X-Role-Context'];
  if (explicit) return explicit === 'owner' ? 'admin' : explicit;
  const url = config.url || '';
  if (url.includes('/superadmin/')) return 'superadmin';
  if (url.includes('/admin/') || url.includes('/bookings/owner') || url.includes('/finance/owner') || url.includes('/reviews/owner') || url.includes('/customers/owner') || url.includes('/turfs/owner') || url.includes('/promo-codes')) return 'admin';
  return 'player';
};

// Attach only the token belonging to the portal making this request.
apiClient.interceptors.request.use((config) => {
  const token = parseSessionToken(sessionKeyForScope(inferAuthScope(config)));
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use((response) => response.data, (error) => {
  const responseData = error.response?.data;
  let errorMessage = responseData?.message;
  if (!errorMessage && Array.isArray(responseData?.errors)) errorMessage = responseData.errors.map((e) => e.message).join(', ');
  if (!errorMessage) errorMessage = error.message || 'An unexpected error occurred. Please try again.';
  if (error.response?.status === 401) localStorage.removeItem(sessionKeyForScope(inferAuthScope(error.config || {})));
  return Promise.reject(new Error(errorMessage));
});

export default apiClient;
