// One search shape ({ location, date, time, players, coords }) shared by the landing-page search bar
// and the Find Turfs page, so both offer the same choices and behave the same way.

const ALL_TIME_SLOTS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
];

export const TIME_SLOT_OPTIONS = ALL_TIME_SLOTS.map((slot) => ({
  value: slot,
  label: slot,
}));

// The players dropdown shows "Random" but the filter value is "Any Size".
export const normalizePlayersFilter = (players) => players === 'Random' ? 'Any Size' : (players || 'Any Size');

// The search travels in the URL so it is shareable and survives reload/back:
// /turfs?location=&date=&time=&players=&lat=&lng=
const TEXT_FIELDS = ['location', 'date', 'time', 'players'];

export function buildTurfSearchPath(search) {
  const params = new URLSearchParams();
  for (const field of TEXT_FIELDS) {
    const value = typeof search?.[field] === 'string' ? search[field].trim() : '';
    if (!value) continue;
    if (field === 'players' && normalizePlayersFilter(value) === 'Any Size') continue;
    params.set(field, value);
  }
  const lat = Number(search?.coords?.lat);
  const lng = Number(search?.coords?.lng);
  if (search?.coords && Number.isFinite(lat) && Number.isFinite(lng)) {
    params.set('lat', String(lat));
    params.set('lng', String(lng));
  }
  const query = params.toString();
  return query ? `/turfs?${query}` : '/turfs';
}

export function parseTurfSearch(searchParams) {
  const search = {};
  for (const field of TEXT_FIELDS) {
    const value = searchParams.get(field);
    if (value) search[field] = value;
  }
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));
  if (searchParams.get('lat') && searchParams.get('lng') && Number.isFinite(lat) && Number.isFinite(lng)) {
    search.coords = { lat, lng, requestId: 1 };
  }
  return Object.keys(search).length ? search : null;
}
