import { XCircle } from 'lucide-react';

/**
 * "Are you sure?" popup shown before a booking is cancelled.
 * `booking` needs { id, customerName, date, timeSlot }.
 */
function CancelBookingDialog({ booking, busy = false, onKeep, onConfirm }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 space-y-2 text-center">
          <div className="mx-auto w-11 h-11 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle size={22} />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Cancel this booking?</h3>
          <p className="text-xs text-slate-500 font-medium">
            Are you sure you want to cancel booking <strong className="text-slate-800">{booking.id}</strong> for{' '}
            <strong className="text-slate-800">{booking.customerName}</strong> ({booking.date}, {booking.timeSlot})?
            The customer will be notified and the slot will be released.
          </p>
        </div>
        <div className="px-5 pb-5 flex items-center gap-2">
          <button
            onClick={onKeep}
            disabled={busy}
            className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            No, keep it
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-40"
          >
            {busy ? 'Cancelling...' : 'Yes, cancel booking'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelBookingDialog;
