import {
  Wallet,
  CalendarDays,
  CircleDot,
  Users,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Banknote,
} from 'lucide-react';

const statPresentation = {
  'Total Revenue': {
    icon: Wallet,
    iconWrapper: 'bg-lime-100',
    iconColor: 'text-green-600',
  },
  'Total Bookings': {
    icon: CalendarDays,
    iconWrapper: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  'Court Occupancy': {
    icon: CircleDot,
    iconWrapper: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  'Total Customers': {
    icon: Users,
    iconWrapper: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  Upcoming: {
    icon: Clock3,
    iconWrapper: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  Confirmed: {
    icon: CheckCircle2,
    iconWrapper: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  Completed: {
    icon: CheckCircle2,
    iconWrapper: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
  Cancelled: {
    icon: XCircle,
    iconWrapper: 'bg-rose-50',
    iconColor: 'text-rose-500',
  },
  'Paid Online': {
    icon: CreditCard,
    iconWrapper: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  'Pay at Venue': {
    icon: Banknote,
    iconWrapper: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  'Pending Payments': {
    icon: Clock3,
    iconWrapper: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
};

function StatCards({ stats = [], className = 'xl:grid-cols-4' }) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${className}`}>
      {stats.map((stat) => {
        const presentation =
          statPresentation[stat.title] ||
          statPresentation['Total Bookings'];

        const Icon = presentation.icon;
        const showBadge = stat.change != null;
        const negative =
          showBadge && String(stat.change).trim().startsWith('-');

        const BadgeIcon = negative ? ArrowDown : ArrowUp;

        return (
          <div
            key={stat.title}
            className="
              flex
              items-center
              rounded-xl
              border
              border-slate-100
              bg-white
              px-4
              py-4
              shadow-[0_3px_18px_rgba(15,23,42,0.025)]
            "
          >
            {/* Icon */}
            <div
              className={`
                mr-4
                flex
                h-[48px]
                w-[48px]
                shrink-0
                items-center
                justify-center
                rounded-xl
                ${presentation.iconWrapper}
              `}
            >
              <Icon
                size={23}
                strokeWidth={2}
                className={presentation.iconColor}
              />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              {/* Label */}
              <p className="mb-2 text-[13px] font-medium leading-tight text-slate-500">
                {stat.title}
              </p>

              {/* Value + Trend */}
              <div className="flex min-w-0 items-center gap-2">
                <h3 className="truncate text-[20px] font-extrabold leading-none tracking-[-0.025em] text-slate-950">
                  {stat.value}
                </h3>

                {showBadge && (
                  <span
                    className={`
                      flex
                      shrink-0
                      items-center
                      gap-1
                      rounded-full
                      px-2.5
                      py-1.5
                      text-[11px]
                      font-extrabold
                      leading-none
                      ${negative
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-emerald-50 text-emerald-600'
                      }
                    `}
                  >
                    {stat.showTrendArrow !== false && (
                      <BadgeIcon
                        size={11}
                        strokeWidth={2.5}
                      />
                    )}

                    {String(stat.change).replace(/^[-+]\s?/, '')}
                  </span>
                )}
              </div>

              {/* Subtext */}
              <p className="mt-2 truncate text-[12px] font-medium leading-tight text-slate-400">
                {stat.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatCards;