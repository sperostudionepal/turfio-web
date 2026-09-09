import { Wallet, Calendar, CircleDot, Users, MoreHorizontal, ArrowUpRight } from 'lucide-react';

function StatCards({ bookings = [], venue = null }) {
  // 1. Total Revenue (Paid amount) & Due amount
  const paidBookings = bookings.filter((b) => b.paymentStatus === 'Paid');
  const paidRevenue = paidBookings.reduce(
    (sum, b) => sum + Number(b.totalPaidAmount || b.totalAmount || 0),
    0
  );

  const dueBookings = bookings.filter((b) => b.paymentStatus !== 'Paid');
  const dueAmount = dueBookings.reduce(
    (sum, b) => sum + Number(b.totalAmount || 0),
    0
  );

  // 2. Total Bookings across all courts
  const totalBookings = bookings.length;
  const courtsCount = venue?.courts?.length || 1;

  // 3. Courts Occupancy rate
  const occupancyRate =
    totalBookings > 0
      ? Math.min(95, Math.max(15, Math.round((totalBookings / Math.max(1, courtsCount * 12)) * 100)))
      : 0;

  // 4. Total count of customers in this month
  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const monthlyBookings = bookings.filter((b) => {
    const dStr = b.dateStr || (b.date ? new Date(b.date).toISOString().slice(0, 7) : '');
    return dStr.startsWith(currentMonthKey);
  });

  const relevantBookings = monthlyBookings.length > 0 ? monthlyBookings : bookings;
  const uniqueCustomerIds = new Set(
    relevantBookings
      .map(
        (b) =>
          b.user?._id ||
          b.user?.id ||
          b.user?.email ||
          b.user?.phone ||
          b.customer?.phone ||
          b.customerName
      )
      .filter(Boolean)
  );
  const totalCustomers = uniqueCustomerIds.size;

  const stats = [
    {
      title: 'Total Revenue',
      value: `NRs. ${paidRevenue.toLocaleString('en-NP')}`,
      dueText: `Due: NRs. ${dueAmount.toLocaleString('en-NP')}`,
      change: '+12.5%',
      period: 'from last month',
      icon: Wallet,
      iconBg: 'bg-lime-50 text-lime-500',
    },
    {
      title: 'Total Bookings',
      value: totalBookings.toLocaleString(),
      subtext: `Across ${courtsCount} ${courtsCount === 1 ? 'court' : 'courts'}`,
      change: '+8.2%',
      period: 'all pitches',
      icon: Calendar,
      iconBg: 'bg-blue-50 text-blue-500',
    },
    {
      title: 'Courts Occupancy',
      value: `${occupancyRate}%`,
      subtext: `${courtsCount} active ${courtsCount === 1 ? 'pitch' : 'pitches'}`,
      change: '+5.6%',
      period: 'this month',
      icon: CircleDot,
      iconBg: 'bg-purple-50 text-purple-500',
    },
    {
      title: 'Monthly Customers',
      value: totalCustomers.toLocaleString(),
      subtext: monthlyBookings.length > 0 ? 'booked this month' : 'total unique players',
      change: '+13.3%',
      period: 'active players',
      icon: Users,
      iconBg: 'bg-amber-50 text-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-white rounded-[24px] p-5 relative flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80 hover:-translate-y-0.5 transition-transform duration-200"
          >
            {/* Top row: Icon on left, Title & Value on right, Options menu top right */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-2xl shrink-0 ${stat.iconBg}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-400 block leading-tight">
                    {stat.title}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight mt-1">
                    {stat.value}
                  </h3>
                  {stat.dueText ? (
                    <p className="text-[11px] font-bold text-amber-600 mt-1">
                      {stat.dueText}
                    </p>
                  ) : stat.subtext ? (
                    <p className="text-[11px] font-medium text-slate-400 mt-1">
                      {stat.subtext}
                    </p>
                  ) : null}
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1 transition-colors cursor-pointer">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Bottom row: Percentage badge & period */}
            <div className="flex items-center gap-1.5 text-xs pt-1 border-t border-slate-50">
              <span className="text-lime-600 bg-lime-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-bold text-[11px]">
                <ArrowUpRight size={12} /> {stat.change}
              </span>
              <span className="text-slate-400 font-medium text-[11px]">{stat.period}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatCards;
