import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, AlertCircle, X } from 'lucide-react';

import turfService from '../../services/turfService';
import useAuthStore from '../../store/useAuthStore';

const DISMISSED_KEY = 'turfio_dismissed_resumables';
const readDismissed = () => {
  try {
    return JSON.parse(sessionStorage.getItem(DISMISSED_KEY) || '[]');
  } catch {
    return [];
  }
};
const rememberDismissed = (id) => {
  try {
    sessionStorage.setItem(DISMISSED_KEY, JSON.stringify([...readDismissed(), String(id)].slice(-20)));
  } catch {
    /* storage unavailable: the notice just reappears on next navigation */
  }
};

const ContinueBookingBanner = ({ onResume }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [resumableData, setResumableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(null);

  const fetchResumable = async () => {
    try {
      const guestHoldToken = localStorage.getItem('turfio_guest_hold_token');
      const res = await turfService.getResumableBooking(guestHoldToken);
      const item = res?.data || res?.item || res;
      // Only a running hold (with its timer) or a just-expired hold is worth surfacing here.
      // A confirmed booking has nothing left to resume at checkout.
      const usable = item && (item.type === 'hold' || item.type === 'expired_hold') && !readDismissed().includes(String(item.id));
      setResumableData(usable ? item : null);

    } catch (err) {
      console.warn('[ContinueBookingBanner] Error fetching resumable booking:', err);
      setResumableData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumable();

    const handleLocationOrHoldChange = () => {
      fetchResumable();
    };

    window.addEventListener('turfio_hold_created', handleLocationOrHoldChange);

    return () => {
      window.removeEventListener('turfio_hold_created', handleLocationOrHoldChange);
    };
  }, [user, location.pathname]);


  // Countdown timer for holds
  useEffect(() => {
    if (!resumableData || resumableData.type !== 'hold' || resumableData.isExpired) {
      setRemainingSeconds(null);
      return;
    }

    const expiresAtMs = new Date(resumableData.expiresAt).getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiresAtMs - now) / 1000));
      setRemainingSeconds(diff);
      if (diff <= 0) {
        // Mark as expired locally or refetch
        setResumableData((prev) => (prev ? { ...prev, isExpired: true } : null));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [resumableData]);

  // Restrict banner display strictly to Find Turfs page (/turfs, /find-turfs, page=turfs, page=turfListing)
  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const isFindTurfsPage =
    pathname.includes('/turfs') ||
    pathname.includes('/find-turfs') ||
    searchParams.get('page') === 'turfs' ||
    searchParams.get('page') === 'turfListing';

  // Keep the resume banner visible on the turf details page so returning from
  // checkout preserves the user's active hold. Hide it only inside checkout.
  const isBookingCheckout = pathname.includes('/book');

  if (loading || !resumableData || !isFindTurfsPage || isBookingCheckout) {
    return null;
  }


  const { type, turf, date, dateStr, startTime, duration, courtName, holdToken, step } = resumableData;
  // The server reports a just-expired hold as type "expired_hold"; the countdown flips isExpired locally.
  const isExpired = Boolean(resumableData.isExpired) || type === 'expired_hold';

  const closeBanner = () => {
    rememberDismissed(resumableData.id);
    setResumableData(null);
  };
  const rawDate = dateStr || date;


  const formatDateFormatted = (raw) => {
    if (!raw) return '';
    // If already formatted like "Sep 24, 2026" or "Wed, Sep 24"
    if (/[a-zA-Z]/.test(raw) && !raw.includes('T')) {
      const parts = raw.split(',');
      return parts.length > 1 ? parts[1].trim() : raw;
    }
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return raw;
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      const day = d.getDate();
      return `${month} ${day}`;
    } catch {
      return raw;
    }
  };

  const formattedDate = formatDateFormatted(rawDate);



  const handleDismiss = async (e) => {
    e.stopPropagation();
    closeBanner();

    if (type === 'hold' && holdToken && turf?.id && !isExpired) {
      try {
        await turfService.releaseSlotHold(turf.id, holdToken);
        localStorage.removeItem('turfio_guest_hold_token');
      } catch (err) {
        console.warn('Failed to release hold on dismissal:', err);
      }
    }
  };

  const handleAction = () => {
    const turfIdentifier = turf?.slug || turf?.id || turf?._id;

    if (isExpired) {
      // Navigate to turf details page to pick a new slot
      if (turfIdentifier) {
        navigate(`/turfs/${turfIdentifier}`);
      }
      closeBanner();
      return;
    }

    const targetStep = step || 2;

    if (type === 'hold' && turfIdentifier) {
      const searchParams = new URLSearchParams({
        holdToken,
        date: rawDate || '',
        startTime: startTime || '',
        duration: duration || 1,
        courtName: courtName || '',
        step: targetStep,
      });
      navigate(`/turfs/${turfIdentifier}/book?${searchParams.toString()}`);
      if (onResume) onResume(resumableData);
    }
  };


  const formatCountdown = (secs) => {
    if (secs == null) return '';
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Render Expired Hold UI Banner
  if (isExpired) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] max-w-xl w-[calc(100%-2rem)] sm:w-auto bg-white border border-slate-200/80 rounded-full shadow-lg hover:shadow-xl px-3 py-2 transition-all duration-300">
        <div className="flex items-center gap-3">
          {/* Alert Icon */}
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600">
            <AlertCircle size={18} />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-slate-900 truncate">
              Held slot expired at {turf?.title || turf?.name || 'Turf'}
            </span>
            <span className="text-slate-400 font-normal">·</span>
            <button
              onClick={handleAction}
              className="font-medium text-slate-600 hover:text-slate-900 underline cursor-pointer shrink-0"
            >
              Search again
            </button>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="shrink-0 w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }


  // Active hold banner (minimal pill style)
  return (
    <div
      onClick={handleAction}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] max-w-md w-[calc(100%-2rem)] sm:w-auto bg-white border border-slate-200/90 rounded-full shadow-xl hover:shadow-2xl p-2.5 transition-all duration-300 cursor-pointer group flex items-center gap-3.5"


    >
      {/* 1. Circular Progress Step Indicator Badge (Clean, No outer border stroke) */}
      <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">

        {(() => {
          const currentStep = step || 2;
          const totalSteps = 3;
          const progressPercent = Math.min(100, Math.max(1, (currentStep / totalSteps) * 100));
          const radius = 17;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

          return (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 44 44">
                {/* Track ring */}
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  className="stroke-slate-200"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                {/* Active progress ring */}
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  className="stroke-lime-500 transition-all duration-500 ease-out"
                  strokeWidth="3.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-mono font-extrabold text-[12px] text-slate-900 tracking-tight">
                {currentStep}/{totalSteps}
              </span>
            </div>
          );
        })()}
      </div>



      {/* 2. Text Details Stack: Title above Metadata (Date with Calendar icon, Time & Countdown with Clock icon) */}
      <div className="flex flex-col min-w-0 pr-1">
        <h4 className="font-bold text-[15px] text-slate-900 truncate tracking-tight">
          Continue booking
        </h4>

        <div className="flex items-center gap-1.5 text-[13px] text-slate-600 font-medium mt-0.5 whitespace-nowrap">
          <div className="flex items-center gap-1">
            <Calendar size={13} className="text-slate-400 shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1">
            <Clock size={13} className="text-slate-400 shrink-0" />
            <span>{startTime || ''}</span>
          </div>
          {type === 'hold' && remainingSeconds != null && (
            <span className="ml-1 text-[11px] font-bold font-mono text-lime-950 bg-lime-100 px-1.5 py-0.5 rounded-md">
              {formatCountdown(remainingSeconds)}
            </span>
          )}
        </div>
      </div>


      {/* 3. Light Green Circular Arrow Button (Matching Screenshot) */}
      <div className="ml-auto shrink-0 pl-1">
        <div className="w-10 h-10 rounded-full bg-lime-100/70 group-hover:bg-lime-200/80 text-slate-900 flex items-center justify-center transition-all group-hover:scale-105">
          <ArrowRight size={18} className="stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* 4. Dismiss: hides the banner and releases a held slot so others can book it */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="shrink-0 w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ContinueBookingBanner;

