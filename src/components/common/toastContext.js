import { createContext, useContext } from 'react';

// Kept apart from Toast.jsx so that file only exports components, which React Fast Refresh needs.
export const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
