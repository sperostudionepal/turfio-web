import { ChevronRight, Clock } from 'lucide-react';

function Schedule() {
  const schedule = [
    {
      time: '06:00 PM',
      endTime: '09:00 PM',
      venue: 'Green Arena',
      sport: 'Football - 4 Slots',
      status: 'Confirmed',
      statusColor: 'bg-green-100 text-green-700',
    },
    {
      time: '07:00 PM',
      endTime: '10:00 PM',
      venue: 'Play Field 2',
      sport: 'Cricket - Amit Verma',
      status: 'Confirmed',
      statusColor: 'bg-green-100 text-green-700',
    },
    {
      time: '08:00 PM',
      endTime: '09:00 PM',
      venue: 'Victory Turf',
      sport: 'Football - Sachin Patel',
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-700',
    },
    {
      time: '09:00 PM',
      endTime: '10:00 PM',
      venue: 'Elite Arena',
      sport: 'Football - Karan Singh',
      status: 'Confirmed',
      statusColor: 'bg-green-100 text-green-700',
    },
    {
      time: '10:00 PM',
      endTime: '11:00 PM',
      venue: 'City Ground',
      sport: 'Cricket - Sugar Gupta',
      status: 'Confirmed',
      statusColor: 'bg-green-100 text-green-700',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900">Today's Schedule</h3>
        <button className="text-green-600 text-xs font-bold hover:text-green-700 transition-colors flex items-center gap-1">
          View Calendar <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {schedule.map((item, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Clock size={14} className="text-slate-400" />
                {item.time}
              </div>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded whitespace-nowrap ${item.statusColor}`}>
                {item.status}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-900 mb-1">{item.venue}</p>
            <p className="text-xs text-slate-600">{item.sport}</p>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-green-600 text-xs font-bold hover:text-green-700 transition-colors flex items-center justify-center gap-1">
        View Full Schedule <ChevronRight size={14} />
      </button>
    </div>
  );
}

export default Schedule;
