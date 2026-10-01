import { Outlet, ScrollRestoration, useSearchParams, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
const GlobalWidgets = lazy(() => import('../../shared/components/common/GlobalWidgets'));

function LegacyQueryHandler({ children }) {
  const [searchParams] = useSearchParams();

  const page = searchParams.get('page');
  const id = searchParams.get('id') || searchParams.get('turfId');

  if (page === 'turfs' || page === 'find-turfs') {
    return <Navigate to="/turfs" replace />;
  }
  if (page === 'turfDetails' && id) {
    return <Navigate to={`/turfs/${id}`} replace />;
  }
  if (page === 'bookingCheckout' && id) {
    const step = searchParams.get('step') || '1';
    return <Navigate to={`/turfs/${id}/book?step=${step}`} replace />;
  }
  if (page === 'route') {
    return <Navigate to={id ? `/route?turfId=${id}` : '/route'} replace />;
  }
  if (page === 'login') {
    return <Navigate to="/login" replace />;
  }
  if (page === 'signup') {
    return <Navigate to="/signup" replace />;
  }
  if (page === 'admin-login') {
    return <Navigate to="/owner/login" replace />;
  }
  if (page === 'superadmin-login') {
    return <Navigate to="/superadmin/login" replace />;
  }
  if (page === 'dashboard') {
    return <Navigate to="/dashboard" replace />;
  }
  if (page === 'setup-dashboard') {
    return <Navigate to="/setup-dashboard" replace />;
  }

  return children;
}

export default function RootLayout({ userApp = false }) {
  return (
    <LegacyQueryHandler>
      <ScrollRestoration />
      <Outlet />
      {userApp && <Suspense fallback={null}><GlobalWidgets /></Suspense>}
    </LegacyQueryHandler>
  );
}
