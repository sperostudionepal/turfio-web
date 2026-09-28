import Dashboard from '../../admin/pages/dashboard/Dashboard';
import SuperadminDashboard from '../../superadmin/pages/SuperadminDashboard';
import { RequireOwner, RequireSuperadmin } from '../../shared/components/auth/RouteGuards';
import { useOwnerAuth, useSuperadminAuth } from '../../shared/store/useAuthStore';

export function DashboardWrapper() {
  const ownerAuth = useOwnerAuth();
  return (
    <RequireOwner>
      <Dashboard user={ownerAuth.user} onLogout={ownerAuth.logout} />
    </RequireOwner>
  );
}

export function SuperadminDashboardWrapper() {
  const superadminAuth = useSuperadminAuth();
  return (
    <RequireSuperadmin>
      <SuperadminDashboard onLogout={superadminAuth.logout} />
    </RequireSuperadmin>
  );
}
