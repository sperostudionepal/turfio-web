export const formatNpr = (amount) =>
  `NRs. ${Math.round(Number(amount) || 0).toLocaleString('en-NP')}`;

export const REFUND_STATUSES = ['RefundPending', 'Refunded', 'RefundFailed'];

export const isRefund = (payment) => REFUND_STATUSES.includes(payment?.status);

export const isVenuePayment = (payment) => payment?.method === 'Pay at Venue';

export const METHOD_BADGE = {
  eSewa: 'bg-emerald-50 text-emerald-700',
  Khalti: 'bg-purple-50 text-purple-700',
  Fonepay: 'bg-sky-50 text-sky-700',
  'Card/Other Wallets': 'bg-blue-50 text-blue-700',
  'Pay at Venue': 'bg-slate-100 text-slate-700',
};
