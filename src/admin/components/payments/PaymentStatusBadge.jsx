const STATUS_STYLES = {
  Completed: 'bg-emerald-50 text-emerald-600',
  RefundPending: 'bg-amber-50 text-amber-700',
  Refunded: 'bg-slate-100 text-slate-500',
  RefundFailed: 'bg-rose-50 text-rose-600',
};

const STATUS_LABELS = {
  Completed: 'Completed',
  RefundPending: 'Refund Pending',
  Refunded: 'Refunded',
  RefundFailed: 'Refund Failed',
};

export function PaymentStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold leading-none ${STATUS_STYLES[status] ||
        'bg-slate-100 text-slate-600'
        }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export default PaymentStatusBadge;
