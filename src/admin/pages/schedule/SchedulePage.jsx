import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CircleDot,
  CheckCircle2,
  AlertCircle,
  Download,
  X,
  DollarSign
} from 'lucide-react';
import turfService from '../../../shared/services/turfService';
import CustomDatePicker from '../../../shared/components/common/CustomDatePicker';
import CustomDropdown from '../../../shared/components/common/CustomDropdown';
import { getTodayNepalString, getNepalCurrentDateTime, parseSlotInterval, processFutureSlots } from '../../../shared/utils/dateTime';
import { addDays } from '../../../shared/utils/dashboardStats';

function SchedulePage({ user, activeTab, setActiveTab }) {
  const [selectedDate, setSelectedDate] = useState(getTodayNepalString());
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [slotOptions, setSlotOptions] = useState([]);
  const [manualForm, setManualForm] = useState({
    name: '',
    phone: '',
    email: '',
    courtId: '',
    timeSlot: '',
    paymentStatus: 'Pending',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const [ownerTurf, setOwnerTurf] = useState(null);

  const shiftDate = (days) => setSelectedDate(addDays(selectedDate, days));

  // Top Stat Cards Data

  const [scheduleItems, setScheduleItems] = useState([]);

  // Stat cards are worked out from the selected day's real bookings.
  const nowNpt = getNepalCurrentDateTime();
  const isToday = selectedDate === nowNpt.date;
  const activeItems = scheduleItems
    .filter((item) => item.status !== 'Cancelled')
    .map((item) => ({ ...item, ...parseSlotInterval(item.slot) }))
    .sort((a, b) => a.startMinutes - b.startMinutes);
  const ongoing = isToday
    ? activeItems.find((item) => item.startMinutes <= nowNpt.minutes && nowNpt.minutes < item.endMinutes)
    : null;
  const upcoming = activeItems.filter((item) =>
    isToday ? item.startMinutes > nowNpt.minutes : selectedDate > nowNpt.date
  );
  const paidCount = activeItems.filter((item) => item.paymentStatus === 'Paid').length;
  const dayRevenue = activeItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const slotsLabel = (count) => `${count} ${count === 1 ? 'Slot' : 'Slots'}`;

  const stats = [
    {
      title: 'Booked Slots',
      value: slotsLabel(activeItems.length),
      change: `${paidCount} paid`,
      isText: true,
      icon: Clock,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Ongoing Match',
      value: ongoing ? `Slot ${ongoing.startTime}` : 'None',
      change: ongoing ? ongoing.customer : isToday ? 'No match right now' : 'Only shown for today',
      isText: true,
      icon: CircleDot,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Confirmed Upcoming',
      value: slotsLabel(upcoming.length),
      change: upcoming[0] ? `Next: ${upcoming[0].startTime}` : 'Nothing else booked',
      isText: true,
      icon: CheckCircle2,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Estimated Daily Rev',
      value: `NRs. ${dayRevenue.toLocaleString('en-IN')}`,
      change: `${slotsLabel(activeItems.length).toLowerCase()} booked`,
      isText: true,
      icon: DollarSign,
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  useEffect(() => {
    if (!user?.id) return;
    turfService.getTurfs({ owner: user.id, limit: 1 }).then((turfs) => setOwnerTurf(turfs[0] || null)).catch(() => setOwnerTurf(null));
    turfService.getOwnerBookings().then((items) => {
      setScheduleItems(items.filter((booking) => booking.dateStr === selectedDate).map((booking) => ({
        id: booking.bookingId,
        slot: booking.timeSlot,
        customer: [booking.user?.firstName, booking.user?.lastName].filter(Boolean).join(' ') || 'Customer',
        phone: booking.user?.phone || '—',
        avatar: booking.user?.profilePicture || '/logo.png',
        status: booking.status === 'CANCELLED' ? 'Cancelled' : booking.paymentStatus === 'Paid' ? booking.status : 'Pending',
        amount: Number(booking.totalAmount || 0),
        paymentStatus: booking.paymentStatus || 'Pending',
      })));
    }).catch(() => setScheduleItems([]));
  }, [user?.id, selectedDate]);

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
        dateStr: selectedDate,
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

    turfService.getTurfAvailability(turfId, selectedDate, manualForm.courtId)
      .then((availability) => {
        const rawSlots = availability?.slots || [];
        const processed = processFutureSlots({
          slots: rawSlots,
          openingHours: availability?.openingHours || ownerTurf?.openingHours,
          occupiedIntervals: availability?.occupiedIntervals || [],
          dateStr: selectedDate,
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
          dateStr: selectedDate,
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
  }, [ownerTurf?.id, ownerTurf?._id, selectedDate, manualForm.courtId]);

  const saveManualBooking = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setScheduleError('');
    try {
      const turf = ownerTurf;
      if (!turf) throw new Error('No venue is linked to this owner account.');
      if (!manualForm.timeSlot) throw new Error('Please select an available future time slot.');

      const selectedCourt = (ownerTurf?.courts || []).find(
        (c) => (c._id || c.id) === manualForm.courtId
      ) || ownerTurf?.courts?.[0];

      const result = await turfService.createManualBooking({
        turf: turf.id || turf._id,
        court: selectedCourt ? {
          id: selectedCourt._id || selectedCourt.id,
          name: selectedCourt.name,
          courtNumber: selectedCourt.courtNumber,
          dimension: selectedCourt.dimension,
          surface: selectedCourt.surface,
          hourlyRate: selectedCourt.hourlyRate || turf.pricePerHour || 1200,
        } : null,
        courtId: selectedCourt?._id || selectedCourt?.id || null,
        customer: { name: manualForm.name, phone: manualForm.phone, email: manualForm.email },
        date: selectedDate,
        timeSlot: manualForm.timeSlot,
        matchType: '5v5',
        teamSize: 10,
        totalAmount: selectedCourt?.hourlyRate || turf.pricePerHour || 1200,
        paymentMethod: 'Pay at Venue',
        paymentStatus: manualForm.paymentStatus,
        paymentType: 'venue',
      });
      const booking = result?.data || result;
      setScheduleItems((current) => [...current, {
        id: booking.bookingId || booking._id,
        slot: booking.timeSlot,
        courtName: selectedCourt?.name || 'Court 1',
        customer: manualForm.name,
        phone: manualForm.phone,
        avatar: '/logo.png',
        status: manualForm.paymentStatus === 'Paid' ? 'Confirmed' : 'Pending',
        amount: booking.totalAmount || selectedCourt?.hourlyRate || turf.pricePerHour || 1200,
        paymentStatus: manualForm.paymentStatus,
      }]);
      setIsAddModalOpen(false);
      setManualForm({
        name: '',
        phone: '',
        email: '',
        courtId: selectedCourt?._id || selectedCourt?.id || '',
        timeSlot: '',
        paymentStatus: 'Pending',
      });
    } catch (error) {
      setScheduleError(error.message || 'Could not create booking.');
    } finally {
      setIsSaving(false);
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
      default:
        return null;
    }
  };

  const filteredItems = scheduleItems.filter((item) => {
    return statusFilter === 'All' || item.status === statusFilter;
  });

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased overflow-hidden select-none">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
          {/* Header Action Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Arena Daily Schedule
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                Manage court availability, time slots, and daily reservations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2.5 rounded-full bg-white border border-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                <Download size={14} />
                <span>Export Timetable</span>
              </button>

              <button
                onClick={() => setActiveTab('Bookings')}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20"
              >
                <Plus size={15} />
                <span>Manage Bookings</span>
              </button>
            </div>
          </div>

          {/* Top Row: 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const liveValue = stat.title === 'Confirmed Upcoming'
                ? `${scheduleItems.length} Slots`
                : stat.title === 'Estimated Daily Rev'
                ? `NRs. ${scheduleItems.reduce((sum, item) => sum + Number(item.amount || 0), 0).toLocaleString('en-NP')}`
                : stat.value;
              return (
                <div
                  key={stat.title}
                  className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                      <Icon size={18} />
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-slate-400 block">{stat.title}</span>
                    <h3 className="text-xl font-black text-slate-900 mt-0.5">{liveValue}</h3>

                    <div className="flex items-center gap-1 mt-1 text-[10px] font-bold">
                      {stat.isText ? (
                        <span className="text-slate-400 font-medium">{stat.change}</span>
                      ) : (
                        <>
                          <span className={stat.isUp ? 'text-emerald-600' : 'text-rose-600'}>
                            {stat.isUp ? '↗' : '↘'} {stat.change.split(' ')[0]}
                          </span>
                          <span className="text-slate-400 font-medium">{stat.change.split(' ').slice(1).join(' ')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unified Card Container: Date, Filters & Schedule Table */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4">
            {/* Date Controls & Status Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Date Switcher Control */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5">
                <button onClick={() => shiftDate(-1)} className="p-1 rounded-full text-slate-600 hover:bg-white transition-colors">
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-2 px-2 text-xs font-bold text-slate-900">
                  <CalendarIcon size={14} className="text-emerald-600" />
                  <span>{new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>

                <button onClick={() => shiftDate(1)} className="p-1 rounded-full text-slate-600 hover:bg-white transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-0.5">
                {['All', 'Ongoing', 'Confirmed', 'Pending', 'Completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
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

            {/* Timetable Directory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Time Slot</th>
                    <th className="pb-3 pr-4">Booking ID</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3 pr-4">Payment</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pr-4 font-bold text-slate-800 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-400" />
                          <span>{item.slot}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-bold text-emerald-600 text-sm whitespace-nowrap">{item.id}</td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.avatar}
                            alt={item.customer}
                            className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.customer}</h4>
                            <span className="text-xs text-slate-400 font-medium">{item.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-extrabold text-slate-900 text-sm whitespace-nowrap">NRs. {Number(item.amount || 0).toLocaleString('en-NP')}</td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.paymentStatus === 'Paid' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-700 bg-amber-50'}`}>
                          {item.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedSlot(item)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-xs"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Slot Details Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900">Reservation {selectedSlot.id}</span>
                {getStatusBadge(selectedSlot.status)}
              </div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <img
                  src={selectedSlot.avatar}
                  alt={selectedSlot.customer}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{selectedSlot.customer}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{selectedSlot.phone}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Time Slot Window</span>
                  <span className="font-bold text-slate-900">{selectedSlot.slot}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Booking Fee</span>
                  <span className="font-black text-slate-900">NRs. {(selectedSlot.amount * 25).toLocaleString('en-NP')}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-medium">Payment Status</span>
                  <span className="font-bold text-emerald-600">{selectedSlot.paymentStatus}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                >
                  Close Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Slot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-base text-slate-900">Book Time Slot</h3>
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
                  <select
                    value={manualForm.paymentStatus}
                    onChange={(e) => setManualForm({ ...manualForm, paymentStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-bold"
                  >
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
                  value={selectedDate}
                  onChange={setSelectedDate}
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
              {scheduleError && <p className="text-xs font-bold text-rose-600">{scheduleError}</p>}

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
                  {isSaving ? 'Saving...' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchedulePage;
