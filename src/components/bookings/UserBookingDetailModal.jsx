import { X, Calendar as CalendarIcon, CircleDot, CheckCircle2, AlertCircle, Ban, Phone, Mail, Users, Banknote } from 'lucide-react';
import { useState } from 'react';
import { formatNepalDateTime } from '../../utils/dateTime';

const money = (value) => `NRs. ${Number(value || 0).toLocaleString('en-NP')}`;

const PAYMENT_STATUS_STYLES = {
  Paid: 'text-emerald-600 bg-emerald-50',
  Partial: 'text-amber-700 bg-amber-50',
  Failed: 'text-rose-600 bg-rose-50',
};

function UserBookingDetailModal({ booking, onClose, onRequestCancellation }) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!booking) return null;

  const totalAmount = Number(booking.totalAmount || 0);
  const paidAmount = Number(booking.totalPaidAmount || 0);
  const dueAmount = Math.max(0, totalAmount - paidAmount);

  // Check if cancellation is allowed (6 hours before match)
  const matchDateTime = new Date(`${booking.dateStr}T00:00:00.000Z`);
  const matchTimeMinutes = booking.startMinutes || 0;
  matchDateTime.setMinutes(matchDateTime.getMinutes() + matchTimeMinutes - 345); // Nepal timezone
  const hoursUntilMatch = (matchDateTime - new Date()) / (1000 * 60 * 60);
  const canRequestCancellation = hoursUntilMatch >= 6 && booking.status === 'Confirmed' && !booking.cancellationRequest;
  
  // Determine status display
  const displayStatus = booking.status === 'Cancelled' && booking.refund && booking.refund.status === 'Processed' ? 'Refunded' : booking.status;

  const handleCancellationRequest = async () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRequestCancellation(booking._id || booking.id, cancellationReason);
      setShowCancelDialog(false);
      onClose();
    } catch (error) {
      alert(error.message || 'Failed to submit cancellation request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-label="Booking Details"
          onClick={(e) => e.stopPropagation()}
          className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/80 w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="p-5 pb-4 border-b border-slate-100/80 flex items-center justify-between bg-white/60 sticky top-0 z-10">
            <div className="min-w-0">
              <span className="font-black text-lg text-slate-900 tracking-tight block truncate">Booking {booking.bookingId || booking.shortCode}</span>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Booked on {formatNepalDateTime(booking.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                displayStatus === 'Confirmed' 
                  ? 'bg-emerald-50 text-emerald-600'
                  : displayStatus === 'Refunded'
                  ? 'bg-purple-50 text-purple-600'
                  : displayStatus === 'Cancelled'
                  ? 'bg-rose-50 text-rose-600'
                  : displayStatus === 'Completed'
                  ? 'bg-slate-100 text-slate-600'
                  : 'bg-amber-50 text-amber-600'
              }`}>
                {displayStatus === 'Confirmed' && <CheckCircle2 size={13} className="mr-1.5" />}
                {displayStatus}
              </span>
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
            {/* Cancellation Request Status */}
            {booking.cancellationRequest && (
              <div className={`rounded-2xl p-4 border-2 ${
                booking.cancellationRequest.status === 'Pending'
                  ? 'bg-amber-50 border-amber-200'
                  : booking.cancellationRequest.status === 'Approved'
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-rose-50 border-rose-200'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`h-5 w-5 shrink-0 mt-0.5 ${
                    booking.cancellationRequest.status === 'Pending'
                      ? 'text-amber-600'
                      : booking.cancellationRequest.status === 'Approved'
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }`} />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900">
                      Cancellation Request {booking.cancellationRequest.status}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      <span className="font-bold">Reason:</span> {booking.cancellationRequest.reason}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Requested {formatNepalDateTime(booking.cancellationRequest.requestedAt)}
                    </p>
                    {booking.cancellationRequest.reviewNotes && (
                      <p className="text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200">
                        <span className="font-bold">Admin Response:</span> {booking.cancellationRequest.reviewNotes}
                      </p>
                    )}
                    {booking.refund && booking.cancellationRequest.status === 'Approved' && (
                      <div className="mt-3 pt-3 border-t border-emerald-200 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Original Amount:</span>
                          <span className="font-bold text-slate-900">{money(booking.refund.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Processing Fee (10%):</span>
                          <span className="font-bold text-rose-600">{money(booking.refund.deductedAmount)}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-emerald-200">
                          <span className="font-bold text-emerald-700">Net Refund:</span>
                          <span className="font-black text-emerald-700">{money(booking.refund.netRefundAmount)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Venue Details */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2.5">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Venue Information</h5>
              <div className="space-y-1">
                <p className="font-extrabold text-sm text-slate-900">{booking.turf?.name || 'Turf Venue'}</p>
                {booking.turf?.location?.city && (
                  <p className="text-[11px] text-slate-500 font-medium">{booking.turf.location.city}{booking.turf.location.area ? `, ${booking.turf.location.area}` : ''}</p>
                )}
              </div>
            </div>

            {/* Date, Time & Court */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100/60 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  <CalendarIcon size={13} /> Date & Slot
                </div>
                <p className="font-extrabold text-xs text-slate-900">{booking.dateStr}</p>
                <p className="text-[11px] font-semibold text-slate-600">{booking.timeSlot}</p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100/60 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  <CircleDot size={13} /> Court Pitch
                </div>
                <p className="font-extrabold text-xs text-slate-900">{booking.court?.name || 'Court 1'}</p>
                <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                  <Users size={11} /> {booking.teamSize || '—'} players
                </p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2 shadow-2xs">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Summary</h5>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Payment Channel</span>
                <span className="font-bold text-slate-900">{booking.paymentMethod || 'eSewa'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Payment Status</span>
                <span className={`font-extrabold px-2 py-0.5 rounded-md ${PAYMENT_STATUS_STYLES[booking.paymentStatus] || 'text-amber-700 bg-amber-50'}`}>
                  {booking.paymentStatus}
                </span>
              </div>
              
              {booking.paymentType === 'venue' && booking.depositAmount > 0 && (
                <div className="pt-2 border-t border-amber-100 bg-amber-50/30 -mx-4 px-4 pb-2 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-700 font-bold text-[11px]">Deposit Paid (20%)</span>
                    <span className="font-extrabold text-emerald-600">{money(booking.depositAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-700 font-bold text-[11px]">Pay at Venue</span>
                    <span className="font-extrabold text-amber-700">{money(booking.remainingBalance)}</span>
                  </div>
                </div>
              )}
              
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Total price</span>
                  <span className="font-bold text-slate-900">{money(totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Received</span>
                  <span className="font-bold text-emerald-600">{money(paidAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-extrabold text-slate-900">Still due</span>
                  <span className={`font-black text-base ${dueAmount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{money(dueAmount)}</span>
                </div>
              </div>
            </div>

            {booking.confirmedAt && (
              <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-500" /> Confirmed on {formatNepalDateTime(booking.confirmedAt)}
              </p>
            )}

            {/* Actions */}
            <div className="pt-1 space-y-2">
              {canRequestCancellation && (
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all"
                >
                  <Ban size={14} /> Request Cancellation
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
              >
                Close
              </button>
              
              {!canRequestCancellation && booking.status === 'Confirmed' && !booking.cancellationRequest && (
                <p className="text-[11px] text-center text-slate-500 px-3">
                  {hoursUntilMatch < 6 
                    ? 'Cancellation must be requested at least 6 hours before match time'
                    : 'Cannot request cancellation for this booking'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Request Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Request Cancellation</h3>
            <p className="text-sm text-slate-600 mb-4">
              A 10% processing fee will be deducted from your refund. You will receive {money(paidAmount * 0.9)} after approval.
            </p>
            
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Reason for Cancellation <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Please provide a reason..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 resize-none"
              rows={4}
              disabled={isSubmitting}
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCancellationRequest}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
              <button
                onClick={() => setShowCancelDialog(false)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserBookingDetailModal;
