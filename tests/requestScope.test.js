import test from 'node:test';
import assert from 'node:assert/strict';
import { requestRoleContext } from '../src/shared/config/requestScope.js';
test('shared owner operations select the current staff session', () => {
  assert.equal(requestRoleContext({ authScope: 'owner' }, 'partner'), 'admin');
  assert.equal(requestRoleContext({ authScope: 'owner' }, 'superadmin'), 'superadmin');
});
test('explicit auth endpoints retain their own scope', () => {
  assert.equal(requestRoleContext({ headers: { 'X-Role-Context': 'admin' } }, 'superadmin'), 'admin');
  assert.equal(requestRoleContext({ authScope: 'superadmin' }, 'partner'), 'superadmin');
});
test('unscoped requests follow the active app', () => {
  assert.equal(requestRoleContext({}, 'user'), 'player');
  assert.equal(requestRoleContext({}, 'partner'), 'admin');
  assert.equal(requestRoleContext({}, 'superadmin'), 'superadmin');
});
