import PaymentStatusBadge from './PaymentStatusBadge';
import { formatNpr } from './paymentUtils';
import { formatNepalDateTimeParts } from '../../../shared/utils/dateTime';

function RecentRefundsCard({ onViewAll, refunds = [] }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-bold text-slate-900">
          Recent Refunds
        </h3>

        <button
          type="button"
          onClick={onViewAll}
          className="text-[11px] font-bold text-lime-600 transition-colors hover:text-lime-700"
        >
          View All
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {refunds.length === 0 ? (
          <p className="py-6 text-center text-[11px] font-medium text-slate-400">
            No refunds recorded.
          </p>
        ) : (
          refunds.map((refund) => {
            const { date } = formatNepalDateTimeParts(refund.paidAt);
            return (
              <div
                key={`${refund.paymentId}-${refund.bookingId}`}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-bold text-slate-900">
                    {refund.customer?.name || 'Customer'}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] font-medium text-slate-400">
                    {date} · {refund.paymentId}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="whitespace-nowrap text-[12px] font-bold text-slate-900">
                    {formatNpr(refund.amount)}
                  </span>

                  <PaymentStatusBadge status={refund.status} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RecentRefundsCard;
