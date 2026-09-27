import apiClient from './apiClient';

const ownerRequest = { authScope: 'owner' };

const payloadOf = (response) => response?.data ?? response;

/**
 * Promo codes are priced and validated entirely on the server, so this layer only carries
 * the raw documents. The discount a player sees always comes back from the API.
 */
export const promoService = {
  async listForOwner(params = {}) {
    const response = await apiClient.get('/promo-codes', { ...ownerRequest, params });
    const data = payloadOf(response) || {};
    return { promoCodes: data.promoCodes || [], stats: data.stats || {} };
  },

  async createForOwner(payload) {
    const response = await apiClient.post('/promo-codes', payload, ownerRequest);
    return payloadOf(response);
  },

  async updateForOwner(promoId, payload) {
    const response = await apiClient.put(`/promo-codes/${promoId}`, payload, ownerRequest);
    return payloadOf(response);
  },

  async deleteForOwner(promoId) {
    const response = await apiClient.delete(`/promo-codes/${promoId}`, ownerRequest);
    return payloadOf(response);
  },

  /** Codes a player can currently redeem at one venue: its own active codes plus platform-wide ones. */
  async getAvailableForTurf(turfId) {
    const response = await apiClient.get('/promo-codes/available', { params: { turfId } });
    const items = payloadOf(response);
    return Array.isArray(items) ? items : [];
  },

  async validate({ code, turfId, subtotal }) {
    const response = await apiClient.post('/promo-codes/validate', { code, turfId, subtotal });
    return payloadOf(response);
  },

  /** Freezes the discount on the active hold so charging and verification agree on one total. */
  async applyToHold(turfId, { code, holdToken }) {
    const response = await apiClient.patch(`/turfs/${turfId}/holds/promo`, { code, holdToken });
    return payloadOf(response);
  },

  async removeFromHold(turfId, { holdToken }) {
    const response = await apiClient.delete(`/turfs/${turfId}/holds/promo`, { data: { holdToken } });
    return payloadOf(response);
  },
};

export default promoService;
