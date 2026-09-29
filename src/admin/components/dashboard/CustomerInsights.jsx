



function CustomerInsights({ onViewAll, insights = [] }) {
    const TOTAL = insights.reduce((sum, item) => sum + item.value, 0);

    const { segments: gradientSegments } = insights.reduce(
        (acc, item) => {
            const start = acc.currentPercentage;
            const end = start + item.percentage;

            return {
                currentPercentage: end,
                segments: [...acc.segments, `${item.color} ${start}% ${end}%`],
            };
        },
        { currentPercentage: 0, segments: [] }
    );

    const chartBackground = `conic-gradient(${gradientSegments.join(', ')})`;

    return (
        <div className="h-full rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-[16px] font-bold text-slate-900">
                    Customer Insights
                </h3>

                <button
                    type="button"
                    onClick={onViewAll}
                    className="shrink-0 text-[12px] font-bold text-blue-500 transition-colors hover:text-blue-600"
                >
                    View All
                </button>
            </div>

            {/* Content */}
            <div className="mt-4 flex items-center gap-6">
                {/* Donut */}
                <div className="shrink-0">
                    <div
                        className="relative flex h-[132px] w-[132px] items-center justify-center rounded-full"
                        style={{
                            background: chartBackground,
                        }}
                    >
                        {/* Inner circle */}
                        <div className="flex h-[78px] w-[78px] flex-col items-center justify-center rounded-full bg-white">
                            <span className="text-[10px] font-semibold text-slate-400">
                                Total
                            </span>

                            <span className="mt-0.5 text-[20px] font-extrabold leading-none text-slate-900">
                                {TOTAL}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 space-y-3">
                    {insights.map((item) => (
                        <div
                            key={item.label}
                            className="grid grid-cols-[1fr_32px_34px] items-center gap-3"
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <span
                                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                                    style={{
                                        backgroundColor: item.color,
                                    }}
                                />

                                <span className="truncate text-[12px] font-semibold text-slate-600">
                                    {item.label}
                                </span>
                            </div>

                            <span className="text-right text-[12px] font-bold text-slate-800">
                                {item.value}
                            </span>

                            <span className="text-right text-[11px] font-semibold text-slate-400">
                                {item.percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CustomerInsights;