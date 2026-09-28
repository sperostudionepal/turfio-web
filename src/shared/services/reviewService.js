import apiClient from './apiClient';

const formatReviewDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatReviewTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Adapter turning a backend Review document into the shape the review UI renders.
 */
export function transformReview(review) {
  if (!review) return null;

  const user = review.user && typeof review.user === 'object' ? review.user : {};

  return {
    id: review._id || review.id,
    _id: review._id,
    rating: Number(review.rating),
    comment: review.comment || '',
    courtId: review.courtId || null,
    courtName: review.courtName || '',
    userId: user._id || null,
    name: [user.firstName, user.lastName].filter(Boolean).join(' '),
    avatar: user.profilePicture || '',
    date: formatReviewDate(review.createdAt),
    createdAt: review.createdAt || null,
  };
}

/**
 * Same review plus the customer's email and the venue name, for the owner portal's
 * feedback table where reviews from every court of every venue are listed together.
 */
export function transformOwnerReview(review) {
  const base = transformReview(review);
  if (!base) return null;

  const user = review.user && typeof review.user === 'object' ? review.user : {};

  return {
    ...base,
    email: user.email || '',
    turfName: review.turfName || '',
    time: formatReviewTime(review.createdAt),
    bookingId: review.bookingId || review.booking?.bookingId || null,
    status: review.status || null,
    reply: review.ownerReply?.text || null,
    isHidden: Boolean(review.isHidden),
    isReported: Boolean(review.isReported),
  };
}

export const reviewService = {
  async getTurfReviews(turfId) {
    const response = await apiClient.get(`/turfs/${turfId}/reviews`);
    const items = response?.data || [];
    return items.map(transformReview);
  },

  async getOwnerReviews() {
    const response = await apiClient.get('/reviews/owner', { authScope: 'owner' });
    const items = response?.data || [];
    return items.map(transformOwnerReview).filter(Boolean);
  },

  async getOwnerReviewStats() {
    const response = await apiClient.get('/reviews/owner/stats', { authScope: 'owner' });
    return response?.data || null;
  },

  async replyToReview(reviewId, text) {
    const response = await apiClient.post(`/reviews/${reviewId}/reply`, { text }, { authScope: 'owner' });
    return response?.data || response;
  },

  async setReviewVisibility(reviewId, hidden) {
    const response = await apiClient.patch(`/reviews/${reviewId}/visibility`, { hidden }, { authScope: 'owner' });
    return response?.data || response;
  },

  async reportReview(reviewId) {
    const response = await apiClient.post(`/reviews/${reviewId}/report`, {}, { authScope: 'owner' });
    return response?.data || response;
  },

  async createReview(turfId, { courtId, rating, comment }) {
    const response = await apiClient.post(`/turfs/${turfId}/reviews`, { courtId, rating, comment });
    return transformReview(response?.data || response);
  },

  async updateReview(reviewId, { rating, comment }) {
    const response = await apiClient.put(`/reviews/${reviewId}`, { rating, comment });
    return transformReview(response?.data || response);
  },

  async deleteReview(reviewId) {
    await apiClient.delete(`/reviews/${reviewId}`);
    return true;
  },
};

export default reviewService;
