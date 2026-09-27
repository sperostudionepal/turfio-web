import { ArrowRight, CalendarDays, Landmark, WalletCards } from 'lucide-react';
import { formatNpr } from './paymentUtils';

function PayoutSummaryCard({ availableBalance = 0 }) {
  return (
    <div className="h-full rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-bold text-slate-900">Payout Summary</h3>
        <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">View Payouts</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lime-50 text-lime-600">
          <WalletCards size={22} strokeWidth={2.1} />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500">Available Balance</p>
          <p className="mt-0.5 text-[20px] font-extrabold leading-none tracking-[-0.025em] text-slate-950">{formatNpr(availableBalance)}</p>
          <p className="mt-1.5 text-[11px] font-medium text-slate-400">Ready for payout</p>
        </div>
      </div>

      <button type="button" disabled title="Payout backend is not connected yet" className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-lime-400 text-[12px] font-bold text-slate-900 opacity-70">
        Request Payout <ArrowRight size={14} />
      </button>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2.5 rounded-lg border border-slate-100 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Landmark size={17} /></div>
          <div className="min-w-0"><p className="text-[10px] font-medium text-slate-400">Total Paid Out</p><p className="mt-1 truncate text-[13px] font-extrabold text-slate-900">NRs. 0</p><p className="mt-0.5 text-[9px] font-medium text-slate-400">No payouts yet</p></div>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg border border-slate-100 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600"><CalendarDays size={17} /></div>
          <div className="min-w-0"><p className="text-[10px] font-medium text-slate-400">Next Payout</p><p className="mt-1 truncate text-[13px] font-extrabold text-slate-900">Not scheduled</p><p className="mt-0.5 text-[9px] font-medium text-slate-400">Coming soon</p></div>
        </div>
      </div>
    </div>
  );
}
export default PayoutSummaryCard;
