import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Plus,
  Search,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  CircleDot,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  CreditCard,
  X,
  FileText,
  TrendingUp,
  Award,
  Users,
  ArrowUpRight,
  MoreHorizontal,
  Printer,
} from 'lucide-react';
import turfService from '../../services/turfService';
import CustomDatePicker from '../../components/common/CustomDatePicker';
import CustomDropdown from '../../components/common/CustomDropdown';
import { getTodayNepalString, processFutureSlots } from '../../utils/dateTime';

function BookingsPage({ user, activeTab, setActiveTab, ownerBookings = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [ownerTurf, setOwnerTurf] = useState(null);
  const [slotOptions, setSlotOptions] = useState([]);
  const [manualForm, setManualForm] = useState({
    name: '',
    phone: '',
    email: '',
    courtId: '',
    date: getTodayNepalString(),
    timeSlot: '',
    paymentStatus: 'Pending',
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Top Stat Cards Data (matching Dashboard StatCards format)
  const stats = [
    {
      title: 'Total Bookings',
      value: '1,085',
      change: '14.2%',
      period: 'from last month',
      icon: CalendarIcon,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Confirmed Slots',
      value: '842',
      change: '8.4%',
      period: 'from last month',
      icon: CheckCircle2,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Pending Confirmation',
      value: '24',
      change: '2.1%',
      period: 'from last month',
      icon: AlertCircle,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Gross Revenue',
      value: 'NRs. 1,65,450',
      change: '18.2%',
      period: 'from last month',
      icon: DollarSign,
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  // Mock Bookings Data
  const [bookings, setBookings] = useState([
    {
      id: 'BK-1082',
      customerName: 'Rohan Shrestha',
      customerPhone: '+977 9841234567',
      customerEmail: 'rohan.s@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      courtName: 'Main Pro Pitch',
      date: '12 Jun 2026',
      timeSlot: '09:00 AM - 10:00 AM',
      duration: '1 Hour',
      amount: 60.0,
      paymentMethod: 'eSewa',
      paymentStatus: 'Paid',
      bookingStatus: 'Ongoing',
      bookedOn: '10 Jun 2026, 04:30 PM',
      playersCount: 10,
      source: 'Mobile App',
    },
    {
      id: 'BK-1083',
      customerName: 'Aman Tamang',
      customerPhone: '+977 9818765432',
      customerEmail: 'aman.tamang@hotmail.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80',
      courtName: 'Standard Pitch',
      date: '12 Jun 2026',
      timeSlot: '10:00 AM - 11:00 AM',
      duration: '1 Hour',
      amount: 50.0,
      paymentMethod: 'Khalti',
      paymentStatus: 'Paid',
      bookingStatus: 'Confirmed',
      bookedOn: '11 Jun 2026, 09:15 AM',
      playersCount: 10,
      source: 'Mobile App',
    },
    {
      id: 'BK-1084',
      customerName: 'Bikash Gurung',
      customerPhone: '+977 9801122334',
      customerEmail: 'bikash.g@yahoo.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      courtName: 'Rooftop Open Turf',
      date: '12 Jun 2026',
      timeSlot: '11:00 AM - 01:00 PM',
      duration: '2 Hours',
      amount: 160.0,
      paymentMethod: 'VISA Card',
      paymentStatus: 'Paid',
      bookingStatus: 'Confirmed',
      bookedOn: '11 Jun 2026, 02:40 PM',
      playersCount: 14,
      source: 'Walk-in Counter',
    },
    {
      id: 'BK-1085',
      customerName: 'Sujan Magar',
      customerPhone: '+977 9865432109',
      customerEmail: 'sujan.magar@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
      courtName: 'Main Pro Pitch',
      date: '12 Jun 2026',
      timeSlot: '01:00 PM - 02:00 PM',
      duration: '1 Hour',
      amount: 60.0,
      paymentMethod: 'Cash',
      paymentStatus: 'Unpaid',
      bookingStatus: 'Pending',
      bookedOn: '12 Jun 2026, 08:00 AM',
      playersCount: 10,
      source: 'Phone Call',
    },
    {
      id: 'BK-1086',
      customerName: 'Nabin Karki',
      customerPhone: '+977 9849988776',
      customerEmail: 'karki.nabin@outlook.com',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&auto=format&fit=crop&q=80',
      courtName: 'Standard Pitch',
      date: '12 Jun 2026',
      timeSlot: '02:00 PM - 04:00 PM',
      duration: '2 Hours',
      amount: 100.0,
      paymentMethod: 'eSewa',
      paymentStatus: 'Paid',
      bookingStatus: 'Completed',
      bookedOn: '09 Jun 2026, 01:10 PM',
      playersCount: 10,
      source: 'Mobile App',
    },
  ]);

  useEffect(() => {
    turfService.getOwnerBookings().then((items) => {
      setBookings(items.map((booking) => ({
        id: booking.bookingId || booking._id,
        customerName: [booking.user?.firstName, booking.user?.lastName].filter(Boolean).join(' ') || 'Customer',
        customerPhone: booking.user?.phone || '—',
        customerEmail: booking.user?.email || '—',
        avatar: booking.user?.profilePicture || '/logo.png',
        courtName: booking.court?.name || booking.turf?.name || 'Court 1',
        courtDimension: booking.court?.dimension || '',
        date: booking.dateStr || new Date(booking.date).toLocaleDateString(),
        timeSlot: booking.timeSlot || '—',
        duration: '1 Hour',
        amount: Number(booking.totalAmount || 0),
        paymentMethod: booking.paymentMethod || '—',
        paymentStatus: booking.paymentStatus || 'Pending',
        bookingStatus: booking.paymentStatus === 'Paid' ? (booking.status || 'Confirmed') : 'Pending',
        bookedOn: new Date(booking.createdAt).toLocaleString(),
        playersCount: booking.teamSize || 0,
        source: 'Turfio',
      })));
    }).catch(() => {
      if (ownerBookings.length > 0) {
        setBookings(ownerBookings.map((booking) => ({
          id: booking.bookingId || booking._id,
          customerName: [booking.user?.firstName, booking.user?.lastName].filter(Boolean).join(' ') || 'Customer',
          customerPhone: booking.user?.phone || '—',
          customerEmail: booking.user?.email || '—',
          avatar: booking.user?.profilePicture || '/logo.png',
          courtName: booking.court?.name || booking.turf?.name || 'Court 1',
          courtDimension: booking.court?.dimension || '',
          date: booking.dateStr || new Date(booking.date).toLocaleDateString(),
          timeSlot: booking.timeSlot || '—',
          duration: '1 Hour',
          amount: Number(booking.totalAmount || 0),
          paymentMethod: booking.paymentMethod || '—',
          paymentStatus: booking.paymentStatus || 'Pending',
          bookingStatus: booking.paymentStatus === 'Paid' ? (booking.status || 'Confirmed') : 'Pending',
          bookedOn: new Date(booking.createdAt).toLocaleString(),
          playersCount: booking.teamSize || 0,
          source: 'Turfio',
        })));
      }
    });
  }, [ownerBookings.length]);

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

  const saveManualBooking = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const turfId = ownerTurf?.id || ownerTurf?._id;
      if (!turfId || !manualForm.timeSlot) throw new Error('Select an available date and future time slot.');

      const selectedCourt = (ownerTurf?.courts || []).find(
        (c) => (c._id || c.id) === manualForm.courtId
      ) || ownerTurf?.courts?.[0];

      await turfService.createManualBooking({
        turf: turfId,
        court: selectedCourt ? {
          id: selectedCourt._id || selectedCourt.id,
          name: selectedCourt.name,
          courtNumber: selectedCourt.courtNumber,
          dimension: selectedCourt.dimension,
          surface: selectedCourt.surface,
          hourlyRate: selectedCourt.hourlyRate || ownerTurf?.pricePerHour || 1200,
        } : null,
        courtId: selectedCourt?._id || selectedCourt?.id || null,
        customer: { name: manualForm.name, phone: manualForm.phone, email: manualForm.email },
        date: manualForm.date,
        timeSlot: manualForm.timeSlot,
        matchType: '5v5',
        teamSize: 10,
        totalAmount: selectedCourt?.hourlyRate || ownerTurf?.pricePerHour || 1200,
        paymentMethod: 'Pay at Venue',
        paymentStatus: manualForm.paymentStatus,
        paymentType: 'venue',
      });
      const refreshed = await turfService.getOwnerBookings();
      setBookings(refreshed.map((booking) => ({
        id: booking.bookingId || booking._id,
        customerName: [booking.user?.firstName, booking.user?.lastName].filter(Boolean).join(' ') || 'Customer',
        customerPhone: booking.user?.phone || '—',
        customerEmail: booking.user?.email || '—',
        avatar: booking.user?.profilePicture || '/logo.png',
        courtName: booking.court?.name || booking.turf?.name || 'Court 1',
        courtDimension: booking.court?.dimension || '',
        date: booking.dateStr || new Date(booking.date).toLocaleDateString(),
        timeSlot: booking.timeSlot || '—',
        duration: '1 Hour',
        amount: Number(booking.totalAmount || 0),
        paymentMethod: booking.paymentMethod || '—',
        paymentStatus: booking.paymentStatus || 'Pending',
        bookingStatus: booking.paymentStatus === 'Paid' ? (booking.status || 'Confirmed') : 'Pending',
        bookedOn: new Date(booking.createdAt).toLocaleString(),
        playersCount: booking.teamSize || 0,
        source: 'Turfio',
      })));
      setIsAddModalOpen(false);
      setManualForm({
        name: '',
        phone: '',
        email: '',
        courtId: selectedCourt?._id || selectedCourt?.id || '',
        date: getTodayNepalString(),
        timeSlot: '',
        paymentStatus: 'Pending',
      });
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

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.courtName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
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
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 text-xs font-semibold text-slate-700 hover:bg-white transition-all shadow-xs">
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
              </div>
            </div>

            {/* Top Row: 4 Metric Cards (Identical to Dashboard StatCards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                const liveValue = stat.title === 'Total Bookings'
                  ? bookings.length.toLocaleString()
                  : stat.title === 'Confirmed Slots'
                  ? bookings.filter((booking) => booking.bookingStatus === 'Confirmed' || booking.bookingStatus === 'Completed').length.toLocaleString()
                  : stat.title === 'Pending Confirmation'
                  ? bookings.filter((booking) => booking.bookingStatus === 'Pending').length.toLocaleString()
                  : `NRs. ${bookings.filter((booking) => booking.paymentStatus === 'Paid').reduce((sum, booking) => sum + Number(booking.amount || 0), 0).toLocaleString('en-NP')}`;
                return (
                  <div
                    key={stat.title}
                    className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-5 relative flex flex-col justify-between shadow-xs hover:shadow-md hover:bg-white/80 transition-all"
                  >
                    {/* Top row: Icon on left, Title & Value on right, Options menu top right */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3.5 rounded-2xl shrink-0 ${stat.iconBg}`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <span className="text-[12px] font-semibold text-slate-400 block leading-tight">
                            {stat.title}
                          </span>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-1">
                              {liveValue}
                          </h3>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1 transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    {/* Bottom row: Percentage badge & period */}
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-emerald-600 bg-emerald-50/80 px-1.5 py-1 rounded-md flex items-center gap-0.5 font-bold">
                        <ArrowUpRight size={12} /> {stat.change}
                      </span>
                      <span className="text-slate-400 font-medium">{stat.period}</span>
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
                {['All', 'Ongoing', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((status) => (
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

            {/* Bookings Directory Table */}
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[900px] text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider whitespace-nowrap">
                    <th className="pb-3 pr-4">Booking ID</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Court Pitch</th>
                    <th className="pb-3 pr-4">Channel / Source</th>
                    <th className="pb-3 pr-4">Date & Time Slot</th>
                    <th className="pb-3 pr-4">Total Amount</th>
                    <th className="pb-3 pr-4">Payment</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm whitespace-nowrap">
                  {paginatedBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                      <td className="py-3.5 pr-4 font-bold text-emerald-600 text-sm whitespace-nowrap">{b.id}</td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.avatar || '/logo.png'}
                            alt={b.customerName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0"
                          />
                          <div className="whitespace-nowrap">
                            <h4 className="font-bold text-slate-900 text-sm leading-tight whitespace-nowrap">{b.customerName}</h4>
                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{b.customerPhone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-bold text-slate-800 text-sm whitespace-nowrap">{b.courtName}</td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          b.source === 'Mobile App'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : b.source === 'Walk-in Counter'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-purple-50 text-purple-700 border border-purple-100'
                        }`}>
                          {b.source}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{b.date}</span>
                          <span className="text-xs text-slate-500 font-medium">{b.timeSlot}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-extrabold text-slate-900 text-sm whitespace-nowrap">NRs. {Number(b.amount || 0).toLocaleString('en-NP')}</td>
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
                      <td className="py-3.5 pr-4 whitespace-nowrap">{getStatusBadge(b.bookingStatus)}</td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.bookingStatus !== 'Cancelled' && (
                            <button
                              title="Cancel Booking"
                              onClick={() => {
                                setBookings((prev) =>
                                  prev.map((item) => (item.id === b.id ? { ...item, bookingStatus: 'Cancelled' } : item))
                                );
                              }}
                              className="p-1.5 rounded-xl border border-slate-200 text-rose-500 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-2xs"
                            >
                              <XCircle size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedBooking(b)}
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
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:border-slate-200 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={15} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      currentPage === page
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/80 w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 pb-4 border-b border-slate-100/80 flex items-center justify-between bg-white/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-slate-900 tracking-tight">Booking {selectedBooking.id}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  Booked on {selectedBooking.bookedOn}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedBooking.bookingStatus)}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors ml-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs">
              {/* Customer Profile Card */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedBooking.avatar || '/logo.png'}
                    alt={selectedBooking.customerName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{selectedBooking.customerName}</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">{selectedBooking.customerPhone}</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">{selectedBooking.customerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Booking Info Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    <CalendarIcon size={13} /> Date & Slot
                  </div>
                  <p className="font-extrabold text-xs text-slate-900">{selectedBooking.date}</p>
                  <p className="text-[11px] font-semibold text-slate-600">{selectedBooking.timeSlot}</p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                    <CircleDot size={13} /> Court Pitch
                  </div>
                  <p className="font-extrabold text-xs text-slate-900">{selectedBooking.courtName}</p>
                  <p className="text-[11px] font-semibold text-slate-600">{selectedBooking.duration}</p>
                </div>
              </div>

              {/* Payment Summary Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2 shadow-2xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Payment Channel</span>
                  <span className="font-bold text-slate-900">{selectedBooking.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Payment Status</span>
                  <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {selectedBooking.paymentStatus}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm">
                  <span className="font-extrabold text-slate-900">Total Price</span>
                  <span className="font-black text-slate-900 text-base">
                    NRs. {selectedBooking.amount.toLocaleString('en-NP')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs text-xs"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
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

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Available Future Time Slot</label>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Past times are automatically excluded
                  </span>
                </div>
                <CustomDropdown
                  options={slotOptions}
                  value={manualForm.timeSlot}
                  onChange={(timeSlot) => setManualForm({ ...manualForm, timeSlot })}
                  placeholder={slotOptions.length === 0 ? 'No future slots available today' : 'Select time slot'}
                  buttonClassName="h-10 text-xs bg-slate-50 border-slate-100 font-bold"
                />
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default BookingsPage;
