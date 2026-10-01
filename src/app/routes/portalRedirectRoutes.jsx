import { PortalRedirect } from './PortalRedirects';

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
