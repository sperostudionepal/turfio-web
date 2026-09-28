import { createBrowserRouter, Outlet } from 'react-router-dom';
import RedirectWithSearch from './RedirectWithSearch';
import RootLayout from '../layouts/RootLayout';
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import RouteErrorPage from '../layouts/RouteErrorPage';
import { pageLoaders } from './pageLoaders';

// Landing and auth pages stay in the main bundle (first paint / tiny); everything else is a lazy chunk.
import HomePage from '../../player/pages/HomePage';
import LoginPage from '../../player/pages/auth/LoginPage';
import SignUpPage from '../../player/pages/auth/SignUpPage';
import StaffLoginPage from '../../admin/pages/auth/StaffLoginPage';
import SetupDashboardPage from '../../admin/pages/owner/SetupDashboardPage';
import NotFoundPage from '../../shared/pages/NotFoundPage';

import { RequirePlayer } from '../../shared/components/auth/RouteGuards';
import { usePlayerAuth, useOwnerAuth, useSuperadminAuth } from '../../shared/store/useAuthStore';

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
  return useSuperadminAuth.getState().loginSuperadmin(credentials);
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
          { path: '/turfs', lazy: lazyPage(pageLoaders.turfListing) },
          { path: '/find-turfs', element: <RedirectWithSearch to="/turfs" /> },
          { path: '/turfs/:slug', lazy: lazyPage(pageLoaders.turfDetails) },
          { path: '/turfs/:slug/book', lazy: lazyPage(pageLoaders.checkout) },
          { path: '/route', lazy: lazyPage(pageLoaders.turfRoute) },
          { path: '/directions', element: <RedirectWithSearch to="/route" /> },
          { path: '/list-turf', lazy: lazyPage(pageLoaders.listTurf) },
          { path: '/application-status', lazy: lazyPage(pageLoaders.applicationStatus) },
          {
            element: (
              <RequirePlayer>
                <Outlet />
              </RequirePlayer>
            ),
            children: [
              { path: '/profile', lazy: lazyPage(pageLoaders.profile) },
              { path: '/bookings/:bookingId/confirmation', lazy: lazyPage(pageLoaders.confirmation) },
            ],
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
  { path: '/booking-pass/:id', lazy: lazyPage(pageLoaders.bookingPass) },
  { path: '/payment-success', lazy: lazyPage(pageLoaders.paymentSuccess) },
  { path: '/payment-failure', lazy: lazyPage(pageLoaders.paymentFailure) },
  { path: '/admin/login', element: <RedirectWithSearch to="/owner/login" /> },
  { path: '/owner/login', element: <StaffLoginPage onLogin={handleAdminLoginSuccess} portalTitle="OWNER PORTAL" targetRole="admin" /> },
  { path: '/superadmin/login', element: <StaffLoginPage onLogin={handleSuperadminLoginSuccess} portalTitle="SUPERADMIN PORTAL" targetRole="superadmin" /> },
  { path: '/superadmin-login', element: <RedirectWithSearch to="/superadmin/login" /> },
  { path: '/setup-dashboard', element: <SetupDashboardPage onSetupSuccess={() => (window.location.href = '/dashboard')} /> },
  { path: '/dashboard/*', lazy: lazyPage(pageLoaders.dashboards, 'DashboardWrapper') },
  { path: '/superadmin/dashboard', lazy: lazyPage(pageLoaders.dashboards, 'SuperadminDashboardWrapper') },
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
