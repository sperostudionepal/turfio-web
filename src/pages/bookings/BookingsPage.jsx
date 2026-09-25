import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Plus,
  Search,
  Calendar as CalendarIcon,
  CircleDot,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  X,
  Banknote,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  QrCode,
} from 'lucide-react';
import turfService from '../../services/turfService';
import CustomDatePicker from '../../components/common/CustomDatePicker';
import CustomDropdown from '../../components/common/CustomDropdown';
import { getTodayNepalString, processFutureSlots, parseSlotInterval, formatNepalDateTime } from '../../utils/dateTime';
import { buildPaymentRows } from '../../utils/paymentRecords';
import { getMaxDuration, buildSlotRange, suggestedPrice, parsePrice, defaultTeamSize, MAX_DURATION_HOURS } from '../../utils/manualBooking';
import { getPageItems } from '../../utils/pagination';
import { canConfirm, canMarkPaid, canCancel } from '../../utils/bookingActions';
import { paidAmount } from '../../utils/dashboardStats';
import { deriveBookingStatus, getBookingDateStr } from '../../utils/bookingStatus';
import { DATE_FILTER_OPTIONS, getDateFilterRange, matchesDateRange, sortBookings, nextSort } from '../../utils/bookingFilters';
import { buildBookingsCsv, downloadCsv } from '../../utils/reportExport';
import CancelBookingDialog from '../../components/bookings/CancelBookingDialog';
import MarkPaidDialog from '../../components/bookings/MarkPaidDialog';
import BookingDetailsModal from '../../components/bookings/BookingDetailsModal';
import QRScannerModal from '../../components/bookings/QRScannerModal';
import { ErrorNotice } from '../../components/dashboard/DashboardNotices';
import PeriodSelect from '../../components/dashboard/PeriodSelect';

const formatDuration = (booking) => {
  const interval = parseSlotInterval(booking.timeSlot);
  const minutes =
    typeof booking.startMinutes === 'number' && typeof booking.endMinutes === 'number'
      ? booking.endMinutes - booking.startMinutes
      : interval.endMinutes - interval.startMinutes;
  const hours = Math.max(0, minutes) / 60;
  return hours === 1 ? '1 Hour' : `${Number(hours.toFixed(2))} Hours`;
};

const mapServerBooking = (booking) => ({
  id: booking.bookingId || booking._id,
  bookingId: booking.bookingId || booking._id,
  invoiceId: booking.invoiceId || '',
  rawId: booking._id,
  customerName: booking.customerSnapshot?.name || [booking.user?.firstName, booking.user?.lastName].filter(Boolean).join(' ') || 'Customer',
  customerPhone: booking.customerSnapshot?.phone || booking.user?.phone || '—',
  customerEmail: booking.customerSnapshot?.email || booking.user?.email || '—',
  avatar: booking.user?.profilePicture || '/logo.png',
  courtName: booking.court?.name || booking.turf?.name || 'Court 1',
  courtDimension: booking.court?.dimension || '',
  date: booking.dateStr || new Date(booking.date).toLocaleDateString(),
  dateStr: getBookingDateStr(booking),
  startMinutes:
    typeof booking.startMinutes === 'number' ? booking.startMinutes : parseSlotInterval(booking.timeSlot).startMinutes,
  timeSlot: booking.timeSlot || '—',
  duration: formatDuration(booking),
  amount: Number(booking.totalAmount || 0),
  paid: paidAmount(booking),
  due: Math.max(0, Number(booking.totalAmount || 0) - paidAmount(booking)),
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
  raw: booking, // the untouched server booking, used by the CSV export
  payments: buildPaymentRows([booking]),
  playersCount: booking.teamSize || 0,
});

// Blank New Booking form. price stays "auto" (court rate x hours) until the owner edits it.
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
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [dateFilter, setDateFilter] = useState(initialDateFilter);
  const [customRange, setCustomRange] = useState({ from: '', to: '' });
  const [sort, setSort] = useState(null); // { key, dir } or null for the server's order (newest match first)
  const [isAddModalOpen, setIsAddModalOpen] = useState(initialAddOpen);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [ownerTurf, setOwnerTurf] = useState(null);
  const [slotOptions, setSlotOptions] = useState([]);
  const [manualForm, setManualForm] = useState(() => newManualForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [paidTarget, setPaidTarget] = useState(null);
  const [loadStatus, setLoadStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [bookings, setBookings] = useState([]);
  const selectedBooking = bookings.find((b) => b.id === selectedId) || null;
  const [actionBusyId, setActionBusyId] = useState(null);
  const [actionError, setActionError] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Headline numbers from the real bookings. Cancelled and Refunded bookings don't count towards active stats.
  const liveBookings = bookings.filter((b) => b.bookingStatus !== 'Cancelled' && b.bookingStatus !== 'Refunded');
  const refundedCount = bookings.filter((b) => b.bookingStatus === 'Refunded').length;
  const cancelledCount = bookings.filter((b) => b.bookingStatus === 'Cancelled').length;
  const stats = [
    {
      title: 'Total Bookings',
      value: liveBookings.length.toLocaleString(),
      subtext: refundedCount > 0 ? `${cancelledCount} cancelled · ${refundedCount} refunded` : `${cancelledCount} cancelled`,
      icon: CalendarIcon,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Confirmed Slots',
      value: liveBookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Completed').length.toLocaleString(),
      subtext: 'reserved for players',
      icon: CheckCircle2,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Pending Confirmation',
      value: liveBookings.filter((b) => b.bookingStatus === 'Pending').length.toLocaleString(),
      subtext: 'waiting for you',
      icon: AlertCircle,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Gross Revenue',
      value: `NRs. ${liveBookings.reduce((sum, b) => sum + b.paid, 0).toLocaleString('en-NP')}`,
      subtext: `Due: NRs. ${liveBookings.reduce((sum, b) => sum + b.due, 0).toLocaleString('en-NP')}`,
      icon: DollarSign,
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];
  const showSkeleton = loadStatus === 'loading' && !hasLoaded;

  const loadBookings = () =>
    turfService.getOwnerBookings().then((items) => {
      setBookings(items.map(mapServerBooking));
      setHasLoaded(true);
      setLoadStatus('ready');
    }).catch(() => {
      // Fall back to the dashboard's copy of the list rather than an empty page
      if (ownerBookings.length > 0) {
        setBookings((current) => (current.length > 0 ? current : ownerBookings.map(mapServerBooking)));
        setHasLoaded(true);
      }
      setLoadStatus('error');
    });

  const retryLoad = async () => {
    setIsRetrying(true);
    await loadBookings();
    setIsRetrying(false);
  };

  useEffect(() => {
    loadBookings();
  }, [ownerBookings.length]);

  const handleConfirm = async (booking) => {
    setActionBusyId(booking.id);
    setActionError('');
    try {
      await turfService.confirmBooking(booking.rawId || booking.id);
      await loadBookings();
      if (refreshBookings) refreshBookings(); // keep the dashboard's counts (sidebar badge etc.) in step
    } catch (error) {
      setActionError(error.message || 'Could not confirm booking.');
    } finally {
      setActionBusyId(null);
    }
  };

  const handleMarkPaidConfirmed = async () => {
    const booking = paidTarget;
    if (!booking) return;
    setActionBusyId(booking.id);
    setActionError('');
    try {
      await turfService.markBookingPaid(booking.rawId || booking.id);
      await loadBookings();
      if (refreshBookings) refreshBookings();
    } catch (error) {
      setActionError(error.message || 'Could not record the payment.');
    } finally {
      setActionBusyId(null);
      setPaidTarget(null);
    }
  };

  const handleCancelConfirmed = async () => {
    const booking = cancelTarget;
    if (!booking) return;
    setActionBusyId(booking.id);
    setActionError('');
    try {
      await turfService.cancelBooking(booking.rawId || booking.id);
      await loadBookings();
      if (refreshBookings) refreshBookings();
      setCancelTarget(null);
    } catch (error) {
      setActionError(error.message || 'Could not cancel booking.');
      setCancelTarget(null);
    } finally {
      setActionBusyId(null);
    }
  };

  const handleApproveCancellation = async (bookingId, reviewNotes) => {
    try {
      await turfService.approveCancellation(bookingId, reviewNotes);
      await loadBookings();
      if (refreshBookings) refreshBookings();
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to approve cancellation', { cause: error });
    }
  };

  const handleRejectCancellation = async (bookingId, reviewNotes) => {
    try {
      await turfService.rejectCancellation(bookingId, reviewNotes);
      await loadBookings();
      if (refreshBookings) refreshBookings();
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reject cancellation', { cause: error });
    }
  };

  const handleQRScanSuccess = async () => {
    // Refresh bookings list after successful check-in
    await loadBookings();
    if (refreshBookings) refreshBookings();
  };

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    turfService.getTurfs({ owner: userId, limit: 1 }).then((turfs) => {
      const turf = turfs[0] || null;
      setOwnerTurf(turf);
      if (turf?.courts && turf.courts.length > 0) {
        setManualForm((curr) => ({
          ...curr,
          courtId: curr.courtId || turf.courts[0]?._id || turf.courts[0]?.id || '',
        }));
      }
    });
  }, [user?._id, user?.id]);

  useEffect(() => {
    const turfId = ownerTurf?.id || ownerTurf?._id;
    if (!turfId) {
      const processed = processFutureSlots({
        openingHours: ownerTurf?.openingHours,
        dateStr: manualForm.date,
      });
      setSlotOptions(processed);
      const firstAvail = processed.find((s) => s.isAvailable);
      setManualForm((curr) => ({
        ...curr,
        timeSlot: processed.some((s) => s.value === curr.timeSlot && s.isAvailable)
          ? curr.timeSlot
          : firstAvail?.value || '',
      }));
      return;
    }

    turfService.getTurfAvailability(turfId, manualForm.date, manualForm.courtId)
      .then((availability) => {
        const rawSlots = availability?.slots || [];
        const processed = processFutureSlots({
          slots: rawSlots,
          openingHours: availability?.openingHours || ownerTurf?.openingHours,
          occupiedIntervals: availability?.occupiedIntervals || [],
          dateStr: manualForm.date,
        });
        setSlotOptions(processed);
        const firstAvail = processed.find((s) => s.isAvailable);
        setManualForm((curr) => ({
          ...curr,
          timeSlot: processed.some((s) => s.value === curr.timeSlot && s.isAvailable)
            ? curr.timeSlot
            : firstAvail?.value || '',
        }));
      })
      .catch(() => {
        const processed = processFutureSlots({
          openingHours: ownerTurf?.openingHours,
          dateStr: manualForm.date,
        });
        setSlotOptions(processed);
        const firstAvail = processed.find((s) => s.isAvailable);
        setManualForm((curr) => ({
          ...curr,
          timeSlot: processed.some((s) => s.value === curr.timeSlot && s.isAvailable)
            ? curr.timeSlot
            : firstAvail?.value || '',
        }));
      });
  }, [ownerTurf?.id, ownerTurf?._id, manualForm.date, manualForm.courtId]);

  // ---- New Booking form: values derived from the form, the venue and the day's availability
  const courts = ownerTurf?.courts || [];
  const selectedCourt = courts.find((c) => (c._id || c.id) === manualForm.courtId) || courts[0];
  const hourlyRate = Number(selectedCourt?.hourlyRate || ownerTurf?.pricePerHour || 1200);
  const selectedSlot = slotOptions.find((slot) => slot.value === manualForm.timeSlot) || null;
  const maxDuration = getMaxDuration(slotOptions, manualForm.timeSlot); // hours free back-to-back from this start
  const duration = Math.max(1, Math.min(manualForm.durationHours, maxDuration || 1));
  const matchTypes = ownerTurf?.matchTypes?.length ? ownerTurf.matchTypes : ['5v5', '7v7', '11v11'];
  const matchType = matchTypes.includes(manualForm.matchType) ? manualForm.matchType : matchTypes[0];
  const teamSizeValue = manualForm.teamSize !== '' ? manualForm.teamSize : String(defaultTeamSize(matchType));
  const autoPrice = suggestedPrice(hourlyRate, duration);
  const priceValue = manualForm.priceTouched ? manualForm.price : String(autoPrice);
  const slotRange = selectedSlot ? buildSlotRange(selectedSlot.startMinutes, duration) : null;

  const saveManualBooking = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const turfId = ownerTurf?.id || ownerTurf?._id;
      if (!turfId || !slotRange) throw new Error('Select an available date and future start time.');

      const totalAmount = parsePrice(priceValue);
      if (totalAmount === null) throw new Error('Enter a total price greater than 0.');
      const teamSize = Number(teamSizeValue);
      if (!Number.isInteger(teamSize) || teamSize < 1 || teamSize > 60) throw new Error('Players must be a whole number from 1 to 60.');

      await turfService.createManualBooking({
        turf: turfId,
        court: selectedCourt ? {
          id: selectedCourt._id || selectedCourt.id,
          name: selectedCourt.name,
          courtNumber: selectedCourt.courtNumber,
          dimension: selectedCourt.dimension,
          surface: selectedCourt.surface,
          hourlyRate,
        } : null,
        courtId: selectedCourt?._id || selectedCourt?.id || null,
        customer: { name: manualForm.name, phone: manualForm.phone, email: manualForm.email },
        date: manualForm.date,
        // A real range plus exact minutes: the server checks the whole range is free, not just the first hour
        timeSlot: slotRange.timeSlot,
        startMinutes: slotRange.startMinutes,
        endMinutes: slotRange.endMinutes,
        matchType,
        teamSize,
        totalAmount,
        paymentMethod: 'Pay at Venue',
        paymentStatus: manualForm.paymentStatus,
        paymentType: 'venue',
      });
      await loadBookings();
      if (refreshBookings) refreshBookings();
      setIsAddModalOpen(false);
      setManualForm(newManualForm(selectedCourt?._id || selectedCourt?.id || ''));
    } catch (error) {
      setFormError(error.message || 'Could not save booking.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ongoing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 w-fit">
            <CircleDot size={13} className="animate-pulse" /> Ongoing
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 w-fit">
            <CheckCircle2 size={13} /> Confirmed
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 w-fit">
            <CheckCircle2 size={13} /> Completed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 w-fit">
            <AlertCircle size={13} /> Pending
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600 w-fit">
            <CheckCircle2 size={13} /> Refunded
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 w-fit">
            <XCircle size={13} /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const dateRange = getDateFilterRange(dateFilter, customRange);
  const matchingBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.courtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(b.date).includes(searchQuery.trim());
    const matchesStatus = statusFilter === 'All' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus && matchesDateRange(b.dateStr, dateRange);
  });
  const filteredBookings = sortBookings(matchingBookings, sort);
  const hasActiveFilters = Boolean(searchQuery.trim()) || statusFilter !== 'All' || dateFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setDateFilter('all');
    setCustomRange({ from: '', to: '' });
    setCurrentPage(1);
  };

  // Exports what the table is showing (all pages of the current search/status/date filter, in the current order)
  const handleExport = () => {
    if (filteredBookings.length === 0) return;
    const name = hasActiveFilters ? 'turfio-bookings-filtered' : 'turfio-bookings';
    downloadCsv(`${name}-${getTodayNepalString()}.csv`, buildBookingsCsv(filteredBookings.map((b) => b.raw), null, { sort: false }));
  };

  // Sortable column header: click cycles ascending, descending, then back to the default order
  const sortHeader = (label, key, className = 'pb-3 pr-4') => {
    const active = sort?.key === key;
    const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown;
    return (
      <th className={className} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
        <button
          type="button"
          onClick={() => {
            setSort((current) => nextSort(current, key));
            setCurrentPage(1);
          }}
          className={`inline-flex items-center gap-1 uppercase tracking-wider transition-colors cursor-pointer hover:text-slate-700 ${active ? 'text-slate-700' : ''}`}
        >
          {label}
          <Icon size={12} className={active ? 'text-emerald-600' : 'text-slate-300'} />
        </button>
      </th>
    );
  };

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="flex flex-col h-screen bg-[#f3f5fc] text-slate-900 font-sans antialiased overflow-hidden select-none relative">
      {/* Top Header Bar across full window width */}
      <TopBar />

      {/* Main Body Section: Left Sidebar + Right Content Area */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Soft Ambient Background Orbs */}
        <div className="absolute top-[45%] right-[35%] w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-[160px] pointer-events-none" />

        {/* Floating Left Glass Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Floating Right Main Glass Container */}
        <div className="flex-1 flex flex-col min-w-0 backdrop-blur-md overflow-hidden relative z-10">
          {/* Scrollable Main Area */}
          <main className="flex-1 overflow-y-auto space-y-4 scrollbar-thin p-4">
            {/* Header Action Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Futsal Court Bookings
                </h1>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                  Manage court reservations, customer time slots, and booking statuses.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  disabled={filteredBookings.length === 0}
                  title={
                    filteredBookings.length === 0
                      ? 'No bookings to export'
                      : `Download ${filteredBookings.length} booking${filteredBookings.length === 1 ? '' : 's'} as CSV${hasActiveFilters ? ' (current filters)' : ''}`
                  }
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 text-xs font-semibold text-slate-700 hover:bg-white transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={14} className="text-slate-500" />
                  <span>Export Bookings</span>
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                >
                  <Plus size={15} />
                  <span>New Booking</span>
                </button>
                <button
                  onClick={() => setShowQRScanner(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 text-xs font-bold transition-all"
                >
                  <QrCode size={15} />
                  <span>Scan QR</span>
                </button>
              </div>
            </div>

            {/* Top Row: 4 Metric Cards (computed from the real bookings) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.title}
                    className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-5 flex items-center gap-3 shadow-xs hover:shadow-md hover:bg-white/80 transition-all"
                  >
                    <div className={`p-3.5 rounded-2xl shrink-0 ${stat.iconBg}`}>
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[12px] font-semibold text-slate-400 block leading-tight">{stat.title}</span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-1 truncate">
                        {showSkeleton ? <span className="inline-block h-6 w-16 rounded-lg bg-slate-100 animate-pulse align-middle" /> : stat.value}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium block mt-0.5 truncate">
                        {showSkeleton ? '' : stat.subtext}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Unified Card Container: Search, Filter & Table with Glassmorphism */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-5 space-y-4 shadow-xs hover:shadow-md transition-all">
            {/* Filter & Search Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Booking ID, customer or phone..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-slate-50 border border-slate-100 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-0.5">
                {['All', 'Confirmed', 'Pending', 'Completed', 'Refunded', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      statusFilter === status
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Date filter */}
            <div className="flex flex-wrap items-center gap-2">
              <PeriodSelect
                value={dateFilter}
                onChange={(value) => {
                  setDateFilter(value);
                  setCurrentPage(1);
                }}
                options={DATE_FILTER_OPTIONS}
                icon={CalendarIcon}
                ariaLabel="Filter by booking date"
                className="bg-slate-50 border border-slate-100"
              />
              {dateFilter === 'custom' && (
                <>
                  <div className="w-44">
                    <CustomDatePicker
                      value={customRange.from}
                      onChange={(from) => {
                        setCustomRange((current) => ({ ...current, from }));
                        setCurrentPage(1);
                      }}
                      minDate="2000-01-01"
                      label="From"
                      buttonClassName="h-10 text-xs bg-slate-50 border-slate-100"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">to</span>
                  <div className="w-44">
                    <CustomDatePicker
                      value={customRange.to}
                      onChange={(to) => {
                        setCustomRange((current) => ({ ...current, to }));
                        setCurrentPage(1);
                      }}
                      minDate="2000-01-01"
                      label="To"
                      buttonClassName="h-10 text-xs bg-slate-50 border-slate-100"
                    />
                  </div>
                </>
              )}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 rounded-full text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
              {hasActiveFilters && (
                <span className="ml-auto text-[11px] font-semibold text-slate-400">
                  {filteredBookings.length} of {bookings.length} bookings
                </span>
              )}
            </div>

            {loadStatus === 'error' && (
              <ErrorNotice
                message={hasLoaded ? "Couldn't refresh your bookings. Showing the last data that loaded." : "Couldn't load your bookings."}
                onRetry={retryLoad}
                busy={isRetrying}
              />
            )}

            {actionError && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                {actionError}
              </p>
            )}

            {/* Bookings Directory Table */}
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[1100px] text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider whitespace-nowrap">
                    <th className="pb-3 pr-4">Booking ID</th>
                    {sortHeader('Customer', 'customer', 'pb-3 pr-6 min-w-[210px]')}
                    {sortHeader('Court Pitch', 'court', 'pb-3 pr-6 min-w-[110px]')}
                    {sortHeader('Date & Time Slot', 'when')}
                    {sortHeader('Total Amount', 'amount')}
                    {sortHeader('Due Amount', 'due')}
                    {sortHeader('Payment', 'payment')}
                    {sortHeader('Status', 'status')}
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm whitespace-nowrap">
                  {showSkeleton ? (
                    Array.from({ length: 5 }, (_, index) => (
                      <tr key={index}>
                        <td colSpan={8} className="py-3.5">
                          <div className="h-9 rounded-xl bg-slate-100 animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : paginatedBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center whitespace-normal">
                        <p className="text-sm font-bold text-slate-700">
                          {loadStatus === 'error' && bookings.length === 0
                            ? "Bookings couldn't be loaded"
                            : bookings.length === 0
                            ? 'No bookings yet'
                            : 'No bookings match your search or filter'}
                        </p>
                        <p className="text-xs text-slate-400 font-medium mt-1">
                          {loadStatus === 'error' && bookings.length === 0
                            ? 'Use Retry above to try again.'
                            : bookings.length === 0
                            ? 'Bookings from players, and the ones you add yourself, will show up here.'
                            : 'Try a different search, or clear the filters.'}
                        </p>
                        {bookings.length > 0 && (
                          <button
                            onClick={clearFilters}
                            className="mt-3 px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                          >
                            Clear filters
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : paginatedBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <p className="font-bold text-emerald-600 text-sm leading-tight">{b.id}</p>
                        <p className="text-xs text-slate-400 font-medium leading-tight mt-0.5">{b.bookedOn}</p>
                      </td>
                      <td className="py-3.5 pr-6 min-w-[210px] whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.avatar || '/logo.png'}
                            alt={b.customerName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0"
                          />
                          <div className="min-w-0 whitespace-nowrap">
                            <h4 title={b.customerName} className="font-bold text-slate-900 text-sm leading-tight whitespace-nowrap max-w-[150px] truncate">{b.customerName}</h4>
                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{b.customerPhone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-6 min-w-[110px] font-bold text-slate-800 text-sm whitespace-nowrap">{b.courtName}</td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{b.date}</span>
                          <span className="text-xs text-slate-500 font-medium">{b.timeSlot}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-extrabold text-slate-900 text-sm whitespace-nowrap">NRs. {Number(b.amount || 0).toLocaleString('en-NP')}</td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span className={`text-sm font-black ${b.due > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          NRs. {Number(b.due || 0).toLocaleString('en-NP')}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          b.paymentStatus === 'Paid'
                            ? 'text-emerald-600 bg-emerald-50'
                            : b.paymentStatus === 'Failed'
                            ? 'text-rose-600 bg-rose-50'
                            : 'text-amber-700 bg-amber-50'
                        }`}>
                          {b.paymentMethod} ({b.paymentStatus})
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(b.bookingStatus)}
                          {b.cancellationRequest && b.cancellationRequest.status === 'Pending' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 w-fit">
                              <AlertCircle size={10} /> Cancellation Requested
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {canMarkPaid(b) && (
                            <button
                              title="Mark as paid (received at the venue)"
                              disabled={actionBusyId === b.id}
                              onClick={() => setPaidTarget(b)}
                              className="p-1.5 rounded-xl border border-slate-200 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
                            >
                              <Banknote size={14} />
                            </button>
                          )}
                          {canConfirm(b) && (
                            <button
                              title="Confirm Booking"
                              disabled={actionBusyId === b.id}
                              onClick={() => handleConfirm(b)}
                              className="p-1.5 rounded-xl border border-slate-200 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          )}
                          {canCancel(b) && (
                            <button
                              title="Cancel Booking"
                              disabled={actionBusyId === b.id}
                              onClick={() => setCancelTarget(b)}
                              className="p-1.5 rounded-xl border border-slate-200 text-rose-500 hover:bg-rose-600 hover:text-white hover:border-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
                            >
                              <XCircle size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => { setActionError(''); setSelectedId(b.id); }}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-2xs"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Emerald Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3.5 border-t border-slate-100 text-xs text-slate-500 font-medium select-none">
              <div className="flex items-center gap-3">
                <span>
                  Showing <strong className="text-slate-900 font-bold">{filteredBookings.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
                  <strong className="text-slate-900 font-bold">{Math.min(startIndex + itemsPerPage, filteredBookings.length)}</strong> of{' '}
                  <strong className="text-slate-900 font-bold">{filteredBookings.length}</strong> entries
                </span>

                <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                  <span>Rows:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page === 1}
                  aria-label="Previous page"
                  onClick={() => setCurrentPage(Math.max(1, page - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:border-slate-200 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={15} />
                </button>

                {getPageItems(page, totalPages).map((item) =>
                  typeof item === 'number' ? (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      aria-label={'Page ' + item}
                      aria-current={page === item ? 'page' : undefined}
                      className={'min-w-7 h-7 px-1.5 rounded-lg text-xs font-bold transition-all ' + (page === item
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100')}
                    >
                      {item}
                    </button>
                  ) : (
                    <span key={item.key} className="w-5 text-center text-slate-400 font-bold" aria-hidden="true">
                      ...
                    </span>
                  )
                )}

                <button
                  disabled={page === totalPages}
                  aria-label="Next page"
                  onClick={() => setCurrentPage(Math.min(totalPages, page + 1))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:border-slate-200 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        statusBadge={selectedBooking ? getStatusBadge(selectedBooking.bookingStatus) : null}
        busy={Boolean(selectedBooking) && actionBusyId === selectedBooking.id}
        error={actionError}
        onClose={() => { setSelectedId(null); setActionError(''); }}
        onConfirm={() => handleConfirm(selectedBooking)}
        onMarkPaid={() => setPaidTarget(selectedBooking)}
        onCancel={() => setCancelTarget(selectedBooking)}
        onApproveCancellation={handleApproveCancellation}
        onRejectCancellation={handleRejectCancellation}
      />

      {/* Mark-as-paid Confirmation Popup */}
      <MarkPaidDialog
        booking={paidTarget}
        busy={Boolean(paidTarget) && actionBusyId === paidTarget.id}
        onKeep={() => setPaidTarget(null)}
        onConfirm={handleMarkPaidConfirmed}
      />

      {/* Cancel Confirmation Popup */}
      <CancelBookingDialog
        booking={cancelTarget}
        busy={Boolean(cancelTarget) && actionBusyId === cancelTarget.id}
        onKeep={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirmed}
      />

      {/* New Booking Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-base text-slate-900">Create New Booking</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveManualBooking}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Name</label>
                <input
                  type="text"
                  value={manualForm.name}
                  onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                  placeholder="e.g. Rohan Shrestha"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={manualForm.phone}
                    onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                    placeholder="+977 98..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Status</label>
                  <select value={manualForm.paymentStatus} onChange={(e) => setManualForm({ ...manualForm, paymentStatus: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-bold">
                    <option value="Pending">Pending / unpaid</option>
                    <option value="Paid">Paid at venue</option>
                  </select>
                </div>
              </div>

              {ownerTurf?.courts?.length > 1 && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Court / Pitch</label>
                  <CustomDropdown
                    options={ownerTurf.courts.map((court) => ({
                      value: court._id || court.id,
                      label: `${court.name || 'Court'} (${court.dimension || 'Standard 5v5'})`,
                    }))}
                    value={manualForm.courtId}
                    onChange={(courtId) => setManualForm({ ...manualForm, courtId })}
                    buttonClassName="h-10 text-xs bg-slate-50 border-slate-100"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Booking Date</label>
                <CustomDatePicker
                  value={manualForm.date}
                  onChange={(date) => setManualForm({ ...manualForm, date })}
                  minDate={getTodayNepalString()}
                  buttonClassName="h-10 text-xs bg-slate-50 border-slate-100"
                  label="Booking Date"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Start time</label>
                    <span className="text-[10px] text-slate-400 font-semibold">Future slots only</span>
                  </div>
                  <CustomDropdown
                    options={slotOptions}
                    value={manualForm.timeSlot}
                    onChange={(timeSlot) => setManualForm({ ...manualForm, timeSlot })}
                    placeholder={slotOptions.length === 0 ? 'No future slots left' : 'Select start time'}
                    buttonClassName="h-10 text-xs bg-slate-50 border-slate-100 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration</label>
                  <select
                    value={duration}
                    disabled={!selectedSlot}
                    onChange={(e) => setManualForm({ ...manualForm, durationHours: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-bold disabled:opacity-50"
                  >
                    {Array.from({ length: Math.max(1, maxDuration) }, (_, index) => index + 1).map((hours) => (
                      <option key={hours} value={hours}>
                        {hours === 1 ? '1 hour' : hours + ' hours'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {slotRange && (
                <p className="text-[11px] font-semibold text-slate-500 -mt-1.5">
                  Booking {slotRange.timeSlot}
                  {maxDuration > 0 && maxDuration < MAX_DURATION_HOURS
                    ? ' · only ' + maxDuration + (maxDuration === 1 ? ' hour is' : ' hours are') + ' free from this start'
                    : ''}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Match type</label>
                  <select
                    value={matchType}
                    onChange={(e) => setManualForm({ ...manualForm, matchType: e.target.value, teamSize: '' })}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-bold"
                  >
                    {matchTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Players</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={teamSizeValue}
                    onChange={(e) => setManualForm({ ...manualForm, teamSize: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Total price (NRs.)</label>
                  {manualForm.priceTouched && (
                    <button
                      type="button"
                      onClick={() => setManualForm({ ...manualForm, priceTouched: false, price: '' })}
                      className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      Reset to court rate
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={priceValue}
                  onChange={(e) => setManualForm({ ...manualForm, price: e.target.value, priceTouched: true })}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  Court rate NRs. {hourlyRate.toLocaleString('en-NP')}/hr x {duration} {duration === 1 ? 'hour' : 'hours'} = NRs.{' '}
                  {autoPrice.toLocaleString('en-NP')}. Edit the price to give a discount.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Email</label>
                <input
                  type="email"
                  value={manualForm.email}
                  onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                  placeholder="customer@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              {formError && <p className="text-xs font-bold text-rose-600">{formError}</p>}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScannerModal
          onClose={() => setShowQRScanner(false)}
          onScanSuccess={handleQRScanSuccess}
        />
      )}
    </>
  );
}

export default BookingsPage;
