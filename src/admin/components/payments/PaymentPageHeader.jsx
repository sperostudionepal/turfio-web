import { CalendarDays, ChevronDown, Download, SlidersHorizontal } from 'lucide-react';
function PaymentPageHeader({ exportCount = 0, monthLabel, onExport }) {
  return <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
    <div className="min-w-0"><h1 className="text-[24px] font-extrabold tracking-[-0.025em] text-slate-950">Payments</h1><p className="mt-1 text-[13px] font-medium text-slate-500">Track revenue, view transactions, manage payouts and payment settings.</p></div>
    <div className="flex flex-wrap items-center gap-2.5">
      <button type="button" className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-[11px] font-bold text-slate-700"><CalendarDays size={15}/>{monthLabel}<ChevronDown size={13}/></button>
      <button type="button" className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-[11px] font-bold text-slate-700"><SlidersHorizontal size={14}/>All Payment Methods<ChevronDown size={13}/></button>
      <button type="button" onClick={onExport} disabled={exportCount===0} className="flex h-10 items-center gap-2 rounded-lg border border-emerald-100 bg-white px-4 text-[11px] font-bold text-emerald-600 disabled:opacity-50">Export <Download size={14}/></button>
    </div>
  </div>;
}
export default PaymentPageHeader;
