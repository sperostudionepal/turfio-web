// Accepts a turf object or a bare id/slug; map components pass the whole turf.
export function getTurfRoutePath(turfOrId) {
  const id = turfOrId && typeof turfOrId === 'object'
    ? turfOrId.slug || turfOrId.id || turfOrId._id
    : turfOrId;
  return id ? `/route?turfId=${encodeURIComponent(id)}` : '/route';
}
