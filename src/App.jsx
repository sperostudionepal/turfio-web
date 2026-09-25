import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes/router';
import { prefetchLikelyPages } from './app/routes/pageLoaders';
import useAccessibilityStore from './shared/store/useAccessibilityStore';
import { usePlayerAuth, useOwnerAuth } from './shared/store/useAuthStore';

export default function App() {
  const initializeAccessibility = useAccessibilityStore((s) => s.initialize);

  useEffect(() => {
    initializeAccessibility();
    usePlayerAuth.getState().initialize();
    useOwnerAuth.getState().initialize();
    prefetchLikelyPages();
  }, [initializeAccessibility]);

  return <RouterProvider router={router} />;
}