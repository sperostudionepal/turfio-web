import { Clock, ChevronRight } from 'lucide-react';
import { getTodayNepalString, getNepalCurrentDateTime, parseSlotInterval } from '../../../shared/utils/dateTime';
import { getBookingDateStr, isActiveBooking } from '../../../shared/utils/bookingStatus';
import { useOwnerContext } from '../../context/ownerContext';

const STATUS_STYLES = {
  upcoming: { label: 'Upcoming', dotColor: 'bg-amber-400', badgeStyle: 'bg-amber-50 text-amber-600 font-bold' },
  ongoing: { label: 'Ongoing', dotColor: 'bg-lime-500 animate-pulse', badgeStyle: 'bg-lime-400 text-slate-950 font-extrabold shadow-xs' },
  completed: { label: 'Completed', dotColor: 'bg-emerald-500', badgeStyle: 'bg-emerald-50 text-emerald-600 font-bold' },
};

function ScheduleCard({ bookings = [] }) {
  const { openBookings } = useOwnerContext();
  const nowNpt = getNepalCurrentDateTime();
  const todayStr = getTodayNepalString();

  // Only today's live bookings, in slot order (cancelled bookings free the slot).
  const scheduleItems = bookings
    .filter((b) => isActiveBooking(b) && getBookingDateStr(b) === todayStr)
    .map((b) => {
      const interval = parseSlotInterval(b.timeSlot);
      const startMinutes = b.startMinutes ?? interval.startMinutes;
      const endMinutes = b.endMinutes ?? interval.endMinutes;

      let statusType = 'upcoming';
      if (endMinutes <= nowNpt.minutes) statusType = 'completed';
      else if (startMinutes <= nowNpt.minutes) statusType = 'ongoing';

      return {
        key: b._id || b.bookingId || `${b.timeSlot}-${b.court?.name}`,
        startMinutes,
        startTime: interval.startTime,
        endTime: interval.endTime,
        customer: [b.user?.firstName, b.user?.lastName].filter(Boolean).join(' ') || b.customer?.name || 'Customer',
        courtName: b.court?.name || 'Court 1',
        statusType,
        ...STATUS_STYLES[statusType],
      };
    })
    .sort((a, b) => a.startMinutes - b.startMinutes);

  return (
    <div className="bg-white rounded-xl overflow-hidden p-5 flex flex-col justify-between h-full shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-lime-100 flex items-center justify-center text-lime-600">
              <Clock size={16} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Today's Schedule</h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-lime-50 text-lime-600">
            {scheduleItems.length} {scheduleItems.length === 1 ? 'Slot' : 'Slots'} Today
          </span>
        </div>

        {/* Timeline List */}
        {scheduleItems.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 font-medium">
            No bookings scheduled for today.
          </div>
        ) : (
          <div className="relative space-y-3 pt-1 max-h-[17rem] overflow-y-auto pr-1">
            {/* Vertical Connecting Line */}
            <div className="absolute left-[5px] top-4 bottom-4 w-[2px] bg-slate-100 rounded-full pointer-events-none z-0" />

            {scheduleItems.map((item) => (
              <div key={item.key} className="relative flex items-center gap-3.5 group">
                {/* Timeline Dot */}
                <div className={`w-3 h-3 rounded-full shrink-0 relative z-10 ${item.dotColor}`} />

                {/* Card Container */}
                <div
                  className={`flex-1 flex items-center justify-between p-3 rounded-2xl transition-colors ${
                    item.statusType === 'ongoing'
                      ? 'bg-lime-50/80 ring-1 ring-lime-300/60 text-slate-900'
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
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="pt-3 mt-3">
        {openBookings && (
          <button
            onClick={() => openBookings({ date: 'today' })}
            className="flex items-center justify-between w-full text-xs text-lime-600 font-bold hover:text-lime-700 transition-colors cursor-pointer group"
          >
            <span>View Complete Day Schedule</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ScheduleCard;
