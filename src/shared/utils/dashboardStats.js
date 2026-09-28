import { getTodayNepalString, parseSlotInterval, parseTimeToMinutes } from './dateTime';
import { getBookingDateStr, isActiveBooking } from './bookingStatus';

/**
 * Period filtering + stat calculations for the owner dashboard.
 * All dates are Nepal-date strings ('YYYY-MM-DD'), so string comparison is date comparison.
 */

export const PERIOD_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'all', label: 'All Time' },
  { value: 'custom', label: 'Custom Range' },
];

export const periodLabel = (period) => PERIOD_OPTIONS.find((p) => p.value === period)?.label || 'This Month';

const pad = (n) => String(n).padStart(2, '0');
const toUtcDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const toDateStr = (date) => date.toISOString().slice(0, 10);

export const addDays = (dateStr, days) => {
  const date = toUtcDate(dateStr);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateStr(date);
};

// Weeks run Monday..Sunday.
export const startOfWeek = (dateStr) => addDays(dateStr, -((toUtcDate(dateStr).getUTCDay() + 6) % 7));

const monthRange = (year, month) => {
  const start = `${year}-${pad(month)}-01`;
  const end = toDateStr(new Date(Date.UTC(year, month, 0)));
  return { start, end };
};

const withDays = ({ start, end }) => ({
  start,
  end,
  days: Math.round((toUtcDate(end) - toUtcDate(start)) / 86400000) + 1,
});

/** Inclusive { start, end, days } for a period, or null for "all time". */
export function getPeriodRange(period, today = getTodayNepalString(), customRange = null) {
  const [year, month] = today.split('-').map(Number);
  if (period === 'custom' && customRange?.from && customRange?.to) return withDays({ start: customRange.from, end: customRange.to });
  switch (period) {
    case 'today':
      return withDays({ start: today, end: today });
    case 'last7':
      return withDays({ start: addDays(today, -6), end: today });
    case 'last30':
      return withDays({ start: addDays(today, -29), end: today });
    case 'week': {
      const start = startOfWeek(today);
      return withDays({ start, end: addDays(start, 6) });
    }
    case 'month':
      return withDays(monthRange(year, month));
    case 'lastMonth':
      return withDays(month === 1 ? monthRange(year - 1, 12) : monthRange(year, month - 1));
    default:
      return null;
  }
}

/** The period immediately before `period`, used for "vs previous" trends. Null for all time. */
export function getPreviousRange(period, today = getTodayNepalString(), customRange = null) {
  const [year, month] = today.split('-').map(Number);
  if (period === 'custom' && customRange?.from && customRange?.to) {
    const current = withDays({ start: customRange.from, end: customRange.to });
    const end = addDays(current.start, -1);
    return withDays({ start: addDays(end, -(current.days - 1)), end });
  }
  switch (period) {
    case 'today':
      return withDays({ start: addDays(today, -1), end: addDays(today, -1) });
    case 'last7':
      return withDays({ start: addDays(today, -13), end: addDays(today, -7) });
    case 'last30':
      return withDays({ start: addDays(today, -59), end: addDays(today, -30) });
    case 'week': {
      const start = addDays(startOfWeek(today), -7);
      return withDays({ start, end: addDays(start, 6) });
    }
    case 'month':
      return withDays(month === 1 ? monthRange(year - 1, 12) : monthRange(year, month - 1));
    case 'lastMonth':
      return withDays(month <= 2 ? monthRange(year - 1, month + 10) : monthRange(year, month - 2));
    default:
      return null;
  }
}

export const previousPeriodText = (period) =>
  ({ today: 'vs yesterday', week: 'vs last week', month: 'vs last month', lastMonth: 'vs the month before', custom: 'vs previous range' })[period] || 'all time';

export const inRange = (dateStr, range) => !range || (Boolean(dateStr) && dateStr >= range.start && dateStr <= range.end);

// Money actually received for a booking. A booking marked Paid counts in full even if the ledger is empty.
export const paidAmount = (booking) => {
  const received = Number(booking.totalPaidAmount || 0);
  return booking.paymentStatus === 'Paid' ? received || Number(booking.totalAmount || 0) : received;
};

const bookedHours = (booking) => {
  if (typeof booking.startMinutes === 'number' && typeof booking.endMinutes === 'number') {
    return Math.max(0, booking.endMinutes - booking.startMinutes) / 60;
  }
  const { startMinutes, endMinutes } = parseSlotInterval(booking.timeSlot);
  return (endMinutes - startMinutes) / 60;
};

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const hoursBetween = (start, end) => {
  const hours = (parseTimeToMinutes(end) - parseTimeToMinutes(start)) / 60;
  return hours > 0 ? hours : 0;
};

const venueCapacityForDate = (venue, dateStr) => {
  const courtsCount = Math.max(0, venue?.courts?.length || 0);
  if (!courtsCount) return 0;
  const dayKey = DAY_KEYS[toUtcDate(dateStr).getUTCDay()];
  const day = venue?.operatingHoursByDay?.[dayKey];
  if (day) {
    if (day.isClosed === true || day.isClosed === 'true') return 0;
    return courtsCount * hoursBetween(day.open, day.close);
  }
  return courtsCount * hoursBetween(venue?.openingHours?.start, venue?.openingHours?.end);
};

const capacityHours = (venues, range) => {
  if (!range) return null;
  let total = 0;
  for (let date = range.start; date <= range.end; date = addDays(date, 1)) {
    for (const venue of venues) total += venueCapacityForDate(venue, date);
  }
  return total;
};

/**
 * Headline numbers for the bookings that fall inside `range` (all bookings when range is null).
 * Cancelled bookings never count. Occupancy is null when there is no bounded range to measure against.
 */
export function summarizeBookings(bookings, range, { venues = [], courtsCount = 1, openingHours = null } = {}) {
  const inPeriod = bookings.filter((b) => isActiveBooking(b) && inRange(getBookingDateStr(b), range));

  let revenue = 0;
  let due = 0;
  let hoursBooked = 0;
  const customers = new Set();

  inPeriod.forEach((b) => {
    const paid = paidAmount(b);
    revenue += paid;
    due += Math.max(0, Number(b.totalAmount || 0) - paid);
    hoursBooked += bookedHours(b);
    const customerKey = b.user?._id || b.user?.id || b.user?.email || b.user?.phone || b.customer?.phone;
    if (customerKey) customers.add(customerKey);
  });

  let occupancy = null;
  if (range) {
    const normalizedVenues = venues.length ? venues : [{ courts: Array.from({ length: Math.max(1, courtsCount) }), openingHours }];
    const availableHours = capacityHours(normalizedVenues, range);
    occupancy = availableHours > 0 ? Math.min(100, Math.round((hoursBooked / availableHours) * 100)) : null;
  }

  return { revenue, due, bookings: inPeriod.length, occupancy, customers: customers.size, inPeriod };
}

/** Percentage change, or null when there is nothing to compare against. */
export const pctChange = (current, previous) =>
  previous > 0 ? Math.round(((current - previous) / previous) * 100) : null;
