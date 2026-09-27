import { ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';

const MAX_VALUE = 20000;

const formatAxisValue = (value) =>
  value >= 1000 ? `${Math.round(value / 1000)}K` : String(Math.round(value));

function RevenueOverview({
  data = [],
  total = 0,
  change = 0,
  periodLabel = 'This Week',
  subtext = 'from yesterday',
  maxValue = MAX_VALUE,
}) {
  const showBadge = change != null;
  const negative = showBadge && Number(change) < 0;
  const BadgeIcon = negative ? ArrowDown : ArrowUp;

  const axisLabels = [4, 3, 2, 1, 0].map((step) =>
    formatAxisValue((maxValue * step) / 4)
  );

  return (
    <div className="h-full rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[16px] font-bold text-slate-900">
            Revenue Overview
          </h3>

          {/* Amount */}
          <div className="mt-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[20px] font-extrabold leading-none tracking-[-0.025em] text-slate-950">
                NRs. {Math.round(total).toLocaleString()}
              </span>

              {showBadge && (
                <span
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] font-extrabold leading-none ${negative
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-emerald-50 text-emerald-600'
                    }`}
                >
                  <BadgeIcon size={11} strokeWidth={2.5} />
                  {Math.abs(change || 0)}%
                </span>
              )}
            </div>

            <p className="mt-2 text-[12px] font-medium leading-none text-slate-400">
              {subtext}
            </p>
          </div>
        </div>

        {/* Period */}
        <button
          type="button"
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-50 px-3 py-2 text-[13px] font-bold text-slate-600 transition-colors hover:bg-slate-100"
        >
          {periodLabel}

          <ChevronDown size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-end gap-4 text-[12px] font-semibold text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ABE435]" />
          <span>Online Payments</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-lime-200" />
          <span>Pay at Venue</span>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-3 flex h-[190px]">
        {/* Y Axis */}
        <div className="flex w-10 shrink-0 flex-col justify-between pb-[38px] pr-2 text-right text-[11px] font-bold text-slate-400">
          {axisLabels.map((label) => (
            <span key={label}>
              {label}
            </span>
          ))}
        </div>

        {/* Chart Body */}
        <div className="relative min-w-0 flex-1">
          {/* Grid Lines */}
          <div className="absolute inset-x-0 bottom-[38px] top-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((line) => (
              <div
                key={line}
                className="w-full border-t border-dashed border-slate-100"
              />
            ))}
          </div>

          {/* Bars */}
          <div className="relative z-10 flex h-full justify-center">
            <div className="flex h-full w-[88%] items-start justify-between">
              {data.map((item) => {
                const itemTotal = item.online + item.venue;

                const totalHeight = Math.min(
                  (itemTotal / maxValue) * 100,
                  100
                );

                const onlineRatio =
                  itemTotal > 0
                    ? (item.online / itemTotal) * 100
                    : 0;

                const venueRatio =
                  itemTotal > 0
                    ? (item.venue / itemTotal) * 100
                    : 0;

                const isToday = item.isToday;

                return (
                  <div
                    key={item.day}
                    className="flex h-full w-[36px] shrink-0 flex-col items-center"
                  >
                    {/* Plot Area */}
                    <div className="flex h-[151px] w-full items-end justify-center">
                      <div
                        className="flex w-[22px] flex-col-reverse overflow-hidden rounded-t-[3px]"
                        style={{
                          height: `${totalHeight}%`,
                        }}
                      >
                        {/* Online Payments */}
                        <div
                          className="w-full bg-[#ABE435]"
                          style={{
                            height: `${onlineRatio}%`,
                          }}
                        />

                        {/* Pay at Venue */}
                        <div
                          className="w-full bg-lime-200"
                          style={{
                            height: `${venueRatio}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Day */}
                    <div
                      className={`mt-1.5 flex min-w-[36px] flex-col items-center rounded-md px-1.5 py-1 text-[11px] leading-[14px] ${isToday
                          ? 'bg-slate-100 font-semibold text-slate-900'
                          : 'font-bold text-slate-500'
                        }`}
                    >
                      <span>{item.day}</span>

                      {item.date ? (
                        <span>{item.date}</span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevenueOverview;