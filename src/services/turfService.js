import apiClient from './apiClient';

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
  const size = matchTypes.join(', ');

  // Ground surface type (Indoor, Outdoor, Rooftop)
  const groundType = turf.groundType || turf.type || null;

  // Amenities
  const amenities = Array.isArray(turf.amenities) ? turf.amenities : [];
  const hasParking = amenities.some((a) => a.toLowerCase().includes('parking'));

  return {
    id,
    _id: turf._id,
    title: name,
    name,
    description: turf.description || '',
    type: groundType, // if null/undefined, UI conditionally omits pill
    groundType,
    size: matchTypes[0] || '5v5',
    matchTypes,
    parking: hasParking ? 'Parking' : null,
    rating: Number(turf.averageRating || turf.rating) || 4.5,
    reviews: Number(turf.numberOfReviews || turf.reviews) || 0,
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
    openingHours: turf.openingHours || { start: '06:00', end: '22:00' },
    availableDays: turf.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    ownerName: ownerFullName,
    managerName: ownerFullName,
    phone: ownerPhone,
    managerAvatar: ownerAvatar,
    reviewsList: turf.reviewsList || [],
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
};

export default turfService;
