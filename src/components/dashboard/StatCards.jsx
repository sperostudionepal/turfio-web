import { Wallet, Calendar, CircleDot, Users, MoreHorizontal, ArrowUpRight } from 'lucide-react';

function StatCards() {
  const stats = [
    {
      title: 'Total Revenue',
      value: 'NRs. 1,65,450',
      change: '12.5%',
      period: 'from last month',
      icon: Wallet,
      iconBg: 'bg-lime-50 text-lime-400',
    },
    {
      title: 'Total Bookings',
      value: '128',
      change: '8.2%',
      period: 'from last month',
      icon: Calendar,
      iconBg: 'bg-blue-50 text-blue-400',
    },
    {
      title: 'Courts Occupancy',
      value: '72.4%',
      change: '5.6%',
      period: 'from last month',
      icon: CircleDot,
      iconBg: 'bg-purple-50 text-purple-400',
    },
    {
      title: 'New Customers',
      value: '34',
      change: '13.3%',
      period: 'from last month',
      icon: Users,
      iconBg: 'bg-amber-50 text-amber-400',
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
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
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
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1 transition-colors cursor-pointer">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Bottom row: Percentage badge & period */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-lime-500 bg-lime-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-bold">
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
