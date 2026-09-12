import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4000, subtitle = '') => {
    setToasts((prev) => {
      if (prev.some((t) => t.message === message)) {
        return prev;
      }
      const id = Math.random().toString(36).substring(2, 9);
      setTimeout(() => {
        setToasts((active) => active.filter((toast) => toast.id !== id));
      }, duration);
      return [...prev, { id, message, type, subtitle }];
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-2.5 w-auto max-w-[90vw] px-4 pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex items-center gap-3.5 rounded-xl bg-slate-950/95 backdrop-blur-md p-4 shadow-2xl border border-slate-800 text-white min-w-[360px] max-w-lg"
            >
              {/* Icon */}
              {toast.type === 'success' && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime-400/15 text-lime-400 border border-lime-400/20">
                  <CheckCircle2 className="h-[18px] w-[18px]" />
                </span>
              )}
              {toast.type === 'error' && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/20">
                  <XCircle className="h-[18px] w-[18px]" />
                </span>
              )}
              {toast.type === 'info' && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/20">
                  <Info className="h-[18px] w-[18px]" />
                </span>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white leading-tight truncate">
                  {toast.message}
                </p>
                {toast.subtitle ? (
                  <p className="mt-0.5 text-[11px] font-medium text-slate-400 leading-tight truncate">
                    {toast.subtitle}
                  </p>
                ) : (
                  <p className="mt-0.5 text-[11px] font-medium text-slate-400 leading-tight">
                    {toast.type === 'success' ? 'Action completed successfully' : toast.type === 'error' ? 'Something went wrong' : 'Information update'}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors shrink-0 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
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
