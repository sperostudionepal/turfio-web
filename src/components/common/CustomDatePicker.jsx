import { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CustomDatePicker({
  value,
  onChange,
  minDate,
  label,
  variant = 'default',
  buttonClassName = '',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current selected date safely
  const selectedDateObj = useMemo(() => {
    if (!value) return new Date();
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [value]);

  // Calendar navigation state
  const [viewYear, setViewYear] = useState(() => selectedDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => selectedDateObj.getMonth());

  // Keep view synchronized when value changes
  useEffect(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      setViewYear(y);
      setViewMonth(m - 1);
    }
  }, [value]);

  // Outside click and Escape key dismissal
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
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

  // Today normalized
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const minDateObj = useMemo(() => {
    if (!minDate) return today;
    const [y, m, d] = minDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [minDate, today]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Check if previous month can be navigated to
  const isPrevDisabled = useMemo(() => {
    const firstOfCurrentView = new Date(viewYear, viewMonth, 1);
    const firstOfMinMonth = new Date(minDateObj.getFullYear(), minDateObj.getMonth(), 1);
    return firstOfCurrentView <= firstOfMinMonth;
  }, [viewYear, viewMonth, minDateObj]);

  // Calculate days for the calendar grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

  const handleSelectDay = (day) => {
    const formattedDate = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  // Display label formatting
  const displayValue = useMemo(() => {
    if (!value) return 'Select date';
    const [y, m, d] = value.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [value]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
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
              {label || 'DATE'}
            </span>
            <span className="mt-2 block text-sm font-bold text-slate-900 truncate leading-snug">
              {displayValue}
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
          className={`w-full h-[52px] rounded-xl px-4 bg-white border text-left flex items-center justify-between gap-3 transition-all cursor-pointer select-none ${buttonClassName} ${
            isOpen
              ? 'border-slate-400 ring-2 ring-slate-900/5'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <CalendarIcon className="h-5 w-5 text-slate-600 shrink-0" />
            <span className="text-sm font-bold text-slate-900 truncate">
              {displayValue}
            </span>
          </div>
        </button>
      )}

      {/* Calendar Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-[310px] rounded-2xl bg-white p-5 shadow-[0_16px_40px_-6px_rgba(0,0,0,0.15)] border border-slate-100 animate-in fade-in zoom-in-95 duration-150 select-none">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={isPrevDisabled}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
            </button>

            <span className="text-sm font-bold text-slate-900 tracking-tight">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Weekday Labels Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {WEEKDAYS.map((day, idx) => (
              <div
                key={idx}
                className="text-xs font-semibold text-slate-400 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-8 w-8" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const currentDayDate = new Date(viewYear, viewMonth, day);
              currentDayDate.setHours(0, 0, 0, 0);

              const isPast = currentDayDate < minDateObj;
              const isSelected =
                selectedDateObj.getFullYear() === viewYear &&
                selectedDateObj.getMonth() === viewMonth &&
                selectedDateObj.getDate() === day;

              const isCurrentToday =
                today.getFullYear() === viewYear &&
                today.getMonth() === viewMonth &&
                today.getDate() === day;

              return (
                <div key={day} className="flex items-center justify-center">
                  <button
                    type="button"
                    disabled={isPast}
                    onClick={() => handleSelectDay(day)}
                    className={`h-8 w-8 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-lime-400 text-slate-950 font-black shadow-sm ring-2 ring-lime-400/40'
                        : isPast
                          ? 'text-slate-300 line-through cursor-not-allowed pointer-events-none'
                          : isCurrentToday
                            ? 'text-slate-900 border border-slate-300 hover:bg-slate-100'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 active:scale-95'
                    }`}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer Today Shortcut */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                onChange(todayFormatted);
                setViewYear(today.getFullYear());
                setViewMonth(today.getMonth());
                setIsOpen(false);
              }}
              className="text-xs font-bold text-lime-600 hover:text-lime-700 transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
