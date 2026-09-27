const statusStyles = {
    Confirmed: 'bg-lime-50 text-lime-600',
    Completed: 'bg-slate-100 text-slate-600',
    Cancelled: 'bg-rose-50 text-rose-600',
};

function DashboardRecentBookings({ onViewAll, bookings = [] }) {
    return (
        <div className="h-full rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-[16px] font-bold text-slate-900">
                    Recent Bookings
                </h3>

                <button
                    type="button"
                    onClick={onViewAll}
                    className="shrink-0 text-[13px] font-bold text-blue-500 transition-colors hover:text-blue-600"
                >
                    View All
                </button>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[650px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-[1.9fr_0.8fr_0.8fr_1.15fr_0.95fr_0.95fr] items-center gap-3 border-b border-slate-100 pb-2.5">
                        {[
                            'Customer',
                            'Court',
                            'Date',
                            'Time',
                            'Amount',
                            'Status',
                        ].map((label) => (
                            <span
                                key={label}
                                className="text-[12px] font-bold uppercase tracking-wide text-slate-400"
                            >
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* Table Rows */}
                    <div>
                        {bookings.map((booking, index) => (
                            <div
                                key={booking.id}
                                className={`grid min-h-[58px] grid-cols-[1.9fr_0.8fr_0.8fr_1.15fr_0.95fr_0.95fr] items-center gap-3 transition-colors hover:bg-slate-50/70 ${index !== bookings.length - 1
                                        ? 'border-b border-slate-100'
                                        : ''
                                    }`}
                            >
                                {/* Customer */}
                                <div className="flex min-w-0 items-center gap-2.5">
                                    {booking.avatarUrl ? (
                                        <img
                                            src={booking.avatarUrl}
                                            alt={booking.customer}
                                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${booking.avatarClass ||
                                                'bg-lime-100 text-lime-700'
                                                }`}
                                        >
                                            {booking.initials}
                                        </div>
                                    )}

                                    <div className="min-w-0">
                                        <p className="truncate text-[13px] font-bold text-slate-700">
                                            {booking.customer}
                                        </p>

                                        {booking.email && (
                                            <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400">
                                                {booking.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Court */}
                                <span className="truncate text-[13px] font-medium text-slate-600">
                                    {booking.court}
                                </span>

                                {/* Date */}
                                <span className="truncate text-[13px] font-medium text-slate-600">
                                    {booking.date}
                                </span>

                                {/* Time */}
                                <span className="truncate text-[13px] font-medium text-slate-600">
                                    {booking.time}
                                </span>

                                {/* Amount */}
                                <span className="truncate text-[13px] font-semibold text-slate-700">
                                    {booking.amount}
                                </span>

                                {/* Status */}
                                <div>
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1.5 text-[11px] font-bold leading-none ${statusStyles[booking.status] ||
                                            statusStyles.Confirmed
                                            }`}
                                    >
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

export default DashboardRecentBookings;