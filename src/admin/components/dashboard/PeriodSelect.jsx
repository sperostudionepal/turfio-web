import { ChevronDown } from 'lucide-react';

/**
 * Pill-styled native <select> used for the dashboard's period pickers.
 */
function PeriodSelect({ value, onChange, options, icon: Icon, ariaLabel, className = '' }) {
  return (
    <label
      className={`relative flex items-center gap-2 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer text-xs font-semibold text-slate-700 ${className}`}
    >
      {Icon && <Icon size={14} className="text-slate-400 absolute left-3.5 pointer-events-none" />}
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`appearance-none bg-transparent outline-none cursor-pointer py-2 pr-8 font-semibold ${Icon ? 'pl-9' : 'pl-3'}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={13} className="text-slate-400 absolute right-3 pointer-events-none" />
    </label>
  );
}

export default PeriodSelect;
