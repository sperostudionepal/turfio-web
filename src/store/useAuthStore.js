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
   * Player / Customer Login Action (Role: user)
   */
  login: async ({ email, password }) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authService.login({ email, password });
      const { user, token, mfaRequired, tempToken } = response.data || {};

      if (mfaRequired) {
        set({ isLoading: false, error: null });
        return { success: true, mfaRequired: true, tempToken };
      }

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
   * Arena Owner Login Action (Role: admin)
   */
  loginAdmin: async ({ email, password }) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authService.loginAdmin({ email, password });
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
   * Platform Staff Superadmin Login Action (Role: superadmin)
   */
  loginSuperadmin: async ({ email, password }) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authService.loginSuperadmin({ email, password });
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
   * Owner self-registration (from "List Your Turf" when logged out).
   * Persists the token so subsequent requests are authenticated, but does
   * NOT set `user` — the caller submits the listing request first, then
   * calls `initialize()` to hydrate and trigger the pending-page redirect.
   */
  registerOwner: async ({ name, email, password }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.registerOwner({ name, email, password });
      const { user, token } = response.data || {};

      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }

      set({ isLoading: false, error: null });
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
      const { user, token, mfaRequired, tempToken } = response.data || {};

      // A 2FA account isn't signed in until its code is entered.
      if (mfaRequired) {
        set({ isLoading: false, error: null });
        return { success: true, mfaRequired: true, tempToken };
      }

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
   * Permanently delete the current account (pending_owner only), then clear
   * local auth state.
   */
  deleteAccount: async () => {
    try {
      await authService.deleteAccount();
      localStorage.removeItem(TOKEN_KEY);
      set({ user: null, token: null, isAuthenticated: false, error: null });
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Upload Profile Photo Action
   */
  uploadAvatar: async (file) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.uploadAvatar(file);
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
   * Change / Create Password Action
   */
  changePassword: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.changePassword(data);
      const updatedUser = response.data?.user || response.user;
      if (updatedUser) {
        set({ user: updatedUser, isLoading: false, error: null });
      } else {
        set({ isLoading: false, error: null });
      }
      return { success: true, message: response.message };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Update Preferences Action
   */
  updatePreferences: async (preferences) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.updatePreferences(preferences);
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
   * Toggle 2FA Action
   */
  toggleTwoFactor: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.toggleTwoFactor();
      const updatedUser = response.data?.user || response.data;
      set({
        user: updatedUser,
        isLoading: false,
        error: null,
      });
      return { success: true, twoFactorEnabled: updatedUser?.twoFactorEnabled };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  /**
   * Verify 2FA Login with TOTP code or backup code
   */
  verifyMfaLogin: async ({ tempToken, code }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.verifyMfaLogin({ tempToken, code });
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
   * Reset Error
   */
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
