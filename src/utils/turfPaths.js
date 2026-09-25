// Callers pass either a turf object (cards, maps, "View Arena") or a bare id/slug.
const turfKey = (turfOrId) =>
  turfOrId && typeof turfOrId === 'object'
    ? turfOrId.slug || turfOrId.id || turfOrId._id
    : turfOrId;

export function getTurfRoutePath(turfOrId) {
  const key = turfKey(turfOrId);
  return key ? `/route?turfId=${encodeURIComponent(key)}` : '/route';
}

export function getTurfDetailsPath(turfOrId) {
  const key = turfKey(turfOrId);
  return key ? `/turfs/${encodeURIComponent(key)}` : '/turfs';
}
