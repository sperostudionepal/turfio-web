import { roleContext } from './appContext.js';

export function requestRoleContext(config, context) {
  const explicit = config.authScope || config.headers?.['X-Role-Context'];
  // 'owner' labels shared staff operations, which superadmin also legitimately
  // uses (e.g. global promotions). Select the active staff session, not admin.
  if (explicit === 'owner') return context === 'superadmin' ? 'superadmin' : 'admin';
  return explicit || roleContext(context) || 'player';
}
