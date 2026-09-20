import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PeriodSelect from './PeriodSelect';
import { getTodayNepalString } from '../../utils/dateTime';
import { getBookingDateStr, isActiveBooking } from '../../utils/bookingStatus';
import { addDays, startOfWeek } from '../../utils/dashboardStats';

const WEEK_OPTIONS = [
  { value: 'this', label: 'This Week' },
  { value: 'last', label: 'Last Week' },
];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { day, date } = payload[0].payload;
  return (
    <div className="flex flex-col items-center -translate-y-2 animate-in fade-in zoom-in-95 duration-100">
      <div className="bg-[#1e293b] text-white px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-2xl text-center">
        <p className="text-[10px] font-medium text-slate-300">
          {day} · {date}
        </p>
        <p className="text-xs font-black text-white mt-0.5">Bookings: {payload[0].value}</p>
      </div>
      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#1e293b] -mt-[1px]" />
    </div>
  );
}

function RevenueChart({ bookings = [] }) {
  const [week, setWeek] = useState('this');

  const today = getTodayNepalString();
  const weekStart = addDays(startOfWeek(today), week === 'last' ? -7 : 0);

  const activeBookings = bookings.filter(isActiveBooking);
  const data = DAY_LABELS.map((day, index) => {
    const date = addDays(weekStart, index);
    return {
      day,
      date,
      bookings: activeBookings.filter((b) => getBookingDateStr(b) === date).length,
    };
  });

  const weekTotal = data.reduce((sum, d) => sum + d.bookings, 0);
  const maxBookings = Math.max(5, ...data.map((d) => d.bookings));
  const yAxisMax = Math.ceil(maxBookings / 5) * 5 + 5;

  return (
    <div className="bg-white rounded-xl overflow-hidden p-5 flex flex-col justify-between h-full shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-lime-100 flex items-center justify-center text-lime-600">
            <BarChart3 size={16} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight leading-tight">Bookings Overview</h3>
            <span className="text-[11px] font-medium text-slate-400">
              {weekTotal} {weekTotal === 1 ? 'booking' : 'bookings'}
            </span>
          </div>
        </div>
        <PeriodSelect value={week} onChange={setWeek} options={WEEK_OPTIONS} ariaLabel="Select week" />
      </div>

      {/* Bar Chart Container */}
      <div className="h-60 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }} barCategoryGap="28%">
            <defs>
              {/* Light Green for Regular Bars */}
              <linearGradient id="normalBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#bef264" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#a3e635" stopOpacity={0.6} />
              </linearGradient>

              {/* Lime Primary Highlight Bar */}
              <linearGradient id="activeBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a3e635" stopOpacity={1} />
                <stop offset="100%" stopColor="#84cc16" stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
              dy={4}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600, dx: -14 }}
              domain={[0, yAxisMax]}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey="bookings" barSize={22} radius={[12, 12, 12, 12]}>
              {data.map((entry) => (
                <Cell
                  key={entry.date}
                  fill={entry.date === today ? 'url(#activeBarGrad)' : 'url(#normalBarGrad)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;
