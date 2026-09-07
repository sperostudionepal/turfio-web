import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomDropdown({
  options = [],
  value,
  onChange,
  icon: Icon,
  label,
  variant = 'default',
  buttonClassName = '',
  popoverClassName = '',
  placeholder = 'Select option',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) =>
    (typeof opt === 'object' ? opt.value : opt) === value
  );

  const displayLabel = selectedOption
    ? typeof selectedOption === 'object'
      ? selectedOption.label
      : selectedOption
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {variant === 'cell' ? (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full text-left p-3 sm:px-4 sm:py-3 transition-colors cursor-pointer select-none flex items-center justify-between gap-2 ${buttonClassName} ${
            isOpen ? 'bg-slate-50 ring-2 ring-slate-900 z-10 relative' : 'hover:bg-slate-50/80'
          }`}
        >
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none">
              {label || 'SELECT'}
            </span>
            <span className="mt-2 block text-sm font-bold text-slate-900 truncate leading-snug">
              {displayLabel}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-slate-900' : ''
            }`}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full h-[52px] rounded-xl px-4 bg-white border text-left flex items-center justify-between gap-2 transition-all cursor-pointer select-none ${buttonClassName} ${
            isOpen
              ? 'border-slate-400 ring-2 ring-slate-900/5'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
            {Icon && <Icon className="h-5 w-5 text-slate-600 shrink-0" />}
            <span className="text-sm font-bold text-slate-900 truncate">
              {displayLabel}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-slate-700' : ''
            }`}
          />
        </button>
      )}

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-xl border border-slate-100 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.12)] px-2 py-1.5 max-h-60 overflow-y-auto space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ${popoverClassName}`}>
          {options.map((option) => {
            const optValue = typeof option === 'object' ? option.value : option;
            const optLabel = typeof option === 'object' ? option.label : option;
            const isSelected = optValue === value;

            return (
              <button
                key={optValue}
                type="button"
                onClick={() => {
                  onChange(optValue);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-lime-400 text-slate-950 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <span>{optLabel}</span>
                {isSelected && <Check className="h-4 w-4 text-slate-950 shrink-0 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
