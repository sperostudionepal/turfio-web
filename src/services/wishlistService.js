import apiClient from './apiClient';
import { transformTurf } from './turfService';

export const wishlistService = {
  async getWishlist() {
    const response = await apiClient.get('/wishlist');
    const items = response?.data || [];
    return items.map(transformTurf);
  },

  async addToWishlist(turfId) {
    const response = await apiClient.post(`/wishlist/${turfId}`);
    const items = response?.data || [];
    return items.map(transformTurf);
  },

  async removeFromWishlist(turfId) {
    const response = await apiClient.delete(`/wishlist/${turfId}`);
    const items = response?.data || [];
    return items.map(transformTurf);
  },
};

export default wishlistService;
