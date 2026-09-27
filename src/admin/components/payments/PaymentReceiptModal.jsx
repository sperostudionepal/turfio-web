import { X } from 'lucide-react';

import PaymentStatusBadge from './PaymentStatusBadge';
import { formatNpr } from './paymentUtils';
import { formatNepalDateTimeParts } from '../../../shared/utils/dateTime';

function PaymentReceiptModal({ onClose, payment }) {
  if (!payment) return null;

  const { date, time } = formatNepalDateTimeParts(payment.paidAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-extrabold text-base text-slate-900">
              Receipt {payment.paymentId}
            </span>
            <PaymentStatusBadge status={payment.status} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-5 text-xs">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">
                {payment.customer?.name || 'Customer'}
              </h4>
              <p className="text-[11px] font-medium text-slate-500">
                {payment.customer?.phone || '—'}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-50 py-1.5">
              <span className="font-medium text-slate-400">Associated Booking</span>
              <span className="font-bold text-emerald-600">{payment.bookingId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 py-1.5">
              <span className="font-medium text-slate-400">Venue</span>
              <span className="font-bold text-slate-900">{payment.turfName || '—'}</span>
            </div>
            {payment.customer?.email && (
              <div className="flex justify-between gap-4 border-b border-slate-50 py-1.5">
                <span className="font-medium text-slate-400">Customer Email</span>
                <span className="break-all text-right font-bold text-slate-900">
                  {payment.customer.email}
                </span>
              </div>
            )}
            <div className="flex justify-between border-b border-slate-50 py-1.5">
              <span className="font-medium text-slate-400">Payment Method</span>
              <span className="font-bold text-slate-900">{payment.method}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 py-1.5">
              <span className="font-medium text-slate-400">Transaction Date</span>
              <span className="font-bold text-slate-900">{`${date}, ${time}`}</span>
            </div>
            {payment.transactionId && (
              <div className="flex justify-between border-b border-slate-50 py-1.5">
                <span className="font-medium text-slate-400">Gateway Transaction ID</span>
                <span className="font-bold text-slate-900">{payment.transactionId}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5">
              <span className="font-medium text-slate-400">Amount</span>
              <span className="font-black text-emerald-600">{formatNpr(payment.amount)}</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-slate-900 py-2.5 font-bold text-white transition-colors hover:bg-slate-800"
            >
              Close Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentReceiptModal;
