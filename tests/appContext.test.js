import test from 'node:test';
import assert from 'node:assert/strict';
import { getAppContext, getAppBaseUrl, appUrl, roleContext } from '../src/shared/config/appContext.js';

for (const [hostname, expected] of Object.entries({
  'turfio.com': 'user', 'partner.turfio.com': 'partner', 'superadmin.turfio.com': 'superadmin',
})) {
  test(`production host ${hostname}`, () => assert.equal(getAppContext({ hostname, env: { DEV: false } }), expected));
}
for (const [hostname, expected] of Object.entries({
  localhost: 'user', '127.0.0.1': 'user', 'turfio.localhost': 'user',
  'partner.localhost': 'partner', 'superadmin.localhost': 'superadmin',
})) {
  test(`development host ${hostname}`, () => assert.equal(getAppContext({ hostname, env: { DEV: true } }), expected));
}
test('override is development-only', () => {
  assert.equal(getAppContext({ hostname: 'localhost', search: '?app=partner', env: { DEV: true } }), 'partner');
  assert.equal(getAppContext({ hostname: 'turfio.com', search: '?app=superadmin', env: { DEV: false, VITE_APP_CONTEXT: 'partner' } }), 'user');
  assert.equal(getAppContext({ hostname: 'preview.test', search: '?app=superadmin', env: { DEV: false } }), null);
  assert.equal(getAppContext({ hostname: 'preview.test', env: { DEV: true, VITE_APP_CONTEXT: 'superadmin' } }), 'superadmin');
});
test('unknown hosts fail closed, including localhost in production', () => {
  for (const hostname of ['evil.turfio.com', 'partner.turfio.com.evil.test', 'turfio-localhost', 'localhost']) {
    assert.equal(getAppContext({ hostname, env: { DEV: false } }), null);
  }
});
test('configured hosts and invalid overrides', () => {
  assert.equal(getAppContext({ hostname: 'owners.example.com', env: { VITE_PARTNER_APP_URL: 'https://owners.example.com' } }), 'partner');
  assert.equal(getAppContext({ hostname: 'localhost', search: '?app=invalid', env: { DEV: true } }), 'user');
});
test('plain localhost user return and explicit user URL', () => {
  const location = { hostname: 'localhost', origin: 'http://localhost:5173' };
  assert.equal(getAppBaseUrl('user', { env: { DEV: true }, location }), location.origin);
  assert.equal(appUrl('user', '/payment-success', { env: { DEV: true, VITE_USER_APP_URL: 'http://localhost:5173' } }), 'http://localhost:5173/payment-success');
});
test('cross-app links use configured origins and reject external path injection', () => {
  assert.equal(appUrl('partner', '/dashboard', { env: { VITE_PARTNER_APP_URL: 'https://owners.example.com' } }), 'https://owners.example.com/dashboard');
  assert.throws(() => appUrl('partner', '//evil.test'));
  assert.throws(() => getAppBaseUrl('user', { env: { VITE_USER_APP_URL: 'https://u:p@turfio.com' } }));
  assert.equal(roleContext('partner'), 'admin');
});

test('cross-app redirects discard stale overrides and set fallback context explicitly', () => {
  assert.equal(appUrl('superadmin', '/superadmin/login?app=partner', { env: { DEV: true } }), 'http://superadmin.localhost:5173/superadmin/login');
  assert.equal(appUrl('partner', '/owner/login', { env: { DEV: true, VITE_PARTNER_APP_URL: 'http://localhost:5173' } }), 'http://localhost:5173/owner/login?app=partner');
  assert.equal(getAppContext({ hostname: 'localhost', env: { DEV: false, VITE_USER_APP_URL: 'http://localhost:5173' } }), null);
});
