import { buildPaymentRows } from '../../utils/paymentRecords';
import { useOwnerContext } from '../../context/ownerContext';

// Colour + label per payment channel. Anything unrecognised is shown as-is in a neutral pill.
const METHOD_BADGES = [
  { test: /esewa/i, label: 'eSewa', className: 'font-bold text-white bg-lime-500 px-2 py-0.5 rounded-full text-[10px]' },
  { test: /khalti/i, label: 'Khalti', className: 'font-bold text-white bg-purple-700 px-2 py-0.5 rounded-full text-[10px]' },
  { test: /fonepay/i, label: 'Fonepay', className: 'font-bold text-white bg-rose-600 px-2 py-0.5 rounded-full text-[10px]' },
  { test: /venue|cash|counter/i, label: 'Pay at Venue', className: 'font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-100' },
];

const getMethodBadge = (method) =>
  METHOD_BADGES.find((badge) => badge.test.test(method || '')) || {
    label: method || 'Other',
    className: 'font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px] border border-slate-200',
  };

function RecentPaymentsTable({ bookings = [] }) {
  const { setActiveTab } = useOwnerContext();
  // Real received payments only (unpaid bookings are not payments), newest first.
  const payments = buildPaymentRows(bookings).slice(0, 5);

  return (
    <div className="bg-white rounded-xl overflow-hidden p-5 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Recent Payments</h3>
        {setActiveTab && (
          <button
            onClick={() => setActiveTab('Payments')}
            className="text-xs font-semibold text-lime-600 hover:text-lime-700 transition-colors cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Header Grid Row */}
          <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-2.5 border-b border-slate-100">
            <span className="col-span-3">Customer</span>
            <span className="col-span-2">Date</span>
            <span className="col-span-3">Method</span>
            <span className="col-span-2 text-right">Amount</span>
            <span className="col-span-2 text-right">Status</span>
          </div>

          {/* Rows List */}
          <div className="divide-y divide-slate-50">
            {payments.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">No payments received yet.</p>
            ) : (
              payments.map((payment) => {
                const badge = getMethodBadge(payment.method);
                return (
                  <div key={payment.key} className="grid grid-cols-12 gap-2 items-center py-3 text-xs hover:bg-slate-50/70 transition-colors rounded-xl px-1">
                    {/* Customer Column */}
                    <div className="col-span-3 min-w-0">
                      <p className="font-bold text-slate-900 text-xs truncate" title={payment.name}>{payment.name}</p>
                      {payment.note && <p className="text-[10px] text-slate-400 font-medium truncate">{payment.note}</p>}
                    </div>

                    {/* Date Column */}
                    <span className="col-span-2 text-slate-500 font-medium text-xs">{payment.date}</span>

                    {/* Method Column */}
                    <div className="col-span-3 flex items-center gap-2 whitespace-nowrap">
                      <span className={badge.className}>{badge.label}</span>
                      {payment.reference && (
                        <span className="text-slate-400 font-medium text-[11px] truncate" title="Transaction reference">
                          {payment.reference}
                        </span>
                      )}
                    </div>

                    {/* Amount Column */}
                    <span className="col-span-2 font-bold text-slate-900 text-right text-xs">
                      NRs. {payment.amount.toLocaleString('en-NP')}
                    </span>

                    {/* Status Badge: money was received; flag it if the booking was later cancelled */}
                    <div className="col-span-2 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                          payment.cancelled ? 'text-rose-600 bg-rose-50' : 'text-lime-600 bg-lime-50'
                        }`}
                        title={payment.cancelled ? 'Booking was cancelled after payment' : undefined}
                      >
                        {payment.cancelled ? 'Cancelled' : 'Received'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentPaymentsTable;
