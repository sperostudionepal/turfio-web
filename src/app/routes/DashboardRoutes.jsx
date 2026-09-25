import Dashboard from '../../admin/pages/dashboard/Dashboard';
import SuperadminDashboard from '../../superadmin/pages/SuperadminDashboard';
import { RequireOwner, RequireSuperadmin } from '../../shared/components/auth/RouteGuards';
import { useOwnerAuth } from '../../shared/store/useAuthStore';

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
