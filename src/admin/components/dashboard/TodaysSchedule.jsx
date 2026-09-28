import StatusBadge from '../common/StatusBadge';


const timelineStyles = {
    'In Progress': 'bg-blue-500',
    Confirmed: 'bg-blue-500',
    Completed: 'bg-emerald-500',
    Cancelled: 'bg-red-500',
    Available: 'border-2 border-slate-400 bg-white',
};

function TodaysSchedule({ onViewCalendar, schedule = [] }) {
    return (
        <div className="h-full rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-[16px] font-bold text-slate-900">
                    Today&apos;s Schedule
                </h3>

                <button
                    type="button"
                    onClick={onViewCalendar}
                    className="shrink-0 text-[12px] font-bold text-blue-500 transition-colors hover:text-blue-600"
                >
                    View Calendar
                </button>
            </div>

            {/* Schedule */}
            <div>
                {schedule.map((item, index) => (
                    <div
                        key={item.id}
                        className="relative flex min-h-[52px] items-center"
                    >
                        {/* Timeline */}
                        <div className="relative flex w-7 shrink-0 self-stretch justify-center">
                            {index !== schedule.length - 1 && (
                                <span className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 bg-slate-200" />
                            )}

                            <span
                                className={`
                  relative
                  z-10
                  mt-[15px]
                  h-3
                  w-3
                  shrink-0
                  rounded-full
                  ${timelineStyles[item.status]}
                `}
                            />
                        </div>

                        {/* Booking information */}
                        <div
                            className={`
                flex
                min-w-0
                flex-1
                items-center
                gap-3
                py-2
                ${index !== schedule.length - 1
                                    ? 'border-b border-slate-100'
                                    : ''
                                }
              `}
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[12px] font-bold leading-tight text-slate-800">
                                    {item.time}
                                </p>

                                <p className="mt-1 truncate text-[11px] font-medium leading-tight text-slate-500">
                                    {item.customer}
                                </p>
                            </div>

                            {/* Court */}
                            <span className="shrink-0 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-semibold leading-none text-slate-500">
                                {item.court}
                            </span>

                            {/* Status */}
                            <StatusBadge status={item.status} className="min-w-[74px] justify-center py-1.5" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TodaysSchedule;