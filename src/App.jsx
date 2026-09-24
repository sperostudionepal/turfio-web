import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import useAccessibilityStore from './store/useAccessibilityStore';
import { usePlayerAuth, useOwnerAuth } from './store/useAuthStore';

export default function App() {
  const initializeAccessibility = useAccessibilityStore((s) => s.initialize);

  useEffect(() => {
    initializeAccessibility();
    usePlayerAuth.getState().initialize();
    useOwnerAuth.getState().initialize();
  }, [initializeAccessibility]);

  return <RouterProvider router={router} />;
}