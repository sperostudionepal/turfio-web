import { ChevronDown } from 'lucide-react';

function BookingFilterSelect({
  value,
  onChange,
  options,
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[44px] w-full appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-10 text-[12px] font-semibold text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-lime-400"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        strokeWidth={2}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
}

export default BookingFilterSelect;
