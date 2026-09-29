import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes/router';
import useAccessibilityStore from './shared/store/useAccessibilityStore';
import { usePlayerAuth, useOwnerAuth, useSuperadminAuth } from './shared/store/useAuthStore';

export default function App() {
  const initializeAccessibility = useAccessibilityStore((s) => s.initialize);

  useEffect(() => {
    initializeAccessibility();
    usePlayerAuth.getState().initialize();
    useOwnerAuth.getState().initialize();
    useSuperadminAuth.getState().initialize();
  }, [initializeAccessibility]);

  return <RouterProvider router={router} />;
}