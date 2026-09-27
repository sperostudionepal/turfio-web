import { getTodayNepalString } from './dateTime';
import { addDays, getPeriodRange } from './dashboardStats';

/**
 * Date filtering and column sorting for the Bookings list.
 * Works on the Bookings page's mapped bookings ({ dateStr, startMinutes, customerName, ... }).
 * Dates are Nepal-date strings ('YYYY-MM-DD'), so string comparison is date comparison.
 */

export const DATE_FILTER_OPTIONS = [
  { value: 'all', label: 'Any date' },
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
  { value: 'custom', label: 'Custom range...' },
];

/** { start, end } where either end may be null (open-ended), or null for "any date". */
export function getDateFilterRange(filter, custom = {}, today = getTodayNepalString()) {
  switch (filter) {
    case 'today':
      return { start: today, end: today };
    case 'tomorrow': {
      const tomorrow = addDays(today, 1);
      return { start: tomorrow, end: tomorrow };
    }
    case 'week':
    case 'month': {
      const { start, end } = getPeriodRange(filter, today);
      return { start, end };
    }
    case 'upcoming':
      return { start: today, end: null };
    case 'past':
      return { start: null, end: addDays(today, -1) };
    case 'custom': {
      const from = custom.from || null;
      const to = custom.to || null;
      // A reversed range is a slip of the hand, not "no results"
      return from && to && from > to ? { start: to, end: from } : { start: from, end: to };
    }
    default:
      return null;
  }
}

export function matchesDateRange(dateStr, range) {
  if (!range || (!range.start && !range.end)) return true;
  if (!dateStr) return false;
  if (range.start && dateStr < range.start) return false;
  if (range.end && dateStr > range.end) return false;
  return true;
}

const STATUS_RANK = { Confirmed: 0, Completed: 1, Cancelled: 2 };
const PAYMENT_RANK = { Pending: 0, Partial: 1, Paid: 2, Failed: 3 };

const SORT_VALUES = {
  customer: (b) => b.customerName.toLowerCase(),
  court: (b) => b.courtName.toLowerCase(),
  when: (b) => `${b.dateStr || ''}|${String(b.startMinutes ?? 0).padStart(4, '0')}`,
  amount: (b) => b.amount,
  payment: (b) => PAYMENT_RANK[b.paymentStatus] ?? 9,
  status: (b) => STATUS_RANK[b.bookingStatus] ?? 9,
};

/** Returns a sorted copy; ties keep their original order. With no sort, the list is returned as is. */
export function sortBookings(list, sort) {
  const value = sort && SORT_VALUES[sort.key];
  if (!value) return list;
  const direction = sort.dir === 'desc' ? -1 : 1;
  return [...list].sort((a, b) => {
    const x = value(a);
    const y = value(b);
    return (x < y ? -1 : x > y ? 1 : 0) * direction;
  });
}

/** Header click cycle: ascending, then descending, then back to the default order. */
export const nextSort = (current, key) => {
  if (!current || current.key !== key) return { key, dir: 'asc' };
  return current.dir === 'asc' ? { key, dir: 'desc' } : null;
};
