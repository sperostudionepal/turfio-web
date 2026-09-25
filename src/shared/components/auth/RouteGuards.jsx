import { Navigate, useLocation } from 'react-router-dom';
import { usePlayerAuth, useOwnerAuth } from '../../store/useAuthStore';

export function RequirePlayer({ children }) {
  const { user, isInitializing } = usePlayerAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  return children;
}

export function RequireOwner({ children }) {
  const { user, isInitializing } = useOwnerAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isOwner = user?.role === 'admin';

  if (!isOwner) {
    return <Navigate to={`/owner/login?redirectTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}

export function RequireSuperadmin({ children }) {
  const { user, isInitializing } = useOwnerAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isSuperadmin = user && user.role === 'superadmin';

  if (!isSuperadmin) {
    return <Navigate to={`/superadmin/login?redirectTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}
