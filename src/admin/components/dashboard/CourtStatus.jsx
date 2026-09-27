import { ChevronRight } from 'lucide-react';

const statusStyles = {
    'In Use': 'bg-emerald-50 text-emerald-600',
    Upcoming: 'bg-amber-50 text-amber-600',
    Available: 'bg-green-50 text-green-600',
    Maintenance: 'bg-slate-100 text-slate-500',
};

function CourtStatus({ onViewAll, courts = [] }) {
    return (
        <div className="h-full rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-slate-900">
                    Court Status
                </h3>

                <button
                    type="button"
                    onClick={onViewAll}
                    className="text-[13px] font-bold text-blue-500 transition-colors hover:text-blue-600"
                >
                    View All
                </button>
            </div>

            {/* Courts */}
            <div>
                {courts.map((court, index) => (
                    <button
                        type="button"
                        key={court.id}
                        className={`
                            flex
                            w-full
                            items-center
                            gap-3
                            py-3
                            text-left
                            transition-colors
                            hover:bg-slate-50
                            ${index !== courts.length - 1
                                ? 'border-b border-slate-100'
                                : ''
                            }
                        `}
                    >
                        {/* Image */}
                        <img
                            src={court.image}
                            alt={court.name}
                            className="h-10 w-10 shrink-0 rounded-md object-cover"
                        />

                        {/* Court information */}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[14px] font-bold text-slate-900">
                                {court.name}
                            </p>

                            <p className="mt-0.5 truncate text-[12px] font-medium text-slate-400">
                                {court.type}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="shrink-0">
                            <span
                                className={`
                                    inline-flex
                                    whitespace-nowrap
                                    rounded-full
                                    px-2.5
                                    py-1.5
                                    text-[12px]
                                    font-bold
                                    leading-none
                                    ${statusStyles[court.status]}
                                `}
                            >
                                {court.status}
                            </span>
                        </div>

                        {/* Booking information */}
                        <div className="hidden w-[118px] shrink-0 xl:block">
                            <p className="truncate text-[13px] font-bold text-slate-600">
                                {court.time}
                            </p>

                            {court.customer && (
                                <p className="mt-1 truncate text-[12px] font-medium text-slate-400">
                                    {court.customer}
                                </p>
                            )}
                        </div>

                        <ChevronRight
                            size={16}
                            strokeWidth={2}
                            className="shrink-0 text-slate-300"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CourtStatus;