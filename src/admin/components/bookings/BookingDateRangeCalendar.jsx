import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const toDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const toValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function BookingDateRangeCalendar({ value, onApply, onClose }) {
  const rootRef = useRef(null);
  const initial = toDate(value.from) || new Date();
  const [visibleMonth, setVisibleMonth] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [draftRange, setDraftRange] = useState(() => ({ from: value.from || '', to: value.to || '' }));
  const [selectingEnd, setSelectingEnd] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) onClose();
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const days = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const previousMonthDays = new Date(year, month, 0).getDate();
    return Array.from({ length: 42 }, (_, index) => {
      const dayNumber = index - firstWeekday + 1;
      if (dayNumber < 1) return { date: new Date(year, month - 1, previousMonthDays + dayNumber), muted: true };
      if (dayNumber > daysInMonth) return { date: new Date(year, month + 1, dayNumber - daysInMonth), muted: true };
      return { date: new Date(year, month, dayNumber), muted: false };
    });
  }, [visibleMonth]);

  const chooseDate = (date) => {
    const picked = toValue(date);
    if (!selectingEnd || !draftRange.from || draftRange.to) {
      setDraftRange({ from: picked, to: '' });
      setSelectingEnd(true);
      return;
    }
    setDraftRange(picked < draftRange.from
      ? { from: picked, to: draftRange.from }
      : { from: draftRange.from, to: picked });
    setSelectingEnd(false);
  };

  const from = draftRange.from;
  const to = draftRange.to;

  return (
    <div ref={rootRef} className="absolute right-0 top-[52px] z-50 w-[360px] max-w-[calc(100vw-2.5rem)] rounded-xl border border-slate-100 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-extrabold text-slate-900">
            <CalendarDays size={15} className="text-lime-600" />
            Custom date range
          </div>
          <p className="mt-1 text-[10px] font-medium text-slate-400">Choose a start date, then an end date.</p>
        </div>
        <button type="button" onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700" aria-label="Close calendar">
          <X size={15} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button type="button" onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 text-slate-500 transition-colors hover:bg-slate-50" aria-label="Previous month"><ChevronLeft size={16} /></button>
        <p className="text-[12px] font-extrabold text-slate-900">{MONTHS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}</p>
        <button type="button" onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 text-slate-500 transition-colors hover:bg-slate-50" aria-label="Next month"><ChevronRight size={16} /></button>
      </div>

      <div className="mt-3 grid grid-cols-7 text-center">
        {WEEKDAYS.map((day) => <div key={day} className="py-1 text-[9px] font-bold uppercase text-slate-400">{day}</div>)}
        {days.map(({ date, muted }) => {
          const day = toValue(date);
          const isStart = day === from;
          const isEnd = day === to;
          const inRange = from && to && day > from && day < to;
          return (
            <button key={day} type="button" onClick={() => chooseDate(date)} className={`relative flex h-9 items-center justify-center text-[11px] font-semibold transition-colors ${muted ? 'text-slate-300' : 'text-slate-700'} ${inRange ? 'bg-lime-50 text-lime-800' : 'hover:bg-slate-50'} ${isStart || isEnd ? 'rounded-lg bg-lime-400 font-extrabold text-slate-950 hover:bg-lime-500' : ''}`}>
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <button type="button" onClick={() => { setDraftRange({ from: '', to: '' }); setSelectingEnd(false); }} className="text-[10px] font-bold text-slate-500 transition-colors hover:text-slate-900">Clear range</button>
        <button type="button" disabled={!from || !to} onClick={() => { onApply(draftRange); onClose(); }} className="rounded-full bg-lime-400 px-4 py-2 text-[11px] font-bold text-slate-950 transition-colors hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-40">Apply</button>
      </div>
    </div>
  );
}

export default BookingDateRangeCalendar;
