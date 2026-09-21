import { useState, useCallback } from 'react';
import { ToastContext } from './toastContext';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

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
              style={{ backgroundColor: '#fffaf0', borderColor: '#f59e0b', color: '#8a3f05' }}
              className="pointer-events-auto flex items-center gap-3 rounded-2xl border-2 p-3.5 sm:p-4 shadow-[0_8px_24px_rgba(245,158,11,0.14)] min-w-[min(320px,calc(100vw-2rem))] max-w-xl"
            >
              {/* Icon */}
              {toast.type === 'success' && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950/10 text-slate-950 border border-slate-950/15">
                  <CheckCircle2 className="h-[18px] w-[18px]" />
                </span>
              )}
              {toast.type === 'error' && (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <AlertTriangle className="h-6 w-6 fill-amber-400 stroke-amber-900" />
                </span>
              )}
              {toast.type === 'info' && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950/10 text-slate-950 border border-slate-950/15">
                  <Info className="h-[18px] w-[18px]" />
                </span>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-amber-900 leading-tight">
                  {toast.message}
                </p>
                {toast.subtitle ? (
                  <p className="mt-0.5 text-xs font-semibold text-amber-800 leading-snug break-words">
                    {toast.subtitle}
                  </p>
                ) : (
                  <p className="mt-0.5 text-xs font-semibold text-amber-800 leading-tight">
                    {toast.type === 'success' ? 'Action completed successfully' : toast.type === 'error' ? 'Something went wrong' : 'Information update'}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-lg p-1 text-slate-500 hover:bg-amber-100 hover:text-slate-700 transition-colors shrink-0 cursor-pointer"
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
