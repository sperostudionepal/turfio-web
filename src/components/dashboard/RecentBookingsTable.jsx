import { MoreVertical } from 'lucide-react';

function RecentBookingsTable() {
  const bookings = [
    {
      initials: 'JS',
      initialsBg: 'bg-rose-100 text-rose-600',
      name: 'John Smith',
      court: 'Main Turf',
      date: '12 Jun 2026',
      time: '08:00 AM',
      amount: 'NRs. 1,600',
      status: 'Completed',
      statusStyle: 'bg-lime-50 text-lime-500',
    },
    {
      initials: 'MT',
      initialsBg: 'bg-blue-100 text-blue-600',
      name: 'Michael Tan',
      court: 'Main Turf',
      date: '12 Jun 2026',
      time: '09:00 AM',
      amount: 'NRs. 2,000',
      status: 'Ongoing',
      statusStyle: 'bg-blue-50 text-blue-600',
    },
    {
      initials: 'SR',
      initialsBg: 'bg-amber-100 text-amber-600',
      name: 'Sarah Rose',
      court: 'Main Turf',
      date: '12 Jun 2026',
      time: '10:00 AM',
      amount: 'NRs. 1,600',
      status: 'Upcoming',
      statusStyle: 'bg-amber-50 text-amber-600',
    },
    {
      initials: 'DB',
      initialsBg: 'bg-lime-100 text-lime-400',
      name: 'David Brown',
      court: 'Main Turf',
      date: '12 Jun 2026',
      time: '11:00 AM',
      amount: 'NRs. 2,000',
      status: 'Upcoming',
      statusStyle: 'bg-amber-50 text-amber-600',
    },
    {
      initials: 'LM',
      initialsBg: 'bg-purple-100 text-purple-600',
      name: 'Lisa Martinez',
      court: 'Main Turf',
      date: '12 Jun 2026',
      time: '12:00 PM',
      amount: 'NRs. 1,600',
      status: 'Upcoming',
      statusStyle: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Recent Bookings</h3>
        <button className="text-xs font-semibold text-lime-400 hover:text-lime-700 transition-colors cursor-pointer">
          View All
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          {/* Header Grid Row */}
          <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-2.5 border-b border-slate-100">
            <span className="col-span-3">Customer</span>
            <span className="col-span-2">Court</span>
            <span className="col-span-2">Date</span>
            <span className="col-span-2">Time</span>
            <span className="col-span-2 text-right">Amount</span>
            <span className="col-span-1 text-right">Status</span>
          </div>

          {/* Rows List */}
          <div className="divide-y divide-slate-50">
            {bookings.map((booking, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center py-3 text-xs hover:bg-slate-50/70 transition-colors rounded-xl px-1">
                {/* Customer Column */}
                <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${booking.initialsBg}`}>
                    {booking.initials}
                  </div>
                  <span className="font-bold text-slate-900 text-xs truncate">
                    {booking.name}
                  </span>
                </div>

                {/* Court Column */}
                <span className="col-span-2 text-slate-500 font-medium">{booking.court}</span>

                {/* Date Column */}
                <span className="col-span-2 text-slate-500 font-medium">{booking.date}</span>

                {/* Time Column */}
                <span className="col-span-2 text-slate-500 font-medium">{booking.time}</span>

                {/* Amount Column */}
                <span className="col-span-2 font-bold text-slate-900 text-right">{booking.amount}</span>

                {/* Status Badge */}
                <div className="col-span-1 flex items-center justify-end">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${booking.statusStyle}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentBookingsTable;
