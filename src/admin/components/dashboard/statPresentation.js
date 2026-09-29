import {
  Wallet,
  CalendarDays,
  CircleDot,
  Users,
  Clock3,
  CheckCircle2,
  XCircle,
  CreditCard,
  Banknote,
} from 'lucide-react';

// Shared icon/color presentation per stat title, used by StatCards and its
// loading-state skeletons. Lives in its own module (rather than being exported
// from StatCards.jsx) so files importing it don't break Fast Refresh for the
// StatCards component.
export const statPresentation = {
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

export default statPresentation;
