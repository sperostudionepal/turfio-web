import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Clock } from 'lucide-react';

export default function TimePickerDropdown({ value, onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('06');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');
  const containerRef = useRef(null);
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);
  const isInitialized = useRef(false);

  // Parse initial value (24-hour format) - only on mount and when value changes
  useEffect(() => {
    if (value && !isInitialized.current) {
      const [h, m] = value.split(':');
      const hour24 = parseInt(h);
      const period = hour24 >= 12 ? 'PM' : 'AM';
      const hour12 = hour24 % 12 || 12;
      
      setSelectedHour(String(hour12).padStart(2, '0'));
      setSelectedMinute(m);
      setSelectedPeriod(period);
      isInitialized.current = true;
    }
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Scroll to selected item when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const hourIndex = parseInt(selectedHour) - 1; // 1-12 to 0-11
        const minuteIndex = parseInt(selectedMinute);
        
        if (hoursRef.current && hoursRef.current.children[hourIndex]) {
          hoursRef.current.children[hourIndex].scrollIntoView({ block: 'center' });
        }
        
        if (minutesRef.current && minutesRef.current.children[minuteIndex]) {
          minutesRef.current.children[minuteIndex].scrollIntoView({ block: 'center' });
        }
      }, 50);
    }
  }, [isOpen]);

  // Prevent scroll from propagating to parent when at end of list
  const handleWheel = (e) => {
    const element = e.currentTarget;
    const isAtTop = element.scrollTop === 0;
    const isAtBottom = element.scrollTop + element.clientHeight === element.scrollHeight;
    
    if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
      e.preventDefault();
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  // Convert to 24-hour format for storage
  const getFormattedTime = useCallback((hour, minute, period) => {
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    return `${String(hour24).padStart(2, '0')}:${minute}`;
  }, []);

  // Auto-update on change - use ref to avoid infinite loops
  const prevTimeRef = useRef();
  useEffect(() => {
    const newTime = getFormattedTime(selectedHour, selectedMinute, selectedPeriod);
    if (prevTimeRef.current !== newTime) {
      prevTimeRef.current = newTime;
      onChange(newTime);
    }
  }, [selectedHour, selectedMinute, selectedPeriod, getFormattedTime, onChange]);

  // Display in 12-hour format
  const displayTime = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <div className="relative">
        <Clock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-32 pl-8 pr-3 py-2 rounded-full bg-white text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-lime-400 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 cursor-pointer"
        >
          {displayTime}
        </button>
      </div>

      {/* Dropdown Picker */}
      {isOpen && !disabled && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 animate-scale-in overflow-hidden">
          {/* Time Display Box */}
          <div className="flex gap-3 px-4 py-4 bg-slate-50 border-b border-slate-100 justify-center">
            <div className="bg-lime-400 text-white rounded-lg px-4 py-3 text-center min-w-16">
              <div className="text-2xl font-extrabold">{selectedHour}</div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 flex items-center">:</div>
            <div className="bg-lime-400 text-white rounded-lg px-4 py-3 text-center min-w-16">
              <div className="text-2xl font-extrabold">{selectedMinute}</div>
            </div>
            <div className="bg-lime-400 text-white rounded-lg px-4 py-3 text-center min-w-16">
              <div className="text-sm font-extrabold">{selectedPeriod}</div>
            </div>
          </div>

          {/* Time Lists Container */}
          <div className="flex h-64 bg-white">
            {/* Hours Column */}
            <div className="flex-1 flex flex-col">
              <div className="px-2 py-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hours</div>
              <div 
                ref={hoursRef}
                onWheel={handleWheel}
                className="flex-1 overflow-y-auto scrollbar-none space-y-0 px-2 py-2"
              >
                {hours.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => setSelectedHour(hour)}
                    className={`w-full px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                      selectedHour === hour
                        ? 'bg-lime-400 text-white'
                        : 'text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-slate-100" />

            {/* Minutes Column */}
            <div className="flex-1 flex flex-col">
              <div className="px-2 py-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Minutes</div>
              <div 
                ref={minutesRef}
                onWheel={handleWheel}
                className="flex-1 overflow-y-auto scrollbar-none space-y-0 px-2 py-2"
              >
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => setSelectedMinute(minute)}
                    className={`w-full px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                      selectedMinute === minute
                        ? 'bg-lime-400 text-white'
                        : 'text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {minute}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-slate-100" />

            {/* AM/PM Column */}
            <div className="flex-col flex">
              <div className="px-2 py-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Period</div>
              <div className="flex-1 flex flex-col overflow-y-auto scrollbar-none space-y-0 px-2 py-2">
                {['AM', 'PM'].map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                      selectedPeriod === period
                        ? 'bg-lime-400 text-white'
                        : 'text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
