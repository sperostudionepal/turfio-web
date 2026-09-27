import { useCallback, useEffect, useMemo, useState } from 'react';

import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';

import turfService from '../../../shared/services/turfService';

import {
  getTodayNepalString,
  processFutureSlots,
  parseSlotInterval,
  formatNepalDateTime,
} from '../../../shared/utils/dateTime';

import { buildPaymentRows } from '../../../shared/utils/paymentRecords';

import {
  getMaxDuration,
  buildSlotRange,
  suggestedPrice,
  parsePrice,
  defaultTeamSize,
} from '../../../shared/utils/manualBooking';

import { paidAmount } from '../../../shared/utils/dashboardStats';

import {
  deriveBookingStatus,
  getBookingDateStr,
} from '../../../shared/utils/bookingStatus';

import {
  getDateFilterRange,
  matchesDateRange,
  sortBookings,
  nextSort,
} from '../../../shared/utils/bookingFilters';

import {
  buildBookingsCsv,
  downloadCsv,
} from '../../../shared/utils/reportExport';

import CancelBookingDialog from '../../components/bookings/CancelBookingDialog';
import BookingFilters from '../../components/bookings/BookingFilters';
import BookingPageHeader from '../../components/bookings/BookingPageHeader';
import BookingPagination from '../../components/bookings/BookingPagination';
import BookingStats from '../../components/bookings/BookingStats';
import BookingsTable, {
  BookingStatusBadge,
} from '../../components/bookings/BookingsTable';
import ManualBookingModal from '../../components/bookings/ManualBookingModal';
import MarkPaidDialog from '../../components/bookings/MarkPaidDialog';
import BookingDetailsModal from '../../components/bookings/BookingDetailsModal';
import QRScannerModal from '../../components/bookings/QRScannerModal';

import { ErrorNotice } from '../../components/dashboard/DashboardNotices';
import BookingsPageSkeleton from '../../components/bookings/BookingsPageSkeleton';

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatDuration = (booking) => {
  const interval = parseSlotInterval(booking.timeSlot);

  const minutes =
    typeof booking.startMinutes === 'number' &&
      typeof booking.endMinutes === 'number'
      ? booking.endMinutes - booking.startMinutes
      : interval.endMinutes - interval.startMinutes;

  const hours = Math.max(0, minutes) / 60;

  return hours === 1
    ? '1 hr'
    : `${Number(hours.toFixed(2))} hrs`;
};

const mapServerBooking = (booking) => ({
  id: booking.bookingId || booking._id,
  bookingId: booking.bookingId || booking._id,
  invoiceId: booking.invoiceId || '',
  rawId: booking._id,

  customerName:
    booking.customerSnapshot?.name ||
    [booking.user?.firstName, booking.user?.lastName]
      .filter(Boolean)
      .join(' ') ||
    'Customer',

  customerPhone:
    booking.customerSnapshot?.phone ||
    booking.user?.phone ||
    '—',

  customerEmail:
    booking.customerSnapshot?.email ||
    booking.user?.email ||
    '—',

  avatar: booking.user?.profilePicture || '/logo.png',

  courtName:
    booking.court?.name ||
    booking.turf?.name ||
    'Court 1',

  courtDimension:
    booking.court?.dimension ||
    booking.court?.surface ||
    '5-a-side',

  courtImage:
    booking.court?.images?.[0] ||
    booking.turf?.images?.[0] ||
    booking.turf?.image ||
    '/logo.png',

  date:
    booking.dateStr ||
    new Date(booking.date).toLocaleDateString(),

  dateStr: getBookingDateStr(booking),

  startMinutes:
    typeof booking.startMinutes === 'number'
      ? booking.startMinutes
      : parseSlotInterval(booking.timeSlot).startMinutes,

  timeSlot: booking.timeSlot || '—',
  duration: formatDuration(booking),

  amount: Number(booking.totalAmount || 0),

  paid: paidAmount(booking),

  due: Math.max(
    0,
    Number(booking.totalAmount || 0) - paidAmount(booking)
  ),

  depositAmount: Number(booking.depositAmount || 0),
  remainingBalance: Number(booking.remainingBalance || 0),

  depositPaid: booking.depositPaid || false,
  paymentType: booking.paymentType || 'full',

  paymentMethod: booking.paymentMethod || '—',
  paymentStatus: booking.paymentStatus || 'Pending',

  bookingStatus: deriveBookingStatus(booking),

  bookedOn: formatNepalDateTime(booking.createdAt),

  confirmedAt: booking.confirmedAt || null,
  cancellationRequest: booking.cancellationRequest || null,
  refund: booking.refund || null,

  raw: booking,

  payments: buildPaymentRows([booking]),

  playersCount: booking.teamSize || 0,
});

const newManualForm = (courtId = '') => ({
  name: '',
  phone: '',
  email: '',
  courtId,
  date: getTodayNepalString(),
  timeSlot: '',
  durationHours: 1,
  matchType: '',
  teamSize: '',
  price: '',
  priceTouched: false,
  paymentStatus: 'Pending',
});

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

function BookingsPage({
  user,
  activeTab,
  setActiveTab,
  ownerBookings = [],
  refreshBookings,
  initialSearch = '',
  initialStatus = 'All',
  initialDateFilter = 'all',
  initialAddOpen = false,
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const [statusFilter, setStatusFilter] =
    useState(initialStatus);

  const [dateFilter, setDateFilter] =
    useState(initialDateFilter);

  const [courtFilter, setCourtFilter] =
    useState('All');

  const [paymentFilter, setPaymentFilter] =
    useState('All');

  const [customRange, setCustomRange] = useState({
    from: '',
    to: '',
  });

  const [sort, setSort] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(initialAddOpen);

  const [selectedId, setSelectedId] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(10);

  const [ownerTurf, setOwnerTurf] =
    useState(null);

  const [slotOptions, setSlotOptions] =
    useState([]);

  const [manualForm, setManualForm] =
    useState(() => newManualForm());

  const [saving, setSaving] =
    useState(false);

  const [formError, setFormError] =
    useState('');

  const [cancelTarget, setCancelTarget] =
    useState(null);

  const [paidTarget, setPaidTarget] =
    useState(null);

  const [loadStatus, setLoadStatus] =
    useState('loading');

  const [hasLoaded, setHasLoaded] =
    useState(false);

  const [isRetrying, setIsRetrying] =
    useState(false);

  const [bookings, setBookings] =
    useState([]);

  const [actionBusyId, setActionBusyId] =
    useState(null);

  const [actionError, setActionError] =
    useState('');

  const [showQRScanner, setShowQRScanner] =
    useState(false);

  const selectedBooking =
    bookings.find((booking) => booking.id === selectedId) ||
    null;

  const showSkeleton =
    loadStatus === 'loading' && !hasLoaded;

  /* ---------------------------------------------------------------------- */
  /* Load bookings                                                          */
  /* ---------------------------------------------------------------------- */

  const loadBookings = useCallback(
    () =>
      turfService
        .getOwnerBookings()
        .then((items) => {
          setBookings(items.map(mapServerBooking));
          setHasLoaded(true);
          setLoadStatus('ready');
        })
        .catch(() => {
          if (ownerBookings.length > 0) {
            setBookings((current) =>
              current.length > 0
                ? current
                : ownerBookings.map(mapServerBooking)
            );

            setHasLoaded(true);
          }

          setLoadStatus('error');
        }),
    [ownerBookings]
  );

  const retryLoad = async () => {
    setIsRetrying(true);
    await loadBookings();
    setIsRetrying(false);
  };

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    const reloadWhenVisible = () => {
      if (!document.hidden) {
        loadBookings();
      }
    };

    window.addEventListener(
      'focus',
      reloadWhenVisible
    );

    document.addEventListener(
      'visibilitychange',
      reloadWhenVisible
    );

    return () => {
      window.removeEventListener(
        'focus',
        reloadWhenVisible
      );

      document.removeEventListener(
        'visibilitychange',
        reloadWhenVisible
      );
    };
  }, [loadBookings]);

  /* ---------------------------------------------------------------------- */
  /* Turf                                                                   */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const userId = user?._id || user?.id;

    if (!userId) return;

    turfService
      .getTurfs({
        owner: userId,
        limit: 1,
      })
      .then((turfs) => {
        const turf = turfs[0] || null;

        setOwnerTurf(turf);

        if (
          turf?.courts &&
          turf.courts.length > 0
        ) {
          setManualForm((current) => ({
            ...current,
            courtId:
              current.courtId ||
              turf.courts[0]?._id ||
              turf.courts[0]?.id ||
              '',
          }));
        }
      });
  }, [user?._id, user?.id]);

  /* ---------------------------------------------------------------------- */
  /* Availability                                                           */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const turfId =
      ownerTurf?.id || ownerTurf?._id;

    if (!turfId) {
      const processed = processFutureSlots({
        openingHours:
          ownerTurf?.openingHours,
        dateStr: manualForm.date,
      });

      setSlotOptions(processed);

      const firstAvailable =
        processed.find(
          (slot) => slot.isAvailable
        );

      setManualForm((current) => ({
        ...current,
        timeSlot: processed.some(
          (slot) =>
            slot.value ===
            current.timeSlot &&
            slot.isAvailable
        )
          ? current.timeSlot
          : firstAvailable?.value || '',
      }));

      return;
    }

    turfService
      .getTurfAvailability(
        turfId,
        manualForm.date,
        manualForm.courtId
      )
      .then((availability) => {
        const processed =
          processFutureSlots({
            slots:
              availability?.slots ||
              [],
            openingHours:
              availability?.openingHours ||
              ownerTurf?.openingHours,
            occupiedIntervals:
              availability?.occupiedIntervals ||
              [],
            dateStr:
              manualForm.date,
          });

        setSlotOptions(processed);

        const firstAvailable =
          processed.find(
            (slot) =>
              slot.isAvailable
          );

        setManualForm((current) => ({
          ...current,
          timeSlot: processed.some(
            (slot) =>
              slot.value ===
              current.timeSlot &&
              slot.isAvailable
          )
            ? current.timeSlot
            : firstAvailable?.value ||
            '',
        }));
      })
      .catch(() => {
        const processed =
          processFutureSlots({
            openingHours:
              ownerTurf?.openingHours,
            dateStr:
              manualForm.date,
          });

        setSlotOptions(processed);

        const firstAvailable =
          processed.find(
            (slot) =>
              slot.isAvailable
          );

        setManualForm((current) => ({
          ...current,
          timeSlot: processed.some(
            (slot) =>
              slot.value ===
              current.timeSlot &&
              slot.isAvailable
          )
            ? current.timeSlot
            : firstAvailable?.value ||
            '',
        }));
      });
  }, [
    ownerTurf?.id,
    ownerTurf?._id,
    manualForm.date,
    manualForm.courtId,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Manual booking values                                                  */
  /* ---------------------------------------------------------------------- */

  const courts = ownerTurf?.courts || [];

  const selectedCourt =
    courts.find(
      (court) =>
        (court._id || court.id) ===
        manualForm.courtId
    ) || courts[0];

  const hourlyRate = Number(
    selectedCourt?.hourlyRate ||
    ownerTurf?.pricePerHour ||
    1200
  );

  const selectedSlot =
    slotOptions.find(
      (slot) =>
        slot.value ===
        manualForm.timeSlot
    ) || null;

  const maxDuration = getMaxDuration(
    slotOptions,
    manualForm.timeSlot
  );

  const duration = Math.max(
    1,
    Math.min(
      manualForm.durationHours,
      maxDuration || 1
    )
  );

  const matchTypes =
    ownerTurf?.matchTypes?.length
      ? ownerTurf.matchTypes
      : ['5v5', '7v7', '11v11'];

  const matchType =
    matchTypes.includes(
      manualForm.matchType
    )
      ? manualForm.matchType
      : matchTypes[0];

  const teamSizeValue =
    manualForm.teamSize !== ''
      ? manualForm.teamSize
      : String(
        defaultTeamSize(matchType)
      );

  const autoPrice = suggestedPrice(
    hourlyRate,
    duration
  );

  const priceValue =
    manualForm.priceTouched
      ? manualForm.price
      : String(autoPrice);

  const slotRange = selectedSlot
    ? buildSlotRange(
      selectedSlot.startMinutes,
      duration
    )
    : null;

  /* ---------------------------------------------------------------------- */
  /* Actions                                                                */
  /* ---------------------------------------------------------------------- */

  const handleConfirm = async (booking) => {
    if (!booking) return;

    setActionBusyId(booking.id);
    setActionError('');

    try {
      await turfService.confirmBooking(
        booking.rawId || booking.id
      );

      await loadBookings();

      if (refreshBookings) {
        refreshBookings();
      }
    } catch (error) {
      setActionError(
        error.message ||
        'Could not confirm booking.'
      );
    } finally {
      setActionBusyId(null);
    }
  };

  const handleMarkPaidConfirmed =
    async () => {
      const booking = paidTarget;

      if (!booking) return;

      setActionBusyId(booking.id);
      setActionError('');

      try {
        await turfService.markBookingPaid(
          booking.rawId ||
          booking.id
        );

        await loadBookings();

        if (refreshBookings) {
          refreshBookings();
        }
      } catch (error) {
        setActionError(
          error.message ||
          'Could not record the payment.'
        );
      } finally {
        setActionBusyId(null);
        setPaidTarget(null);
      }
    };

  const handleCancelConfirmed =
    async () => {
      const booking = cancelTarget;

      if (!booking) return;

      setActionBusyId(booking.id);
      setActionError('');

      try {
        await turfService.cancelBooking(
          booking.rawId ||
          booking.id
        );

        await loadBookings();

        if (refreshBookings) {
          refreshBookings();
        }

        setCancelTarget(null);
      } catch (error) {
        setActionError(
          error.message ||
          'Could not cancel booking.'
        );

        setCancelTarget(null);
      } finally {
        setActionBusyId(null);
      }
    };

  const handleApproveCancellation =
    async (bookingId, reviewNotes) => {
      try {
        await turfService.approveCancellation(
          bookingId,
          reviewNotes
        );

        await loadBookings();

        if (refreshBookings) {
          refreshBookings();
        }
      } catch (error) {
        throw new Error(
          error.response?.data
            ?.message ||
          'Failed to approve cancellation',
          { cause: error }
        );
      }
    };

  const handleRejectCancellation =
    async (bookingId, reviewNotes) => {
      try {
        await turfService.rejectCancellation(
          bookingId,
          reviewNotes
        );

        await loadBookings();

        if (refreshBookings) {
          refreshBookings();
        }
      } catch (error) {
        throw new Error(
          error.response?.data
            ?.message ||
          'Failed to reject cancellation',
          { cause: error }
        );
      }
    };

  const handleQRScanSuccess =
    async () => {
      await loadBookings();

      if (refreshBookings) {
        refreshBookings();
      }
    };

  /* ---------------------------------------------------------------------- */
  /* Manual booking                                                         */
  /* ---------------------------------------------------------------------- */

  const saveManualBooking = async (
    event
  ) => {
    event.preventDefault();

    setSaving(true);
    setFormError('');

    try {
      const turfId =
        ownerTurf?.id ||
        ownerTurf?._id;

      if (!turfId || !slotRange) {
        throw new Error(
          'Select an available date and future start time.'
        );
      }

      const totalAmount =
        parsePrice(priceValue);

      if (totalAmount === null) {
        throw new Error(
          'Enter a total price greater than 0.'
        );
      }

      const teamSize =
        Number(teamSizeValue);

      if (
        !Number.isInteger(teamSize) ||
        teamSize < 1 ||
        teamSize > 60
      ) {
        throw new Error(
          'Players must be a whole number from 1 to 60.'
        );
      }

      await turfService.createManualBooking(
        {
          turf: turfId,

          court: selectedCourt
            ? {
              id:
                selectedCourt._id ||
                selectedCourt.id,
              name:
                selectedCourt.name,
              courtNumber:
                selectedCourt.courtNumber,
              dimension:
                selectedCourt.dimension,
              surface:
                selectedCourt.surface,
              hourlyRate,
            }
            : null,

          courtId:
            selectedCourt?._id ||
            selectedCourt?.id ||
            null,

          customer: {
            name: manualForm.name,
            phone:
              manualForm.phone,
            email:
              manualForm.email,
          },

          date: manualForm.date,

          timeSlot:
            slotRange.timeSlot,

          startMinutes:
            slotRange.startMinutes,

          endMinutes:
            slotRange.endMinutes,

          matchType,
          teamSize,
          totalAmount,

          paymentMethod:
            'Pay at Venue',

          paymentStatus:
            manualForm.paymentStatus,

          paymentType: 'venue',
        }
      );

      await loadBookings();

      if (refreshBookings) {
        refreshBookings();
      }

      setIsAddModalOpen(false);

      setManualForm(
        newManualForm(
          selectedCourt?._id ||
          selectedCourt?.id ||
          ''
        )
      );
    } catch (error) {
      setFormError(
        error.message ||
        'Could not save booking.'
      );
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Counts                                                                 */
  /* ---------------------------------------------------------------------- */

  const statusCounts = useMemo(() => {
    const count = (status) =>
      bookings.filter(
        (booking) =>
          booking.bookingStatus ===
          status
      ).length;

    return {
      All: bookings.length,
      Confirmed: count('Confirmed'),
      Completed: count('Completed'),
      Cancelled: count('Cancelled'),
    };
  }, [bookings]);

  const confirmedCount =
    statusCounts.Confirmed;

  const completedCount =
    statusCounts.Completed;

  const cancelledCount =
    statusCounts.Cancelled;

  const activeTotal = Math.max(1, bookings.length);

  const percentage = (value) =>
    `${Math.round(
      (value / activeTotal) * 100
    )}%`;

  /* ---------------------------------------------------------------------- */
  /* Filters                                                                */
  /* ---------------------------------------------------------------------- */

  const uniqueCourts = useMemo(
    () =>
      [
        ...new Set(
          bookings
            .map(
              (booking) =>
                booking.courtName
            )
            .filter(Boolean)
        ),
      ].sort(),
    [bookings]
  );

  const paymentMethods = useMemo(
    () =>
      [
        ...new Set(
          bookings
            .map(
              (booking) =>
                booking.paymentMethod
            )
            .filter(Boolean)
        ),
      ].sort(),
    [bookings]
  );

  const dateRange = getDateFilterRange(
    dateFilter,
    customRange
  );

  const matchingBookings =
    bookings.filter((booking) => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      const matchesSearch =
        !query ||
        booking.customerName
          .toLowerCase()
          .includes(query) ||
        booking.id
          .toLowerCase()
          .includes(query) ||
        booking.customerPhone
          .toLowerCase()
          .includes(query) ||
        booking.courtName
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === 'All' ||
        booking.bookingStatus ===
        statusFilter;

      const matchesCourt =
        courtFilter === 'All' ||
        booking.courtName ===
        courtFilter;

      const matchesPayment =
        paymentFilter === 'All' ||
        booking.paymentMethod ===
        paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCourt &&
        matchesPayment &&
        matchesDateRange(
          booking.dateStr,
          dateRange
        )
      );
    });

  const filteredBookings =
    sortBookings(
      matchingBookings,
      sort
    );

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== 'All' ||
    dateFilter !== 'all' ||
    courtFilter !== 'All' ||
    paymentFilter !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setDateFilter('all');
    setCourtFilter('All');
    setPaymentFilter('All');

    setCustomRange({
      from: '',
      to: '',
    });

    setCurrentPage(1);
  };

  /* ---------------------------------------------------------------------- */
  /* Export                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleExport = () => {
    if (
      filteredBookings.length === 0
    ) {
      return;
    }

    const name = hasActiveFilters
      ? 'turfio-bookings-filtered'
      : 'turfio-bookings';

    downloadCsv(
      `${name}-${getTodayNepalString()}.csv`,
      buildBookingsCsv(
        filteredBookings.map(
          (booking) =>
            booking.raw
        ),
        null,
        {
          sort: false,
        }
      )
    );
  };

  /* ---------------------------------------------------------------------- */
  /* Pagination                                                             */
  /* ---------------------------------------------------------------------- */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredBookings.length /
      itemsPerPage
    )
  );

  const page = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (page - 1) * itemsPerPage;

  const paginatedBookings =
    filteredBookings.slice(
      startIndex,
      startIndex +
      itemsPerPage
    );

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      <div className="relative flex h-screen flex-col overflow-hidden bg-white font-sans text-slate-900 antialiased select-none">
        <TopBar />

        <div className="relative flex min-h-0 flex-1">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={
              setActiveTab
            }
          />

          <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="scrollbar-thin flex-1 overflow-y-auto">
              <div className="mx-auto w-full space-y-6 px-5 py-6 md:px-6 md:py-7 xl:px-7">
                <BookingPageHeader
                  filteredBookingsCount={filteredBookings.length}
                  onExport={handleExport}
                  onShowQRScanner={() => setShowQRScanner(true)}
                  onOpenBookingModal={() => setIsAddModalOpen(true)}
                />

                {showSkeleton ? (
                  <BookingsPageSkeleton />
                ) : (
                  <>
                    <BookingStats
                      bookingsCount={bookings.length}
                      confirmedCount={confirmedCount}
                      completedCount={completedCount}
                      cancelledCount={cancelledCount}
                      percentage={percentage}
                    />

                    <div className="overflow-visible rounded-xl border border-slate-100 bg-white shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
                  <BookingFilters
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    dateFilter={dateFilter}
                    courtFilter={courtFilter}
                    paymentFilter={paymentFilter}
                    customRange={customRange}
                    uniqueCourts={uniqueCourts}
                    paymentMethods={paymentMethods}
                    statusCounts={statusCounts}
                    hasActiveFilters={hasActiveFilters}
                    onSearchChange={(value) => {
                      setSearchQuery(value);
                      setCurrentPage(1);
                    }}
                    onStatusFilterChange={(value) => {
                      setStatusFilter(value);
                      setCurrentPage(1);
                    }}
                    onDateFilterChange={(value) => {
                      setDateFilter(value);
                      setCurrentPage(1);
                    }}
                    onCourtFilterChange={(value) => {
                      setCourtFilter(value);
                      setCurrentPage(1);
                    }}
                    onPaymentFilterChange={(value) => {
                      setPaymentFilter(value);
                      setCurrentPage(1);
                    }}
                    onCustomRangeApply={(range) => {
                      setCustomRange(range);
                      setCurrentPage(1);
                    }}
                    onClearFilters={clearFilters}
                  />

                  {loadStatus === 'error' && (
                    <div className="px-5 pt-4">
                      <ErrorNotice
                        message={
                          hasLoaded
                            ? "Couldn't refresh your bookings. Showing the last data that loaded."
                            : "Couldn't load your bookings."
                        }
                        onRetry={retryLoad}
                        busy={isRetrying}
                      />
                    </div>
                  )}

                  {actionError && (
                    <div className="px-5 pt-4">
                      <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-[11px] font-bold text-rose-600">
                        {actionError}
                      </p>
                    </div>
                  )}

                  <BookingsTable
                    bookings={bookings}
                    paginatedBookings={paginatedBookings}
                    showSkeleton={false}
                    sort={sort}
                    onClearFilters={clearFilters}
                    onSelectBooking={(booking) => {
                      setActionError('');
                      setSelectedId(booking.id);
                    }}
                    onSort={(key) => {
                      setSort((current) => nextSort(current, key));
                      setCurrentPage(1);
                    }}
                  />

                      <BookingPagination
                        filteredBookingsCount={filteredBookings.length}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={(value) => {
                          setItemsPerPage(Number(value));
                          setCurrentPage(1);
                        }}
                        onPageChange={setCurrentPage}
                        page={page}
                        startIndex={startIndex}
                        totalPages={totalPages}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Details */}
      <BookingDetailsModal
        booking={selectedBooking}
        statusBadge={
          selectedBooking
            ? <BookingStatusBadge
              status={selectedBooking.bookingStatus}
            />
            : null
        }
        busy={
          Boolean(selectedBooking) &&
          actionBusyId ===
          selectedBooking?.id
        }
        error={actionError}
        onClose={() => {
          setSelectedId(null);
          setActionError('');
        }}
        onConfirm={() =>
          handleConfirm(
            selectedBooking
          )
        }
        onMarkPaid={() =>
          setPaidTarget(
            selectedBooking
          )
        }
        onCancel={() =>
          setCancelTarget(
            selectedBooking
          )
        }
        onApproveCancellation={
          handleApproveCancellation
        }
        onRejectCancellation={
          handleRejectCancellation
        }
      />

      <MarkPaidDialog
        booking={paidTarget}
        busy={
          Boolean(paidTarget) &&
          actionBusyId ===
          paidTarget?.id
        }
        onKeep={() =>
          setPaidTarget(null)
        }
        onConfirm={
          handleMarkPaidConfirmed
        }
      />

      <CancelBookingDialog
        booking={cancelTarget}
        busy={
          Boolean(cancelTarget) &&
          actionBusyId ===
          cancelTarget?.id
        }
        onKeep={() =>
          setCancelTarget(null)
        }
        onConfirm={
          handleCancelConfirmed
        }
      />

      <ManualBookingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={saveManualBooking}
        manualForm={manualForm}
        setManualForm={setManualForm}
        saving={saving}
        formError={formError}
        ownerTurf={ownerTurf}
        slotOptions={slotOptions}
        duration={duration}
        selectedSlot={selectedSlot}
        maxDuration={maxDuration}
        slotRange={slotRange}
        matchType={matchType}
        matchTypes={matchTypes}
        teamSizeValue={teamSizeValue}
        priceValue={priceValue}
        hourlyRate={hourlyRate}
        autoPrice={autoPrice}
      />

      {showQRScanner && (
        <QRScannerModal
          onClose={() =>
            setShowQRScanner(
              false
            )
          }
          onScanSuccess={
            handleQRScanSuccess
          }
        />
      )}
    </>
  );
}

export default BookingsPage;