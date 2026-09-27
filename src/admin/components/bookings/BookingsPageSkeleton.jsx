const CARD = 'rounded-xl border border-slate-100 bg-white shadow-[0_3px_18px_rgba(15,23,42,0.02)]';
const Line = ({ className = '', ...props }) => <div className={`rounded-full bg-slate-100 ${className}`} {...props} />;

function BookingsPageSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-hidden="true">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={`${CARD} flex items-center px-4 py-3.5`}>
            <div className="mr-3.5 h-[46px] w-[46px] shrink-0 rounded-xl bg-slate-100" />
            <div className="min-w-0 flex-1">
              <Line className="h-3 w-24" />
              <div className="mt-2 flex items-center gap-2"><Line className="h-5 w-14" /><Line className="h-5 w-12" /></div>
              <Line className="mt-2 h-2.5 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className={`${CARD} overflow-hidden`}>
        <div className="flex h-[61px] items-end gap-6 border-b border-slate-100 px-5 pb-4 pt-3">
          <Line className="h-3 w-24" /><Line className="h-3 w-20" /><Line className="h-3 w-20" /><Line className="h-3 w-20" />
        </div>
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3 xl:flex-row">
          <Line className="h-[44px] min-w-[260px] flex-1 rounded-lg xl:max-w-[420px]" />
          <Line className="h-[44px] w-full rounded-lg xl:w-[190px]" />
          <Line className="h-[44px] w-full rounded-lg xl:w-[140px]" />
          <Line className="h-[44px] w-full rounded-lg xl:w-[180px]" />
        </div>
        <div className="overflow-hidden">
          <div className="flex h-[43px] items-center gap-7 border-b border-slate-100 px-4">
            <div className="h-4 w-4 rounded bg-slate-100" />
            {[70, 72, 58, 88, 50, 58, 62, 52].map((width, index) => <Line key={index} className="h-2.5" style={{ width }} />)}
          </div>
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="flex h-[66px] items-center gap-5 border-b border-slate-100 px-4 last:border-b-0">
              <div className="h-4 w-4 shrink-0 rounded bg-slate-100" />
              <div className="w-[90px]"><Line className="h-3 w-20" /><Line className="mt-2 h-2 w-14" /></div>
              <div className="flex w-[175px] items-center gap-3"><div className="h-9 w-9 shrink-0 rounded-full bg-slate-100" /><div className="flex-1"><Line className="h-3 w-24" /><Line className="mt-2 h-2 w-16" /></div></div>
              <div className="flex w-[135px] items-center gap-2"><div className="h-9 w-11 shrink-0 rounded-md bg-slate-100" /><Line className="h-3 w-16" /></div>
              <div className="w-[120px]"><Line className="h-3 w-20" /><Line className="mt-2 h-2 w-24" /></div>
              <Line className="h-3 w-10" /><Line className="h-3 w-16" /><Line className="h-6 w-20" /><Line className="h-6 w-16" />
            </div>
          ))}
        </div>
        <div className="flex min-h-[62px] items-center justify-between border-t border-slate-100 px-5 py-3">
          <Line className="h-3 w-32" /><div className="flex gap-2"><Line className="h-8 w-8 rounded-lg" /><Line className="h-8 w-20 rounded-lg" /><Line className="h-8 w-8 rounded-lg" /></div>
        </div>
      </div>
    </div>
  );
}

export default BookingsPageSkeleton;
