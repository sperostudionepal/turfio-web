import { useEffect } from 'react';
import {
    ArrowRight,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Eye,
    Image as ImageIcon,
    Loader2,
} from 'lucide-react';

import { formatNepalDateTime } from '../../../shared/utils/dateTime';
import { getPageItems } from '../../../shared/utils/pagination';

export default function MyBookingsCard({
    bookings,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    onSelectBooking,
    onFindTurfs,
}) {
    const totalItems = bookings?.length || 0;

    const totalPages = Math.max(
        1,
        Math.ceil(totalItems / itemsPerPage)
    );

    const pageItems = getPageItems(
        currentPage,
        totalPages
    );

    const startIndex =
        totalItems === 0
            ? 0
            : (currentPage - 1) * itemsPerPage;

    const endIndex = Math.min(
        startIndex + itemsPerPage,
        totalItems
    );

    const visibleBookings = bookings.slice(
        startIndex,
        endIndex
    );

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [
        currentPage,
        totalPages,
        setCurrentPage,
    ]);

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return 'bg-blue-100 text-blue-700';

            case 'completed':
                return 'bg-emerald-100 text-emerald-700';

            case 'cancelled':
            case 'canceled':
                return 'bg-rose-100 text-rose-700';

            case 'pending':
                return 'bg-amber-100 text-amber-700';

            case 'rejected':
                return 'bg-red-100 text-red-700';

            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    const getPaymentStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'completed':
                return 'bg-emerald-100 text-emerald-700';

            case 'partial':
            case 'partially_paid':
            case 'partially paid':
                return 'bg-amber-100 text-amber-700';

            case 'pending':
            case 'unpaid':
                return 'bg-orange-100 text-orange-700';

            case 'failed':
            case 'cancelled':
            case 'canceled':
                return 'bg-rose-100 text-rose-700';

            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    const displayValue = (value) => {
        if (value === undefined || value === null || value === '') return '—';
        return String(value);
    };

    const formatBookingId = (booking) =>
        displayValue(booking?.bookingId);

    const getTurfName = (booking) =>
        displayValue(booking?.turf?.name);

    const getCourtName = (booking) =>
        displayValue(booking?.court?.name);

    const getTurfImage = (booking) =>
        booking?.turf?.images?.[0] || '';

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null || amount === '') return '—';

        const numericAmount = Number(amount);
        return Number.isNaN(numericAmount)
            ? displayValue(amount)
            : `NPR ${numericAmount.toLocaleString()}`;
    };

    const getAmount = (booking) =>
        formatCurrency(booking?.totalAmount);

    const getDepositAmount = (booking) =>
        booking?.depositAmount;

    const getDueAmount = (booking) =>
        booking?.remainingBalance;

    const getPaymentStatus = (booking) =>
        booking?.paymentStatus;

    const formatPaymentStatus = (status) =>
        displayValue(status);

    const getDate = (booking) => {
        if (!booking?.date) return '—';
        return formatNepalDateTime(booking.date);
    };

    const getTime = (booking) =>
        displayValue(booking?.timeSlot);

    return (
        <section className="overflow-hidden rounded-xl bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
            {/* Header */}
            <div
                className="
          flex
          flex-col
          gap-4
          border-b
          border-slate-100
          px-5
          py-5
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-6
        "
            >
                <div>
                    <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                        My Bookings
                    </h2>

                    <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                        View and manage your futsal reservations.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onFindTurfs}
                    className="
            inline-flex
            cursor-pointer
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-lime-400
            px-4
            py-2.5
            text-xs
            font-bold
            text-slate-900
            transition-colors
            hover:bg-lime-500
            sm:text-sm
          "
                >
                    Find a Turf

                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>

            {isLoading ? (
                <div className="flex min-h-[320px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-7 w-7 animate-spin text-lime-500" />

                        <p className="text-xs font-semibold text-slate-500">
                            Loading your bookings...
                        </p>
                    </div>
                </div>
            ) : error ? (
                <div className="px-5 py-16 text-center sm:px-6">
                    <h3 className="text-base font-bold text-slate-900">Unable to load bookings</h3>
                    <p className="mx-auto mt-2 max-w-md text-xs font-medium leading-5 text-rose-600 sm:text-sm">
                        {error}
                    </p>
                </div>
            ) : totalItems === 0 ? (
                <div className="px-5 py-16 text-center sm:px-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <Calendar className="h-6 w-6" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                        No bookings yet
                    </h3>

                    <p className="mx-auto mt-1 max-w-sm text-xs font-medium leading-5 text-slate-500 sm:text-sm">
                        Your upcoming and previous turf bookings will appear here.
                    </p>

                    <button
                        type="button"
                        onClick={onFindTurfs}
                        className="
              mt-5
              cursor-pointer
              text-sm
              font-bold
              text-lime-700
              transition-colors
              hover:text-lime-800
            "
                    >
                        Browse available turfs
                    </button>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full table-auto border-collapse">

                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70">
                                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                                        Booking ID
                                    </th>

                                    <th className="py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                                        Venue
                                    </th>

                                    <th className="py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                                        Schedule
                                    </th>

                                    <th className="py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                                        Payment
                                    </th>

                                    <th className="py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {visibleBookings.map((booking) => {
                                    const bookingKey =
                                        booking?._id || booking?.bookingId;

                                    const turfName =
                                        getTurfName(booking);

                                    const courtName =
                                        getCourtName(booking);

                                    const turfImage =
                                        getTurfImage(booking);

                                    const paymentStatus =
                                        getPaymentStatus(booking);

                                    const depositAmount =
                                        getDepositAmount(booking);

                                    const dueAmount =
                                        getDueAmount(booking);

                                    return (
                                        <tr
                                            key={bookingKey}
                                            onClick={() =>
                                                onSelectBooking(booking)
                                            }
                                            className="
                        group
                        cursor-pointer
                        transition-colors
                        hover:bg-slate-50/70
                      "
                                        >
                                            {/* 1. Booking ID */}
                                            <td className="px-5 py-5 align-middle">
                                                <p className="truncate text-sm font-extrabold tracking-tight text-lime-700">
                                                    {formatBookingId(booking)}
                                                </p>
                                            </td>

                                            {/* 2. Venue */}
                                            <td className="py-5 flex max-w-full align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="
                              h-12
                              w-16
                              shrink-0
                              overflow-hidden
                              rounded-lg
                              bg-slate-100
                            "
                                                    >
                                                        {turfImage ? (
                                                            <img
                                                                src={turfImage}
                                                                alt={turfName}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                                <ImageIcon className="h-4 w-4" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-extrabold text-slate-900">
                                                            {turfName}
                                                        </p>

                                                        {courtName && (
                                                            <p className="mt-1 truncate text-xs font-medium text-slate-500">
                                                                {courtName}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* 3. Schedule */}
                                            <td className="py-5 align-middle">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-bold text-slate-900">
                                                        {getDate(booking)}
                                                    </p>

                                                    <p className="mt-1.5 truncate text-xs font-medium text-slate-500">
                                                        {getTime(booking)}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* 4. Payment */}
                                            <td className="py-5 align-middle">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="whitespace-nowrap text-sm font-extrabold text-slate-900">
                                                            {getAmount(booking)}
                                                        </p>

                                                        {paymentStatus && (
                                                            <span
                                                                className={`
                                  inline-flex
                                  shrink-0
                                  items-center
                                  rounded-full
                                  px-2
                                  py-1
                                  text-[11px]
                                  font-bold
                                  ${getPaymentStatusStyles(
                                                                    paymentStatus
                                                                )}
                                `}
                                                            >
                                                                {formatPaymentStatus(
                                                                    paymentStatus
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {(dueAmount !== null ||
                                                        depositAmount !== null) && (
                                                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                                                                {dueAmount !== null && (
                                                                    <span className="whitespace-nowrap text-[11px] font-semibold text-orange-600">
                                                                        Due{' '}
                                                                        {formatCurrency(
                                                                            dueAmount
                                                                        )}
                                                                    </span>
                                                                )}

                                                                {depositAmount !== null && (
                                                                    <span className="whitespace-nowrap text-[11px] font-semibold text-emerald-600">
                                                                        Deposit{' '}
                                                                        {formatCurrency(
                                                                            depositAmount
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            </td>

                                            {/* 5. Status */}
                                            <td className="py-5 align-middle">
                                                <span
                                                    className={`
                            inline-flex
                            items-center
                            rounded-full
                            px-2.5
                            py-1.5
                            text-[11px]
                            font-bold
                            capitalize
                            ${getStatusStyles(
                                                        booking?.status
                                                    )}
                          `}
                                                >
                                                    {displayValue(booking?.status)}
                                                </span>
                                            </td>

                                            {/* 6. Action */}
                                            <td className="px-5 py-5 align-middle">
                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={(event) => {
                                                            event.stopPropagation();

                                                            onSelectBooking(
                                                                booking
                                                            );
                                                        }}
                                                        className="
                              inline-flex
                              cursor-pointer
                              items-center
                              justify-center
                              gap-1.5
                              whitespace-nowrap
                              rounded-lg
                              text-sm
                              font-bold
                              text-lime-500
                              transition-colors
                            "
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile / Tablet */}
                    <div className="divide-y divide-slate-100 lg:hidden">
                        {visibleBookings.map((booking) => {
                            const bookingKey =
                                booking?._id || booking?.bookingId;

                            const turfName =
                                getTurfName(booking);

                            const courtName =
                                getCourtName(booking);

                            const turfImage =
                                getTurfImage(booking);

                            const paymentStatus =
                                getPaymentStatus(booking);

                            const depositAmount =
                                getDepositAmount(booking);

                            const dueAmount =
                                getDueAmount(booking);

                            return (
                                <article
                                    key={bookingKey}
                                    className="px-5 py-5 sm:px-6"
                                >
                                    {/* Booking ID + Status */}
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="truncate text-sm font-extrabold tracking-tight text-lime-700">
                                            {formatBookingId(booking)}
                                        </p>

                                        <span
                                            className={`
                        shrink-0
                        rounded-full
                        px-2.5
                        py-1
                        text-[11px]
                        font-bold
                        capitalize
                        ${getStatusStyles(
                                                booking?.status
                                            )}
                      `}
                                        >
                                            {displayValue(booking?.status)}
                                        </span>
                                    </div>

                                    {/* Venue */}
                                    <div className="mt-4 flex items-center gap-3">
                                        <div
                                            className="
                        h-14
                        w-20
                        shrink-0
                        overflow-hidden
                        rounded-lg
                        bg-slate-100
                      "
                                        >
                                            {turfImage ? (
                                                <img
                                                    src={turfImage}
                                                    alt={turfName}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                    <ImageIcon className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-base font-extrabold text-slate-900">
                                                {turfName}
                                            </h3>

                                            {courtName && (
                                                <p className="mt-1 truncate text-sm font-medium text-slate-500">
                                                    {courtName}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Schedule + Payment */}
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="rounded-lg bg-slate-50 p-3">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                                                Schedule
                                            </p>

                                            <p className="mt-1.5 text-sm font-bold text-slate-900">
                                                {getDate(booking)}
                                            </p>

                                            <p className="mt-1 text-xs font-medium text-slate-500">
                                                {getTime(booking)}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-slate-50 p-3">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                                                Payment
                                            </p>

                                            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                                <p className="text-sm font-extrabold text-slate-900">
                                                    {getAmount(booking)}
                                                </p>

                                                {paymentStatus && (
                                                    <span
                                                        className={`
                              rounded-full
                              px-1.5
                              py-0.5
                              text-[10px]
                              font-bold
                              ${getPaymentStatusStyles(
                                                            paymentStatus
                                                        )}
                            `}
                                                    >
                                                        {formatPaymentStatus(
                                                            paymentStatus
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            {(dueAmount !== null ||
                                                depositAmount !== null) && (
                                                    <div className="mt-1.5 space-y-0.5">
                                                        {dueAmount !== null && (
                                                            <p className="text-[10px] font-semibold text-orange-600">
                                                                Due{' '}
                                                                {formatCurrency(
                                                                    dueAmount
                                                                )}
                                                            </p>
                                                        )}

                                                        {depositAmount !== null && (
                                                            <p className="text-[10px] font-semibold text-emerald-600">
                                                                Deposit{' '}
                                                                {formatCurrency(
                                                                    depositAmount
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onSelectBooking(booking)
                                        }
                                        className="
                      mt-4
                      inline-flex
                      w-full
                      cursor-pointer
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-lime-400
                      px-4
                      py-2.5
                      text-sm
                      font-bold
                      text-slate-900
                      transition-colors
                      hover:bg-lime-500
                    "
                                    >
                                        <Eye className="h-3.5 w-3.5" />

                                        View Details
                                    </button>
                                </article>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    <div
                        className="
              flex
              flex-col
              gap-4
              border-t
              border-slate-100
              px-5
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:px-6
            "
                    >
                        <div className="flex flex-wrap items-center gap-3">
                            <p className="text-xs font-medium text-slate-500">
                                Showing{' '}
                                <span className="font-bold text-slate-700">
                                    {totalItems === 0
                                        ? 0
                                        : startIndex + 1}
                                </span>{' '}
                                to{' '}
                                <span className="font-bold text-slate-700">
                                    {endIndex}
                                </span>{' '}
                                of{' '}
                                <span className="font-bold text-slate-700">
                                    {totalItems}
                                </span>
                            </p>

                            <div className="h-4 w-px bg-slate-200" />

                            <label className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-500">
                                    Rows
                                </span>

                                <select
                                    value={itemsPerPage}
                                    onChange={(event) => {
                                        setItemsPerPage(
                                            Number(event.target.value)
                                        );

                                        setCurrentPage(1);
                                    }}
                                    className="
                    cursor-pointer
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-2.5
                    py-1.5
                    text-xs
                    font-bold
                    text-slate-700
                    outline-none
                    transition-colors
                    focus:border-lime-400
                  "
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                            </label>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                aria-label="Previous page"
                                disabled={currentPage <= 1}
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.max(1, page - 1)
                                    )
                                }
                                className="
                  flex
                  h-8
                  w-8
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-slate-500
                  transition-colors
                  hover:bg-slate-50
                  hover:text-slate-900
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            {pageItems.map(
                                (item, index) =>
                                    item === '...' ? (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="
                        flex
                        h-8
                        min-w-8
                        items-center
                        justify-center
                        px-1
                        text-xs
                        font-bold
                        text-slate-400
                      "
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() =>
                                                setCurrentPage(item)
                                            }
                                            className={`
                        flex
                        h-8
                        min-w-8
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-lg
                        px-2
                        text-xs
                        font-bold
                        transition-colors

                        ${item === currentPage
                                                    ? 'bg-lime-400 text-slate-900'
                                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                                }
                      `}
                                        >
                                            {item}
                                        </button>
                                    )
                            )}

                            <button
                                type="button"
                                aria-label="Next page"
                                disabled={
                                    currentPage >= totalPages
                                }
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.min(
                                            totalPages,
                                            page + 1
                                        )
                                    )
                                }
                                className="
                  flex
                  h-8
                  w-8
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-slate-500
                  transition-colors
                  hover:bg-slate-50
                  hover:text-slate-900
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}