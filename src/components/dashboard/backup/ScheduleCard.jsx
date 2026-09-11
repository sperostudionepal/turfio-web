import { Clock, ChevronRight, CircleDot } from 'lucide-react';
import { getTodayNepalString, getNepalCurrentDateTime, parseSlotInterval } from '../../utils/dateTime';

function ScheduleCard({ bookings = [] }) {
  const nowNpt = getNepalCurrentDateTime();
  const todayStr = getTodayNepalString();

  // Filter today's bookings first
  const isToday = (b) => {
    const dStr = b.dateStr || (b.date ? new Date(b.date).toISOString().slice(0, 10) : '');
    return dStr.startsWith(todayStr);
  };

  const todayBookings = bookings.filter(isToday);

  // If fewer than 3 today, append future upcoming bookings, then recent bookings
  const otherBookings = bookings.filter((b) => !isToday(b));
  const futureBookings = otherBookings.filter((b) => {
    const dStr = b.dateStr || (b.date ? new Date(b.date).toISOString().slice(0, 10) : '');
    return dStr > todayStr;
  });
  const pastBookings = otherBookings.filter((b) => {
    const dStr = b.dateStr || (b.date ? new Date(b.date).toISOString().slice(0, 10) : '');
    return dStr < todayStr;
  });

  const displayList = [...todayBookings, ...futureBookings, ...pastBookings].slice(0, 4);

  const scheduleItems = displayList.map((b) => {
    const interval = parseSlotInterval(b.timeSlot);
    const startMinutes = b.startMinutes ?? interval.startMinutes;
    const endMinutes = b.endMinutes ?? interval.endMinutes;
    const bookingDate = b.dateStr || (b.date ? new Date(b.date).toISOString().slice(0, 10) : todayStr);

    let status = 'Upcoming';
    let statusType = 'upcoming';
    let dotColor = 'bg-amber-400';
    let badgeStyle = 'bg-amber-50 text-amber-600 font-bold';

    if (bookingDate < nowNpt.date || (bookingDate === nowNpt.date && endMinutes <= nowNpt.minutes)) {
      status = 'Completed';
      statusType = 'completed';
      dotColor = 'bg-emerald-500';
      badgeStyle = 'bg-emerald-50 text-emerald-600 font-bold';
    } else if (bookingDate === nowNpt.date && startMinutes <= nowNpt.minutes && endMinutes > nowNpt.minutes) {
      status = 'Ongoing';
      statusType = 'ongoing';
      dotColor = 'bg-[#FE4A49] animate-pulse';
      badgeStyle = 'bg-[#FE4A49] text-white font-extrabold shadow-xs';
    } else {
      status = 'Upcoming';
      statusType = 'upcoming';
      dotColor = 'bg-amber-400';
      badgeStyle = 'bg-amber-50 text-amber-600 font-bold';
    }

    const customer = [b.user?.firstName, b.user?.lastName].filter(Boolean).join(' ') || b.customer?.name || 'Customer';
    const courtName = b.court?.name || 'Court 1';

    return {
      startTime: interval.startTime,
      endTime: interval.endTime,
      customer,
      courtName,
      status,
      statusType,
      badgeStyle,
      dotColor,
      isTodayMatch: bookingDate === todayStr,
    };
  });

  return (
    <div className="bg-white rounded-[24px] p-5 flex flex-col justify-between h-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fff1f1] flex items-center justify-center text-[#FE4A49]">
              <Clock size={16} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Today's Schedule</h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#fff1f1] text-[#FE4A49]">
            {todayBookings.length} {todayBookings.length === 1 ? 'Slot' : 'Slots'} Today
          </span>
        </div>

        {/* Timeline List */}
        {scheduleItems.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 font-medium">
            No bookings scheduled yet today.
          </div>
        ) : (
          <div className="relative space-y-3 pt-1">
            {/* Vertical Connecting Line */}
            <div className="absolute left-[5px] top-4 bottom-4 w-[2px] bg-slate-100 rounded-full pointer-events-none z-0" />

            {scheduleItems.map((item, idx) => (
              <div key={idx} className="relative flex items-center gap-3.5 group">
                {/* Timeline Dot */}
                <div className={`w-3 h-3 rounded-full shrink-0 relative z-10 ${item.dotColor}`} />

                {/* Card Container */}
                <div
                  className={`flex-1 flex items-center justify-between p-3 rounded-2xl transition-colors ${
                    item.statusType === 'ongoing'
                      ? 'bg-rose-50/80 ring-1 ring-rose-200 text-slate-900'
                      : 'bg-slate-50 hover:bg-slate-100/80'
                  }`}
                >
                  {/* Time & Customer Info */}
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <span>{item.startTime}</span>
                      <span className="text-slate-400 font-normal">→</span>
                      <span className="text-slate-600 font-bold">{item.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-700 font-semibold truncate">
                        {item.customer}
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200/60 shrink-0">
                        {item.courtName}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[10px] px-2.5 py-1 rounded-full shrink-0 ${item.badgeStyle}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="pt-3 mt-3 border-t border-slate-100">
        <button className="flex items-center justify-between w-full text-xs text-[#FE4A49] font-bold hover:text-[#e03e3d] transition-colors cursor-pointer group">
          <span>View Complete Day Schedule</span>
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default ScheduleCard;
