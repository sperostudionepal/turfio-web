import { ChevronDown, ChevronRight, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function RevenueSummaryDonut() {
  const data = [
    { name: 'Court Bookings', value: 135669.0, color: '#34d399', percentage: '82%' },
    { name: 'Equipment & Rentals', value: 29781.0, color: '#38bdf8', percentage: '18%' },
  ];

  return (
    <div className="bg-white rounded-[24px] p-5 flex flex-col justify-between h-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-lime-100 flex items-center justify-center text-lime-500">
              <PieChartIcon size={16} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Revenue Summary</h3>
          </div>
          <button className="flex items-center gap-1 text-xs font-semibold text-slate-700 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer">
            <span>This Month</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
        </div>

        {/* Filled Pie Chart & Total Revenue Right Side Container */}
        <div className="flex items-center justify-between gap-3 my-2">
          {/* Left: Filled Pie Chart */}
          <div className="relative h-36 w-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={65}
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={3}
                  strokeLinejoin="round"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Right Side: Total Revenue Stat Block */}
          <div className="flex-1 flex flex-col justify-center pl-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5 block">
              NRs. 165.4K
            </span>
            <span className="text-[11px] font-semibold text-lime-500 mt-1 block">
              +12.5% vs last month
            </span>
          </div>
        </div>

        {/* Legend Breakdown List */}
        <div className="space-y-3.5 mt-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-slate-900">NRs. {item.value.toLocaleString('en-NP')}</span>
                <span className="text-slate-400 w-7 text-right font-medium">{item.percentage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-3 mt-3 border-t border-slate-100">
        <button className="flex items-center justify-between w-full text-xs text-slate-500 font-semibold hover:text-slate-900 transition-colors cursor-pointer">
          <span>View full analytics</span>
          <ChevronRight size={14} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}

export default RevenueSummaryDonut;
