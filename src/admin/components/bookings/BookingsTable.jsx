import { useEffect, useRef, useState } from 'react';

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Banknote,
  Check,
  Copy,
} from 'lucide-react';
import Avatar from '../common/Avatar';

export function BookingStatusBadge({ status }) {
  const styles = {
    Confirmed: 'bg-lime-50 text-lime-700',
    Completed: 'bg-slate-100 text-slate-600',
    Cancelled: 'bg-rose-50 text-rose-600',
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1.5 text-[11px] font-bold leading-none ${styles[status] ||
        'bg-slate-100 text-slate-600'
        }`}
    >
      {status}
    </span>
  );
}

function BookingsTable({
  bookings,
  onClearFilters,
  onSelectBooking,
  onSort,
  paginatedBookings,
  showSkeleton,
  sort,
}) {
  const [copiedId, setCopiedId] = useState(null);
  const copyTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  const copyBookingId = async (bookingId) => {
    try {
      await navigator.clipboard.writeText(bookingId);
      setCopiedId(bookingId);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setCopiedId(null);
    }
  };

  const sortHeader = (label, key, className = '') => {
    const active = sort?.key === key;
    const Icon = !active
      ? ArrowUpDown
      : sort.dir === 'asc'
        ? ArrowUp
        : ArrowDown;

    return (
      <th
        className={`px-4 py-3 text-left ${className}`}
        aria-sort={
          active
            ? sort.dir === 'asc'
              ? 'ascending'
              : 'descending'
            : 'none'
        }
      >
        <button
          type="button"
          onClick={() => onSort(key)}
          className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-400 transition-colors hover:text-slate-700"
        >
          {label}

          <Icon
            size={12}
            className={
              active ? 'text-lime-600' : 'text-slate-300'
            }
          />
        </button>
      </th>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1280px] border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="w-[45px] px-4 py-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 accent-lime-500"
              />
            </th>

            <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wide text-slate-400">
              Booking ID
            </th>

            {sortHeader('Customer', 'customer')}
            {sortHeader('Court', 'court')}
            {sortHeader('Date & Time', 'when')}

            <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wide text-slate-400">
              Duration
            </th>

            {sortHeader('Amount', 'amount')}
            {sortHeader('Payment', 'payment')}
            {sortHeader('Status', 'status')}

          </tr>
        </thead>

        <tbody>
          {showSkeleton ? (
            Array.from({ length: 10 }, (_, index) => (
              <tr
                key={index}
                className="border-b border-slate-100"
              >
                <td
                  colSpan={9}
                  className="px-5 py-3"
                >
                  <div className="h-11 animate-pulse rounded-lg bg-slate-50" />
                </td>
              </tr>
            ))
          ) : paginatedBookings.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="py-16 text-center"
              >
                <p className="text-[14px] font-bold text-slate-800">
                  {bookings.length === 0
                    ? 'No bookings yet'
                    : 'No bookings match your filters'}
                </p>

                <p className="mt-1 text-[12px] font-medium text-slate-400">
                  {bookings.length === 0
                    ? 'New bookings will appear here.'
                    : 'Try changing or clearing your filters.'}
                </p>

                {bookings.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="mt-3 text-[12px] font-bold text-lime-600"
                  >
                    Clear filters
                  </button>
                )}
              </td>
            </tr>
          ) : (
            paginatedBookings.map((booking) => (
              <tr
                key={booking.id}
                onClick={() => onSelectBooking(booking)}
                className="h-[58px] cursor-pointer border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/70"
              >
                <td
                  className="px-4 py-3"
                  onClick={(event) => event.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 accent-lime-500"
                  />
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-bold text-slate-900">{booking.id}</p>
                    <button
                      type="button"
                      onClick={(event) => { event.stopPropagation(); copyBookingId(booking.id); }}
                      className="relative flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      aria-label={`Copy booking ID ${booking.id}`}
                      title={copiedId === booking.id ? 'Copied!' : 'Copy booking ID'}
                    >
                      {copiedId === booking.id ? <Check size={12} className="text-lime-600" /> : <Copy size={12} />}
                      {copiedId === booking.id && (
                        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-bold text-white shadow-sm">Copied!</span>
                      )}
                    </button>
                  </div>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-400">{booking.bookedOn}</p>
                </td>

                <td className="px-4 py-3">
                  <div className="flex min-w-[190px] items-center gap-2.5">
                    <Avatar name={booking.customerName} src={booking.avatar} className="h-8 w-8 border border-slate-100" />

                    <div className="min-w-0">
                      <p className="max-w-[160px] truncate text-[13px] font-bold text-slate-900">
                        {booking.customerName}
                      </p>

                      <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                        {booking.customerPhone}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="min-w-[135px]">
                    <div>
                      <p className="text-[13px] font-medium text-slate-600">
                        {booking.courtName}
                      </p>

                      <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                        {booking.courtDimension}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <p className="text-[13px] font-medium text-slate-600">
                    {booking.date}
                  </p>

                  <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                    {booking.timeSlot}
                  </p>
                </td>

                <td className="px-4 py-3 text-[13px] font-medium text-slate-600">
                  {booking.duration}
                </td>

                <td className="px-4 py-3">
                  <p className="whitespace-nowrap text-[13px] font-semibold text-slate-700">
                    NRs. {Number(booking.amount || 0).toLocaleString('en-NP')}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${booking.paymentStatus === 'Paid'
                        ? 'bg-lime-50 text-lime-700'
                        : 'bg-slate-100 text-slate-500'
                        }`}
                    >
                      <Banknote size={12} />
                    </div>

                    <div>
                      <p className="whitespace-nowrap text-[13px] font-medium text-slate-600">
                        {booking.paymentMethod}
                      </p>

                      <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                        {booking.paymentStatus}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <BookingStatusBadge status={booking.bookingStatus} />

                    {booking.cancellationRequest?.status === 'Pending' && (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">
                        Cancellation Requested
                      </span>
                    )}
                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BookingsTable;