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

    const getBookingId = (booking) => {
        return (
            booking?.bookingId ||
            booking?.bookingCode ||
            booking?.reference ||
            booking?._id ||
            booking?.id ||
            '—'
        );
    };

    const formatBookingId = (booking) => {
        const id = String(getBookingId(booking));

        if (id === '—') return id;

        if (
            id.startsWith('BK-') ||
            id.startsWith('bk-')
        ) {
            return id.toUpperCase();
        }

        if (id.length > 12) {
            return `#${id.slice(-8).toUpperCase()}`;
        }

        return id.startsWith('#')
            ? id
            : `#${id.toUpperCase()}`;
    };

    const getTurf = (booking) => {
        return (
            booking?.turf ||
            booking?.turfId ||
            {}
        );
    };

    const getTurfName = (booking) => {
        const turf = getTurf(booking);

        return (
            turf?.name ||
            booking?.turfName ||
            'Turf Booking'
        );
    };

    const getCourtName = (booking) => {
        return (
            booking?.court?.name ||
            booking?.courtName ||
            booking?.court?.title ||
            booking?.court ||
            booking?.pitch?.name ||
            booking?.pitchName ||
            ''
        );
    };

    const getTurfImage = (booking) => {
        const turf = getTurf(booking);

        const image =
            turf?.images?.[0] ||
            turf?.image ||
            turf?.coverImage ||
            turf?.thumbnail ||
            booking?.turfImage;

        if (!image) {
            return '';
        }

        if (typeof image === 'string') {
            return image;
        }

        return (
            image?.url ||
            image?.secure_url ||
            image?.src ||
            ''
        );
    };

    const getAmountValue = (booking) => {
        return (
            booking?.totalAmount ??
            booking?.totalPrice ??
            booking?.amount ??
            booking?.price ??
            booking?.payment?.amount
        );
    };

    const formatCurrency = (amount) => {
        if (
            amount === undefined ||
            amount === null ||
            amount === ''
        ) {
            return '—';
        }

        const numericAmount = Number(amount);

        if (Number.isNaN(numericAmount)) {
            return `NPR ${amount}`;
        }

        return `NPR ${numericAmount.toLocaleString()}`;
    };

    const getAmount = (booking) => {
        return formatCurrency(
            getAmountValue(booking)
        );
    };

    const getDepositAmount = (booking) => {
        const amount =
            booking?.depositAmount ??
            booking?.deposit ??
            booking?.paidAmount ??
            booking?.payment?.depositAmount ??
            booking?.payment?.paidAmount;

        if (
            amount === undefined ||
            amount === null ||
            amount === ''
        ) {
            return null;
        }

        return amount;
    };

    const getDueAmount = (booking) => {
        const explicitDue =
            booking?.dueAmount ??
            booking?.remainingAmount ??
            booking?.balanceAmount ??
            booking?.payment?.dueAmount ??
            booking?.payment?.remainingAmount;

        if (
            explicitDue !== undefined &&
            explicitDue !== null &&
            explicitDue !== ''
        ) {
            return explicitDue;
        }

        const total = Number(
            getAmountValue(booking)
        );

        const paid = Number(
            getDepositAmount(booking)
        );

        if (
            !Number.isNaN(total) &&
            !Number.isNaN(paid)
        ) {
            return Math.max(0, total - paid);
        }

        return null;
    };

    const getPaymentStatus = (booking) => {
        const explicitStatus =
            booking?.paymentStatus ||
            booking?.payment?.status;

        if (explicitStatus) {
            return explicitStatus;
        }

        const total = Number(
            getAmountValue(booking)
        );

        const paid = Number(
            getDepositAmount(booking)
        );

        if (
            !Number.isNaN(total) &&
            !Number.isNaN(paid) &&
            total > 0
        ) {
            if (paid >= total) {
                return 'Paid';
            }

            if (paid > 0) {
                return 'Partial';
            }

            return 'Unpaid';
        }

        return '';
    };

    const formatPaymentStatus = (status) => {
        if (!status) return '';

        return String(status)
            .replaceAll('_', ' ')
            .replace(/\b\w/g, (character) =>
                character.toUpperCase()
            );
    };

    const getBookingDateValue = (booking) => {
        return (
            booking?.date ||
            booking?.bookingDate ||
            booking?.slotDate
        );
    };

    const getDate = (booking) => {
        const date = getBookingDateValue(booking);

        if (!date) {
            return 'Date unavailable';
        }

        return formatNepalDateTime(date);
    };

    const getTime = (booking) => {
        const startTime =
            booking?.startTime ||
            booking?.slot?.startTime;

        const endTime =
            booking?.endTime ||
            booking?.slot?.endTime;

        if (!startTime) {
            return 'Time unavailable';
        }

        return endTime
            ? `${startTime} – ${endTime}`
            : startTime;
    };

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
                        <table className="w-full table-fixed border-collapse">
                            <colgroup>
                                <col className="w-[12%]" />
                                <col className="w-[24%]" />
                                <col className="w-[14%]" />
                                <col className="w-[18%]" />
                                <col className="w-[10%]" />
                                <col className="w-[10%]" />
                            </colgroup>

                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70">
                                    <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                                        Booking ID
                                    </th>

                                    <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                                        Venue
                                    </th>

                                    <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                                        Schedule
                                    </th>

                                    <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                                        Payment
                                    </th>

                                    <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {visibleBookings.map((booking) => {
                                    const bookingKey =
                                        booking?._id ||
                                        booking?.id ||
                                        getBookingId(booking);

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
                                            <td className="px-6 py-5 align-middle">
                                                <p className="truncate text-[13px] font-extrabold tracking-tight text-lime-700">
                                                    {formatBookingId(booking)}
                                                </p>
                                            </td>

                                            {/* 2. Venue */}
                                            <td className="px-4 py-5 align-middle">
                                                <div className="flex min-w-0 items-center gap-3">
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
                                                        <p className="truncate text-[13px] font-extrabold text-slate-900">
                                                            {turfName}
                                                        </p>

                                                        {courtName && (
                                                            <p className="mt-1 truncate text-[11px] font-medium text-slate-500">
                                                                {courtName}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* 3. Schedule */}
                                            <td className="px-4 py-5 align-middle">
                                                <div className="min-w-0">
                                                    <p className="truncate text-[12px] font-bold text-slate-900">
                                                        {getDate(booking)}
                                                    </p>

                                                    <p className="mt-1.5 truncate text-[11px] font-medium text-slate-500">
                                                        {getTime(booking)}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* 4. Payment */}
                                            <td className="px-4 py-5 align-middle">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="whitespace-nowrap text-[13px] font-extrabold text-slate-900">
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
                                                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                                                                {dueAmount !== null && (
                                                                    <span className="whitespace-nowrap text-[10px] font-semibold text-orange-600">
                                                                        Due{' '}
                                                                        {formatCurrency(
                                                                            dueAmount
                                                                        )}
                                                                    </span>
                                                                )}

                                                                {depositAmount !== null && (
                                                                    <span className="whitespace-nowrap text-[10px] font-semibold text-emerald-600">
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
                                            <td className="px-4 py-5 align-middle">
                                                <span
                                                    className={`
                            inline-flex
                            items-center
                            rounded-full
                            px-2.5
                            py-1.5
                            text-[10px]
                            font-bold
                            capitalize
                            ${getStatusStyles(
                                                        booking?.status
                                                    )}
                          `}
                                                >
                                                    {booking?.status ||
                                                        'Pending'}
                                                </span>
                                            </td>

                                            {/* 6. Action */}
                                            <td className="px-6 py-5 align-middle">
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
                              bg-lime-400
                              px-3.5
                              py-2
                              text-xs
                              font-bold
                              text-slate-900
                              transition-colors
                              hover:bg-lime-500
                            "
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />

                                                        View Details
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
                                booking?._id ||
                                booking?.id ||
                                getBookingId(booking);

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
                                        <p className="truncate text-[12px] font-extrabold tracking-tight text-lime-700">
                                            {formatBookingId(booking)}
                                        </p>

                                        <span
                                            className={`
                        shrink-0
                        rounded-full
                        px-2.5
                        py-1
                        text-[10px]
                        font-bold
                        capitalize
                        ${getStatusStyles(
                                                booking?.status
                                            )}
                      `}
                                        >
                                            {booking?.status ||
                                                'Pending'}
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
                                            <h3 className="truncate text-sm font-extrabold text-slate-900">
                                                {turfName}
                                            </h3>

                                            {courtName && (
                                                <p className="mt-1 truncate text-xs font-medium text-slate-500">
                                                    {courtName}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Schedule + Payment */}
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="rounded-lg bg-slate-50 p-3">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                                                Schedule
                                            </p>

                                            <p className="mt-1.5 text-[11px] font-bold text-slate-900">
                                                {getDate(booking)}
                                            </p>

                                            <p className="mt-1 text-[10px] font-medium text-slate-500">
                                                {getTime(booking)}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-slate-50 p-3">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                                                Payment
                                            </p>

                                            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                                <p className="text-[11px] font-extrabold text-slate-900">
                                                    {getAmount(booking)}
                                                </p>

                                                {paymentStatus && (
                                                    <span
                                                        className={`
                              rounded-full
                              px-1.5
                              py-0.5
                              text-[9px]
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
                                                            <p className="text-[9px] font-semibold text-orange-600">
                                                                Due{' '}
                                                                {formatCurrency(
                                                                    dueAmount
                                                                )}
                                                            </p>
                                                        )}

                                                        {depositAmount !== null && (
                                                            <p className="text-[9px] font-semibold text-emerald-600">
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
                      text-xs
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