import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { appUrl } from '../../shared/config/appContext';

export function PortalRedirect({ app, path }) {
  const location = useLocation();
  const target = appUrl(app, (path || location.pathname) + location.search + location.hash);
  useEffect(() => { window.location.replace(target); }, [target]);
  return <p className="p-8">Opening the Turfio portal… <a href={target}>Continue</a></p>;
}

export function portalRedirectRoutes(context) {
  const routes = [];
  if (context !== 'partner') routes.push(
    { path: '/owner/login', element: <PortalRedirect app="partner" /> },
    { path: '/admin/login', element: <PortalRedirect app="partner" path="/owner/login" /> },
    { path: '/setup-dashboard', element: <PortalRedirect app="partner" /> },
    { path: '/dashboard/*', element: <PortalRedirect app="partner" /> },
  );
  if (context !== 'superadmin') routes.push(
    { path: '/superadmin/login', element: <PortalRedirect app="superadmin" /> },
    { path: '/superadmin-login', element: <PortalRedirect app="superadmin" path="/superadmin/login" /> },
    { path: '/superadmin/dashboard', element: <PortalRedirect app="superadmin" /> },
  );
  if (context !== 'user') {
    for (const path of ['/turfs', '/turfs/:slug', '/turfs/:slug/book', '/profile', '/list-turf', '/application-status', '/booking-pass/:id', '/bookings/:bookingId/confirmation', '/payment-success', '/payment-failure', '/signup', '/route']) {
      routes.push({ path, element: <PortalRedirect app="user" /> });
    }
  }
  return routes;
}
