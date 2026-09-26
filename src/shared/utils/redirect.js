const hasUnsafeChar = (value) => [...value].some((ch) => ch === '\\' || ch.charCodeAt(0) < 32);

// Post-login redirects must stay on this site: only accept a same-origin path, never a
// full URL, protocol-relative "//host" or backslash/control-character tricks.
export function safeRedirectPath(target, fallback = '/') {
  if (typeof target !== 'string') return fallback;
  if (!target.startsWith('/') || target.startsWith('//')) return fallback;
  if (hasUnsafeChar(target)) return fallback;
  return target;
}
