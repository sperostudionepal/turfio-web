/**
 * Booking status helpers shared by the Bookings page and the owner dashboard,
 * so a booking reads the same everywhere.
 */

// Cancelled/Completed come straight from the server. Otherwise a booking is Confirmed once money has been
// received (fully or in part, e.g. a split payment) or the owner has confirmed it (e.g. Pay at Venue),
// and Pending until then.
export const deriveBookingStatus = (booking) => {
  if (booking.status === 'Cancelled' || booking.status === 'Completed') return booking.status;
  const moneyReceived = booking.paymentStatus === 'Paid' || Number(booking.totalPaidAmount || 0) > 0;
  return moneyReceived || booking.confirmedAt ? 'Confirmed' : 'Pending';
};

// Cancelled bookings must not count towards revenue, occupancy, schedule, etc.
export const isActiveBooking = (booking) => booking?.status !== 'Cancelled';

// 'YYYY-MM-DD' (Nepal date) a booking is for. `dateStr` is set by the server; `date` is UTC midnight of that day.
export const getBookingDateStr = (booking) => {
  if (booking?.dateStr) return booking.dateStr;
  const parsed = booking?.date ? new Date(booking.date) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : '';
};
