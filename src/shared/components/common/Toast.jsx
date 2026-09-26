import { useState, useCallback, useEffect } from 'react';
import { ToastContext } from './toastContext';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [toastTop, setToastTop] = useState(96);

  /**
   * Keep the toast positioned directly below the navbar.
   *
   * At the top of the page:
   * Topbar
   * Navbar
   * Toast
   *
   * After scrolling:
   * Navbar (sticky)
   * Toast
   */
  useEffect(() => {
    let frameId = null;
    let resizeObserver = null;

    const updateToastPosition = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        const navbar = document.querySelector('[data-app-navbar]');

        if (!navbar) {
          setToastTop(16);
          return;
        }

        const rect = navbar.getBoundingClientRect();

        // Keep a 16px gap below the navbar.
        setToastTop(Math.max(rect.bottom + 16, 16));
      });
    };

    // Calculate initial position after the browser has laid out the page.
    updateToastPosition();

    window.addEventListener('scroll', updateToastPosition, {
      passive: true,
    });

    window.addEventListener('resize', updateToastPosition);

    const navbar = document.querySelector('[data-app-navbar]');

    if (navbar) {
      resizeObserver = new ResizeObserver(updateToastPosition);
      resizeObserver.observe(navbar);
    }

    return () => {
      window.removeEventListener('scroll', updateToastPosition);
      window.removeEventListener('resize', updateToastPosition);

      resizeObserver?.disconnect();

      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const showToast = useCallback(
    (
      message,
      type = 'success',
      duration = 4000,
      subtitle = ''
    ) => {
      setToasts((prev) => {
        if (prev.some((t) => t.message === message)) {
          return prev;
        }

        const id = Math.random()
          .toString(36)
          .substring(2, 9);

        setTimeout(() => {
          setToasts((active) =>
            active.filter((toast) => toast.id !== id)
          );
        }, duration);

        return [
          ...prev,
          {
            id,
            message,
            type,
            subtitle,
          },
        ];
      });
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.filter((toast) => toast.id !== id)
    );
  }, []);

  const getToastIcon = (type) => {
    switch (type) {
      case 'error':
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
            <AlertCircle
              className="h-5 w-5 text-red-500"
              strokeWidth={2.2}
            />
          </div>
        );

      case 'info':
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <Info
              className="h-5 w-5 text-slate-700"
              strokeWidth={2.2}
            />
          </div>
        );

      case 'success':
      default:
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-100">
            <CheckCircle2
              className="h-5 w-5 text-lime-600"
              strokeWidth={2.3}
            />
          </div>
        );
    }
  };

  const getDefaultSubtitle = (type) => {
    switch (type) {
      case 'error':
        return 'Please try again';

      case 'info':
        return 'Here’s something you should know';

      case 'success':
      default:
        return 'Action completed successfully';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="
          pointer-events-none
          fixed
          left-1/2
          z-[99999]
          flex
          w-auto
          max-w-[calc(100vw-2rem)]
          -translate-x-1/2
          flex-col
          items-center
          gap-2.5

          md:left-auto
          md:right-6
          md:translate-x-0
          md:items-end
        "
        style={{
          top: `${toastTop}px`,
        }}
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{
                opacity: 0,
                y: -16,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.97,
              }}
              transition={{
                duration: 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                pointer-events-auto
                flex
                min-w-[min(360px,calc(100vw-2rem))]
                max-w-[440px]
                items-center
                gap-3
                rounded-2xl
                bg-white
                px-4
                py-3.5
                shadow-[0_10px_35px_rgba(15,23,42,0.12)]
              "
            >
              {/* Status Icon */}
              {getToastIcon(toast.type)}

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="break-words text-sm font-bold leading-5 text-slate-900">
                  {toast.message}
                </p>

                <p className="mt-0.5 break-words text-xs font-medium leading-4 text-slate-400">
                  {toast.subtitle ||
                    getDefaultSubtitle(toast.type)}
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition-colors
                  hover:bg-slate-100
                  hover:text-slate-700
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-lime-400/40
                "
              >
                <X
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}