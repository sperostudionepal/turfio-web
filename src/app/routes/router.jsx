import { lazy, Suspense } from 'react';
import { getAppContext } from '../../shared/config/appContext';

// Only the selected tree is imported. Staff page code is not in the user entry graph.
const trees = {
  user: lazy(() => import('./UserRoutes')),
  partner: lazy(() => import('./PartnerRoutes')),
  superadmin: lazy(() => import('./SuperadminRoutes')),
};

export default function AppRoutes() {
  const Tree = trees[getAppContext()];
  if (!Tree) return <main className="min-h-screen flex items-center justify-center p-8"><div><h1 className="text-2xl font-bold">Turfio configuration error</h1><p>This hostname is not configured for a Turfio app. Contact the site operator.</p></div></main>;
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Turfio…</div>}><Tree /></Suspense>;
}
