import { create } from 'zustand';
import authService from '../services/authService';

// Session JWTs live only in HttpOnly cookies. Remove credentials left behind by
// older builds so an XSS-capable script cannot recover a previously persisted JWT.
['turfio_player_session', 'turfio_admin_session', 'turfio_superadmin_session'].forEach((key) => {
  try { localStorage.removeItem(key); } catch { /* storage can be unavailable */ }
});

const authenticatedState = (user) => ({
  user,
  token: null, // compatibility field; session tokens are intentionally inaccessible to JavaScript
  isAuthenticated: true,
  isLoading: false,
  error: null,
});

const signedOutState = (error = null) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error,
});

export const usePlayerAuth = create((set) => ({
  ...signedOutState(),
  isInitializing: true,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.getCurrentUser('player');
      const user = response.data?.user || response.data;
      set(authenticatedState(user));
    } catch {
      set(signedOutState());
    } finally {
      set({ isInitializing: false });
    }
  },

  login: async ({ email, password, redirectTo }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login({ email, password, redirectTo });
      const { user, mfaRequired, tempToken, redirectTo: next } = response.data || {};
      if (mfaRequired) {
        set({ isLoading: false, error: null });
        return { success: true, mfaRequired: true, tempToken };
      }
      set({ ...authenticatedState(user), isInitializing: false });
      return { success: true, user, redirectTo: next || redirectTo };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  googleLogin: async (idToken, redirectTo) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.googleLogin(idToken, redirectTo);
      const { user, redirectTo: next } = response.data || {};
      set({ ...authenticatedState(user), isInitializing: false });
      return { success: true, user, redirectTo: next || redirectTo };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  signup: async (signupData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.register(signupData);
      const { user } = response.data || {};
      set({ ...authenticatedState(user), isInitializing: false });
      return { success: true, user };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  updateProfile: async (profileData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.updateProfile(profileData);
      const user = response.data?.user || response.data;
      set({ user, isLoading: false, error: null });
      return { success: true, user };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  logout: async () => {
    try { await authService.logoutPlayer(); }
    catch (err) { console.warn('Player logout server error:', err.message); }
    set(signedOutState());
  },

  uploadAvatar: async (file) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.uploadAvatar(file);
      const user = response.data?.user || response.data;
      set({ user, isLoading: false, error: null });
      return { success: true, user };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  changePassword: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.changePassword(data);
      const user = response.data?.user || response.user;
      set({ ...(user ? { user } : {}), isLoading: false, error: null });
      return { success: true, message: response.message };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  updatePreferences: async (preferences) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.updatePreferences(preferences);
      const user = response.data?.user || response.data;
      set({ user, isLoading: false, error: null });
      return { success: true, user };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  verifyMfaLogin: async ({ tempToken, code }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.verifyMfaLogin({ tempToken, code });
      const { user } = response.data || {};
      set({ ...authenticatedState(user), isInitializing: false });
      return { success: true, user };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  clearError: () => set({ error: null }),
}));

export const useOwnerAuth = create((set) => ({
  ...signedOutState(),
  isInitializing: true,
  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.getCurrentUser('admin');
      const user = response.data?.user || response.data;
      if (user?.role !== 'admin') throw new Error('Invalid admin session');
      set(authenticatedState(user));
    } catch {
      set(signedOutState());
    } finally { set({ isInitializing: false }); }
  },
  loginAdmin: async ({ email, password, redirectTo }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.loginAdmin({ email, password, redirectTo });
      const { user, mfaRequired, tempToken, redirectTo: next } = response.data || {};
      if (mfaRequired) { set({ isLoading: false, error: null }); return { success: true, mfaRequired: true, tempToken }; }
      if (user?.role !== 'admin') throw new Error('Admin account required');
      set({ ...authenticatedState(user), isInitializing: false });
      return { success: true, user, redirectTo: next || redirectTo };
    } catch (err) { set({ isLoading: false, error: err.message }); return { success: false, error: err.message }; }
  },
  verifyMfaLogin: async ({ tempToken, code }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.verifyMfaLogin({ tempToken, code });
      const { user } = response.data || {};
      if (user?.role !== 'admin') throw new Error('Admin account required');
      set({ ...authenticatedState(user), isInitializing: false });
      return { success: true, user };
    } catch (err) { set({ isLoading: false, error: err.message }); return { success: false, error: err.message }; }
  },
  dismissTurfBanner: async () => {
    set((state) => ({ user: state.user ? { ...state.user, turfApprovalBannerSeen: true } : state.user }));
    try { await authService.dismissStaffBanner(); } catch (err) { console.warn('Could not save banner dismissal:', err.message); }
  },
  logout: async () => {
    try { await authService.logoutAdmin(); } catch (err) { console.warn('Admin logout server error:', err.message); }
    set(signedOutState());
  },
  clearError: () => set({ error: null }),
}));

export const useSuperadminAuth = create((set) => ({
  ...signedOutState(),
  isInitializing: true,
  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.getCurrentUser('superadmin');
      const user = response.data?.user || response.data;
      if (user?.role !== 'superadmin') throw new Error('Invalid superadmin session');
      set(authenticatedState(user));
    } catch {
      set(signedOutState());
    } finally { set({ isInitializing: false }); }
  },
  loginSuperadmin: async ({ email, password }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.loginSuperadmin({ email, password });
      const { user, mfaRequired, tempToken } = response.data || {};
      if (mfaRequired) { set({ isLoading: false, isInitializing: false, error: null }); return { success: true, mfaRequired: true, tempToken }; }
      if (user?.role !== 'superadmin') throw new Error('Superadmin account required');
      set({ ...authenticatedState(user), isInitializing: false });
      return { success: true, user, redirectTo: '/superadmin/dashboard' };
    } catch (err) { set({ isLoading: false, error: err.message }); return { success: false, error: err.message }; }
  },
  verifyMfaLogin: async ({ tempToken, code }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.verifyMfaLogin({ tempToken, code });
      const { user } = response.data || {};
      if (user?.role !== 'superadmin') throw new Error('Superadmin account required');
      set({ ...authenticatedState(user), isInitializing: false });
      return { success: true, user };
    } catch (err) { set({ isLoading: false, error: err.message }); return { success: false, error: err.message }; }
  },
  logout: async () => {
    try { await authService.logoutSuperadmin(); } catch (err) { console.warn('Superadmin logout server error:', err.message); }
    set(signedOutState());
  },
  clearError: () => set({ error: null }),
}));

export const useAuthStore = usePlayerAuth;
export default useAuthStore;
