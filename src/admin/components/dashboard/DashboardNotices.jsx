import { AlertTriangle, CalendarPlus, Building2, RefreshCw } from 'lucide-react';

const CARD = 'bg-white rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100';

/** Pulsing placeholder that stands in for a widget while its data loads. */
export function WidgetSkeleton({ className = 'h-64' }) {
  return (
    <div className={`${CARD} p-5 ${className}`} aria-hidden="true">
      <div className="animate-pulse space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-100" />
          <div className="h-3 w-32 rounded-full bg-slate-100" />
        </div>
        <div className="h-3 w-full rounded-full bg-slate-100" />
        <div className="h-3 w-5/6 rounded-full bg-slate-100" />
        <div className="h-3 w-2/3 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

/** Whole dashboard body in skeleton form (first load only). */
export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading your dashboard" className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {[0, 1, 2, 3].map((n) => (
          <WidgetSkeleton key={n} className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[0, 1, 2].map((n) => (
          <WidgetSkeleton key={n} className="h-72" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[0, 1].map((n) => (
          <WidgetSkeleton key={n} className="h-64" />
        ))}
      </div>
    </div>
  );
}

/** Something failed to load; offer a retry. */
export function ErrorNotice({ message, onRetry, busy = false }) {
  return (
    <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <AlertTriangle size={18} className="text-rose-600 shrink-0" />
        <p className="text-xs sm:text-sm font-semibold text-rose-700">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={busy}
          className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={13} className={busy ? 'animate-spin' : ''} />
          <span>{busy ? 'Retrying...' : 'Retry'}</span>
        </button>
      )}
    </div>
  );
}

/** Shown when the account has no venue at all, so numbers would be meaningless. */
export function NoVenueNotice({ onListTurf }) {
  return (
    <div className={`${CARD} p-6 text-center`}>
      <div className="mx-auto w-11 h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
        <Building2 size={22} />
      </div>
      <h3 className="font-extrabold text-base text-slate-900">No venue linked to this account yet</h3>
      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-md mx-auto">
        Once your venue is set up and approved, its bookings, revenue and schedule will show up here.
      </p>
      {onListTurf && (
        <button
          onClick={onListTurf}
          className="mt-4 px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-900 text-xs font-bold transition-colors cursor-pointer"
        >
          List your turf
        </button>
      )}
    </div>
  );
}

/** First-run state: the venue exists but nobody has booked yet. */
export function EmptyBookingsNotice({ onAddBooking, onSetup }) {
  return (
    <div className={`${CARD} p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-600 flex items-center justify-center shrink-0">
          <CalendarPlus size={20} />
        </div>
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900">No bookings yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Your numbers below will fill in as players book. You can also add a walk-in or phone booking yourself,
            and make sure your courts and photos are set up so players can find you.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onSetup && (
          <button
            onClick={onSetup}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Finish venue setup
          </button>
        )}
        {onAddBooking && (
          <button
            onClick={onAddBooking}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Add a booking
          </button>
        )}
      </div>
    </div>
  );
}
