import { Banknote } from 'lucide-react';

/**
 * Confirmation before recording a payment that was collected in person.
 * `booking` needs { id, customerName, due, date, timeSlot }.
 */
function MarkPaidDialog({ booking, busy = false, onKeep, onConfirm }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 space-y-2 text-center">
          <div className="mx-auto w-11 h-11 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center">
            <Banknote size={22} />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Record payment received?</h3>
          <p className="text-xs text-slate-500 font-medium">
            Mark <strong className="text-slate-800">NRs. {Number(booking.due || 0).toLocaleString('en-NP')}</strong> from{' '}
            <strong className="text-slate-800">{booking.customerName}</strong> as paid at the venue for booking{' '}
            <strong className="text-slate-800">{booking.id}</strong> ({booking.date}, {booking.timeSlot}).
            It will count towards your revenue, and this can't be undone from here.
          </p>
        </div>
        <div className="px-5 pb-5 flex items-center gap-2">
          <button
            onClick={onKeep}
            disabled={busy}
            className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            Not yet
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 py-2 rounded-xl bg-lime-400 hover:bg-lime-500 text-white text-xs font-bold transition-colors disabled:opacity-40"
          >
            {busy ? 'Saving...' : 'Yes, mark as paid'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarkPaidDialog;
