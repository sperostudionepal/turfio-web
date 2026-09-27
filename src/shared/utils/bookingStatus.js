/**
 * Booking status helpers shared by admin/player surfaces.
 * The backend owns booking lifecycle state and exposes exactly three states.
 */
export const deriveBookingStatus = (booking) => {
  const status = String(booking?.status || 'CONFIRMED').toUpperCase();
  if (status === 'COMPLETED') return 'Completed';
  if (status === 'CANCELLED') return 'Cancelled';
  return 'Confirmed';
};

export const isActiveBooking = (booking) =>
  String(booking?.status || '').toUpperCase() !== 'CANCELLED';

export const getBookingDateStr = (booking) => {
  if (booking?.dateStr) return booking.dateStr;
  const parsed = booking?.date ? new Date(booking.date) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : '';
};
