import axios from 'axios';

import { getAppContext } from '../config/appContext';
import { requestRoleContext } from '../config/requestScope';

// Browser sessions always use the current host's /api proxy. An absolute API
// origin would store all three sessions on that API hostname instead.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
if (!API_BASE_URL.startsWith('/') || API_BASE_URL.startsWith('//')) {
  throw new Error('VITE_API_URL must be a same-origin path for host-only sessions');
}

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
apiClient.interceptors.request.use((config) => {
  config.headers['X-Role-Context'] = requestRoleContext(config, getAppContext());
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
