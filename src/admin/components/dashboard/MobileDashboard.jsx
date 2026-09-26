import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Bell,
  Menu,
  Search,
  Plus,
  Download,
  Clock,
  ChevronDown,
  ChevronRight,
  Calendar,
  Tag,
  ArrowUpRight,
} from 'lucide-react';
import { getTodayNepalString, parseSlotInterval } from '../../../shared/utils/dateTime';

function MobileDashboard({ user, venue, bookings = [], setActiveTab }) {

  const todayStr = getTodayNepalString();

  // Filter today's bookings
  const isToday = (b) => {
    const dStr = b.dateStr || (b.date ? new Date(b.date).toISOString().slice(0, 10) : '');
    return dStr.startsWith(todayStr);
  };

  const todayBookings = bookings.filter(isToday);

  // Compute metric stats
  const todayPaidRevenue = todayBookings
    .filter((b) => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + Number(b.totalPaidAmount || b.totalAmount || 0), 0);


  const dueAmount = bookings
    .filter((b) => b.paymentStatus !== 'Paid')
    .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);

  const courtCount = venue?.courts?.length || 4;
  const activeCourtsText = `${Math.min(courtCount, Math.max(3, todayBookings.length))}/${courtCount}`;

  // Performance Overview Dual Bar Chart Data (Jan - Jun)
  const performanceOverviewData = [
    { month: 'Jan', revenue: 20, expense: 8 },
    { month: 'Feb', revenue: 35, expense: 12 },
    { month: 'Mar', revenue: 26, expense: 10 },
    { month: 'Apr', revenue: 14, expense: 22 },
    { month: 'May', revenue: 25, expense: 15 },
    { month: 'Jun', revenue: 26, expense: 12 },
  ];

  const mappedBookings = todayBookings.map((b) => {
    const interval = parseSlotInterval(b.timeSlot);
    const customer =
      [b.user?.firstName, b.user?.lastName].filter(Boolean).join(' ') ||
      b.customer?.name ||
      'Customer';
    const initials = customer.slice(0, 2).toUpperCase();
    const court = b.court?.name || 'Court 1';

    let status = 'Confirmed';
    let badgeBg = 'bg-emerald-100/70 text-emerald-800';
    let dotColor = 'bg-emerald-500';

    if (b.paymentStatus === 'Pending' || b.status === 'Pending') {
      status = 'Upcoming';
      badgeBg = 'bg-blue-100/70 text-blue-800';
      dotColor = 'bg-blue-500';
    }

    return {
      initials,
      customer,
      court,
      time: `${interval.startTime || '7:00 PM'} – ${interval.endTime || '8:00 PM'}`,
      matchType: b.court?.type || '5v5 • 1 hour',
      status,
      badgeBg,
      dotColor,
    };
  });

  const displayBookings = mappedBookings.slice(0, 3);

  return (
    <div className="w-full bg-[#fbfcfd] min-h-screen text-slate-900 pb-24 select-none md:hidden">
      {/* 1. Full Edge-to-Edge Upper Navigation Header Bar */}
      <div className="w-full px-4 py-3.5 flex items-center justify-between">
        {/* Left: User Avatar & Morning Greeting */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-900 border border-slate-200 shrink-0 shadow-sm">
            {user?.avatar ? (
              <img src={user.avatar} alt="Owner Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-950 text-[#a3e635] font-black text-xl flex items-center justify-center">
                {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1 text-[13px] font-bold text-slate-400">
              <span>👋</span>
              <span>Morning</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
              {user?.firstName || user?.name?.split(' ')?.[0] || 'Owner'}
            </h2>
          </div>
        </div>

        {/* Right: Search, Notification Badge & Hamburger Menu as separate buttons */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            type="button"
            className="w-9 h-9 rounded-2xl bg-white border border-slate-100 text-slate-800 flex items-center justify-center shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)] cursor-pointer hover:bg-slate-50 transition-colors"
            aria-label="Search"
          >
            <Search size={17} />
          </button>

          {/* Notifications Button with Red Dot */}
          <button
            type="button"
            className="w-9 h-9 rounded-2xl bg-white border border-slate-100 text-slate-800 flex items-center justify-center shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)] cursor-pointer hover:bg-slate-50 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border border-white" />
          </button>

          {/* Hamburger Menu Button */}
          <button
            type="button"
            className="w-9 h-9 rounded-2xl bg-white border border-slate-100 text-slate-800 flex items-center justify-center shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)] cursor-pointer hover:bg-slate-50 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={17} />
          </button>
        </div>
      </div>

      {/* Main Body Content Container with Padding */}
      <div className="px-4 pt-2 pb-4 space-y-4">
        {/* 2. Overview Section Header & Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {venue?.name ? `${venue.name} Overview` : 'Arena Overview'}
          </h2>

          {/* Action Buttons (+ and Download as separate elements) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab('Bookings')}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-900 flex items-center justify-center shadow-xs cursor-pointer hover:bg-slate-50 transition-colors"
              aria-label="Add new booking"
            >
              <Plus size={18} className="stroke-[2.5]" />
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-[#a3e635] text-slate-950 flex items-center justify-center shadow-xs cursor-pointer hover:bg-lime-400 transition-colors"
              aria-label="Download report"
            >
              <Download size={16} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* 3. 2x2 Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Revenue */}
          <div className="bg-white rounded-lg p-3.5 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] border border-slate-100/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-400 tracking-normal">Revenue</span>
              <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-100">
                <ArrowUpRight size={13} />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-[22px] font-black text-slate-900 tracking-tight leading-none">
                Rs. {todayPaidRevenue > 0 ? todayPaidRevenue.toLocaleString('en-NP') : '26,450'}
              </h3>
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[11px] font-extrabold">
                  +10.5%
                </span>
                <span className="text-[11px] text-slate-400 font-medium">vs. Last Month</span>
              </div>
            </div>
          </div>

          {/* Today's Bookings */}
          <div className="bg-white rounded-lg p-3.5 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] border border-slate-100/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-400 tracking-normal">Today's Bookings</span>
              <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-100">
                <ArrowUpRight size={13} />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-[22px] font-black text-slate-900 tracking-tight leading-none">
                {todayBookings.length > 0 ? todayBookings.length : '8'}
              </h3>
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[11px] font-extrabold">
                  +3.7%
                </span>
                <span className="text-[11px] text-slate-400 font-medium">vs. Last Month</span>
              </div>
            </div>
          </div>

          {/* Active Courts */}
          <div className="bg-white rounded-lg p-3.5 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] border border-slate-100/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-400 tracking-normal">Active Courts</span>
              <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-100">
                <ArrowUpRight size={13} />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-[22px] font-black text-slate-900 tracking-tight leading-none">
                {activeCourtsText}
              </h3>
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 text-[11px] font-extrabold">
                  +8.5%
                </span>
                <span className="text-[11px] text-slate-400 font-medium">vs. Last Month</span>
              </div>
            </div>
          </div>

          {/* Pending Payments */}
          <div className="bg-white rounded-lg p-3.5 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] border border-slate-100/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-400 tracking-normal">Pending Payments</span>
              <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-100">
                <ArrowUpRight size={13} />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-[22px] font-black text-slate-900 tracking-tight leading-none">
                Rs. {dueAmount > 0 ? dueAmount.toLocaleString('en-NP') : '2,500'}
              </h3>
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[11px] font-extrabold">
                  +3.5%
                </span>
                <span className="text-[11px] text-slate-400 font-medium">vs. Last Month</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Performance Overview Card */}
        <div className="bg-white rounded-lg p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-slate-100/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Performance Overview</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              <span>6 months</span>
              <ChevronDown size={13} />
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-600 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#a3e635]" />
              <span>Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-slate-200" />
              <span>Expense</span>
            </div>
          </div>

          {/* Dual Bar Chart */}
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceOverviewData}
                margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
                barGap={3}
              >
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                  tickFormatter={(val) => `${val}k`}
                  domain={[0, 40]}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                  dy={4}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#1e293b] text-white px-3 py-2 rounded-lg text-xs font-bold shadow-lg space-y-1">
                          <p className="text-slate-400 font-semibold">{label}</p>
                          <p className="text-white">Revenue: Rs. {payload[0]?.value}k</p>
                          <p className="text-slate-300">Expense: Rs. {payload[1]?.value}k</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" fill="#a3e635" radius={[2, 2, 0, 0]} barSize={10} />
                <Bar dataKey="expense" fill="#e2e8f0" radius={[2, 2, 0, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Quick Actions Grid */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-2.5 tracking-tight">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-2">
            {/* Tile 1: Manage Bookings */}
            <button
              onClick={() => setActiveTab && setActiveTab('Bookings')}
              className="bg-white p-3 rounded-lg flex flex-col items-center justify-center text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-slate-100/80 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-1.5">
                <Calendar size={16} />
              </div>
              <span className="text-[11px] font-bold text-slate-700 leading-tight">
                Manage Bookings
              </span>
            </button>

            {/* Tile 2: Time Slots */}
            <button
              onClick={() => setActiveTab && setActiveTab('Pricing')}
              className="bg-white p-3 rounded-lg flex flex-col items-center justify-center text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-slate-100/80 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-1.5">
                <Clock size={16} />
              </div>
              <span className="text-[11px] font-bold text-slate-700 leading-tight">Time Slots</span>
            </button>

            {/* Tile 3: Pricing */}
            <button
              onClick={() => setActiveTab && setActiveTab('Pricing')}
              className="bg-white p-3 rounded-lg flex flex-col items-center justify-center text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-slate-100/80 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-1.5">
                <Tag size={16} />
              </div>
              <span className="text-[11px] font-bold text-slate-700 leading-tight">Pricing</span>
            </button>

          </div>
        </div>

        {/* 7. Today's Bookings List */}
        <div className="bg-white rounded-lg p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] border border-slate-100/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Today's Bookings</h3>
            <button
              onClick={() => setActiveTab && setActiveTab('Bookings')}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-0.5"
            >
              <span>See All</span>
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Slot Rows */}
          <div className="space-y-2.5">
            {displayBookings.length === 0 && (
              <p className="rounded-xl bg-slate-50/80 p-4 text-center text-xs font-medium text-slate-500">
                No bookings scheduled for today.
              </p>
            )}
            {displayBookings.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTab && setActiveTab('Bookings')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors cursor-pointer"
              >
                {/* Initials & Customer Name */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-lime-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {item.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-extrabold text-slate-900 truncate">
                      {item.customer}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-400 truncate mt-0.2">
                      {item.court}
                    </p>
                  </div>
                </div>

                {/* Time & Match Type */}
                <div className="text-right pr-2 shrink-0">
                  <p className="text-xs font-bold text-slate-800">{item.time}</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.2">{item.matchType}</p>
                </div>

                {/* Status Badge & Arrow */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${item.badgeBg}`}>
                    {item.status}
                  </span>
                  <ChevronRight size={14} className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileDashboard;
