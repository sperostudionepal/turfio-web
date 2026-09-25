import { createBrowserRouter, Outlet } from 'react-router-dom';
import RedirectWithSearch from './RedirectWithSearch';
import RootLayout from '../layouts/RootLayout';
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import RouteErrorPage from '../layouts/RouteErrorPage';

// Landing and auth pages stay in the main bundle (first paint / tiny); everything else is a lazy chunk.
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';
import StaffLoginPage from '../pages/auth/StaffLoginPage';
import SetupDashboardPage from '../pages/owner/SetupDashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

import { RequirePlayer } from '../components/auth/RouteGuards';
import { usePlayerAuth, useOwnerAuth } from '../store/useAuthStore';

const lazyPage = (load, exportName = 'default') => async () => ({ Component: (await load())[exportName] });

const handleLoginSuccess = async (credentials) => {
  const searchParams = new URLSearchParams(window.location.search);
  const redirectToParam = searchParams.get('redirectTo');
  return usePlayerAuth.getState().login({
    ...credentials,
    redirectTo: credentials?.redirectTo || redirectToParam || undefined,
  });
};

const handleSignUpSuccess = async (credentials) => {
  return usePlayerAuth.getState().signup(credentials);
};

const handleAdminLoginSuccess = async (credentials) => {
  const searchParams = new URLSearchParams(window.location.search);
  const redirectToParam = searchParams.get('redirectTo');
  return useOwnerAuth.getState().loginAdmin({
    ...credentials,
    redirectTo: credentials?.redirectTo || redirectToParam || undefined,
  });
};

const handleSuperadminLoginSuccess = async (credentials) => {
  return useOwnerAuth.getState().loginSuperadmin(credentials);
};

const routes = [
  {
    element: <PublicLayout />,
    children: [
      {
        // Keeps the navbar/footer on screen when a page inside the layout throws.
        errorElement: <RouteErrorPage />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/turfs', lazy: lazyPage(() => import('../pages/turfs/TurfListingPage')) },
          { path: '/find-turfs', element: <RedirectWithSearch to="/turfs" /> },
          { path: '/turfs/:slug', lazy: lazyPage(() => import('../pages/turfs/TurfDetailsPageWrapper')) },
          { path: '/turfs/:slug/book', lazy: lazyPage(() => import('../pages/bookings/BookingCheckoutPageWrapper')) },
          { path: '/route', lazy: lazyPage(() => import('../pages/turfs/TurfRoutePageWrapper')) },
          { path: '/directions', element: <RedirectWithSearch to="/route" /> },
          { path: '/list-turf', lazy: lazyPage(() => import('../pages/listTurf/ListTurfPage')) },
          { path: '/application-status', lazy: lazyPage(() => import('../pages/owner/ApplicationStatusPage')) },
          {
            element: (
              <RequirePlayer>
                <Outlet />
              </RequirePlayer>
            ),
            children: [{ path: '/profile', lazy: lazyPage(() => import('../pages/profile/ProfilePage')) }],
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage onLogin={handleLoginSuccess} /> },
      { path: '/register', element: <RedirectWithSearch to="/signup" /> },
      { path: '/signup', element: <SignUpPage onSignUp={handleSignUpSuccess} /> },
    ],
  },
  { path: '/booking-pass/:id', lazy: lazyPage(() => import('../pages/BookingPassPublicPage')) },
  {
    element: (
      <RequirePlayer>
        <Outlet />
      </RequirePlayer>
    ),
    children: [
      {
        path: '/bookings/:bookingId/confirmation',
        lazy: lazyPage(() => import('../pages/bookings/BookingConfirmationPageWrapper')),
      },
    ],
  },
  { path: '/payment-success', lazy: lazyPage(() => import('../pages/PaymentSuccess')) },
  { path: '/payment-failure', lazy: lazyPage(() => import('../pages/PaymentFailure')) },
  { path: '/admin/login', element: <RedirectWithSearch to="/owner/login" /> },
  { path: '/owner/login', element: <StaffLoginPage onLogin={handleAdminLoginSuccess} portalTitle="OWNER PORTAL" targetRole="admin" /> },
  { path: '/superadmin/login', element: <StaffLoginPage onLogin={handleSuperadminLoginSuccess} portalTitle="SUPERADMIN PORTAL" targetRole="superadmin" /> },
  { path: '/superadmin-login', element: <RedirectWithSearch to="/superadmin/login" /> },
  { path: '/setup-dashboard', element: <SetupDashboardPage onSetupSuccess={() => (window.location.href = '/dashboard')} /> },
  { path: '/dashboard/*', lazy: lazyPage(() => import('./DashboardRoutes'), 'DashboardWrapper') },
  { path: '/superadmin/dashboard', lazy: lazyPage(() => import('./DashboardRoutes'), 'SuperadminDashboardWrapper') },
  { path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    hydrateFallbackElement: (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
    children: routes,
  },
]);
