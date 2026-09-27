import { Search } from 'lucide-react';

import BookingFilterSelect from '../bookings/BookingFilterSelect';
import BookingPagination from '../bookings/BookingPagination';

import PaymentStatusBadge from './PaymentStatusBadge';
import { METHOD_BADGE, formatNpr } from './paymentUtils';
import { formatNepalDateTimeParts } from '../../../shared/utils/dateTime';

const DATE_OPTIONS = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
];

const STATUS_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'Completed', label: 'Completed' },
  { value: 'RefundPending', label: 'Refund Pending' },
  { value: 'Refunded', label: 'Refunded' },
  { value: 'RefundFailed', label: 'Refund Failed' },
];

const customerInitials = (name) =>
  (name || 'C')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

function PaymentsTable({
  dateFilter,
  hasActiveFilters,
  itemsPerPage,
  methodFilter,
  methods,
  onClearFilters,
  onDateFilterChange,
  onItemsPerPageChange,
  onMethodFilterChange,
  onPageChange,
  onSearchChange,
  onSelectPayment,
  onStatusFilterChange,
  page,
  paginatedPayments,
  paymentCount,
  searchQuery,
  showSkeleton,
  startIndex,
  statusFilter,
  totalPages,
}) {
  return (
    <div className="h-full rounded-xl border border-slate-100 bg-white shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
      {/* Filters */}
      <div className="border-b border-slate-100 px-5 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative min-w-[260px] flex-1 xl:max-w-[420px]">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by customer, phone, payment ID, booking ID..."
              className="h-[44px] w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-[12px] font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-lime-400"
            />
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:justify-end">
            <BookingFilterSelect
              value={dateFilter}
              onChange={onDateFilterChange}
              className="w-full sm:w-[160px]"
              options={DATE_OPTIONS}
            />

            <BookingFilterSelect
              value={statusFilter}
              onChange={onStatusFilterChange}
              className="w-full sm:w-[150px]"
              options={STATUS_OPTIONS}
            />

            <BookingFilterSelect
              value={methodFilter}
              onChange={onMethodFilterChange}
              className="w-full sm:w-[190px]"
              options={[
                { value: 'All', label: 'All Payment Methods' },
                ...methods.map((method) => ({
                  value: method,
                  label: method,
                })),
              ]}
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="h-[44px] shrink-0 px-2 text-[11px] font-bold text-slate-500 hover:text-slate-900"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.04em] text-slate-400">
                Payment ID
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.04em] text-slate-400">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.04em] text-slate-400">
                Booking ID
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.04em] text-slate-400">
                Venue
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.04em] text-slate-400">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.04em] text-slate-400">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.04em] text-slate-400">
                Payment Method
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.04em] text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.04em] text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {showSkeleton ? (
              Array.from({ length: 10 }, (_, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td colSpan={9} className="px-5 py-3">
                    <div className="h-11 animate-pulse rounded-lg bg-slate-50" />
                  </td>
                </tr>
              ))
            ) : paginatedPayments.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center">
                  <p className="text-[14px] font-bold text-slate-800">
                    {paymentCount === 0 && !hasActiveFilters
                      ? 'No transactions yet'
                      : 'No transactions match your filters'}
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-slate-400">
                    {paymentCount === 0 && !hasActiveFilters
                      ? 'Completed payments will appear here.'
                      : 'Try changing or clearing your filters.'}
                  </p>

                  {hasActiveFilters && (
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
              paginatedPayments.map((payment) => {
                const { date, time } = formatNepalDateTimeParts(payment.paidAt);
                return (
                  <tr
                    key={`${payment.paymentId}-${payment.bookingId}`}
                    onClick={() => onSelectPayment(payment)}
                    className="cursor-pointer border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/70"
                  >
                    <td className="px-4 py-3">
                      <p className="whitespace-nowrap text-[12px] font-bold text-slate-900">
                        {payment.paymentId || 'Unavailable'}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex min-w-[160px] items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500">
                          {customerInitials(payment.customer?.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[150px] truncate text-[12px] font-bold text-slate-900">
                            {payment.customer?.name || 'Customer'}
                          </p>

                          <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                            {payment.customer?.phone || '—'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <p className="whitespace-nowrap text-[12px] font-bold text-slate-800">
                        {payment.bookingId}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <p className="max-w-[140px] truncate text-[12px] font-medium text-slate-500">
                        {payment.turfName || '—'}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <p className="whitespace-nowrap text-[12px] font-bold text-slate-900">
                        {date}
                      </p>

                      <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                        {time}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <p className="whitespace-nowrap text-[12px] font-bold text-slate-900">
                        {formatNpr(payment.amount)}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold leading-none ${METHOD_BADGE[payment.method] ||
                          'bg-slate-100 text-slate-700'
                          }`}
                      >
                        {payment.method}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={payment.status} />
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelectPayment(payment);
                        }}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-700 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <BookingPagination
        filteredBookingsCount={paymentCount}
        itemsPerPage={itemsPerPage}
        label="transactions"
        onItemsPerPageChange={onItemsPerPageChange}
        onPageChange={onPageChange}
        page={page}
        startIndex={startIndex}
        totalPages={totalPages}
      />
    </div>
  );
}

export default PaymentsTable;
