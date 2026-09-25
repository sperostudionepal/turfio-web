import { create } from 'zustand';
import wishlistService from '../services/wishlistService';

export const useWishlistStore = create((set, get) => ({
  items: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  isWishlisted: (turfId) => get().items.some((t) => t.id === turfId || t._id === turfId),

  fetchWishlist: async () => {
    try {
      set({ isLoading: true, error: null });
      const items = await wishlistService.getWishlist();
      set({ items, isLoading: false, isLoaded: true });
      return { success: true, items };
    } catch (err) {
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  addToWishlist: async (turfId) => {
    try {
      const items = await wishlistService.addToWishlist(turfId);
      set({ items, isLoaded: true });
      return { success: true, items };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  removeFromWishlist: async (turfId) => {
    try {
      const items = await wishlistService.removeFromWishlist(turfId);
      set({ items, isLoaded: true });
      return { success: true, items };
    } catch (err) {
      set({ error: err.message });
      return { success: false, error: err.message };
    }
  },

  reset: () => set({ items: [], isLoading: false, isLoaded: false, error: null }),
}));

export default useWishlistStore;
