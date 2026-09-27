import {
    ChevronDown,
    MoreVertical,
    Shield,
} from 'lucide-react';



const rankStyles = {
    1: 'bg-amber-300 text-white',
    2: 'bg-slate-200 text-white',
    3: 'bg-orange-300 text-white',
};

function TopCustomers({ customers = [] }) {
    return (
        <div className="h-full rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-[16px] font-bold text-slate-900">
                    Top Customers
                </h3>

                <button
                    type="button"
                    className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-50 px-3 py-2 text-[12px] font-bold text-slate-600 transition-colors hover:bg-slate-100"
                >
                    This Month

                    <ChevronDown
                        size={12}
                        strokeWidth={2}
                    />
                </button>
            </div>

            {/* Customers */}
            <div className="mt-3">
                {customers.map((customer, index) => (
                    <div
                        key={customer.id}
                        className={`
              grid
              min-h-[48px]
              grid-cols-[28px_1fr_80px_92px_20px]
              items-center
              gap-2
              ${index !== customers.length - 1
                                ? 'border-b border-slate-100'
                                : ''
                            }
            `}
                    >
                        {/* Rank */}
                        <div
                            className={`
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                text-[10px]
                font-bold
                ${rankStyles[customer.rank]}
              `}
                        >
                            {customer.rank}
                        </div>

                        {/* Customer */}
                        <div className="flex min-w-0 items-center gap-2">
                            <div
                                className={`
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  ${customer.logoBg}
                `}
                            >
                                <Shield
                                    size={15}
                                    strokeWidth={2}
                                    className={customer.logoColor}
                                />
                            </div>

                            <span className="truncate text-[12px] font-semibold text-slate-800">
                                {customer.name}
                            </span>
                        </div>

                        {/* Bookings */}
                        <span className="whitespace-nowrap text-[11px] font-semibold text-slate-500">
                            {customer.bookings} bookings
                        </span>

                        {/* Revenue */}
                        <span className="whitespace-nowrap text-right text-[11px] font-semibold text-slate-700">
                            {customer.amount}
                        </span>

                        {/* Menu */}
                        <button
                            type="button"
                            className="flex h-7 w-5 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                        >
                            <MoreVertical
                                size={14}
                                strokeWidth={2}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopCustomers;