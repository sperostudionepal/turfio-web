import { X, Calendar as CalendarIcon, CircleDot, CheckCircle2, Banknote, XCircle, Phone, Mail, Users } from 'lucide-react';
import { formatNepalDateTime } from '../../utils/dateTime';
import { canConfirm, canMarkPaid, canCancel } from '../../utils/bookingActions';

const money = (value) => `NRs. ${Number(value || 0).toLocaleString('en-NP')}`;

const PAYMENT_STATUS_STYLES = {
  Paid: 'text-emerald-600 bg-emerald-50',
  Failed: 'text-rose-600 bg-rose-50',
};

/**
 * Full view of one booking: who, when, payment summary and history, plus the owner's actions.
 * `booking` is the Bookings page's mapped booking; `statusBadge` is the rendered status pill.
 */
function BookingDetailsModal({ booking, statusBadge, busy = false, error = '', onClose, onConfirm, onMarkPaid, onCancel }) {
  if (!booking) return null;

  const hasPhone = booking.customerPhone && booking.customerPhone !== '—';
  const hasEmail = booking.customerEmail && booking.customerEmail !== '—';
  const cancelledAfterPayment = booking.bookingStatus === 'Cancelled' && booking.paid > 0;
  const showActions = canConfirm(booking) || canMarkPaid(booking) || canCancel(booking);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label={`Booking ${booking.id}`}
        onClick={(event) => event.stopPropagation()}
        className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/80 w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100/80 flex items-center justify-between bg-white/60 sticky top-0 z-10">
          <div className="min-w-0">
            <span className="font-black text-lg text-slate-900 tracking-tight block truncate">Booking {booking.id}</span>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Booked on {booking.bookedOn}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {statusBadge}
            <button
              onClick={onClose}
              aria-label="Close details"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {error && (
            <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{error}</p>
          )}

          {/* Customer */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2.5">
            <div className="flex items-center gap-3">
              <img
                src={booking.avatar || '/logo.png'}
                alt={booking.customerName}
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
              />
              <h4 className="font-extrabold text-sm text-slate-900 leading-tight truncate">{booking.customerName}</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {hasPhone ? (
                <a
                  href={`tel:${booking.customerPhone}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                >
                  <Phone size={12} /> {booking.customerPhone}
                </a>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">No phone on file</span>
              )}
              {hasEmail && (
                <a
                  href={`mailto:${booking.customerEmail}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50 max-w-full truncate"
                >
                  <Mail size={12} /> <span className="truncate">{booking.customerEmail}</span>
                </a>
              )}
            </div>
          </div>

          {/* When and where */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100/60 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                <CalendarIcon size={13} /> Date & Slot
              </div>
              <p className="font-extrabold text-xs text-slate-900">{booking.date}</p>
              <p className="text-[11px] font-semibold text-slate-600">
                {booking.timeSlot} · {booking.duration}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100/60 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                <CircleDot size={13} /> Court Pitch
              </div>
              <p className="font-extrabold text-xs text-slate-900">{booking.courtName}</p>
              <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                <Users size={11} /> {booking.playersCount || '—'} players
              </p>
            </div>
          </div>

          {/* Payment summary */}
          <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2 shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-semibold">Payment Channel</span>
              <span className="font-bold text-slate-900">{booking.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-semibold">Payment Status</span>
              <span className={`font-extrabold px-2 py-0.5 rounded-md ${PAYMENT_STATUS_STYLES[booking.paymentStatus] || 'text-amber-700 bg-amber-50'}`}>
                {booking.paymentStatus}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Total price</span>
                <span className="font-bold text-slate-900">{money(booking.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Received</span>
                <span className="font-bold text-emerald-600">{money(booking.paid)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-extrabold text-slate-900">Still due</span>
                <span className={`font-black text-base ${booking.due > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{money(booking.due)}</span>
              </div>
            </div>
          </div>

          {/* Payment history */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment history</h5>
            {booking.payments.length === 0 ? (
              <p className="text-[11px] text-slate-400 font-medium bg-slate-50 rounded-xl px-3 py-2.5">
                No payments recorded yet.
              </p>
            ) : (
              <div className="rounded-xl border border-slate-100 divide-y divide-slate-50 overflow-hidden">
                {booking.payments.map((payment) => (
                  <div key={payment.key} className="flex items-center justify-between gap-3 px-3 py-2.5 bg-white">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 truncate">
                        {payment.method}
                        {payment.note ? ` · ${payment.note}` : ''}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        {formatNepalDateTime(payment.paidAt)}
                        {payment.reference ? ` · ref ${payment.reference}` : ''}
                        {payment.name && payment.name !== booking.customerName ? ` · ${payment.name}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 shrink-0">{money(payment.amount)}</span>
                  </div>
                ))}
              </div>
            )}
            {cancelledAfterPayment && (
              <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                This booking was cancelled after {money(booking.paid)} was received. A refund may be due to the customer.
              </p>
            )}
          </div>

          {booking.confirmedAt && (
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-emerald-500" /> Confirmed on {formatNepalDateTime(booking.confirmedAt)}
            </p>
          )}

          {/* Actions */}
          <div className="pt-1 space-y-2">
            {showActions && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {canConfirm(booking) && (
                  <button
                    onClick={onConfirm}
                    disabled={busy}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 size={14} /> Confirm
                  </button>
                )}
                {canMarkPaid(booking) && (
                  <button
                    onClick={onMarkPaid}
                    disabled={busy}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Banknote size={14} /> Mark as paid
                  </button>
                )}
                {canCancel(booking) && (
                  <button
                    onClick={onCancel}
                    disabled={busy}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 text-rose-500 hover:bg-rose-600 hover:text-white hover:border-rose-600 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <XCircle size={14} /> Cancel booking
                  </button>
                )}
              </div>
            )}
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailsModal;
