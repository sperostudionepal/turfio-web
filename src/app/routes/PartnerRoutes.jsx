import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import RedirectWithSearch from './RedirectWithSearch';
import { portalRedirectRoutes } from './portalRedirectRoutes';
import StaffLoginPage from '../../admin/pages/auth/StaffLoginPage';
import SetupDashboardPage from '../../admin/pages/owner/SetupDashboardPage';
import Dashboard from '../../admin/pages/dashboard/Dashboard';
import { RequireOwner } from '../../shared/components/auth/RouteGuards';
import { useOwnerAuth } from '../../shared/store/useAuthStore';

function PartnerDashboard() {
  const auth = useOwnerAuth();
  return <RequireOwner><Dashboard user={auth.user} onLogout={auth.logout} /></RequireOwner>;
}
const login = (credentials) => useOwnerAuth.getState().loginAdmin({
  ...credentials,
  redirectTo: credentials?.redirectTo || new URLSearchParams(window.location.search).get('redirectTo') || undefined,
});
const router = createBrowserRouter([{ element: <RootLayout />, children: [
  ...portalRedirectRoutes('partner'),
  { path: '/', element: <RedirectWithSearch to="/dashboard" /> },
  { path: '/login', element: <RedirectWithSearch to="/owner/login" /> },
  { path: '/admin/login', element: <RedirectWithSearch to="/owner/login" /> },
  { path: '/owner/login', element: <StaffLoginPage onLogin={login} portalTitle="OWNER PORTAL" targetRole="admin" /> },
  { path: '/setup-dashboard', element: <SetupDashboardPage onSetupSuccess={() => window.location.assign('/dashboard')} /> },
  { path: '/dashboard/*', element: <PartnerDashboard /> },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]}]);
export default function PartnerRoutes() { return <RouterProvider router={router} />; }
