import { Wallet, Calendar, CircleDot, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  getPeriodRange,
  getPreviousRange,
  summarizeBookings,
  pctChange,
  previousPeriodText,
  periodLabel,
} from '../../../shared/utils/dashboardStats';

function StatCards({ bookings = [], venue = null, venues = [], period = 'month' }) {
  const effectiveVenues = venues.length ? venues : (venue ? [venue] : []);
  const courtsCount = effectiveVenues.reduce((sum, item) => sum + (item?.courts?.length || 0), 0);
  const options = { venues: effectiveVenues, courtsCount, openingHours: venue?.openingHours };

  const range = getPeriodRange(period);
  const previousRange = getPreviousRange(period);
  const current = summarizeBookings(bookings, range, options);
  const previous = previousRange ? summarizeBookings(bookings, previousRange, options) : null;

  const trend = (key) => (previous ? pctChange(current[key], previous[key]) : null);
  const comparisonText = previousPeriodText(period);

  const stats = [
    {
      title: 'Total Revenue',
      value: `NRs. ${current.revenue.toLocaleString('en-NP')}`,
      subtext: `Due: NRs. ${current.due.toLocaleString('en-NP')}`,
      change: trend('revenue'),
      icon: Wallet,
      iconBg: 'bg-lime-50 text-lime-500',
    },
    {
      title: 'Total Bookings',
      value: current.bookings.toLocaleString(),
      subtext: `${periodLabel(period)} · ${courtsCount} ${courtsCount === 1 ? 'court' : 'courts'}`,
      change: trend('bookings'),
      icon: Calendar,
      iconBg: 'bg-blue-50 text-blue-500',
    },
    {
      title: 'Courts Occupancy',
      value: current.occupancy === null ? '—' : `${current.occupancy}%`,
      subtext: current.occupancy === null ? 'Pick a period to measure' : 'of open hours booked',
      change: trend('occupancy'),
      icon: CircleDot,
      iconBg: 'bg-purple-50 text-purple-500',
    },
    {
      title: 'Customers',
      value: current.customers.toLocaleString(),
      subtext: 'unique players booked',
      change: trend('customers'),
      icon: Users,
      iconBg: 'bg-amber-50 text-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const hasChange = stat.change !== null;
        const isDown = hasChange && stat.change < 0;
        const TrendIcon = isDown ? ArrowDownRight : ArrowUpRight;
        return (
          <div
            key={stat.title}
            className="bg-white rounded-xl overflow-hidden p-3.5 sm:p-5 relative flex flex-col justify-between shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100 hover:-translate-y-0.5 transition-transform duration-200"
          >
            {/* Top row: Icon on left, Title & Value on right */}
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shrink-0 ${stat.iconBg}`}>
                  <Icon size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs font-medium text-slate-400 block leading-tight truncate">
                    {stat.title}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight mt-0.5 sm:mt-1 truncate">
                    {stat.value}
                  </h3>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 block leading-tight mt-0.5 truncate">
                    {stat.subtext}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom row: change vs the previous period (only when there is something to compare) */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-xs pt-1 sm:pt-2">
              {hasChange && (
                <span
                  className={`px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 font-bold text-[10px] sm:text-[11px] shrink-0 ${
                    isDown ? 'text-rose-600 bg-rose-50' : 'text-lime-600 bg-lime-50'
                  }`}
                >
                  <TrendIcon size={11} /> {stat.change > 0 ? '+' : ''}
                  {stat.change}%
                </span>
              )}
              <span className="text-slate-400 font-medium text-[10px] sm:text-[11px] truncate">
                {hasChange ? comparisonText : previousPeriodText(period) === 'all time' ? 'all time' : 'no earlier data to compare'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatCards;
