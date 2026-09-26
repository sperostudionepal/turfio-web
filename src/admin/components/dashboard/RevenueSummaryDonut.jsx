import { PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getPeriodRange, summarizeBookings, paidAmount, periodLabel } from '../../../shared/utils/dashboardStats';

const isPayAtVenue = (b) => b.paymentMethod === 'Pay at Venue' || b.paymentType === 'venue';

function RevenueSummaryDonut({ bookings = [], period = 'month' }) {
  // Live (non-cancelled) bookings inside the selected period.
  const { inPeriod, revenue: totalPaidRevenue } = summarizeBookings(bookings, getPeriodRange(period));

  const venueBookings = inPeriod.filter(isPayAtVenue);
  const onlineBookings = inPeriod.filter((b) => !isPayAtVenue(b));

  const sumPaid = (list) => list.reduce((sum, b) => sum + paidAmount(b), 0);
  const onlinePaidRevenue = sumPaid(onlineBookings);
  const venuePaidRevenue = sumPaid(venueBookings);

  // Slice by money collected; before anything is paid, fall back to booking counts.
  const byRevenue = totalPaidRevenue > 0;
  const onlineValue = byRevenue ? onlinePaidRevenue : onlineBookings.length;
  const venueValue = byRevenue ? venuePaidRevenue : venueBookings.length;
  const totalValue = onlineValue + venueValue;
  const onlinePct = totalValue > 0 ? Math.round((onlineValue / totalValue) * 100) : 0;
  const venuePct = totalValue > 0 ? 100 - onlinePct : 0;

  const data = [
    { name: 'Paid Online', value: onlineValue, revenue: onlinePaidRevenue, count: onlineBookings.length, color: '#10b981', percentage: `${onlinePct}%` },
    { name: 'Pay at Venue', value: venueValue, revenue: venuePaidRevenue, count: venueBookings.length, color: '#38bdf8', percentage: `${venuePct}%` },
  ];
  // Nothing to slice yet: draw a neutral ring instead of a made-up 50/50 split.
  const pieData = totalValue > 0 ? data : [{ name: 'No data', value: 1, color: '#e2e8f0' }];

  const formattedTotalRevenue =
    totalPaidRevenue >= 100000
      ? `NRs. ${(totalPaidRevenue / 1000).toFixed(1)}K`
      : `NRs. ${totalPaidRevenue.toLocaleString('en-NP')}`;

  return (
    <div className="bg-white rounded-xl overflow-hidden p-5 flex flex-col justify-between h-full shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-lime-100 flex items-center justify-center text-lime-600">
              <PieChartIcon size={16} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Revenue Summary</h3>
          </div>
          {/* The period is picked once in the dashboard header; this just shows which one is applied. */}
          <span className="text-xs font-semibold text-slate-700 px-3 py-2 rounded-full bg-slate-100">
            {periodLabel(period)}
          </span>
        </div>

        {/* Filled Pie Chart & Total Revenue Right Side Container */}
        <div className="flex items-center justify-between gap-3 my-2">
          {/* Left: Filled Pie Chart */}
          <div className="relative h-36 w-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={65}
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={3}
                  strokeLinejoin="round"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
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
            <span className="text-[11px] font-semibold text-lime-600 mt-1 block">
              {inPeriod.length} {inPeriod.length === 1 ? 'booking' : 'bookings'}
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
    </div>
  );
}

export default RevenueSummaryDonut;
