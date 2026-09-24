import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';

import HomePage from '../pages/HomePage';
import TurfListingPage from '../pages/turfs/TurfListingPage';
import TurfDetailsPageWrapper from '../pages/turfs/TurfDetailsPageWrapper';
import BookingCheckoutPageWrapper from '../pages/bookings/BookingCheckoutPageWrapper';
import BookingConfirmationPageWrapper from '../pages/bookings/BookingConfirmationPageWrapper';
import TurfRoutePageWrapper from '../pages/turfs/TurfRoutePageWrapper';
import ListTurfPage from '../pages/listTurf/ListTurfPage';
import ApplicationStatusPage from '../pages/owner/ApplicationStatusPage';
import ProfilePage from '../pages/profile/ProfilePage';
import BookingPassPublicPage from '../pages/BookingPassPublicPage';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentFailure from '../pages/PaymentFailure';
import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';
import StaffLoginPage from '../pages/auth/StaffLoginPage';
import SetupDashboardPage from '../pages/owner/SetupDashboardPage';
import Dashboard from '../pages/dashboard/Dashboard';
import SuperadminDashboard from '../pages/superadmin/SuperadminDashboard';
import NotFoundPage from '../pages/NotFoundPage';

import { RequirePlayer, RequireOwner, RequireSuperadmin } from '../components/auth/RouteGuards';
import { usePlayerAuth, useOwnerAuth } from '../store/useAuthStore';

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

function DashboardWrapper() {
  const ownerAuth = useOwnerAuth();
  return (
    <RequireOwner>
      <Dashboard user={ownerAuth.user} onLogout={ownerAuth.logout} />
    </RequireOwner>
  );
}

function SuperadminDashboardWrapper() {
  const ownerAuth = useOwnerAuth();
  return (
    <RequireSuperadmin>
      <SuperadminDashboard onLogout={ownerAuth.logout} />
    </RequireSuperadmin>
  );
}

const routes = [
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/turfs', element: <TurfListingPage /> },
      { path: '/find-turfs', element: <Navigate to="/turfs" replace /> },
      { path: '/turfs/:slug', element: <TurfDetailsPageWrapper /> },
      { path: '/turfs/:slug/book', element: <BookingCheckoutPageWrapper /> },
      { path: '/route', element: <TurfRoutePageWrapper /> },
      { path: '/directions', element: <Navigate to="/route" replace /> },
      { path: '/list-turf', element: <ListTurfPage /> },
      { path: '/application-status', element: <ApplicationStatusPage /> },
      {
        path: '/profile',
        element: (
          <RequirePlayer>
            <ProfilePage />
          </RequirePlayer>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage onLogin={handleLoginSuccess} /> },
      { path: '/register', element: <Navigate to="/signup" replace /> },
      { path: '/signup', element: <SignUpPage onSignUp={handleSignUpSuccess} /> },
    ],
  },
  { path: '/booking-pass/:id', element: <BookingPassPublicPage /> },
  { path: '/bookings/:bookingId/confirmation', element: <RequirePlayer><BookingConfirmationPageWrapper /></RequirePlayer> },
  { path: '/payment-success', element: <PaymentSuccess /> },
  { path: '/payment-failure', element: <PaymentFailure /> },
  { path: '/admin/login', element: <Navigate to="/owner/login" replace /> },
  { path: '/owner/login', element: <StaffLoginPage onLogin={handleAdminLoginSuccess} portalTitle="OWNER PORTAL" targetRole="admin" /> },
  { path: '/superadmin/login', element: <StaffLoginPage onLogin={handleSuperadminLoginSuccess} portalTitle="SUPERADMIN PORTAL" targetRole="superadmin" /> },
  { path: '/superadmin-login', element: <Navigate to="/superadmin/login" replace /> },
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
