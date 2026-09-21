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

// Request Interceptor: Attach role-scoped JWT Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const roleContext = config.headers?.['X-Role-Context'];
    const isAdminPort =
      typeof window !== 'undefined' &&
      window.location.port === (import.meta.env.VITE_ADMIN_PORT || '5174');

    const isOwnerRequest =
      isAdminPort ||
      roleContext === 'owner' ||
      config.url?.includes('/admin') ||
      config.url?.includes('/bookings/owner') ||
      config.url?.includes('/owner-applications');

    const tokenKey = isOwnerRequest ? 'turfio_owner_session' : 'turfio_player_session';
    let token = parseSessionToken(tokenKey);

    // Fallback: If no token under primary key, try alternate token or legacy key
    if (!token && isOwnerRequest) {
      token = parseSessionToken('turfio_player_session');
    } else if (!token && !isOwnerRequest) {
      token = parseSessionToken('turfio_owner_session');
    }

    if (!token) {
      token = localStorage.getItem('turfio_token');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract clean error messages & handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const responseData = error.response?.data;
    let errorMessage = responseData?.message;

    if (!errorMessage && responseData?.errors && Array.isArray(responseData.errors)) {
      errorMessage = responseData.errors.map((e) => e.message).join(', ');
    }

    if (!errorMessage) {
      errorMessage = error.message || 'An unexpected error occurred. Please try again.';
    }

    // Auto clear namespaced token on 401 Unauthorized
    if (error.response?.status === 401) {
      const config = error.config || {};
      const roleContext = config.headers?.['X-Role-Context'];
      const isAdminPort =
        typeof window !== 'undefined' &&
        window.location.port === (import.meta.env.VITE_ADMIN_PORT || '5174');

      const isOwnerRequest =
        isAdminPort ||
        roleContext === 'owner' ||
        config.url?.includes('/admin') ||
        config.url?.includes('/bookings/owner') ||
        config.url?.includes('/owner-applications');

      if (isOwnerRequest) {
        localStorage.removeItem('turfio_owner_session');
      } else {
        localStorage.removeItem('turfio_player_session');
      }
      localStorage.removeItem('turfio_token');
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
