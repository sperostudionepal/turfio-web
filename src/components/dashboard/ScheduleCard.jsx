import { Clock, ChevronRight } from 'lucide-react';

function ScheduleCard() {
  const scheduleItems = [
    {
      startTime: '08:00 AM',
      endTime: '09:00 AM',
      customer: 'Aarav Sharma',
      status: 'Completed',
      statusType: 'completed',
      badgeStyle: 'bg-lime-50 text-lime-500 font-bold',
      dotColor: 'bg-lime-400',
    },
    {
      startTime: '09:00 AM',
      endTime: '10:00 AM',
      customer: 'Rohan Shrestha',
      status: 'Ongoing',
      statusType: 'ongoing',
      badgeStyle: 'bg-lime-400 text-slate-900 font-extrabold',
      dotColor: 'bg-lime-400',
    },
    {
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      customer: 'Sujan Thapa',
      status: 'Upcoming',
      statusType: 'upcoming',
      badgeStyle: 'bg-amber-50 text-amber-400 font-bold',
      dotColor: 'bg-amber-400',
    },
  ];

  return (
    <div className="bg-white rounded-[24px] p-5 flex flex-col justify-between h-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-lime-100 flex items-center justify-center text-lime-500">
              <Clock size={16} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Today's Schedule</h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-lime-50 text-lime-500">
            3 Slots Today
          </span>
        </div>

        {/* Timeline List */}
        <div className="relative space-y-3 pt-1">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[5px] top-4 bottom-4 w-[2px] bg-slate-100 rounded-full pointer-events-none z-0" />

          {scheduleItems.map((item, idx) => (
            <div key={idx} className="relative flex items-center gap-3.5 group">
              {/* Timeline Dot (perfectly centered on line) */}
              <div
                className={`w-3 h-3 rounded-full shrink-0 relative z-10 ${item.dotColor}`}
              />

              {/* Card Container */}
              <div
                className={`flex-1 flex items-center justify-between p-3 rounded-2xl transition-colors ${
                  item.statusType === 'ongoing'
                    ? 'bg-lime-50 text-slate-900'
                    : 'bg-slate-50 hover:bg-slate-100/80'
                }`}
              >
                {/* Time & Customer Info */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <span>{item.startTime}</span>
                    <span className="text-slate-400 font-normal">→</span>
                    <span className="text-slate-600 font-bold">{item.endTime}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {item.customer}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.badgeStyle}`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-3 mt-3 border-t border-slate-100">
        <button className="flex items-center justify-between w-full text-xs text-lime-500 font-semibold hover:text-lime-700 transition-colors cursor-pointer group">
          <span>View Complete Day Schedule</span>
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default ScheduleCard;
