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

// Request Interceptor: Attach JWT Bearer Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('turfio_token');
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

    // Auto clear token on 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('turfio_token');
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
