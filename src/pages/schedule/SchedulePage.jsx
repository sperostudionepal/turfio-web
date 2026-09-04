import { useState } from 'react';
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
  XCircle,
  Download,
  Filter,
  User,
  Phone,
  X,
  Grid,
  List,
  Check,
  TrendingUp,
  DollarSign
} from 'lucide-react';

function SchedulePage({ activeTab, setActiveTab }) {
  const [selectedDate, setSelectedDate] = useState('12 Jun 2026');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Top Stat Cards Data
  const stats = [
    {
      title: "Today's Occupancy",
      value: '82%',
      change: '14 of 17 slots filled',
      isText: true,
      icon: Clock,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Ongoing Match',
      value: 'Slot 09:00 AM',
      change: 'Main Pro Pitch',
      isText: true,
      icon: CircleDot,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Confirmed Upcoming',
      value: '8 Slots',
      change: 'Next: 10:00 AM',
      isText: true,
      icon: CheckCircle2,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Estimated Daily Rev',
      value: 'NRs. 24,500',
      change: '+12% vs last Sunday',
      isUp: true,
      icon: DollarSign,
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  // Single Arena Daily Schedule Dataset
  const [scheduleItems, setScheduleItems] = useState([
    {
      id: 'BK-1081',
      slot: '08:00 AM - 09:00 AM',
      customer: 'Ramesh Adhikari',
      phone: '+977 9841001122',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      status: 'Completed',
      amount: 60.0,
      paymentStatus: 'Paid',
    },
    {
      id: 'BK-1082',
      slot: '09:00 AM - 10:00 AM',
      customer: 'Rohan Shrestha',
      phone: '+977 9841234567',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80',
      status: 'Ongoing',
      amount: 60.0,
      paymentStatus: 'Paid',
    },
    {
      id: 'BK-1083',
      slot: '10:00 AM - 11:00 AM',
      customer: 'Aman Tamang',
      phone: '+977 9818765432',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      status: 'Confirmed',
      amount: 50.0,
      paymentStatus: 'Paid',
    },
    {
      id: 'BK-1084',
      slot: '11:00 AM - 12:00 PM',
      customer: 'Bikash Gurung',
      phone: '+977 9801122334',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
      status: 'Pending',
      amount: 80.0,
      paymentStatus: 'Unpaid',
    },
    {
      id: 'BK-1085',
      slot: '01:00 PM - 02:00 PM',
      customer: 'Sujan Magar',
      phone: '+977 9865432109',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&auto=format&fit=crop&q=80',
      status: 'Confirmed',
      amount: 60.0,
      paymentStatus: 'Paid',
    },
  ]);

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
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20"
              >
                <Plus size={15} />
                <span>Book Slot</span>
              </button>
            </div>
          </div>

          {/* Top Row: 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {stats.map((stat) => {
              const Icon = stat.icon;
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
                    <h3 className="text-xl font-black text-slate-900 mt-0.5">{stat.value}</h3>

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
                <button className="p-1 rounded-full text-slate-600 hover:bg-white transition-colors">
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-2 px-2 text-xs font-bold text-slate-900">
                  <CalendarIcon size={14} className="text-emerald-600" />
                  <span>{selectedDate}</span>
                </div>

                <button className="p-1 rounded-full text-slate-600 hover:bg-white transition-colors">
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
                      <td className="py-3.5 pr-4 font-extrabold text-slate-900 text-sm whitespace-nowrap">NRs. {(item.amount * 25).toLocaleString('en-NP')}</td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsAddModalOpen(false);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Name</label>
                <input
                  type="text"
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
                    placeholder="+977 98..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold">
                    <option>09:00 AM - 10:00 AM</option>
                    <option>10:00 AM - 11:00 AM</option>
                    <option>11:00 AM - 12:00 PM</option>
                    <option>01:00 PM - 02:00 PM</option>
                  </select>
                </div>
              </div>

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
                  Confirm Reservation
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
