import { ChevronDown, ChevronRight, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function RevenueSummaryDonut({ bookings = [] }) {
  const isManual = (b) =>
    b.paymentMethod === 'Pay at Venue' ||
    b.paymentType === 'venue' ||
    b.source === 'Walk-in Counter' ||
    b.source === 'Phone Call';

  const manualBookings = bookings.filter(isManual);
  const onlineBookings = bookings.filter((b) => !isManual(b));

  const manualPaidRevenue = manualBookings.reduce(
    (sum, b) => sum + (b.paymentStatus === 'Paid' ? Number(b.totalPaidAmount || b.totalAmount || 0) : 0),
    0
  );
  const onlinePaidRevenue = onlineBookings.reduce(
    (sum, b) => sum + (b.paymentStatus === 'Paid' ? Number(b.totalPaidAmount || b.totalAmount || 0) : 0),
    0
  );

  const totalPaidRevenue = manualPaidRevenue + onlinePaidRevenue;

  // Determine chart values
  let onlineVal = onlinePaidRevenue;
  let manualVal = manualPaidRevenue;
  let onlinePct = 50;
  let manualPct = 50;

  if (totalPaidRevenue > 0) {
    onlinePct = Math.round((onlinePaidRevenue / totalPaidRevenue) * 100);
    manualPct = 100 - onlinePct;
  } else if (bookings.length > 0) {
    onlineVal = onlineBookings.length || 1;
    manualVal = manualBookings.length || 1;
    const totalCount = onlineVal + manualVal;
    onlinePct = Math.round((onlineVal / totalCount) * 100);
    manualPct = 100 - onlinePct;
  } else {
    onlineVal = 1;
    manualVal = 1;
  }

  const data = [
    {
      name: 'Online Bookings',
      value: onlineVal,
      revenue: onlinePaidRevenue,
      count: onlineBookings.length,
      color: '#FE4A49',
      percentage: `${onlinePct}%`,
    },
    {
      name: 'Manual Bookings',
      value: manualVal,
      revenue: manualPaidRevenue,
      count: manualBookings.length,
      color: '#38bdf8',
      percentage: `${manualPct}%`,
    },
  ];

  const formattedTotalRevenue =
    totalPaidRevenue >= 100000
      ? `NRs. ${(totalPaidRevenue / 1000).toFixed(1)}K`
      : `NRs. ${totalPaidRevenue.toLocaleString('en-NP')}`;

  return (
    <div className="bg-white rounded-[24px] p-5 flex flex-col justify-between h-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fff1f1] flex items-center justify-center text-[#FE4A49]">
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
              {formattedTotalRevenue}
            </span>
            <span className="text-[11px] font-semibold text-[#FE4A49] mt-1 block">
              {bookings.length} total bookings
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
                <span className="text-[10px] text-slate-400 font-medium">({item.count})</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-slate-900">NRs. {item.revenue.toLocaleString('en-NP')}</span>
                <span className="text-slate-400 w-8 text-right font-bold">{item.percentage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-3 mt-3 border-t border-slate-100">
        <button className="flex items-center justify-between w-full text-xs text-slate-500 font-semibold hover:text-slate-900 transition-colors cursor-pointer">
          <span>Manual vs Online analytics</span>
          <ChevronRight size={14} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}

export default RevenueSummaryDonut;
