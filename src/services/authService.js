import apiClient from './apiClient';

/**
 * Auth Service communicating with Express backend `/api/auth` endpoints
 */
export const authService = {
  /**
   * Register a new user
   * @param {{ firstName, lastName, email, password, confirmPassword }} data
   */
  async register(data) {
    const response = await apiClient.post('/auth/register', {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword || data.password,
    });
    return response; // { success: true, message, data: { user, token } }
  },

  /**
   * Register a prospective venue owner (no account required beforehand).
   * Creates a `pending_owner` — no access until a superadmin approves.
   * @param {{ name, email, password }} data
   */
  async registerOwner(data) {
    const response = await apiClient.post('/auth/register-owner', {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    return response; // { success, message, data: { user, token } }
  },

  /**
   * Login player/customer (Role: user)
   * @param {{ email, password }} data
   */
  async login(data) {
    const response = await apiClient.post('/auth/login', {
      email: data.email,
      password: data.password,
    });
    return response; // { success: true, message, data: { user, token } }
  },

  /**
   * Login arena owner (Role: admin)
   * @param {{ email, password }} data
   */
  async loginAdmin(data) {
    const response = await apiClient.post('/admin/auth/login', {
      email: data.email,
      password: data.password,
    });
    return response; // { success: true, message, data: { user, token } }
  },

  /**
   * Login platform staff (Role: superadmin)
   * @param {{ email, password }} data
   */
  async loginSuperadmin(data) {
    const response = await apiClient.post('/superadmin/auth/login', {
      email: data.email,
      password: data.password,
    });
    return response; // { success: true, message, data: { user, token } }
  },

  /**
   * Google Login with ID token
   * @param {string} idToken
   */
  async googleLogin(idToken) {
    const response = await apiClient.post('/auth/google', { idToken });
    return response;
  },

  /**
   * Get current authenticated user details
   */
  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response; // { success: true, message, data: { user } }
  },

  /**
   * Self-delete the current account (only permitted for a pending_owner).
   */
  async deleteAccount() {
    return apiClient.delete('/auth/me');
  },

  /**
   * Update user profile / Complete onboarding
   * @param {Object} profileData
   */
  async updateProfile(profileData) {
    const rawTravel = profileData.travelDistance || profileData.travelPreference;
    const parsedTravel = typeof rawTravel === 'number'
      ? rawTravel
      : parseInt(String(rawTravel || '').replace(/[^0-9]/g, ''), 10) || 5;

    const payload = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phone: profileData.phone,
      username: profileData.username,
      dateOfBirth: profileData.dob || profileData.dateOfBirth,
      gender: profileData.gender,
      city: profileData.city,
      preferredFoot: profileData.preferredFoot,
      primaryPosition: profileData.position || profileData.primaryPosition,
      skillLevel: profileData.skillLevel,
      playingStyle: profileData.playingStyle,
      preferredMatchType: profileData.matchType || profileData.preferredMatchType,
      playFrequency: profileData.playFrequency,
      preferredTime: profileData.preferredTime,
      travelPreference: parsedTravel,
      weeklyAvailability: profileData.weeklyAvailability,
      gameVibe: Array.isArray(profileData.gameVibe) ? profileData.gameVibe : profileData.gameVibe ? [profileData.gameVibe] : [],
      fitnessLevel: profileData.fitnessLevel,
      isProfileCompleted: true,
    };

    const response = await apiClient.put('/auth/profile', payload);
    return response; // { success: true, message, data: { user } }
  },

  /**
   * Upload profile avatar image
   * @param {File} file
   */
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post('/auth/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  /**
   * Change user password
   * @param {{ currentPassword, newPassword }} data
   */
  async changePassword({ currentPassword, newPassword }) {
    const response = await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response;
  },

  /**
   * Update user preferences
   * @param {{ notifications, preferredLocation, theme, language }} preferences
   */
  async updatePreferences(preferences) {
    const response = await apiClient.put('/auth/preferences', preferences);
    return response;
  },

  /**
   * Get list of active sessions for current user
   */
  async getSessions() {
    const response = await apiClient.get('/auth/sessions');
    return response;
  },

  /**
   * Terminate all other sessions
   */
  async logoutOtherSessions() {
    const response = await apiClient.post('/auth/sessions/logout-others');
    return response;
  },

  /**
   * Toggle 2FA setting
   */
  async toggleTwoFactor() {
    const response = await apiClient.post('/auth/2fa/toggle');
    return response;
  },

  /**
   * Generate temporary TOTP secret and QR code for MFA setup
   */
  async generateMfaSecret() {
    const response = await apiClient.post('/auth/mfa/generate');
    return response;
  },

  /**
   * Verify initial 6-digit TOTP code and enable 2FA
   * @param {string} code
   */
  async verifyMfaSetup(code) {
    const response = await apiClient.post('/auth/mfa/verify', { code });
    return response;
  },

  /**
   * Disable 2FA with password or TOTP re-authentication
   * @param {{ password, code }} data
   */
  async disableMfa(data) {
    const response = await apiClient.post('/auth/mfa/disable', data);
    return response;
  },

  /**
   * Verify TOTP code or backup code during login flow
   * @param {{ tempToken, code }} data
   */
  async verifyMfaLogin({ tempToken, code }) {
    const response = await apiClient.post('/auth/mfa/verify-login', { tempToken, code });
    return response;
  },
};

export default authService;
