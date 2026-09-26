/**
 * Which owner actions a booking currently allows. Works on the Bookings page's mapped booking
 * ({ bookingStatus, paymentStatus, paymentType }) and is shared by the table rows and the details popup
 * so the two can never disagree.
 */

// Waiting for the owner to accept it
export const canConfirm = (booking) => booking.bookingStatus === 'Pending';

// Cancelled bookings can't be paid in person here
export const canMarkPaid = (booking) =>
  booking.bookingStatus !== 'Cancelled' && booking.paymentStatus !== 'Paid';

export const canCancel = (booking) => booking.bookingStatus !== 'Cancelled' && booking.bookingStatus !== 'Completed';
