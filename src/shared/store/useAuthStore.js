import { create } from 'zustand';
import authService from '../services/authService';

const PLAYER_SESSION_KEY = 'turfio_player_session';
const OWNER_SESSION_KEY = 'turfio_owner_session';

const getStoredSession = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { token: null, user: null };
    if (raw.startsWith('{')) {
      const parsed = JSON.parse(raw);
      return { token: parsed.token || null, user: parsed.user || null };
    }
    return { token: raw, user: null };
  } catch {
    return { token: null, user: null };
  }
};

const setStoredSession = (key, token, user) => {
  if (token) {
    localStorage.setItem(key, JSON.stringify({ token, user }));
  } else {
    localStorage.removeItem(key);
  }
};

export const usePlayerAuth = create((set, get) => ({
  user: getStoredSession(PLAYER_SESSION_KEY).user,
  token: getStoredSession(PLAYER_SESSION_KEY).token,
  isAuthenticated: Boolean(getStoredSession(PLAYER_SESSION_KEY).token),
  isLoading: false,
  isInitializing: true,
  error: null,

  initialize: async () => {
    const { token, user: cachedUser } = getStoredSession(PLAYER_SESSION_KEY);
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isInitializing: false });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const response = await authService.getCurrentUser('player');
      const user = response.data?.user || response.data || cachedUser;
      setStoredSession(PLAYER_SESSION_KEY, token, user);
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      console.warn('Player auth initialization failed:', err.message);
      setStoredSession(PLAYER_SESSION_KEY, null, null);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: err.message,
      });
    } finally {
      set({ isInitializing: false });
    }
  },

  login: async ({ email, password, redirectTo }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login({ email, password, redirectTo });
      const { user, token, mfaRequired, tempToken, redirectTo: resRedirectTo } = response.data || {};

      if (mfaRequired) {
        set({ isLoading: false, error: null });
        return { success: true, mfaRequired: true, tempToken };
      }

      if (token) {
        setStoredSession(PLAYER_SESSION_KEY, token, user);
      }

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user, token, redirectTo: resRedirectTo || redirectTo };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  googleLogin: async (idToken, redirectTo) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.googleLogin(idToken, redirectTo);
      const { user, token, redirectTo: resRedirectTo } = response.data || {};

      if (token) {
        setStoredSession(PLAYER_SESSION_KEY, token, user);
      }

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user, token, redirectTo: resRedirectTo || redirectTo };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  signup: async (signupData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.register(signupData);
      const { user, token } = response.data || {};

      if (token) {
        setStoredSession(PLAYER_SESSION_KEY, token, user);
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

  updateProfile: async (profileData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.updateProfile(profileData);
      const updatedUser = response.data?.user || response.data;
      const { token } = get();

      if (token) {
        setStoredSession(PLAYER_SESSION_KEY, token, updatedUser);
      }

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

  logout: async () => {
    try {
      await authService.logoutPlayer();
    } catch (err) {
      console.warn('Player logout server error:', err.message);
    }
    setStoredSession(PLAYER_SESSION_KEY, null, null);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  uploadAvatar: async (file) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.uploadAvatar(file);
      const updatedUser = response.data?.user || response.data;
      const { token } = get();
      if (token) setStoredSession(PLAYER_SESSION_KEY, token, updatedUser);
      set({ user: updatedUser, isLoading: false, error: null });
      return { success: true, user: updatedUser };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  changePassword: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.changePassword(data);
      const updatedUser = response.data?.user || response.user;
      const { token } = get();
      if (updatedUser && token) setStoredSession(PLAYER_SESSION_KEY, token, updatedUser);
      set({ ...(updatedUser ? { user: updatedUser } : {}), isLoading: false, error: null });
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
      const updatedUser = response.data?.user || response.data;
      const { token } = get();
      if (token) setStoredSession(PLAYER_SESSION_KEY, token, updatedUser);
      set({ user: updatedUser, isLoading: false, error: null });
      return { success: true, user: updatedUser };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  verifyMfaLogin: async ({ tempToken, code }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.verifyMfaLogin({ tempToken, code });
      const { user, token } = response.data || {};

      if (token) {
        setStoredSession(PLAYER_SESSION_KEY, token, user);
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

  clearError: () => set({ error: null }),
}));

export const useOwnerAuth = create((set) => ({
  user: getStoredSession(OWNER_SESSION_KEY).user,
  token: getStoredSession(OWNER_SESSION_KEY).token,
  isAuthenticated: Boolean(getStoredSession(OWNER_SESSION_KEY).token),
  isLoading: false,
  isInitializing: true,
  error: null,

  initialize: async () => {
    const { token, user: cachedUser } = getStoredSession(OWNER_SESSION_KEY);
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isInitializing: false });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const response = await authService.getCurrentUser('owner');
      const user = response.data?.user || response.data || cachedUser;
      setStoredSession(OWNER_SESSION_KEY, token, user);
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      console.warn('Owner auth initialization failed:', err.message);
      setStoredSession(OWNER_SESSION_KEY, null, null);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } finally {
      set({ isInitializing: false });
    }
  },

  loginAdmin: async ({ email, password, redirectTo }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.loginAdmin({ email, password, redirectTo });
      const { user, token, redirectTo: resRedirectTo } = response.data || {};

      if (token) {
        setStoredSession(OWNER_SESSION_KEY, token, user);
      }

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        error: null,
      });

      return { success: true, user, token, redirectTo: resRedirectTo || redirectTo };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  loginSuperadmin: async ({ email, password }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.loginSuperadmin({ email, password });
      const { user, token, mfaRequired, tempToken } = response.data || {};

      if (mfaRequired) {
        set({ isLoading: false, isInitializing: false, error: null });
        return { success: true, mfaRequired: true, tempToken };
      }

      if (token) {
        setStoredSession(OWNER_SESSION_KEY, token, user);
      }

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        error: null,
      });

      return { success: true, user, token, redirectTo: '/superadmin/dashboard' };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  verifyMfaLogin: async ({ tempToken, code }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.verifyMfaLogin({ tempToken, code });
      const { user, token } = response.data || {};

      if (token) {
        setStoredSession(OWNER_SESSION_KEY, token, user);
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

  setOwnerSession: (token, user) => {
    if (token) {
      setStoredSession(OWNER_SESSION_KEY, token, user);
    }
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  dismissTurfBanner: async () => {
    set((state) => {
      const user = state.user ? { ...state.user, turfApprovalBannerSeen: true } : state.user;
      if (state.token) setStoredSession(OWNER_SESSION_KEY, state.token, user);
      return { user };
    });
    try {
      await authService.dismissStaffBanner();
    } catch (err) {
      console.warn('Could not save banner dismissal:', err.message);
    }
  },

  logout: async () => {
    try {
      await authService.logoutOwner();
    } catch (err) {
      console.warn('Owner logout server error:', err.message);
    }
    setStoredSession(OWNER_SESSION_KEY, null, null);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));

export const useAuthStore = usePlayerAuth;
export default useAuthStore;
