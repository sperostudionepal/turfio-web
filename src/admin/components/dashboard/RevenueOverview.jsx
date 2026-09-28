import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import PeriodSelect from './PeriodSelect';
import BookingDateRangeCalendar from '../bookings/BookingDateRangeCalendar';

const MAX_VALUE = 20000;
const formatAxisValue = (value) => value >= 1000 ? `${Math.round(value / 1000)}K` : String(Math.round(value));
const WIDGET_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'all', label: 'All Time' },
  { value: 'custom', label: 'Custom Range' },
];

const rangeLabel = (range) => {
  if (!range?.from || !range?.to) return 'Custom Range';
  const format = (value) => new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${format(range.from)} – ${format(range.to)}`;
};

function RevenueOverview({ data = [], total = 0, change = null, subtext = 'All-time total', period = 'month', customRange = null, onPeriodChange, onCustomRangeApply, maxValue = MAX_VALUE }) {
  const [rangeOpen, setRangeOpen] = useState(false);
  const showBadge = change != null;
  const negative = showBadge && Number(change) < 0;
  const BadgeIcon = negative ? ArrowDown : ArrowUp;
  const dataMax = Math.max(...data.map((item) => Number(item.online || 0) + Number(item.venue || 0)), 0);
  const resolvedMax = Math.max(maxValue, dataMax || 1);
  const axisLabels = [4, 3, 2, 1, 0].map((step) => formatAxisValue((resolvedMax * step) / 4));

  return (
    <div className="h-full rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[16px] font-bold text-slate-900">Revenue Overview</h3>
          <div className="mt-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[20px] font-extrabold leading-none tracking-[-0.025em] text-slate-950">NRs. {Math.round(total).toLocaleString()}</span>
              {showBadge && <span className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] font-extrabold leading-none ${negative ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}><BadgeIcon size={11} strokeWidth={2.5} />{Math.abs(change)}%</span>}
            </div>
            <p className="mt-2 text-[12px] font-medium leading-none text-slate-400">{subtext}</p>
          </div>
        </div>
        <div className="relative shrink-0"><PeriodSelect value={period} onChange={(value) => { if (value === 'custom') setRangeOpen(true); else onPeriodChange?.(value); }} options={WIDGET_OPTIONS} displayLabel={period === 'custom' ? rangeLabel(customRange) : undefined} ariaLabel="Revenue period" />{rangeOpen && <BookingDateRangeCalendar value={customRange || { from: '', to: '' }} onApply={(range) => { onCustomRangeApply?.(range); setRangeOpen(false); }} onClose={() => setRangeOpen(false)} />}</div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-4 text-[12px] font-semibold text-slate-500">
        <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ABE435]" /><span>Online Payments</span></div>
        <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-lime-200" /><span>Pay at Venue</span></div>
      </div>

      <div className="mt-3 flex h-[190px]">
        <div className="flex w-10 shrink-0 flex-col justify-between pb-[38px] pr-2 text-right text-[11px] font-bold text-slate-400">{axisLabels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div>
        <div className="relative min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative h-full" style={{ minWidth: data.length > 7 ? `${(data.length / 7) * 100}%` : '100%' }}>
            <div className="absolute inset-x-0 bottom-[38px] top-0 flex flex-col justify-between">{[0,1,2,3,4].map((line)=><div key={line} className="w-full border-t border-dashed border-slate-100" />)}</div>
            <div className="relative z-10 flex h-full"><div className="flex h-full w-full items-start">
            {data.map((item, index) => {
              const itemTotal = item.online + item.venue;
              const totalHeight = Math.min((itemTotal / resolvedMax) * 100, 100);
              const onlineRatio = itemTotal > 0 ? (item.online / itemTotal) * 100 : 0;
              const venueRatio = itemTotal > 0 ? (item.venue / itemTotal) * 100 : 0;
              return <div key={`${item.day}-${item.date}-${index}`} className="flex h-full min-w-0 flex-1 flex-col items-center">
                <div className="flex h-[151px] w-full items-end justify-center"><div className="flex w-[22px] flex-col-reverse overflow-hidden rounded-t-[3px]" style={{ height: `${totalHeight}%` }}><div className="w-full bg-[#ABE435]" style={{ height: `${onlineRatio}%` }} /><div className="w-full bg-lime-200" style={{ height: `${venueRatio}%` }} /></div></div>
                <div className={`mt-1.5 flex min-w-[36px] flex-col items-center rounded-md px-1 py-1 text-[10px] leading-[14px] ${item.isToday ? 'bg-slate-100 font-semibold text-slate-900' : 'font-bold text-slate-500'}`}><span>{item.day}</span>{item.date ? <span>{item.date}</span> : null}</div>
              </div>;
            })}
            </div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RevenueOverview;
