import { useEffect } from 'react';
import AppRoutes from './app/routes/router';
import { getAppContext } from './shared/config/appContext';
import useAccessibilityStore from './shared/store/useAccessibilityStore';
import { usePlayerAuth, useOwnerAuth, useSuperadminAuth } from './shared/store/useAuthStore';

export default function App() {
  const initializeAccessibility = useAccessibilityStore((s) => s.initialize);

  useEffect(() => {
    initializeAccessibility();
    const store = { user: usePlayerAuth, partner: useOwnerAuth, superadmin: useSuperadminAuth }[getAppContext()];
    store?.getState().initialize();
  }, [initializeAccessibility]);

  return <AppRoutes />;
}