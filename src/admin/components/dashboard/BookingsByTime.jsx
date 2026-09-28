import { useState } from 'react';
import PeriodSelect from './PeriodSelect';
import BookingDateRangeCalendar from '../bookings/BookingDateRangeCalendar';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const intensityClasses = { 0: 'bg-slate-50', 1: 'bg-lime-50', 2: 'bg-lime-200', 3: 'bg-[#ABE435]' };
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

function BookingsByTime({ rows = [], period = 'month', customRange = null, onPeriodChange, onCustomRangeApply }) {
  const [rangeOpen, setRangeOpen] = useState(false);
  return (
    <div className="h-full rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-bold text-slate-900">Bookings by Time</h3>
        <div className="relative shrink-0"><PeriodSelect value={period} onChange={(value) => { if (value === 'custom') setRangeOpen(true); else onPeriodChange?.(value); }} options={WIDGET_OPTIONS} displayLabel={period === 'custom' ? rangeLabel(customRange) : undefined} ariaLabel="Bookings by time period" />{rangeOpen && <BookingDateRangeCalendar value={customRange || { from: '', to: '' }} onApply={(range) => { onCustomRangeApply?.(range); setRangeOpen(false); }} onClose={() => setRangeOpen(false)} />}</div>
      </div>
      <div className="mt-5"><div className="grid grid-cols-[44px_repeat(7,minmax(0,1fr))] gap-x-1.5 gap-y-1.5">
        {rows.map((row) => <div key={row.time} className="contents">
          <div className="flex h-[24px] items-center whitespace-nowrap text-[11px] font-bold leading-none text-slate-400">{row.time}</div>
          {row.values.map((value,index)=><div key={`${row.time}-${days[index]}`} title={`${days[index]} ${row.time}`} className={`h-[24px] min-w-0 rounded-[4px] transition-transform duration-150 hover:scale-[1.04] ${intensityClasses[value]}`} />)}
        </div>)}
        <div className="h-5" />{days.map((day)=><div key={day} className="flex h-5 items-end justify-center text-center text-[11px] font-bold leading-none text-slate-500">{day}</div>)}
      </div></div>
      <div className="mt-4 flex items-center justify-center gap-5 text-[12px] font-semibold leading-none text-slate-500">
        <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-lime-50 ring-1 ring-lime-100" /><span>Low</span></div>
        <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-lime-200" /><span>Medium</span></div>
        <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ABE435]" /><span>High</span></div>
      </div>
    </div>
  );
}
export default BookingsByTime;
