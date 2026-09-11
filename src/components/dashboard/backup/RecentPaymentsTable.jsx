function RecentPaymentsTable({ bookings = [] }) {
  const payments = bookings.slice(0, 5).map((b) => {
    const customer = b.user || {};
    const name =
      [customer.firstName, customer.lastName].filter(Boolean).join(' ') ||
      b.customer?.name ||
      'Customer';
    const rawMethod = b.paymentMethod || 'Pay at Venue';

    let methodType = 'Venue';
    let cardLast4 = 'Counter';

    if (/esewa/i.test(rawMethod)) {
      methodType = 'eSewa';
      cardLast4 = 'Online';
    } else if (/khalti/i.test(rawMethod)) {
      methodType = 'Khalti';
      cardLast4 = 'Online';
    } else if (/fonepay/i.test(rawMethod)) {
      methodType = 'Fonepay';
      cardLast4 = 'QR Pay';
    } else if (/master/i.test(rawMethod)) {
      methodType = 'MasterCard';
      cardLast4 = '**** 8888';
    } else if (/visa|card/i.test(rawMethod)) {
      methodType = 'VISA';
      cardLast4 = '**** 4242';
    } else {
      methodType = 'Venue';
      cardLast4 = 'Counter';
    }

    const amount = Number(b.totalPaidAmount || b.totalAmount || 0);

    return {
      name,
      date: b.dateStr || new Date(b.date || b.createdAt).toLocaleDateString(),
      methodType,
      cardLast4,
      amount: `NRs. ${amount.toLocaleString('en-NP')}`,
      status: b.paymentStatus || 'Pending',
    };
  });

  return (
    <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Recent Payments</h3>
        <button className="text-xs font-bold text-[#FE4A49] hover:text-[#e03e3d] transition-colors cursor-pointer">
          View All
        </button>
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
              <p className="py-8 text-center text-xs text-slate-400">No payment records yet.</p>
            ) : (
              payments.map((payment, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center py-3 text-xs hover:bg-slate-50/70 transition-colors rounded-xl px-1">
                  {/* Customer Column */}
                  <div className="col-span-3 font-bold text-slate-900 text-xs truncate">
                    {payment.name}
                  </div>

                  {/* Date Column */}
                  <span className="col-span-2 text-slate-500 font-medium text-xs">{payment.date}</span>

                  {/* Method Column */}
                  <div className="col-span-3 flex items-center gap-2 whitespace-nowrap">
                    {payment.methodType === 'VISA' && (
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px] tracking-wider uppercase border border-blue-100/60">
                        VISA
                      </span>
                    )}
                    {payment.methodType === 'MasterCard' && (
                      <div className="flex items-center -space-x-1 shrink-0">
                        <span className="w-3.5 h-3.5 rounded-full bg-rose-500 inline-block opacity-90" />
                        <span className="w-3.5 h-3.5 rounded-full bg-amber-400 inline-block opacity-90" />
                      </div>
                    )}
                    {payment.methodType === 'eSewa' && (
                      <span className="font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-full text-[10px]">
                        eSewa
                      </span>
                    )}
                    {payment.methodType === 'Khalti' && (
                      <span className="font-bold text-white bg-purple-700 px-2 py-0.5 rounded-full text-[10px]">
                        Khalti
                      </span>
                    )}
                    {payment.methodType === 'Fonepay' && (
                      <span className="font-bold text-white bg-rose-600 px-2 py-0.5 rounded-full text-[10px]">
                        Fonepay
                      </span>
                    )}
                    {payment.methodType === 'Venue' && (
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px] border border-slate-200/60">
                        Pay at Venue
                      </span>
                    )}
                    <span className="text-slate-500 font-medium text-[11px] truncate">
                      {payment.cardLast4}
                    </span>
                  </div>

                  {/* Amount Column */}
                  <span className="col-span-2 font-bold text-slate-900 text-right text-xs">{payment.amount}</span>

                  {/* Status Badge */}
                  <div className="col-span-2 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                        payment.status === 'Paid'
                          ? 'text-emerald-600 bg-emerald-50'
                          : payment.status === 'Failed'
                          ? 'text-rose-600 bg-rose-50'
                          : 'text-amber-600 bg-amber-50'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentPaymentsTable;
