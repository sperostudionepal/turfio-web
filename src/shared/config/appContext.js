const contexts = ['user', 'partner', 'superadmin'];
const defaultHosts = {
  'turfio.com': 'user',
  'partner.turfio.com': 'partner',
  'superadmin.turfio.com': 'superadmin',
};
const developmentHosts = {
  localhost: 'user', '127.0.0.1': 'user', '[::1]': 'user',
  'turfio.localhost': 'user', 'partner.localhost': 'partner', 'superadmin.localhost': 'superadmin',
};
const urlKeys = { user: 'VITE_USER_APP_URL', partner: 'VITE_PARTNER_APP_URL', superadmin: 'VITE_SUPERADMIN_APP_URL' };

// Pure inputs make hostname/override policy testable without a browser or Vite.
export function getAppContext({
  hostname = globalThis.location?.hostname || '',
  search = globalThis.location?.search || '',
  env = import.meta.env || {},
} = {}) {
  const host = hostname.toLowerCase();
  let context = defaultHosts[host] || (env.DEV ? developmentHosts[host] : null);
  for (const app of contexts) {
    if (!env[urlKeys[app]]) continue;
    try {
      if (new URL(getAppBaseUrl(app, { env })).hostname.toLowerCase() === host) {
        // Multiple apps may use localhost in override mode. Explicit host mappings win.
        context ||= app;
      }
    } catch { return null; }
  }
  if (env.DEV) {
    const override = new URLSearchParams(search).get('app') || env.VITE_APP_CONTEXT;
    if (contexts.includes(override)) return override;
  }
  return context || null;
}

export function getAppBaseUrl(app, {
  env = import.meta.env || {}, location = globalThis.location,
} = {}) {
  if (!contexts.includes(app)) throw new Error('Invalid app context');
  let base = env[urlKeys[app]];
  if (!base) {
    if (env.DEV) {
      base = app === 'user' && location && ['localhost', '127.0.0.1', '[::1]', 'turfio.localhost'].includes(location.hostname)
        ? location.origin
        : `http://${app === 'user' ? 'turfio' : app}.localhost:5173`;
    } else {
      base = `https://${app === 'user' ? '' : `${app}.`}turfio.com`;
    }
  }
  const url = new URL(base);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error(`${urlKeys[app]} must be an HTTP(S) origin`);
  }
  if (!env.DEV && url.protocol !== 'https:') throw new Error('Production app URLs require HTTPS');
  return url.origin;
}

export function appUrl(app, path = '/', options) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//') || [...path].some((ch) => ch === '\\' || ch.charCodeAt(0) < 32)) {
    throw new Error('App links require a local absolute path');
  }
  const env = options?.env || import.meta.env || {};
  const url = new URL(path, getAppBaseUrl(app, options));
  // Do not carry a development override into a different portal.
  url.searchParams.delete('app');
  if (env.DEV && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) && app !== 'user') url.searchParams.set('app', app);
  return url.href;
}

export const roleContext = (context = getAppContext()) => ({ user: 'player', partner: 'admin', superadmin: 'superadmin' })[context];
