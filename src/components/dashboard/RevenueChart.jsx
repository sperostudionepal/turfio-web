import { ChevronDown, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function RevenueChart() {
  // Height values matching reference image (Mon: 16, Tue: 23, Wed: 28, Thu: 27, Fri: 39, Sat: 28, Sun: 16)
  const data = [
    { day: 'Mon', bookings: 16 },
    { day: 'Tue', bookings: 23 },
    { day: 'Wed', bookings: 28 },
    { day: 'Thu', bookings: 27 },
    { day: 'Fri', bookings: 39 },
    { day: 'Sat', bookings: 28 },
    { day: 'Sun', bookings: 16 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="flex flex-col items-center -translate-y-2 animate-in fade-in zoom-in-95 duration-100">
          <div className="bg-[#1e293b] text-white px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-2xl text-center">
            <p className="text-[10px] font-medium text-slate-300">Fri, 10 Jun</p>
            <p className="text-xs font-black text-white mt-0.5">
              Bookings: {payload[0].value}
            </p>
          </div>
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#1e293b] -mt-[1px]" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-[24px] p-5 flex flex-col justify-between h-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-lime-100 flex items-center justify-center text-lime-500">
            <BarChart3 size={16} />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Bookings Overview</h3>
        </div>
        <button className="flex items-center gap-1 text-xs font-semibold text-slate-700 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer">
          <span>This Week</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>
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
              ticks={[0, 10, 20, 30, 40, 50]}
              domain={[0, 50]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey="bookings" barSize={22} radius={[12, 12, 12, 12]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.day === 'Fri' ? 'url(#activeBarGrad)' : 'url(#normalBarGrad)'}
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
