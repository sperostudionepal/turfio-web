import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.08)] border border-slate-100/90 transition-all duration-300 animate-slide-in"
          >
            {/* Icon */}
            {toast.type === 'success' && (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-600">
                <CheckCircle2 className="h-[18px] w-[18px]" />
              </span>
            )}
            {toast.type === 'error' && (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <XCircle className="h-[18px] w-[18px]" />
              </span>
            )}
            {toast.type === 'info' && (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Info className="h-[18px] w-[18px]" />
              </span>
            )}

            {/* Content */}
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 leading-tight">
                {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Notification'}
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500 leading-snug">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
