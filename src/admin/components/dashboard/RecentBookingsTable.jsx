import { deriveBookingStatus, getBookingDateStr } from '../../../shared/utils/bookingStatus';
import { useOwnerContext } from '../../context/ownerContext';

const STATUS_STYLES = {
  Confirmed: 'bg-lime-50 text-lime-600',
  Pending: 'bg-amber-50 text-amber-600',
  Cancelled: 'bg-rose-50 text-rose-600',
  Completed: 'bg-slate-100 text-slate-600',
};

function RecentBookingsTable({ bookings = [] }) {
  const { openBookings } = useOwnerContext();
  // "Recent" = most recently booked (the API orders by match date, which puts far-future matches first).
  const recent = [...bookings].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const rows = recent.slice(0, 5).map((booking) => {
    const status = deriveBookingStatus(booking);
    const customer = booking.user || {};
    const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || booking.customer?.name || 'Customer';
    return {
      initials: name.slice(0, 2).toUpperCase(),
      initialsBg: 'bg-lime-100 text-lime-700',
      name,
      court: booking.court?.name || booking.courtName || 'Court 1',
      date: getBookingDateStr(booking) || '—',
      time: booking.timeSlot || '—',
      amount: `NRs. ${Number(booking.totalAmount || 0).toLocaleString('en-NP')}`,
      status,
      statusStyle: STATUS_STYLES[status] || STATUS_STYLES.Pending,
    };
  });

  return (
    <div className="bg-white rounded-xl overflow-hidden p-5 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Recent Bookings</h3>
        {openBookings && (
          <button
            onClick={() => openBookings()}
            className="text-xs font-semibold text-lime-600 hover:text-lime-700 transition-colors cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          {/* Header Grid Row */}
          <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-2.5 border-b border-slate-100">
            <span className="col-span-3">Customer</span>
            <span className="col-span-1">Court</span>
            <span className="col-span-2">Date</span>
            <span className="col-span-2">Time</span>
            <span className="col-span-2 text-right">Amount</span>
            <span className="col-span-2 text-right">Status</span>
          </div>

          {/* Rows List */}
          <div className="divide-y divide-slate-50">
            {rows.length === 0 ? <p className="py-8 text-center text-xs text-slate-400">No bookings yet.</p> : rows.map((booking, idx) => (
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
                <span className="col-span-1 text-slate-500 font-medium">{booking.court}</span>

                {/* Date Column */}
                <span className="col-span-2 text-slate-500 font-medium">{booking.date}</span>

                {/* Time Column */}
                <span className="col-span-2 text-slate-500 font-medium">{booking.time}</span>

                {/* Amount Column */}
                <span className="col-span-2 font-bold text-slate-900 text-right">{booking.amount}</span>

                {/* Status Badge */}
                <div className="col-span-2 flex items-center justify-end">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${booking.statusStyle}`}>
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
