import {
  X,
  Calendar as CalendarIcon,
  CircleDot,
  CheckCircle2,
  AlertCircle,
  Ban,
  Users,
  Download,
  QrCode,
  Clock3,
  RefreshCcw,
  MapPin,
  CreditCard,
  WalletCards,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

import { formatNepalDateTime } from '../../../shared/utils/dateTime';
import BookingPassModal from './BookingPassModal';
import turfService from '../../../shared/services/turfService';

const money = (value) => {
  if (value === null || value === undefined || value === '') return '—';

  const amount = Number(value);

  if (Number.isNaN(amount)) return '—';

  return `NRs. ${amount.toLocaleString('en-NP')}`;
};

const displayValue = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  return value;
};

const PAYMENT_STATUS_STYLES = {
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Partial: 'bg-amber-50 text-amber-700 border-amber-100',
  Failed: 'bg-rose-50 text-rose-700 border-rose-100',
  Pending: 'bg-amber-50 text-amber-700 border-amber-100',
};

const STATUS_STYLES = {
  Confirmed: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    icon: CheckCircle2,
  },
  Refunded: {
    badge: 'bg-violet-50 text-violet-700 border-violet-100',
    icon: RefreshCcw,
  },
  Cancelled: {
    badge: 'bg-rose-50 text-rose-700 border-rose-100',
    icon: Ban,
  },
  Completed: {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: CheckCircle2,
  },
  Pending: {
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    icon: Clock3,
  },
};

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2">
      {Icon && (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Icon size={14} strokeWidth={2} />
        </div>
      )}

      <h3 className="text-xs font-extrabold uppercase tracking-[0.08em] text-slate-500">
        {title}
      </h3>
    </div>
  );
}

function DetailItem({ label, value, icon: Icon, className = '' }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <div className="mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon size={13} className="shrink-0 text-slate-400" />}

        <span className="text-[11px] font-semibold text-slate-400">
          {label}
        </span>
      </div>

      <p className="truncate text-sm font-bold text-slate-900">
        {displayValue(value)}
      </p>
    </div>
  );
}

function PaymentRow({
  label,
  value,
  valueClassName = 'text-slate-900',
  strong = false,
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-2">
      <span
        className={`text-sm ${strong
            ? 'font-bold text-slate-800'
            : 'font-medium text-slate-500'
          }`}
      >
        {label}
      </span>

      <span
        className={`shrink-0 text-right text-sm ${strong ? 'font-black' : 'font-bold'
          } ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}

function UserBookingDetailModal({
  booking,
  onClose,
  onRequestCancellation,
}) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showBookingPass, setShowBookingPass] = useState(false);
  const [bookingPassData, setBookingPassData] = useState(null);

  const [qrToken, setQrToken] = useState(null);
  const [isLoadingQR, setIsLoadingQR] = useState(true);
  const [qrTimestamp] = useState(() => Date.now());

  useEffect(() => {
    let active = true;

    if (
      booking?.status === 'Confirmed' &&
      !booking?.cancellationRequest
    ) {
      setIsLoadingQR(true);

      turfService
        .generateBookingPass(booking._id || booking.id)
        .then((response) => {
          if (!active) return;

          const data = response?.data || response;

          if (data?.qrToken) {
            setQrToken(data.qrToken);
            setBookingPassData(data);
          }
        })
        .catch((error) => {
          console.error('QR fetch error:', error);
        })
        .finally(() => {
          if (active) {
            setIsLoadingQR(false);
          }
        });
    } else {
      setIsLoadingQR(false);
    }

    return () => {
      active = false;
    };
  }, [booking]);

  if (!booking) return null;

  const totalAmount = Number(booking.totalAmount || 0);
  const paidAmount = Number(booking.totalPaidAmount || 0);
  const dueAmount = Math.max(0, totalAmount - paidAmount);

  const venueAmount = Math.max(
    0,
    totalAmount - Number(booking.depositAmount || 0),
  );

  const venueSettled = dueAmount <= 0;

  const matchDateTime = booking.dateStr
    ? new Date(`${booking.dateStr}T00:00:00.000Z`)
    : null;

  if (matchDateTime && !Number.isNaN(matchDateTime.getTime())) {
    const matchTimeMinutes = booking.startMinutes || 0;

    matchDateTime.setMinutes(
      matchDateTime.getMinutes() + matchTimeMinutes - 345,
    );
  }

  const hoursUntilMatch =
    matchDateTime && !Number.isNaN(matchDateTime.getTime())
      ? (matchDateTime - new Date()) / (1000 * 60 * 60)
      : -1;

  const canRequestCancellation =
    hoursUntilMatch >= 6 &&
    booking.status === 'Confirmed' &&
    !booking.cancellationRequest;

  const displayStatus =
    booking.status === 'Cancelled' &&
      booking.refund?.status === 'Processed'
      ? 'Refunded'
      : booking.status;

  const statusStyle =
    STATUS_STYLES[displayStatus] || STATUS_STYLES.Pending;

  const StatusIcon = statusStyle.icon;

  const location = [
    booking.turf?.location?.city,
    booking.turf?.location?.area,
  ]
    .filter(Boolean)
    .join(', ');

  const handleCancellationRequest = async () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setIsSubmitting(true);

    try {
      await onRequestCancellation(
        booking._id || booking.id,
        cancellationReason,
      );

      setShowCancelDialog(false);
      onClose();
    } catch (error) {
      alert(
        error.message || 'Failed to submit cancellation request',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPass = () => {
    if (!bookingPassData && qrToken) {
      setBookingPassData({
        booking,
        qrToken,
        expiresAt: booking.qrTokenExpiresAt,
      });
    }

    setShowBookingPass(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3 backdrop-blur-sm sm:p-6"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Booking Details"
          onClick={(event) => event.stopPropagation()}
          className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between gap-5 border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                <h2 className="truncate text-lg font-black tracking-tight text-slate-900">
                  {displayValue(
                    booking.bookingId || booking.shortCode,
                  )}
                </h2>

                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyle.badge}`}
                >
                  <StatusIcon size={12} strokeWidth={2.5} />
                  {displayValue(displayStatus)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
                <span>{displayValue(booking.dateStr)}</span>

                {booking.timeSlot && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{booking.timeSlot}</span>
                  </>
                )}

                {booking.createdAt && (
                  <>
                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                    <span className="basis-full text-slate-400 sm:basis-auto">
                      Booked {formatNepalDateTime(booking.createdAt)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto">
            <div className="space-y-6 px-5 py-5 sm:px-6 sm:py-6">
              {/* Cancellation status */}
              {booking.cancellationRequest && (
                <div
                  className={`rounded-xl border p-4 ${booking.cancellationRequest.status === 'Pending'
                      ? 'border-amber-200 bg-amber-50'
                      : booking.cancellationRequest.status ===
                        'Approved'
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-rose-200 bg-rose-50'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      size={18}
                      className={`mt-0.5 shrink-0 ${booking.cancellationRequest.status ===
                          'Pending'
                          ? 'text-amber-600'
                          : booking.cancellationRequest.status ===
                            'Approved'
                            ? 'text-emerald-600'
                            : 'text-rose-600'
                        }`}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold text-slate-900">
                        Cancellation request{' '}
                        {booking.cancellationRequest.status}
                      </p>

                      {booking.cancellationRequest.reason && (
                        <p className="mt-1.5 text-xs leading-5 text-slate-600">
                          <span className="font-bold">Reason:</span>{' '}
                          {booking.cancellationRequest.reason}
                        </p>
                      )}

                      {booking.cancellationRequest.requestedAt && (
                        <p className="mt-1 text-[11px] font-medium text-slate-500">
                          Requested{' '}
                          {formatNepalDateTime(
                            booking.cancellationRequest.requestedAt,
                          )}
                        </p>
                      )}

                      {booking.cancellationRequest.reviewNotes && (
                        <div className="mt-3 border-t border-black/5 pt-3">
                          <p className="text-xs leading-5 text-slate-600">
                            <span className="font-bold">
                              Admin response:
                            </span>{' '}
                            {
                              booking.cancellationRequest
                                .reviewNotes
                            }
                          </p>
                        </div>
                      )}

                      {booking.refund &&
                        booking.cancellationRequest.status ===
                        'Approved' && (
                          <div className="mt-3 space-y-1 border-t border-black/5 pt-3">
                            <PaymentRow
                              label="Original amount"
                              value={money(booking.refund.amount)}
                            />

                            <PaymentRow
                              label="Processing fee"
                              value={`−${money(
                                booking.refund.deductedAmount,
                              )}`}
                              valueClassName="text-rose-600"
                            />

                            <PaymentRow
                              label="Net refund"
                              value={money(
                                booking.refund.netRefundAmount,
                              )}
                              valueClassName="text-emerald-700"
                              strong
                            />
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* Booking information */}
              <section className="space-y-4">
                <SectionHeader
                  icon={CalendarIcon}
                  title="Booking information"
                />

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                    <div className="p-4">
                      <DetailItem
                        label="Venue"
                        value={booking.turf?.name}
                        icon={MapPin}
                      />

                      {location && (
                        <p className="mt-2 text-xs font-medium text-slate-500">
                          {location}
                        </p>
                      )}
                    </div>

                    <div className="p-4">
                      <DetailItem
                        label="Court / Pitch"
                        value={booking.court?.name}
                        icon={CircleDot}
                      />

                      {booking.teamSize !== null &&
                        booking.teamSize !== undefined && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <Users size={12} />
                            {booking.teamSize} players
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 border-t border-slate-100 sm:grid-cols-3">
                    <div className="border-r border-slate-100 p-4">
                      <DetailItem
                        label="Date"
                        value={booking.dateStr}
                      />
                    </div>

                    <div className="p-4 sm:border-r sm:border-slate-100">
                      <DetailItem
                        label="Time"
                        value={booking.timeSlot}
                      />
                    </div>

                    <div className="col-span-2 border-t border-slate-100 p-4 sm:col-span-1 sm:border-t-0">
                      <DetailItem
                        label="Team size"
                        value={
                          booking.teamSize !== null &&
                            booking.teamSize !== undefined
                            ? `${booking.teamSize} players`
                            : null
                        }
                      />
                    </div>
                  </div>
                </div>

                {booking.confirmedAt && (
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <CheckCircle2
                      size={14}
                      className="text-emerald-500"
                    />

                    <span>
                      Confirmed{' '}
                      {formatNepalDateTime(booking.confirmedAt)}
                    </span>
                  </div>
                )}
              </section>

              {/* Payment */}
              <section className="space-y-4">
                <SectionHeader
                  icon={CreditCard}
                  title="Payment"
                />

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="grid grid-cols-1 border-b border-slate-100 sm:grid-cols-2">
                    <div className="p-4 sm:border-r sm:border-slate-100">
                      <p className="mb-1 text-[11px] font-semibold text-slate-400">
                        Payment channel
                      </p>

                      <p className="text-sm font-bold text-slate-900">
                        {displayValue(booking.paymentMethod)}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 p-4 sm:border-t-0">
                      <p className="mb-1.5 text-[11px] font-semibold text-slate-400">
                        Payment status
                      </p>

                      {booking.paymentStatus ? (
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${PAYMENT_STATUS_STYLES[
                            booking.paymentStatus
                            ] ||
                            'border-slate-200 bg-slate-100 text-slate-700'
                            }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-slate-900">
                          —
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="px-4 py-2">
                    {booking.paymentType === 'venue' &&
                      Number(booking.depositAmount) > 0 && (
                        <div className="border-b border-slate-100 pb-2">
                          <PaymentRow
                            label="Deposit paid"
                            value={money(
                              booking.depositAmount,
                            )}
                            valueClassName="text-emerald-600"
                          />

                          <PaymentRow
                            label={
                              venueSettled
                                ? 'Paid at venue'
                                : 'Pay at venue'
                            }
                            value={money(venueAmount)}
                            valueClassName={
                              venueSettled
                                ? 'text-emerald-600'
                                : 'text-amber-600'
                            }
                          />
                        </div>
                      )}

                    <PaymentRow
                      label="Total price"
                      value={money(booking.totalAmount)}
                    />

                    <PaymentRow
                      label="Amount paid"
                      value={money(booking.totalPaidAmount)}
                      valueClassName="text-emerald-600"
                    />
                  </div>

                  <div
                    className={`mx-4 mb-4 flex items-center justify-between rounded-lg px-4 py-3 ${dueAmount > 0
                        ? 'bg-amber-50'
                        : 'bg-emerald-50'
                      }`}
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Remaining balance
                      </p>

                      <p
                        className={`mt-0.5 text-xs font-bold ${dueAmount > 0
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                          }`}
                      >
                        {dueAmount > 0
                          ? 'Payment remaining'
                          : 'Fully paid'}
                      </p>
                    </div>

                    <span
                      className={`text-lg font-black ${dueAmount > 0
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                        }`}
                    >
                      {money(dueAmount)}
                    </span>
                  </div>
                </div>
              </section>

              {/* QR */}
              {displayStatus === 'Confirmed' &&
                !booking.cancellationRequest && (
                  <section className="space-y-4">
                    <SectionHeader
                      icon={QrCode}
                      title="Venue check-in"
                    />

                    <div className="flex flex-col items-center gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center">
                      <div className="flex h-[146px] w-[146px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                        {qrToken ? (
                          <QRCodeSVG
                            value={JSON.stringify({
                              token: qrToken,
                              type: 'booking_verification',
                              timestamp: qrTimestamp,
                            })}
                            size={126}
                            level="H"
                            includeMargin
                          />
                        ) : isLoadingQR ? (
                          <div className="flex flex-col items-center gap-3 text-xs font-medium text-slate-500">
                            <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-lime-500" />
                            Generating...
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 px-3 text-center">
                            <AlertCircle
                              size={22}
                              className="text-rose-500"
                            />

                            <span className="text-xs font-semibold text-rose-600">
                              QR unavailable
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 text-center sm:text-left">
                        <h4 className="text-sm font-extrabold text-slate-900">
                          Booking QR Code
                        </h4>

                        <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-500">
                          {qrToken
                            ? 'Present this QR code at the venue when you arrive to verify your booking.'
                            : isLoadingQR
                              ? 'Generating your unique booking QR code.'
                              : 'The QR code could not be generated. Please close the booking and try again.'}
                        </p>

                        {qrToken && (
                          <button
                            type="button"
                            onClick={handleDownloadPass}
                            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-lime-400 px-4 py-2.5 text-xs font-extrabold text-slate-900 transition hover:bg-lime-500"
                          >
                            <Download size={14} />
                            Download booking pass
                          </button>
                        )}
                      </div>
                    </div>
                  </section>
                )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-4 sm:px-6">
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>

              {canRequestCancellation && (
                <button
                  type="button"
                  onClick={() => setShowCancelDialog(true)}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 text-sm font-bold text-white transition hover:bg-rose-700"
                >
                  <Ban size={14} />
                  Request cancellation
                </button>
              )}
            </div>

            {!canRequestCancellation &&
              booking.status === 'Confirmed' &&
              !booking.cancellationRequest &&
              hoursUntilMatch < 6 && (
                <p className="mt-2 text-right text-[11px] font-medium text-slate-400">
                  Cancellation requests must be submitted at least
                  6 hours before the match.
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Booking Pass */}
      {showBookingPass && bookingPassData && (
        <BookingPassModal
          booking={bookingPassData.booking}
          qrToken={bookingPassData.qrToken}
          onClose={() => {
            setShowBookingPass(false);
            setBookingPassData(null);
          }}
        />
      )}

      {/* Cancellation dialog */}
      {showCancelDialog && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!isSubmitting) {
              setShowCancelDialog(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Request Cancellation"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Request cancellation
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  This request will be sent to the venue for
                  review.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCancelDialog(false)}
                disabled={isSubmitting}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close cancellation dialog"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3.5">
                <WalletCards
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <div>
                  <p className="text-xs font-bold text-amber-900">
                    Refund information
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-800">
                    A 10% processing fee will be deducted. Your
                    estimated refund after approval is{' '}
                    <span className="font-black">
                      {money(paidAmount * 0.9)}
                    </span>
                    .
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="cancellation-reason"
                  className="mb-2 block text-xs font-bold text-slate-700"
                >
                  Reason for cancellation
                  <span className="ml-1 text-rose-500">*</span>
                </label>

                <textarea
                  id="cancellation-reason"
                  value={cancellationReason}
                  onChange={(event) =>
                    setCancellationReason(event.target.value)
                  }
                  placeholder="Tell us why you need to cancel this booking..."
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>
            </div>

            <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setShowCancelDialog(false)}
                disabled={isSubmitting}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep booking
              </button>

              <button
                type="button"
                onClick={handleCancellationRequest}
                disabled={
                  isSubmitting || !cancellationReason.trim()
                }
                className="flex-1 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? 'Submitting...'
                  : 'Submit request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserBookingDetailModal;