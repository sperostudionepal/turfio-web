import { createBrowserRouter, Outlet } from 'react-router-dom';
import RedirectWithSearch from './RedirectWithSearch';
import RootLayout from '../layouts/RootLayout';
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';

// Route components are imported directly instead of through runtime dynamic imports.
// This keeps Vite's development module graph deterministic during navigation/HMR and
// avoids intermittent "Failed to fetch dynamically imported module" route failures.
import HomePage from '../../player/pages/HomePage';
import LoginPage from '../../player/pages/auth/LoginPage';
import SignUpPage from '../../player/pages/auth/SignUpPage';
import StaffLoginPage from '../../admin/pages/auth/StaffLoginPage';
import SetupDashboardPage from '../../admin/pages/owner/SetupDashboardPage';
import ApplicationStatusPage from '../../admin/pages/owner/ApplicationStatusPage';
import TurfListingPage from '../../player/pages/turfs/TurfListingPage';
import TurfDetailsPageWrapper from '../../player/pages/turfs/TurfDetailsPageWrapper';
import BookingCheckoutPageWrapper from '../../player/pages/bookings/BookingCheckoutPageWrapper';
import TurfRoutePageWrapper from '../../player/pages/turfs/TurfRoutePageWrapper';
import ListTurfPage from '../../player/pages/listTurf/ListTurfPage';
import ProfilePage from '../../player/pages/profile/ProfilePage';
import BookingConfirmationPageWrapper from '../../player/pages/bookings/BookingConfirmationPageWrapper';
import BookingPassPublicPage from '../../shared/pages/BookingPassPublicPage';
import PaymentSuccess from '../../shared/pages/PaymentSuccess';
import PaymentFailure from '../../shared/pages/PaymentFailure';
import NotFoundPage from '../../shared/pages/NotFoundPage';
import { DashboardWrapper, SuperadminDashboardWrapper } from './DashboardRoutes';

import { RequirePlayer } from '../../shared/components/auth/RouteGuards';
import { usePlayerAuth, useOwnerAuth, useSuperadminAuth } from '../../shared/store/useAuthStore';

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
      { path: '/', element: <HomePage /> },
      { path: '/turfs', element: <TurfListingPage /> },
      { path: '/find-turfs', element: <RedirectWithSearch to="/turfs" /> },
      { path: '/turfs/:slug', element: <TurfDetailsPageWrapper /> },
      { path: '/turfs/:slug/book', element: <BookingCheckoutPageWrapper /> },
      { path: '/route', element: <TurfRoutePageWrapper /> },
      { path: '/directions', element: <RedirectWithSearch to="/route" /> },
      { path: '/list-turf', element: <ListTurfPage /> },
      { path: '/application-status', element: <ApplicationStatusPage /> },
      {
        element: (
          <RequirePlayer>
            <Outlet />
          </RequirePlayer>
        ),
        children: [
          { path: '/profile', element: <ProfilePage /> },
          { path: '/bookings/:bookingId/confirmation', element: <BookingConfirmationPageWrapper /> },
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
  { path: '/booking-pass/:id', element: <BookingPassPublicPage /> },
  { path: '/payment-success', element: <PaymentSuccess /> },
  { path: '/payment-failure', element: <PaymentFailure /> },
  { path: '/admin/login', element: <RedirectWithSearch to="/owner/login" /> },
  { path: '/owner/login', element: <StaffLoginPage onLogin={handleAdminLoginSuccess} portalTitle="OWNER PORTAL" targetRole="admin" /> },
  { path: '/superadmin/login', element: <StaffLoginPage onLogin={handleSuperadminLoginSuccess} portalTitle="SUPERADMIN PORTAL" targetRole="superadmin" /> },
  { path: '/superadmin-login', element: <RedirectWithSearch to="/superadmin/login" /> },
  { path: '/setup-dashboard', element: <SetupDashboardPage onSetupSuccess={() => (window.location.href = '/dashboard')} /> },
  { path: '/dashboard/*', element: <DashboardWrapper /> },
  { path: '/superadmin/dashboard', element: <SuperadminDashboardWrapper /> },
  { path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: routes,
  },
]);
