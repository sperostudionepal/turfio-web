import { create } from 'zustand';
import authService from '../services/authService';

const TOKEN_KEY = 'turfio_token';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem(TOKEN_KEY) || null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,

  /**
   * Initialize Auth State on app launch
   * Hydrates current user if JWT token exists in localStorage
   */
  initialize: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isInitializing: false });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const response = await authService.getCurrentUser();
      const user = response.data?.user || response.data;
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
      });
    } catch (err) {
      console.warn('Auth initialization failed:', err.message);
      localStorage.removeItem(TOKEN_KEY);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitializing: false,
      });
    }
  },

  /**
   * Login Action
   */
  login: async ({ email, password }) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authService.login({ email, password });
      const { user, token } = response.data || {};

      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user, token };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Sign Up Action
   */
  signup: async ({ firstName, lastName, email, password, confirmPassword }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      const { user, token } = response.data || {};

      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user, token };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Google Login Action with ID token
   */
  googleLogin: async (idToken) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.googleLogin(idToken);
      const { user, token } = response.data || {};

      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user, token };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Complete Onboarding / Update Profile Action
   */
  updateProfile: async (profileData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.updateProfile(profileData);
      const updatedUser = response.data?.user || response.data;

      set({
        user: updatedUser,
        isLoading: false,
        error: null,
      });

      return { success: true, user: updatedUser };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Logout Action
   */
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  /**
   * Reset Error
   */
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
