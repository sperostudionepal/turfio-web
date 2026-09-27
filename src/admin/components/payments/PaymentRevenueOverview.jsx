import { ChevronDown } from 'lucide-react';

const fmt = (n) => n >= 1000 ? `${Math.round(n / 1000)}K` : `${Math.round(n)}`;

function PaymentRevenueOverview({ data = [], maxValue = 20000 }) {
  const labels = [4, 3, 2, 1, 0].map(i => fmt(maxValue * i / 4));

  return (
    <div className="h-full rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[16px] font-bold text-slate-900">Revenue Overview</h3>
        <div className="flex flex-wrap items-center gap-5 text-[12px] font-semibold text-slate-500">
          <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#ABE435]" />Online Payments</span>
          <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-lime-200" />Pay at Venue</span>
          <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-amber-300" />Pending</span>
          <button type="button" className="flex items-center gap-1.5 rounded-lg border border-slate-100 px-3 py-2 text-[13px] font-bold text-slate-600">This Month <ChevronDown size={14} /></button>
        </div>
      </div>
      <div className="mt-4 flex h-[205px]">
        <div className="flex w-10 shrink-0 flex-col justify-between pb-7 pr-2 text-right text-[11px] font-bold text-slate-400">{labels.map(x => <span key={x}>{x}</span>)}</div>
        <div className="relative min-w-0 flex-1">
          <div className="absolute inset-x-0 bottom-7 top-0 flex flex-col justify-between">{labels.map((_, i) => <div key={i} className="border-t border-slate-100" />)}</div>
          <div className="relative z-10 flex h-full items-end justify-between gap-1 overflow-hidden pb-7">
            {data.map((item, idx) => {
              const online = Number(item.online || 0), venue = Number(item.venue || 0), pending = Number(item.pending || 0); const total = online + venue + pending || 1;
              return <div key={`${item.day}-${idx}`} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end">
                <div className="flex w-full max-w-[22px] flex-col-reverse overflow-hidden rounded-t-[2px]" style={{ height: `${Math.min(100, (total / maxValue) * 100)}%` }}>
                  <div className="bg-[#ABE435]" style={{ height: `${online / total * 100}%` }} /><div className="bg-lime-200" style={{ height: `${venue / total * 100}%` }} /><div className="bg-amber-300" style={{ height: `${pending / total * 100}%` }} />
                </div>
                <span className="absolute bottom-0 whitespace-nowrap text-[11px] font-bold text-slate-500" style={{ transform: `translateX(${0}px)` }}>{idx % 2 === 0 ? item.day : ''}</span>
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentRevenueOverview;