import { useState } from 'react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import turfService from '../../../shared/services/turfService';
import CancelBookingDialog from '../bookings/CancelBookingDialog';
import { deriveBookingStatus, getBookingDateStr, isActiveBooking } from '../../../shared/utils/bookingStatus';
import { getNepalCurrentDateTime, parseSlotInterval } from '../../../shared/utils/dateTime';

const MAX_ROWS = 5;

/**
 * Bookings waiting on the owner (e.g. Pay at Venue bookings nobody has confirmed yet),
 * with Confirm / Cancel right on the dashboard. Renders nothing when everything is handled.
 * `onChanged` should reload the owner's bookings after an action succeeds.
 */
function NeedsActionCard({ bookings = [], onChanged, onViewAll }) {
  const [cancelTarget, setCancelTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const nowNpt = getNepalCurrentDateTime();
  const pending = bookings
    .filter((b) => isActiveBooking(b) && deriveBookingStatus(b) === 'Pending')
    .map((b) => {
      const date = getBookingDateStr(b);
      const { startMinutes, endMinutes } = parseSlotInterval(b.timeSlot);
      const end = b.endMinutes ?? endMinutes;
      return {
        booking: b,
        date,
        start: b.startMinutes ?? startMinutes,
        // The match is already over and nobody confirmed or cancelled it
        overdue: date < nowNpt.date || (date === nowNpt.date && end <= nowNpt.minutes),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.start - b.start);

  if (pending.length === 0) return null;

  const customerName = (b) => [b.user?.firstName, b.user?.lastName].filter(Boolean).join(' ') || 'Customer';

  const run = async (booking, action, fallbackMessage) => {
    setBusyId(booking._id);
    setError('');
    try {
      await action(booking._id);
      if (onChanged) await onChanged();
      return true;
    } catch (err) {
      setError(err.message || fallbackMessage);
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirm = (booking) => run(booking, turfService.confirmBooking, 'Could not confirm booking.');

  const handleCancelConfirmed = async () => {
    const booking = cancelTarget.booking;
    await run(booking, turfService.cancelBooking, 'Could not cancel booking.');
    setCancelTarget(null);
  };

  const visible = pending.slice(0, MAX_ROWS);

  return (
    <div className="bg-white rounded-xl overflow-hidden p-5 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-amber-200/70">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
            <AlertCircle size={16} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight leading-tight">Needs your action</h3>
            <span className="text-[11px] font-medium text-slate-400">
              {pending.length} {pending.length === 1 ? 'booking is' : 'bookings are'} waiting for confirmation
            </span>
          </div>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-lime-600 hover:text-lime-700 transition-colors cursor-pointer"
          >
            {pending.length > MAX_ROWS ? `View all ${pending.length}` : 'View in Bookings'}
          </button>
        )}
      </div>

      {error && (
        <p className="mb-3 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{error}</p>
      )}

      <div className="divide-y divide-slate-50">
        {visible.map(({ booking, date, overdue }) => {
          const busy = busyId === booking._id;
          return (
            <div key={booking._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-900 truncate">{customerName(booking)}</p>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 rounded border border-slate-200/60 shrink-0">
                    {booking.court?.name || 'Court 1'}
                  </span>
                  {overdue && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 rounded shrink-0">Match passed</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {date} · {booking.timeSlot || '—'} · NRs. {Number(booking.totalAmount || 0).toLocaleString('en-NP')} ·{' '}
                  {booking.paymentMethod || 'Pay at Venue'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  disabled={busy}
                  onClick={() => handleConfirm(booking)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>{busy ? 'Working...' : 'Confirm'}</span>
                </button>
                <button
                  disabled={busy}
                  onClick={() =>
                    setCancelTarget({
                      booking,
                      id: booking.shortCode || booking.bookingId || booking._id,
                      customerName: customerName(booking),
                      date,
                      timeSlot: booking.timeSlot || '—',
                    })
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-rose-500 hover:bg-rose-600 hover:text-white hover:border-rose-600 text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <XCircle size={14} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <CancelBookingDialog
        booking={cancelTarget}
        busy={Boolean(cancelTarget) && busyId === cancelTarget.booking._id}
        onKeep={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirmed}
      />
    </div>
  );
}

export default NeedsActionCard;
