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
};

export default authService;
