import apiClient from './apiClient';

/**
 * Owner (turf-listing) request API.
 *
 * Submissions are multipart: a single JSON `payload` field plus one or more
 * `documents` files. The server (POST /api/owner-requests) validates the
 * payload with Zod and the files by magic bytes.
 */
export const ownerRequestService = {
  /**
   * @param {object} args
   * @param {object} args.payload   structured request body (see server schema)
   * @param {Array<{ file: File, kind: string }>} args.documents
   */
  async submit({ payload, documents }) {
    const form = new FormData();
    form.append('payload', JSON.stringify(payload));
    documents.forEach(({ file }) => form.append('documents', file, file.name));

    // Let the browser/axios set the multipart boundary.
    return apiClient.post('/owner-requests', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /** Current user's own requests, newest first. */
  async mine() {
    return apiClient.get('/owner-requests/mine');
  },

  /** Cancel an open (pending / needs_changes) request. */
  async withdraw(id) {
    return apiClient.patch(`/owner-requests/${id}/withdraw`);
  },

  /* ---- superadmin ---- */

  async list({ status = 'pending', q = '', page = 1, limit = 20 } = {}) {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.set('status', status);
    if (q) params.set('q', q);
    params.set('page', page);
    params.set('limit', limit);
    return apiClient.get(`/owner-requests?${params.toString()}`);
  },

  async get(id) {
    return apiClient.get(`/owner-requests/${id}`);
  },

  async decide(id, decision, note) {
    return apiClient.patch(`/owner-requests/${id}/decision`, { decision, note });
  },
};

export default ownerRequestService;
