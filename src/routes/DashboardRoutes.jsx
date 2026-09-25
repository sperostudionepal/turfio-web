import Dashboard from '../pages/dashboard/Dashboard';
import SuperadminDashboard from '../pages/superadmin/SuperadminDashboard';
import { RequireOwner, RequireSuperadmin } from '../components/auth/RouteGuards';
import { useOwnerAuth } from '../store/useAuthStore';

export function DashboardWrapper() {
  const ownerAuth = useOwnerAuth();
  return (
    <RequireOwner>
      <Dashboard user={ownerAuth.user} onLogout={ownerAuth.logout} />
    </RequireOwner>
  );
}

export function SuperadminDashboardWrapper() {
  const ownerAuth = useOwnerAuth();
  return (
    <RequireSuperadmin>
      <SuperadminDashboard onLogout={ownerAuth.logout} />
    </RequireSuperadmin>
  );
}
