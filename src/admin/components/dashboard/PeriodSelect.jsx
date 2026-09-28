import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

/** Themed period picker shared by dashboard period controls. */
function PeriodSelect({ value, onChange, options, icon: Icon, ariaLabel, className = '', displayLabel }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const active = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    const escape = (event) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-[40px] w-fit cursor-pointer items-center gap-2 rounded-full bg-slate-100 px-3.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200/80"
      >
        {Icon && <Icon size={14} className="shrink-0 text-slate-400" />}
        <span className="whitespace-nowrap text-left">{displayLabel || active?.label || 'Select period'}</span>
        <ChevronDown size={13} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[46px] z-[60] w-[210px] overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => { onChange(option.value); setOpen(false); }}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[12px] font-semibold transition-colors ${selected ? 'bg-lime-50 text-slate-950' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <span className="truncate">{option.label}</span>
                {selected && <Check size={14} strokeWidth={2.5} className="shrink-0 text-lime-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PeriodSelect;
