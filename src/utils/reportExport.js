import { deriveBookingStatus, getBookingDateStr } from './bookingStatus';
import { inRange, paidAmount } from './dashboardStats';

/**
 * CSV export of the bookings in a dashboard period (all bookings when range is null).
 * Cancelled bookings are included and labelled, so the file is a complete record; money columns
 * for them are still what was recorded at the time.
 */

const COLUMNS = [
  'Booking ID',
  'Date',
  'Time Slot',
  'Court',
  'Customer',
  'Phone',
  'Email',
  'Total Amount (NRs)',
  'Paid (NRs)',
  'Due (NRs)',
  'Payment Method',
  'Payment Status',
  'Booking Status',
];

// Quote every field; neutralise leading = + - @ so spreadsheets don't run customer-supplied text as a formula.
const csvCell = (value) => {
  let text = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

// Oldest match first by default. Pass { sort: false } to keep the caller's order (e.g. the Bookings table's own sort).
export function getReportBookings(bookings = [], range = null, { sort = true } = {}) {
  const inPeriod = bookings.filter((b) => inRange(getBookingDateStr(b), range));
  if (!sort) return inPeriod;
  return inPeriod.sort((a, b) => getBookingDateStr(a).localeCompare(getBookingDateStr(b)) || (a.startMinutes ?? 0) - (b.startMinutes ?? 0));
}

export function buildBookingsCsv(bookings = [], range = null, options = {}) {
  const rows = getReportBookings(bookings, range, options).map((b) => {
    const paid = paidAmount(b);
    return [
      b.bookingId || b._id,
      getBookingDateStr(b),
      b.timeSlot,
      b.court?.name || 'Court 1',
      [b.user?.firstName, b.user?.lastName].filter(Boolean).join(' '),
      b.user?.phone,
      b.user?.email,
      Number(b.totalAmount || 0),
      paid,
      Math.max(0, Number(b.totalAmount || 0) - paid),
      b.paymentMethod,
      b.paymentStatus,
      deriveBookingStatus(b),
    ];
  });

  return [COLUMNS, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
}

/** Triggers a browser download. The BOM makes Excel read the file as UTF-8. */
export function downloadCsv(filename, csv) {
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
