import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import RedirectWithSearch from './RedirectWithSearch';
import { portalRedirectRoutes } from './PortalRedirects';
import StaffLoginPage from '../../admin/pages/auth/StaffLoginPage';
import SuperadminDashboard from '../../superadmin/pages/SuperadminDashboard';
import { RequireSuperadmin } from '../../shared/components/auth/RouteGuards';
import { useSuperadminAuth } from '../../shared/store/useAuthStore';

function OperatorDashboard() {
  const auth = useSuperadminAuth();
  return <RequireSuperadmin><SuperadminDashboard onLogout={auth.logout} /></RequireSuperadmin>;
}
const router = createBrowserRouter([{ element: <RootLayout />, children: [
  ...portalRedirectRoutes('superadmin'),
  { path: '/', element: <RedirectWithSearch to="/superadmin/dashboard" /> },
  { path: '/login', element: <RedirectWithSearch to="/superadmin/login" /> },
  { path: '/superadmin-login', element: <RedirectWithSearch to="/superadmin/login" /> },
  { path: '/superadmin/login', element: <StaffLoginPage onLogin={(data) => useSuperadminAuth.getState().loginSuperadmin(data)} portalTitle="SUPERADMIN PORTAL" targetRole="superadmin" /> },
  { path: '/superadmin/dashboard', element: <OperatorDashboard /> },
  { path: '*', element: <Navigate to="/superadmin/dashboard" replace /> },
]}]);
export default function SuperadminRoutes() { return <RouterProvider router={router} />; }
