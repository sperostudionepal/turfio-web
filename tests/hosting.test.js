import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url)));
test('staff hosts receive noindex and disallow robots rules', () => {
  for (const host of ['partner.turfio.com', 'superadmin.turfio.com']) {
    assert.ok(config.headers.some((rule) => rule.has.some((condition) => condition.type === 'host' && condition.value === host) && rule.headers.some((header) => header.key === 'X-Robots-Tag' && header.value.includes('noindex'))));
    assert.ok(config.rewrites.some((rule) => rule.source === '/robots.txt' && rule.destination === '/robots-staff.txt' && rule.has?.some((condition) => condition.type === 'host' && condition.value === host)));
  }
  assert.equal(readFileSync(new URL('../public/robots-staff.txt', import.meta.url), 'utf8'), 'User-agent: *\nDisallow: /\n');
  assert.ok(readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8').includes('Sitemap: https://turfio.com/sitemap.xml'));
});
test('API proxy precedes SPA fallback and preserves API namespace', () => {
  const proxy = config.rewrites.findIndex((rule) => rule.source === '/api/:path*');
  const fallback = config.rewrites.findIndex((rule) => rule.destination === '/index.html');
  assert.ok(proxy >= 0 && proxy < fallback);
  assert.ok(config.rewrites[proxy].destination.endsWith('/api/:path*'));
});
