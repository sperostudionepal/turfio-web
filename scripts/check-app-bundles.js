import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const manifest = JSON.parse(readFileSync(new URL('../dist/.vite/manifest.json', import.meta.url)));
const user = Object.keys(manifest).find((key) => key.endsWith('/UserRoutes.jsx'));
assert.ok(user, 'User route chunk missing');
const entry = Object.keys(manifest).find((key) => manifest[key].isEntry);
const visited = new Set();
function visit(key) {
  if (visited.has(key)) return;
  visited.add(key);
  assert.ok(!/PartnerRoutes|SuperadminRoutes|StaffLoginPage/.test(key), `User graph imports staff code: ${key}`);
  for (const child of [...(manifest[key]?.imports || []), ...(key === entry ? [] : (manifest[key]?.dynamicImports || []))]) visit(child);
}
// Shared chunks can point back to the bootstrap entry. Its dynamic edges are
// the app dispatcher, not imports executed by the user route tree.
visit(user);
const synchronous = new Set();
function visitEntry(key) {
  if (synchronous.has(key)) return;
  synchronous.add(key);
  assert.ok(!/PartnerRoutes|SuperadminRoutes|StaffLoginPage/.test(key), `Entry eagerly loads staff code: ${key}`);
  for (const child of manifest[key]?.imports || []) visitEntry(child);
}
visitEntry(entry);
console.log(`User graph verified (${visited.size} chunks); staff trees remain lazy.`);
