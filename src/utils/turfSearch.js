// The hero search bar and the Find Turfs page share one search shape: { location, date, time, players }.
// It travels in the URL so a search is shareable and survives reload/back.
const FIELDS = ['location', 'date', 'time', 'players'];

export function buildTurfSearchPath(search) {
  const params = new URLSearchParams();
  for (const field of FIELDS) {
    const value = typeof search?.[field] === 'string' ? search[field].trim() : '';
    // "Random" is the players dropdown's "any size" default, so it adds nothing to the query.
    if (value && !(field === 'players' && value === 'Random')) params.set(field, value);
  }
  const query = params.toString();
  return query ? `/turfs?${query}` : '/turfs';
}

export function parseTurfSearch(searchParams) {
  const search = {};
  for (const field of FIELDS) {
    const value = searchParams.get(field);
    if (value) search[field] = value;
  }
  return Object.keys(search).length ? search : null;
}
