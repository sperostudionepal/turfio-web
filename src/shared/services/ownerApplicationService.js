import apiClient from './apiClient';

/**
 * Owner Application Service communicating with `/api/owner-applications`
 */
export const ownerApplicationService = {
  /**
   * Submit new arena listing application (No password)
   * @param {{ payload: object, documents: Array<{ file: File, kind: string }> }} args
   */
  async submit({ payload, documents = [] }) {
    const form = new FormData();
    form.append('payload', JSON.stringify(payload));
    documents.forEach(({ file }) => form.append('documents', file, file.name));

    return apiClient.post('/owner-applications', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Track application by tracking token
   * @param {string} token
   */
  async track(token) {
    return apiClient.get(`/owner-applications/track?token=${encodeURIComponent(token)}`);
  },

  /**
   * Verify signup token for dashboard setup
   * @param {string} token
   */
  async verifySignupToken(token) {
    return apiClient.get(`/owner-applications/verify-signup-token?token=${encodeURIComponent(token)}`);
  },

  /**
   * Complete signup and set password
   * @param {{ token: string, password: string, confirmPassword: string }} data
   */
  async completeSignup(data) {
    return apiClient.post('/owner-applications/complete-signup', data);
  },

  /* ---- Superadmin API ---- */

  /**
   * List applications with filter & search
   */
  async list({ status = 'pending', q = '', page = 1, limit = 20 } = {}) {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.set('status', status);
    if (q) params.set('q', q);
    params.set('page', page);
    params.set('limit', limit);
    return apiClient.get(`/owner-applications?${params.toString()}`);
  },

  /**
   * Get single application details
   */
  async get(id) {
    return apiClient.get(`/owner-applications/${id}`);
  },

  /**
   * Decide on application (approve / reject / needs_changes)
   */
  async decide(id, decision, note) {
    return apiClient.patch(`/owner-applications/${id}/decision`, { decision, note });
  },

  /**
   * Resend the single-use dashboard setup link for an approved application
   */
  async resendSetup(id) {
    return apiClient.post(`/owner-applications/${id}/resend-setup`);
  },
};

export default ownerApplicationService;
