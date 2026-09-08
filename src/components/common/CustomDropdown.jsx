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
      {variant === 'searchPill' ? (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`group relative flex flex-1 items-center gap-2.5 rounded-full px-3.5 py-2.5 text-left transition-colors hover:bg-slate-50 focus-within:bg-slate-50 cursor-pointer w-full select-none ${buttonClassName} ${
            isOpen ? 'bg-slate-50' : ''
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-950 transition-colors group-hover:bg-lime-100 group-hover:text-lime-700">
            {Icon ? <Icon className="h-4 w-4 stroke-[2.2]" /> : <ChevronDown className="h-4 w-4" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-bold text-slate-900 leading-tight">
              {label || 'Select'}
            </span>
            <span className="mt-0.5 block text-[14px] font-medium text-slate-400 truncate">
              {displayLabel}
            </span>
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-slate-600 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-slate-900' : ''
            }`}
          />
        </button>
      ) : variant === 'cell' ? (
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
        <div className={`absolute top-full left-0 min-w-[180px] mt-2 z-[9999] bg-white rounded-2xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.2)] px-2 py-2 max-h-60 overflow-y-auto space-y-0.5 animate-in fade-in zoom-in-95 duration-150 select-none ${popoverClassName}`}>
          {options.map((option) => {
            const optValue = typeof option === 'object' ? option.value : option;
            const optLabel = typeof option === 'object' ? option.label : option;
            const isDisabled = typeof option === 'object' ? Boolean(option.disabled) : false;
            const isSelected = optValue === value;

            return (
              <button
                key={optValue}
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  if (isDisabled) return;
                  onChange(optValue);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${
                  isDisabled
                    ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400'
                    : isSelected
                    ? 'bg-lime-400 text-slate-950 shadow-xs cursor-pointer'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 cursor-pointer'
                }`}
              >
                <span>{optLabel}</span>
                {isSelected && !isDisabled && <Check className="h-4 w-4 text-slate-950 shrink-0 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
