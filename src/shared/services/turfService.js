import apiClient from './apiClient';
import { transformReview } from './reviewService';

// Owner/admin calls explicitly select the staff credential namespace. Never infer identity from URL shape.
const ownerRequest = { authScope: 'owner' };

/**
 * Fallback images for venues that don't have custom uploaded photos yet.
 */
const DEFAULT_TURF_IMAGES = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
];

/**
 * Adapter to transform a backend Turf document into the exact UI data model.
 * Guarantees zero UI breakage while supporting full dynamic backend data.
 */
export function transformTurf(turf) {
  if (!turf) return null;

  const id = turf._id || turf.id;
  const name = turf.name || turf.title || 'Futsal Arena';
  const pricePerHour = Number(turf.pricePerHour) || 1200;
  const coordinates = turf.location?.coordinates || [85.324, 27.7172]; // [lng, lat]
  const lng = turf.lng ?? coordinates[0];
  const lat = turf.lat ?? coordinates[1];

  // Address & City string
  const city = turf.address?.city || '';
  const area = turf.address?.area || '';
  const locationString = turf.location && typeof turf.location === 'string'
    ? turf.location
    : [area, city].filter(Boolean).join(', ') || 'Kathmandu, Nepal';

  // Images & Gallery
  let images = Array.isArray(turf.images) && turf.images.length > 0 ? turf.images : [];
  if (images.length === 0 && turf.image) {
    images = [turf.image];
  }
  if (images.length === 0) {
    // Pick deterministic placeholder based on id hash
    const idx = (typeof id === 'string' ? id.charCodeAt(id.length - 1) : 0) % DEFAULT_TURF_IMAGES.length;
    images = [DEFAULT_TURF_IMAGES[idx]];
  }

  // Owner details from populated user or application
  const ownerObj = turf.owner && typeof turf.owner === 'object' ? turf.owner : null;
  const ownerFullName = ownerObj
    ? [ownerObj.firstName, ownerObj.lastName].filter(Boolean).join(' ')
    : turf.ownerName || turf.managerName || '';
  const ownerPhone = ownerObj?.phone || turf.phone || '+977 9800000000';
  const ownerAvatar = ownerObj?.avatar || turf.managerAvatar || null;

  // Match sizes
  const matchTypes = Array.isArray(turf.matchTypes) && turf.matchTypes.length > 0
    ? turf.matchTypes
    : [turf.size || '5v5'];

  // Ground surface type (Indoor, Outdoor, Rooftop)
  const groundType = turf.groundType || turf.type || null;

  // Amenities
  const amenities = Array.isArray(turf.amenities) ? turf.amenities : [];
  const hasParking = amenities.some((a) => a.toLowerCase().includes('parking'));

  return {
    id,
    _id: turf._id,
    slug: turf.slug,
    title: name,
    name,
    description: turf.description || '',
    type: groundType, // if null/undefined, UI conditionally omits pill
    groundType,
    size: matchTypes[0] || '5v5',
    matchTypes,
    parking: hasParking ? 'Parking' : null,
    rating: Math.round(Number(turf.averageRating ?? turf.rating ?? 0) * 10) / 10,
    reviews: Number(turf.numberOfReviews ?? turf.reviews ?? 0),
    priceVal: pricePerHour,
    price: `NPR ${pricePerHour.toLocaleString()}/hr`,
    pricePerHour,
    image: images[0],
    gallery: images,
    images,
    location: locationString,
    address: locationString,
    city: city || 'Kathmandu',
    area,
    lat,
    lng,
    amenities,
    isVerified: Boolean(turf.isVerified),
    status: turf.status || 'Active',
    openingHours: turf.openingHours || null,
    operatingHoursByDay: turf.operatingHoursByDay || {},
    availableDays: turf.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    ownerName: ownerFullName,
    managerName: ownerFullName,
    phone: ownerPhone,
    managerAvatar: ownerAvatar,
    reviewsList: Array.isArray(turf.reviews) ? turf.reviews.map(transformReview).filter(Boolean) : [],
    courts: Array.isArray(turf.courts) ? turf.courts : [],
    raw: turf,
  };
}

export const turfService = {
  /**
   * Fetch all turfs from backend with optional filters and transform with adapter
   */
  async getTurfs(params = {}) {
    try {
      const response = await apiClient.get('/turfs', { params });
      const items = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
      return items.map(transformTurf);
    } catch (err) {
      console.warn('Failed to fetch turfs from backend API, using fallback:', err.message);
      throw err;
    }
  },

  /** Fetch turfs belonging to the authenticated staff account. Ownership is resolved server-side. */
  async getOwnerTurfs() {
    const response = await apiClient.get('/turfs/owner', ownerRequest);
    const items = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
    return items.map(transformTurf);
  },

  /**
   * Fetch a single turf by ID from backend and transform with adapter
   */
  async getTurfById(id) {
    try {
      const response = await apiClient.get(`/turfs/${id}`);
      const item = response?.data || response;
      return transformTurf(item);
    } catch (err) {
      console.warn(`Failed to fetch turf ${id} from backend API:`, err.message);
      throw err;
    }
  },

  /**
   * Fetch dynamic availability for a turf on a given date (opening window, bookable slots, booked/held ranges)
   */
  async getTurfAvailability(id, date, courtId = null, holdToken = null) {
    try {
      const params = { date };
      if (courtId) params.courtId = courtId;
      if (holdToken) params.holdToken = holdToken;
      const response = await apiClient.get(`/turfs/${id}/availability`, {
        params,
      });
      return response?.data || response;
    } catch (err) {
      console.warn(`Failed to fetch availability for turf ${id}:`, err.message);
      throw err;
    }
  },

  /**
   * Validate a specific time slot range against operating hours and conflicts
   */
  async validateSlot(id, { date, startTime, duration, holdToken, courtId }) {
    const response = await apiClient.post(`/turfs/${id}/slots/validate`, {
      date,
      startTime,
      duration,
      holdToken,
      courtId,
    });
    return response?.data || response;
  },

  /**
   * Create an atomic 5-minute hold on a slot range
   */
  async createSlotHold(id, { date, startTime, duration, courtId, courtName, replaceHoldToken }) {
    const response = await apiClient.post(`/turfs/${id}/holds`, {
      date,
      startTime,
      duration,
      courtId,
      courtName,
      replaceHoldToken,
    });
    return response?.data || response;
  },

  /**
   * Release a previously held slot range
   */
  async releaseSlotHold(id, holdToken) {
    try {
      const response = await apiClient.delete(`/turfs/${id}/holds`, {
        data: { holdToken },
      });
      return response?.data || response;
    } catch (err) {
      console.warn(`Failed to release hold:`, err.message);
      return null;
    }
  },

  /**
   * Update the current checkout step (1 = details, 2 = review) on an active hold
   */
  async updateHoldStep(id, holdToken, step) {
    if (!id || !holdToken || !step) return null;
    try {
      const response = await apiClient.patch(`/turfs/${id}/holds/step`, {
        holdToken,
        step,
      });
      return response?.data || response;
    } catch (err) {
      console.warn(`Failed to update hold step:`, err.message);
      return null;
    }
  },

  /**
   * Create a booking record on the backend
   */
  async createBooking(bookingData, options = {}) {
    const response = await apiClient.post('/bookings', bookingData, options);
    return response?.data || response;
  },

  async getMyBookings() {
    const response = await apiClient.get('/bookings');
    return response?.data || response;
  },

  async getBookingById(bookingId) {
    const response = await apiClient.get(`/bookings/${encodeURIComponent(bookingId)}`);
    return response?.data || response;
  },

  async getOwnerBookings() {
    const response = await apiClient.get('/bookings/owner', ownerRequest);
    return response?.data || response;
  },

  async getOwnerCustomers(params = {}) {
    const response = await apiClient.get('/customers/owner', { ...ownerRequest, params });
    return response?.data || response;
  },

  async createOwnerCustomer(customerData) {
    const response = await apiClient.post('/customers/owner', customerData, ownerRequest);
    return response?.data || response;
  },

  async getOwnerPayments(params = {}) {
    const response = await apiClient.get('/payments/owner', { ...ownerRequest, params });
    return response?.data || response;
  },

  /**
   * Update editable venue fields (name, description, address city/area, pricePerHour, amenities)
   */
  async updateTurf(turfId, updates) {
    const response = await apiClient.put(`/turfs/${turfId}`, updates, ownerRequest);
    return transformTurf(response?.data || response);
  },

  async cancelBooking(bookingId) {
    const response = await apiClient.put(`/bookings/${encodeURIComponent(bookingId)}/cancel`);
    return response?.data || response;
  },

  /**
   * Owner records that the customer paid the outstanding balance in person (Pay at Venue)
   */
  async markBookingPaid(bookingId) {
    const response = await apiClient.put(`/bookings/${encodeURIComponent(bookingId)}/payment`, { paymentStatus: 'Paid' }, ownerRequest);
    return response?.data || response;
  },

  async confirmBooking(bookingId) {
    const response = await apiClient.put(`/bookings/${encodeURIComponent(bookingId)}/confirm`, {}, ownerRequest);
    return response?.data || response;
  },

  /**
   * Request cancellation with refund (user side)
   */
  async requestCancellation(bookingId, reason) {
    const response = await apiClient.post(`/bookings/${encodeURIComponent(bookingId)}/request-cancellation`, { reason });
    return response?.data || response;
  },

  /**
   * Approve cancellation request (admin side)
   */
  async approveCancellation(bookingId, reviewNotes) {
    const response = await apiClient.put(`/bookings/${encodeURIComponent(bookingId)}/approve-cancellation`, { reviewNotes }, ownerRequest);
    return response?.data || response;
  },

  /**
   * Reject cancellation request (admin side)
   */
  async rejectCancellation(bookingId, reviewNotes) {
    const response = await apiClient.put(`/bookings/${encodeURIComponent(bookingId)}/reject-cancellation`, { reviewNotes }, ownerRequest);
    return response?.data || response;
  },

  async createManualBooking(bookingData) {
    const response = await apiClient.post('/bookings/manual', bookingData, ownerRequest);
    return response?.data || response;
  },

  /**
   * Initiate eSewa payment for a booking or active hold
   */
  async initiateEsewaPayment(bookingId, amount, extraOptions = {}) {
    const response = await apiClient.post('/payments/initiate', {
      bookingId,
      amount,
      ...extraOptions,
    });
    return response?.data || response;
  },

  /**
   * Verify eSewa callback payment data
   */
  async verifyEsewaPayment(encodedData, bookingPayload = null) {
    const response = await apiClient.post('/payments/verify', {
      data: encodedData,
      bookingPayload,
    });
    return response?.data || response;
  },

  /**
   * Submit eSewa form programmatically
   */
  submitEsewaForm(paymentUrl, formData, { replaceHistory = false } = {}) {
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', paymentUrl);
    form.style.display = 'none';

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', key);
      input.setAttribute('value', value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    if (replaceHistory) {
      window.history.replaceState({ turfioPaymentRedirect: true }, '', window.location.href);
    }
    form.submit();
  },

  async cancelEsewaAttempt(holdToken) {
    if (!holdToken) return null;
    const response = await apiClient.post('/payments/cancel-attempt', { holdToken });
    return response?.data || response;
  },

  /**
   * Get all courts for a turf
   */
  async getCourts(turfId) {
    const response = await apiClient.get(`/turfs/${turfId}/courts`);
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.courts)) return response.courts;
    return [];
  },

  /**
   * Add a new court to a turf
   */
  async addCourt(turfId, courtData) {
    const response = await apiClient.post(`/turfs/${turfId}/courts`, courtData, ownerRequest);
    return response?.data || response;
  },

  /**
   * Update court details
   */
  async updateCourt(turfId, courtId, courtData) {
    const response = await apiClient.put(`/turfs/${turfId}/courts/${courtId}`, courtData, ownerRequest);
    return response?.data || response;
  },

  /**
   * Delete a court
   */
  async deleteCourt(turfId, courtId) {
    const response = await apiClient.delete(`/turfs/${turfId}/courts/${courtId}`, ownerRequest);
    return response?.data || response;
  },

  /**
   * Upload an image for a court
   */
  async uploadCourtImage(turfId, courtId, file) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post(`/turfs/${turfId}/courts/${courtId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      authScope: 'owner',
    });
    return response?.data || response;
  },
  /**
   * Upload multiple global turf images
   */
  async uploadTurfImages(turfId, files) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    const response = await apiClient.post(`/turfs/${turfId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      authScope: 'owner',
    });
    const item = response?.data || response;
    return transformTurf(item);
  },

  /**
   * Delete a single turf image
   */
  async deleteTurfImage(turfId, imageUrl) {
    const response = await apiClient.delete(`/turfs/${turfId}/images`, {
      data: { imageUrl },
      authScope: 'owner',
    });
    const item = response?.data || response;
    return transformTurf(item);
  },

  /**
   * Reorder turf images array
   */
  async reorderTurfImages(turfId, images) {
    const response = await apiClient.put(`/turfs/${turfId}/images/reorder`, { images }, ownerRequest);
    const item = response?.data || response;
    return transformTurf(item);
  },

  /**
   * Fetch any interrupted hold or unpaid booking to show a "Continue Booking" banner
   */
  async getResumableBooking(guestHoldToken) {
    try {
      const response = await apiClient.get('/bookings/resumable', {
        params: guestHoldToken ? { holdToken: guestHoldToken } : {},
      });
      return response?.data || response;
    } catch (err) {
      console.warn('Failed to fetch resumable booking:', err.message);
      return { item: null };
    }
  },

  /**
   * Generate booking pass with QR code
   */
  async generateBookingPass(bookingId) {
    const response = await apiClient.get(`/bookings/${bookingId}/booking-pass`);
    // Backend returns { success: true, data: { booking, qrToken, expiresAt }, message: "..." }
    return response;
  },

  /**
   * Verify booking QR code (admin)
   */
  async verifyBookingQR(token) {
    const response = await apiClient.post('/bookings/verify-qr', { token }, ownerRequest);
    return response.data;
  },
};

export default turfService;
