import {
    CalendarPlus,
    Clock3,
    UserPlus,
    Tag,
    FileText,
    CreditCard,
    Settings,
    Image,
} from 'lucide-react';

const actions = [
    {
        id: 'booking',
        label: 'New Booking',
        icon: CalendarPlus,
        iconWrapper: 'bg-lime-50',
        iconColor: 'text-lime-600',
    },
    {
        id: 'block-slot',
        label: 'Block Slot',
        icon: Clock3,
        iconWrapper: 'bg-rose-50',
        iconColor: 'text-rose-500',
    },
    {
        id: 'customer',
        label: 'Add Customer',
        icon: UserPlus,
        iconWrapper: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        id: 'promo',
        label: 'Create Promo',
        icon: Tag,
        iconWrapper: 'bg-rose-50',
        iconColor: 'text-rose-500',
    },
    {
        id: 'invoice',
        label: 'Send Invoice',
        icon: FileText,
        iconWrapper: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        id: 'payment',
        label: 'Record Payment',
        icon: CreditCard,
        iconWrapper: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
    },
    {
        id: 'rates',
        label: 'Manage Rates',
        icon: Settings,
        iconWrapper: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        id: 'images',
        label: 'Turf Images',
        icon: Image,
        iconWrapper: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
    },
];

function QuickActions({ onAction }) {
    return (
        <div className="h-full rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
            {/* Header */}
            <h3 className="text-[16px] font-bold text-slate-900">
                Quick Actions
            </h3>

            {/* Actions */}
            <div className="mt-4 grid grid-cols-4 gap-x-3 gap-y-5">
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <button
                            key={action.id}
                            type="button"
                            onClick={() => onAction?.(action.id)}
                            className="group flex min-w-0 flex-col items-center text-center"
                        >
                            <div
                                className={`
                  flex
                  h-[58px]
                  w-full
                  max-w-[64px]
                  items-center
                  justify-center
                  rounded-xl
                  transition-transform
                  duration-150
                  group-hover:-translate-y-0.5
                  ${action.iconWrapper}
                `}
                            >
                                <Icon
                                    size={24}
                                    strokeWidth={2}
                                    className={action.iconColor}
                                />
                            </div>

                            <span className="mt-2 whitespace-nowrap text-[11px] font-semibold leading-tight text-slate-700">
                                {action.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default QuickActions;