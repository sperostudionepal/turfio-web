import { paidAmount } from './dashboardStats';
import { NPT_OFFSET_MINUTES } from './dateTime';

/**
 * Turns bookings into a flat list of payments that were actually received, newest first.
 *
 * Source of truth is each booking's `payments` ledger (eSewa/split payments write one entry per payment).
 * A booking marked Paid at the venue has no ledger entry, so any received amount the ledger doesn't
 * explain is added as one "recorded at venue" payment. Unpaid bookings produce no rows.
 */

const GENERIC_PAYERS = /^(player|organizer|teammate)\b/i;

// ISO timestamp -> 'YYYY-MM-DD' in Nepal time
export const toNepalDateString = (value) => {
  const time = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(time) ? '' : new Date(time + NPT_OFFSET_MINUTES * 60000).toISOString().slice(0, 10);
};

const customerName = (booking) =>
  [booking.user?.firstName, booking.user?.lastName].filter(Boolean).join(' ') || booking.customer?.name || 'Customer';

const shortReference = (transactionId) => (transactionId ? `…${String(transactionId).slice(-8)}` : '');

export function buildPaymentRows(bookings = []) {
  const rows = [];

  bookings.forEach((booking) => {
    const bookingKey = booking._id || booking.bookingId;
    const name = customerName(booking);
    const cancelled = booking.status === 'Cancelled';
    const ledger = Array.isArray(booking.payments) ? booking.payments : [];

    ledger.forEach((payment, index) => {
      const amount = Number(payment.amount || 0);
      if (amount <= 0) return;
      const payer = payment.payerName && !GENERIC_PAYERS.test(payment.payerName) ? payment.payerName : '';
      rows.push({
        key: `${bookingKey}-${payment.transactionId || index}`,
        name: payer || name,
        // On split bookings, say which share this was
        note: booking.paymentType === 'split' ? `Split · ${payment.payerName || 'Player'}` : '',
        method: payment.paymentMethod || booking.paymentMethod || 'eSewa',
        reference: shortReference(payment.transactionId),
        amount,
        paidAt: payment.paidAt || booking.updatedAt || booking.createdAt,
        cancelled,
      });
    });

    const unexplained = paidAmount(booking) - ledger.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    if (unexplained > 0) {
      rows.push({
        key: `${bookingKey}-venue`,
        name,
        note: '',
        method: booking.paymentMethod || 'Pay at Venue',
        reference: '',
        amount: unexplained,
        paidAt: booking.updatedAt || booking.createdAt,
        cancelled,
      });
    }
  });

  return rows
    .map((row) => ({ ...row, date: toNepalDateString(row.paidAt) || '—', sortTime: new Date(row.paidAt || 0).getTime() || 0 }))
    .sort((a, b) => b.sortTime - a.sortTime);
}
