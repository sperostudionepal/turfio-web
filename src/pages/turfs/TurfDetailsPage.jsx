import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Droplets,
  Heart,
  MapPin,
  Mail,
  MessageCircle,
  Phone,
  Share2,
  Shield,
  Star,
  Users,
  Car,
  Wifi,
  Zap,
  X,
  ChevronLeft,
  ChevronDown,
  Maximize2,
  ImageIcon,
  Grip,
  Trophy,
  Tag,
  Sparkles,
  Navigation,
  Info,
  Award,
  Layers,
  ThumbsUp,
  Flag,
  Coffee,
  Copy,
  ExternalLink,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CustomDropdown from '../../components/common/CustomDropdown';
import CustomDatePicker from '../../components/common/CustomDatePicker';
import TurfSingleLocationMap from '../../components/turfs/TurfSingleLocationMap';
import turfService from '../../services/turfService';

/* ─── Amenity Icon Mapping ─── */
const amenityIconMap = {
  Parking: Car,
  WiFi: Wifi,
  Washrooms: Droplets,
  'Changing Rooms': Users,
  Canteen: Coffee,
  'First Aid': Shield,
  Floodlights: Zap,
  'Drinking Water': Droplets,
  'Locker Rooms': Shield,
  'Spectator Seating': Users,
  'Bibs & Balls': Trophy,
  'Air Conditioning': Zap,
  'Shower Rooms': Droplets,
  'Sound System': Zap,
  'CCTV Security': Shield,
};

/* ─── Amenity Categories ─── */
const amenityCategories = [
  {
    category: 'Field & Game',
    items: ['Floodlights', 'Bibs & Balls', 'Spectator Seating', 'CCTV Security'],
  },
  {
    category: 'Player Comfort',
    items: ['Changing Rooms', 'Locker Rooms', 'Shower Rooms', 'Drinking Water', 'Washrooms'],
  },
  {
    category: 'Facility & Tech',
    items: ['Parking', 'WiFi', 'Canteen', 'First Aid'],
  },
];

/* ─── Star Rating Component ─── */
function StarRating({ rating, size = 'h-4 w-4' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${size} ${
            i < Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : i < rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-slate-200 text-slate-200'
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Image Gallery Lightbox ─── */
function ImageLightbox({ images, currentIndex, onClose, onPrev, onNext, onSelect }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-black/95 p-4 md:p-8 backdrop-blur-md animate-fadeIn">
      {/* Top Bar */}
      <div className="flex w-full max-w-7xl items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wider text-slate-400">
            PHOTO {currentIndex + 1} OF {images.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/25 hover:rotate-90 cursor-pointer"
          aria-label="Close fullscreen gallery"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Preview Area */}
      <div className="relative flex w-full max-w-6xl flex-1 items-center justify-center py-4">
        <button
          onClick={onPrev}
          className="absolute left-2 md:left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <img
          src={images[currentIndex]}
          alt={`Arena photo ${currentIndex + 1}`}
          className="max-h-[72vh] max-w-full rounded-2xl object-contain shadow-2xl transition-all duration-300 select-none"
        />

        <button
          onClick={onNext}
          className="absolute right-2 md:right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Thumbnails Row */}
      <div className="flex w-full max-w-4xl items-center justify-center gap-2 overflow-x-auto py-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(idx)}
            className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl transition-all cursor-pointer ${
              idx === currentIndex ? 'scale-105 opacity-100 shadow-md ring-2 ring-lime-400' : 'opacity-40 hover:opacity-80'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Amenities Full Modal ─── */
function AmenitiesModal({ isOpen, onClose, amenities }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900">All Venue Amenities & Facilities</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Everything available on-site for players and spectators</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-6">
          {amenityCategories.map((group) => {
            const activeItems = group.items.filter((item) => amenities.includes(item) || true);
            return (
              <div key={group.category} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{group.category}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeItems.map((item) => {
                    const Icon = amenityIconMap[item] || CheckCircle2;
                    return (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 text-slate-800"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item}</p>
                          <p className="text-xs text-slate-500">Free access with booking</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-4">
          <button
            onClick={onClose}
            className="w-full rounded-full bg-slate-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800 cursor-pointer"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Mock Similar Turfs ─── */
const allTurfs = [
  {
    id: 1,
    title: 'Great Himalayan Futsal',
    type: 'Indoor',
    size: '7v7',
    rating: 4.5,
    reviews: 321,
    price: 'NPR 800/hr',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    location: 'Hattiban, Lalitpur',
  },
  {
    id: 2,
    title: 'Prime Futsal Kathmandu',
    type: 'Indoor',
    size: '7v7',
    rating: 4.2,
    reviews: 511,
    price: 'NPR 1,200/hr',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    location: 'Baneshwor, Kathmandu',
  },
  {
    id: 3,
    title: 'The Ultimate Kick-Off',
    type: 'Outdoor',
    size: '7v7',
    rating: 4.1,
    reviews: 91,
    price: 'NPR 900/hr',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80',
    location: 'Suryabinayak, Bhaktapur',
  },
];

/* ─── Available Time Slots ─── */
const ALL_TIME_SLOTS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM',
];

const TIME_SLOT_OPTIONS = ALL_TIME_SLOTS.map((slot) => ({
  value: slot,
  label: slot,
}));

const DURATION_OPTIONS = [
  { value: 1, label: '1 Hour' },
  { value: 1.5, label: '1.5 Hours' },
  { value: 2, label: '2 Hours' },
  { value: 2.5, label: '2.5 Hours' },
  { value: 3, label: '3 Hours' },
  { value: 4, label: '4 Hours' },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT (BORDERLESS STYLING)
   ═══════════════════════════════════════════════════════════════ */
export default function TurfDetailsPage({
  turf,
  onHome,
  onLogin,
  onLogout,
  onBack,
  onFindTurfs,
  onListTurf,
  onBookNow,
  onViewTurfDetails,
  onNavigateRoute,
  user,
}) {
  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Modals
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [previewReviewImage, setPreviewReviewImage] = useState(null);

  // Favorites & Social Feedback
  const [isFavorited, setIsFavorited] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Booking Card State
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [duration, setDuration] = useState(1);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isHoldingSlot, setIsHoldingSlot] = useState(false);

  // Dynamic slot engine state
  const [availabilityData, setAvailabilityData] = useState(null);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
  }, [turf?.id]);

  // Fetch dynamic slot availability from backend
  useEffect(() => {
    const turfId = turf?.id || turf?._id;
    if (!turfId) return;

    let isMounted = true;
    setIsLoadingAvailability(true);

    turfService
      .getTurfAvailability(turfId, selectedDate)
      .then((data) => {
        if (!isMounted) return;
        setAvailabilityData(data);
      })
      .catch((err) => {
        console.warn('Failed to load dynamic slot availability:', err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoadingAvailability(false);
      });

    return () => {
      isMounted = false;
    };
  }, [turf?.id, turf?._id, selectedDate]);

  // Effective available days for this venue
  const effectiveAvailableDays = useMemo(() => {
    if (availabilityData?.availableDays && availabilityData.availableDays.length > 0) {
      return availabilityData.availableDays;
    }
    if (turf?.availableDays && turf.availableDays.length > 0) {
      return turf.availableDays;
    }
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }, [availabilityData?.availableDays, turf?.availableDays]);

  // Check if current selected date is a holiday/closed day
  const isSelectedDateHoliday = useMemo(() => {
    if (!selectedDate) return false;
    const parts = selectedDate.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    const dayCodes = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayCode = dayCodes[d.getDay()];
    return effectiveAvailableDays.length > 0 && !effectiveAvailableDays.includes(dayCode);
  }, [selectedDate, effectiveAvailableDays]);

  // Derive dynamic slot options from admin opening hours and availability
  const timeSlotOptions = useMemo(() => {
    if (isSelectedDateHoliday || availabilityData?.isClosed) {
      return [{ value: 'CLOSED', label: 'Closed (Holiday)', disabled: true }];
    }

    if (availabilityData?.slots && availabilityData.slots.length > 0) {
      return availabilityData.slots.map((s) => ({
        value: s.time,
        label: s.isAvailable ? s.time : `${s.time} (Taken)`,
        disabled: !s.isAvailable,
      }));
    }

    // Fallback if network is delayed: compute from turf openingHours
    const openStr = turf?.openingHours?.start || '06:00';
    const closeStr = turf?.openingHours?.end || '22:00';

    const parseToMin = (t) => {
      const parts = t.split(':');
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    };

    const to12 = (min) => {
      const h24 = Math.floor(min / 60);
      const minVal = min % 60;
      const p = h24 >= 12 ? 'PM' : 'AM';
      let h12 = h24 % 12;
      if (h12 === 0) h12 = 12;
      return `${String(h12).padStart(2, '0')}:${String(minVal).padStart(2, '0')} ${p}`;
    };

    const openMin = parseToMin(openStr);
    const closeMin = parseToMin(closeStr);
    const generated = [];
    for (let m = openMin; m < closeMin; m += 60) {
      const formatted = to12(m);
      generated.push({ value: formatted, label: formatted, disabled: false });
    }
    return generated.length > 0 ? generated : TIME_SLOT_OPTIONS;
  }, [isSelectedDateHoliday, availabilityData, turf?.openingHours]);

  // Keep selectedTimeSlot in sync with available slots
  useEffect(() => {
    if (isSelectedDateHoliday) {
      setSelectedTimeSlot('');
      return;
    }
    if (timeSlotOptions.length > 0) {
      const firstAvailable = timeSlotOptions.find((opt) => !opt.disabled);
      const currentOpt = timeSlotOptions.find((opt) => opt.value === selectedTimeSlot);
      if (!currentOpt || currentOpt.disabled) {
        setSelectedTimeSlot(firstAvailable ? firstAvailable.value : '');
      }
    }
  }, [timeSlotOptions, isSelectedDateHoliday]);

  // Gallery Fallback
  const gallery = useMemo(() => {
    if (turf?.gallery && turf.gallery.length > 0) return turf.gallery;
    if (turf?.image) return [turf.image];
    return ['/image.png'];
  }, [turf]);

  // Price calculation
  const baseRateNumeric = useMemo(() => {
    const priceStr = turf?.price || '1000';
    const match = priceStr.match(/(\d+,?\d*)/);
    return match ? parseInt(match[1].replace(/,/g, ''), 10) : 1000;
  }, [turf]);

  const subtotal = baseRateNumeric * duration;
  const totalAmount = subtotal;

  // Calculate End Time
  const endTimeStr = useMemo(() => {
    if (!selectedTimeSlot) return '';
    const [time, period] = selectedTimeSlot.split(' ');
    let [hour, min] = time.split(':').map(Number);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const totalMinutes = hour * 60 + min + duration * 60;
    const endHour24 = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    const endPeriod = endHour24 >= 12 ? 'PM' : 'AM';
    let endHour12 = endHour24 % 12;
    if (endHour12 === 0) endHour12 = 12;

    return `${String(endHour12).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')} ${endPeriod}`;
  }, [selectedTimeSlot, duration]);

  // Toast Notification helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Atomic Slot Hold creation before navigating to booking checkout
  const handleBookSlot = async () => {
    if (isHoldingSlot) return;

    if (!selectedTimeSlot) {
      triggerToast('Please choose an available start time');
      return;
    }

    const turfId = turf?.id || turf?._id;
    if (!turfId) {
      triggerToast('Turf details not found');
      return;
    }

    try {
      setIsHoldingSlot(true);

      // Attempt atomic hold creation
      const holdRes = await turfService.createSlotHold(turfId, {
        date: selectedDate,
        startTime: selectedTimeSlot,
        duration,
      });

      const holdData = holdRes?.data || holdRes;

      // Proceed to checkout with real hold data
      onBookNow?.({
        ...turf,
        selectedDate,
        selectedTime: selectedTimeSlot,
        duration,
        totalAmount,
        holdId: holdData?.holdId,
        holdToken: holdData?.holdToken,
        holdExpiresAt: holdData?.expiresAt,
        ttlSeconds: holdData?.ttlSeconds || 600,
      });
    } catch (err) {
      console.warn('Hold creation rejected:', err.message);
      const conflictMsg =
        err.response?.data?.error ||
        err.message ||
        'This slot was just taken by another player. Please pick another time.';
      triggerToast(conflictMsg);

      // Refresh dynamic availability immediately
      turfService.getTurfAvailability(turfId, selectedDate).then(setAvailabilityData).catch(() => {});
    } finally {
      setIsHoldingSlot(false);
    }
  };

  // Review Feedback Handlers
  const [helpfulReviews, setHelpfulReviews] = useState({});
  const [reportedReviews, setReportedReviews] = useState({});

  const handleToggleHelpful = (reviewIndex) => {
    setHelpfulReviews((prev) => {
      const isHelpful = !prev[reviewIndex];
      triggerToast(isHelpful ? 'Marked review as helpful' : 'Helpful feedback removed');
      return { ...prev, [reviewIndex]: isHelpful };
    });
  };

  const handleReportReview = (reviewIndex) => {
    if (reportedReviews[reviewIndex]) {
      triggerToast('Review already reported for moderation');
      return;
    }
    setReportedReviews((prev) => ({ ...prev, [reviewIndex]: true }));
    triggerToast('Review reported. Thank you for keeping our community safe!');
  };

  // Share action
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: turf.title,
          text: `Check out ${turf.title} on Turfio!`,
          url,
        });
      } catch (err) {
        navigator.clipboard?.writeText(url);
        triggerToast('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard?.writeText(url);
      triggerToast('Link copied to clipboard!');
    }
  };

  // Copy address
  const handleCopyAddress = () => {
    const address = turf.address || turf.location || 'Kathmandu, Nepal';
    navigator.clipboard?.writeText(address);
    setCopiedAddress(true);
    triggerToast('Address copied to clipboard!');
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  // Lightbox handlers
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const handlePrevImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };
  const handleNextImage = () => {
    setLightboxIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  if (!turf) return null;

  const amenities = turf.amenities || [
    'Parking',
    'WiFi',
    'Washrooms',
    'Changing Rooms',
    'Canteen',
    'First Aid',
    'Floodlights',
    'Drinking Water',
    'Spectator Seating',
  ];

  // Similar turfs state from backend
  const [similarTurfs, setSimilarTurfs] = useState([]);

  useEffect(() => {
    let isMounted = true;
    turfService.getTurfs().then((data) => {
      if (isMounted && Array.isArray(data)) {
        setSimilarTurfs(data.filter((t) => t.id !== turf?.id));
      }
    }).catch((err) => {
      console.warn('Failed to load similar turfs:', err);
    });
    return () => {
      isMounted = false;
    };
  }, [turf?.id]);

  // Prepare active turf with coordinates
  const currentTurfWithCoords = useMemo(() => {
    if (!turf) return null;
    return {
      ...turf,
      lat: turf.lat || 27.71585,
      lng: turf.lng || turf.lon || 85.36209,
    };
  }, [turf]);

  const displayedSimilarTurfs = similarTurfs.length > 0 ? similarTurfs : allTurfs.filter((t) => t.id !== turf?.id);

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900 selection:bg-lime-300 selection:text-slate-900">
      <Navbar
        onLogin={onLogin}
        user={user}
        onLogout={onLogout}
        onListTurf={onListTurf}
        onHome={onHome}
        onFindTurfs={onFindTurfs}
      />

      {/* ─── FLOATING TOAST NOTIFICATION ─── */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[9999] flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl transition-all animate-slide-in">
          <Sparkles className="h-4 w-4 text-lime-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── BREADCRUMB (ABOVE GALLERY) ─── */}
      <div className="mx-auto max-w-[1440px] px-6 pt-6 pb-3.5 md:px-14 lg:px-20">
        <nav className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={onHome}
            className="transition-colors hover:text-slate-900 cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
          <button
            type="button"
            onClick={onFindTurfs}
            className="transition-colors hover:text-slate-900 cursor-pointer"
          >
            Find Turfs
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
          <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
            {turf.title}
          </span>
        </nav>
      </div>

      {/* ─── SECTION 1: 5-IMAGE SHOWCASE GRID (NO BORDER) ─── */}
      <section className="mx-auto max-w-[1440px] px-6 pb-2 md:px-14 lg:px-20">
        {/* Desktop 5-Photo Mosaic Grid */}
        <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-3.5 h-[380px] lg:h-[430px] rounded-2xl overflow-hidden relative shadow-lg shadow-slate-200/50">
          {/* Main Hero Shot */}
          <div
            onClick={() => openLightbox(0)}
            className="col-span-2 row-span-2 relative group overflow-hidden bg-slate-900 cursor-pointer"
          >
            <img
              src={gallery[0]}
              alt={`${turf.title} main pitch`}
              className="h-full w-full object-cover transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <Maximize2 className="h-4 w-4" /> View full resolution
              </span>
            </div>
          </div>

          {/* Sub Images 1 to 4 */}
          {[1, 2, 3, 4].map((index) => {
            const imgSrc = gallery[index] || gallery[0];
            return (
              <div
                key={index}
                onClick={() => openLightbox(index)}
                className="relative group overflow-hidden bg-slate-900 cursor-pointer"
              >
                <img
                  src={imgSrc}
                  alt={`${turf.title} view ${index + 1}`}
                  className="h-full w-full object-cover transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}

          {/* "Show All Photos" Floating Trigger Badge */}
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="absolute bottom-5 right-5 flex items-center gap-2 rounded-lg bg-white/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-md border border-slate-200/60 transition-all hover:bg-white active:scale-95 cursor-pointer z-10"
          >
            <Grip className="h-3.5 w-3.5 text-slate-900" />
            <span>Show all {gallery.length} photos</span>
          </button>
        </div>

        {/* Mobile Swipeable Carousel */}
        <div className="md:hidden relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-md">
          <img
            src={gallery[activeImageIndex] || gallery[0]}
            alt={`${turf.title} mobile preview`}
            onClick={() => openLightbox(activeImageIndex)}
            className="h-full w-full object-cover"
          />
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md backdrop-blur-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-md backdrop-blur-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 right-3 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white">
                {activeImageIndex + 1} / {gallery.length}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── MAIN TWO-COLUMN CONTENT GRID (EXPLICIT FR + FIXED SIDEBAR) ─── */}
      <main className="mx-auto max-w-[1440px] px-6 py-6 md:px-14 lg:px-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_440px] lg:gap-8 xl:gap-12">
          {/* ══════════════════════════════════════
              LEFT MAIN CONTENT COLUMN (NO BORDERS)
             ══════════════════════════════════════ */}
          <div className="min-w-0 space-y-10">
            {/* ── HEADER BANNER (NO CARD CONTAINER) ── */}
            <div>
              {/* Title & Actions Row */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold tracking-tight text-slate-900 leading-tight">
                      {turf.title}
                    </h1>
                    <BadgeCheck className="h-6 w-6 fill-lime-500 text-white stroke-[2.2] shrink-0" title="Verified Arena" />
                  </div>

                  {/* Row 1: Location & Rating */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-slate-600">
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <MapPin className="h-4 w-4 text-lime-600 shrink-0" />
                      <span>{turf.address || turf.location || 'Kathmandu, Nepal'}</span>
                    </button>
                    <span className="text-slate-300">•</span>
                    <a
                      href="#reviews"
                      className="inline-flex items-center gap-1 font-bold text-slate-900 hover:text-lime-700 transition-colors"
                    >
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{turf.rating || 4.8}</span>
                      <span className="font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 ml-0.5">
                        ({turf.reviews || 321} reviews)
                      </span>
                    </a>
                  </div>

                  {/* Row 2: Type, Format & Opening Hours */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-slate-600">
                    {turf.type && (
                      <>
                        <span className="font-semibold text-slate-700 inline-flex items-center gap-1.5">
                          <Compass className="h-3.5 w-3.5 text-slate-400" />
                          {turf.type}
                        </span>
                        <span className="text-slate-300">•</span>
                      </>
                    )}
                    {turf.size && (
                      <>
                        <span className="font-semibold text-slate-700 inline-flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          {turf.size}
                        </span>
                        <span className="text-slate-300">•</span>
                      </>
                    )}
                    <span className="font-semibold text-lime-600">
                      Open Now ({turf.openingHours?.start || '6:00 AM'} – {turf.openingHours?.end || '10:30 PM'})
                    </span>
                  </div>
                </div>

                {/* Circular Action buttons */}
                <div className="hidden sm:flex items-center gap-2.5 shrink-0 pt-1.5">
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share"
                    title="Share this venue"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95 cursor-pointer"
                  >
                    <Share2 className="h-4.5 w-4.5 text-slate-700" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsFavorited(!isFavorited);
                      triggerToast(!isFavorited ? 'Saved to your favorites!' : 'Removed from favorites');
                    }}
                    aria-label="Save to favorites"
                    title="Save to favorites"
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${
                      isFavorited
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`h-4.5 w-4.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── OVERVIEW & QUICK HIGHLIGHTS ── */}
            <section id="overview" className="space-y-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-3">About The Arena</h2>
                <div className="text-[16px] leading-[28px] font-medium text-slate-800 text-justify">
                  {showFullAbout ? (
                    <>
                      <span>
                        {turf.description ||
                          `${turf.title} is one of Kathmandu valley's top-tier futsal and football destinations, built with FIFA-grade artificial grass, optimal shock-absorption cushioning, and professional LED floodlights for seamless day and night gameplay. The arena features full changing rooms, high-pressure hot/cold showers, drinking water filtration, and spectator seating.`}
                      </span>
                      {' '}
                      <button
                        type="button"
                        onClick={() => setShowFullAbout(false)}
                        className="text-sm font-semibold text-slate-900 underline decoration-slate-400 underline-offset-4 hover:text-slate-600 transition-colors cursor-pointer inline-flex items-center gap-0.5 ml-1"
                      >
                        Show less
                      </button>
                    </>
                  ) : (
                    <>
                      <span>
                        {(turf.description || `${turf.title} is one of Kathmandu valley's top-tier futsal and football destinations, built with FIFA-grade artificial grass, optimal shock-absorption cushioning, and professional LED floodlights for seamless day and night gameplay. The arena features full changing rooms, high-pressure hot/cold showers, drinking water filtration, and spectator seating.`).slice(0, 220).trim()}...
                      </span>
                      {' '}
                      <button
                        type="button"
                        onClick={() => setShowFullAbout(true)}
                        className="text-sm font-semibold text-slate-900 underline decoration-slate-400 underline-offset-4 hover:text-slate-600 transition-colors cursor-pointer inline-flex items-center gap-0.5 ml-1"
                      >
                        Show more
                      </button>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* ── SECTION: VENUE OWNER / CONTACT INFO (BORDERLESS GRAY CARD) ── */}
            <div className="rounded-2xl bg-slate-100/80 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={
                        turf.managerAvatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'
                      }
                      alt="Venue Owner"
                      className="h-12 w-12 sm:h-13 sm:w-13 rounded-full object-cover ring-2 ring-white shadow-xs"
                    />
                    <BadgeCheck
                      className="absolute -bottom-0.5 -right-0.5 h-5 w-5 fill-lime-500 text-white stroke-[2.2] drop-shadow-xs"
                      title="Verified Host"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      Owner: {turf.managerName || turf.ownerName || 'Bikash Maharjan'}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Verified Venue Owner • Responds within 5 mins
                    </p>
                  </div>
                </div>

                {/* Contact Actions (Borderless, Pill Rounded) */}
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://wa.me/${(turf.phone || '9779841234567').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hi, I'm inquiring about booking at ${turf.title} via Turfio.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-950 px-4 py-2 text-xs font-black transition-all active:scale-95 shadow-xs"
                  >
                    <MessageCircle className="h-4 w-4 text-slate-950 fill-slate-950/20" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${turf.phone || '+977 9841234567'}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-slate-200/90 text-slate-800 px-4 py-2 text-xs font-bold transition-all active:scale-95 shadow-2xs"
                  >
                    <Phone className="h-3.5 w-3.5 text-slate-600" />
                    <span>{turf.phone || '+977 9841-234567'}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* ── SECTION: AMENITIES & FACILITIES (NO BORDERS) ── */}
            <section id="amenities" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  What this place offers
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAmenitiesModal(true)}
                  className="text-sm font-semibold text-slate-900 underline decoration-slate-400 underline-offset-4 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  View all ({amenities.length})
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                {amenities.slice(0, 9).map((amenity) => {
                  const Icon = amenityIconMap[amenity] || Check;
                  return (
                    <div key={amenity} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400/25 text-lime-950">
                        <Icon className="h-5 w-5 text-lime-900" strokeWidth={2} />
                      </div>
                      <span className="text-sm font-bold text-slate-800">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── SECTION: LOCATION & DIRECTIONS ── */}
            <section id="location" className="space-y-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Where you'll be</h2>
              </div>
              <div className="h-96 w-full rounded-3xl overflow-hidden bg-slate-100 relative shadow-[0_2px_18px_rgba(0,0,0,0.06)]">
                <TurfSingleLocationMap
                  turf={currentTurfWithCoords}
                  onNavigateRoute={onNavigateRoute}
                />
              </div>
              <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[16px] font-semibold text-slate-900">
                  {turf.address || turf.location}
                </p>
                {onNavigateRoute ? (
                  <button
                    type="button"
                    onClick={() => onNavigateRoute(turf)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 underline decoration-slate-400 underline-offset-4 hover:text-slate-600 transition-colors group cursor-pointer"
                  >
                    <span>Get Turn-by-Turn Directions</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(turf.address || turf.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 underline decoration-slate-400 underline-offset-4 hover:text-slate-600 transition-colors group cursor-pointer"
                  >
                    <span>Get Directions</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
            </section>

            {/* ── SECTION: REVIEWS & RATINGS ── */}
            <section id="reviews" className="space-y-6 pt-2">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center gap-6 mb-2">
                  <img src="/grain_left.png" alt="left laurel" className="h-24 sm:h-26 w-auto object-contain" />
                  <span className="text-[80px] font-extrabold text-slate-900 leading-none tracking-tight">
                    {turf.rating}
                  </span>
                  <img src="/grain_right.png" alt="right laurel" className="h-24 sm:h-26 w-auto object-contain" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">Players' favorite</h3>
                <p className="mt-2 text-[16px] leading-[26px] font-medium text-slate-800 max-w-sm mx-auto">
                  One of the most loved turfs on Turfio based on ratings, reviews, and reliability
                </p>
                <button
                  type="button"
                  className="mt-3 text-sm font-bold text-slate-900 underline decoration-slate-400 underline-offset-4 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {turf.reviews} reviews
                </button>
              </div>

              {/* Individual reviews (Clean Airbnb Review Architecture) */}
              {turf.reviewsList && turf.reviewsList.length > 0 && (
                <div className="pt-2">
                  {turf.reviewsList.map((review, i) => (
                    <div key={i}>
                      {i > 0 && <div className="my-8 border-t border-slate-100" />}
                      <div className="flex flex-col space-y-3.5">
                        {/* Reviewer Header */}
                        <div className="flex items-center gap-3.5">
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 shrink-0 shadow-2xs"
                          />
                          <div>
                            <h4 className="text-[16px] font-bold text-slate-900 leading-snug">
                              {review.name}
                            </h4>
                            <p className="text-[13px] font-medium text-slate-500">
                              2 years on Turfio
                            </p>
                          </div>
                        </div>

                        {/* Rating Stars & Timestamp (Inline Row) */}
                        <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                          <StarRating rating={review.rating} size="h-3.5 w-3.5" />
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 font-medium">{review.date}</span>
                        </div>

                        {/* Review Body */}
                        <p className="text-[16px] leading-[28px] font-medium text-slate-800 antialiased">
                          {review.comment}
                        </p>

                        {/* User-attached Review Photos */}
                        {review.images && review.images.length > 0 && (
                          <div className="pt-1 flex flex-wrap gap-3">
                            {review.images.map((imgUrl, imgIdx) => (
                              <button
                                key={imgIdx}
                                type="button"
                                onClick={() => setPreviewReviewImage(imgUrl)}
                                className="group relative h-22 w-22 sm:h-24 sm:w-24 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/80 transition-all hover:ring-2 hover:ring-lime-400 cursor-pointer shadow-xs"
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Review photo by ${review.name}`}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Review Feedback Actions (Helpful & Report) */}
                        <div className="pt-1 flex items-center gap-5 text-[13px] font-medium text-slate-500">
                          <button
                            type="button"
                            onClick={() => handleToggleHelpful(i)}
                            className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                              helpfulReviews[i]
                                ? 'text-lime-700 font-bold'
                                : 'hover:text-slate-900 text-slate-500'
                            }`}
                          >
                            <ThumbsUp className={`h-3.5 w-3.5 ${helpfulReviews[i] ? 'fill-lime-600 text-lime-700 stroke-[2]' : 'text-slate-400'}`} />
                            <span>Helpful {helpfulReviews[i] ? '(1)' : ''}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReportReview(i)}
                            className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                              reportedReviews[i]
                                ? 'text-rose-600 font-bold'
                                : 'hover:text-slate-700 text-slate-400'
                            }`}
                          >
                            <Flag className="h-3.5 w-3.5" />
                            <span>{reportedReviews[i] ? 'Reported' : 'Report'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ══════════════════════════════════════
              RIGHT STICKY SIDEBAR (EXACT WIDTH)
             ══════════════════════════════════════ */}
          <div>
            <div className="lg:sticky lg:top-28 space-y-5 w-full">
              {/* ── HIGH-CONVERSION BOOKING CARD (AIRBNB FLOATING ELEVATION) ── */}
              <div className="w-full rounded-2xl bg-white p-6 sm:p-7 shadow-[0_0_25px_rgba(0,0,0,0.04)] space-y-5">
                {/* Header Price Banner */}
                <div className="flex items-baseline justify-between pb-1">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-slate-900 tracking-tight">
                        NPR {baseRateNumeric.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">/ hour</span>
                    </div>
                  </div>
                </div>

                {/* ── COMPOUND SEGMENTED BOOKING INPUTS (AIRBNB STYLE) ── */}
                <div className="rounded-2xl border border-slate-200 bg-white overflow-visible divide-y divide-slate-200 shadow-2xs">
                  {/* Top Row: Match Date (Full Width) */}
                  <div>
                    <CustomDatePicker
                      label="Match Date"
                      value={selectedDate}
                      onChange={setSelectedDate}
                      minDate={new Date().toISOString().split('T')[0]}
                      availableDays={effectiveAvailableDays}
                      variant="cell"
                      buttonClassName="rounded-t-2xl"
                    />
                  </div>

                  {/* Bottom Row: 2 Columns for Start Time & Duration */}
                  <div className="grid grid-cols-2 divide-x divide-slate-200">
                    <CustomDropdown
                      label="Start Time"
                      options={timeSlotOptions}
                      value={selectedTimeSlot}
                      onChange={setSelectedTimeSlot}
                      variant="cell"
                      buttonClassName="rounded-bl-2xl"
                    />
                    <CustomDropdown
                      label="Duration"
                      options={DURATION_OPTIONS}
                      value={duration}
                      onChange={setDuration}
                      variant="cell"
                      buttonClassName="rounded-br-2xl"
                    />
                  </div>
                </div>

                {/* Holiday Warning Notice if selected date is closed */}
                {isSelectedDateHoliday && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200/80 p-3.5 text-center text-xs font-semibold text-rose-700">
                    ⛔ Venue is closed on this day (Holiday). Please select an open date.
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-slate-100 text-sm font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>
                      NPR {baseRateNumeric.toLocaleString()} × {duration} {duration === 1 ? 'hr' : 'hrs'}
                    </span>
                    <span className="font-bold text-slate-900">
                      NPR {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span>Platform Booking Fee</span>
                      <div className="relative group flex items-center">
                        <button
                          type="button"
                          aria-label="Platform fee info"
                          className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-medium text-white opacity-0 shadow-xl transition-all group-hover:opacity-100 group-focus-within:opacity-100 z-50 text-center leading-snug">
                          Turfio charges NPR 0 booking fee for all players. Enjoy 100% free reservations!
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-lime-700 bg-lime-100/80 px-2.5 py-0.5 rounded-full text-xs">
                      FREE
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-base font-black text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-xl text-slate-900 font-black">
                      NPR {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Book Now Button CTA */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    disabled={isHoldingSlot || isSelectedDateHoliday}
                    onClick={handleBookSlot}
                    className="w-full rounded-full bg-lime-400 hover:bg-lime-500 py-3.5 text-base font-black text-slate-950 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSelectedDateHoliday ? 'Venue Closed on this Date' : isHoldingSlot ? 'Reserving...' : 'Book This Slot'}</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <p className="text-center text-xs font-medium text-slate-400">
                    You won't be charged yet
                  </p>
                </div>
              </div>

              {/* Match Window preview badge outside card below */}
              <div className="rounded-2xl bg-slate-100/90 py-3 px-4 text-center text-xs font-medium text-slate-600">
                Match Window: <span className="font-bold text-slate-900">{selectedTimeSlot}</span> →{' '}
                <span className="font-bold text-lime-700">{endTimeStr}</span> ({duration}h)
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── SIMILAR TURFS NEARBY ─── */}
      {similarTurfs.length > 0 && (
        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-sm font-semibold text-lime-500">
                  Explore More Venues
                </span>
                <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                  Similar Turfs Nearby
                </h2>
                <p className="mt-1.5 text-sm font-medium text-slate-500 sm:text-base">
                  Other top-rated pitches and arenas around this area.
                </p>
              </div>
              <button
                type="button"
                onClick={onFindTurfs}
                className="text-sm font-semibold text-slate-900 underline decoration-slate-400 underline-offset-4 hover:text-slate-600 transition-colors cursor-pointer"
              >
                View all turfs
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {displayedSimilarTurfs.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onViewTurfDetails?.(t)}
                  className="group flex flex-col justify-between bg-white cursor-pointer"
                >
                  <div className="w-full">
                    {/* Card Image with rounded corners matching landing page */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-slate-100">
                      <img
                        src={t.image}
                        alt={t.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/image.png';
                        }}
                      />
                    </div>

                    {/* Text details flush with left edge */}
                    <div className="pt-3 px-0 pb-0">
                      {/* Badges / Features line */}
                      <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1">
                          <Compass className="h-3.5 w-3.5 text-slate-400" />
                          {t.type || 'Indoor'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          {t.size || '7v7'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Car className="h-3.5 w-3.5 text-slate-400" />
                          {t.parking || 'Parking'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-2 text-base font-bold text-slate-900 group-hover:text-lime-600 transition-colors">
                        {t.title}
                      </h3>

                      {/* Rating */}
                      <div className="mt-1 flex items-center gap-1">
                        <div className="flex text-lime-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-lime-400 text-lime-400"
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-xs font-semibold text-slate-600">
                          {t.rating} ({t.reviews})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer: Price & CTA flush with left edge */}
                  <div className="pt-3 px-0 pb-1 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-600">
                      {t.price}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewTurfDetails?.(t);
                      }}
                      className="rounded-full bg-lime-400 px-5 py-2 text-xs font-bold text-slate-900 transition-all hover:bg-lime-500 active:scale-95 cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── MOBILE STICKY FLOATING BOTTOM BAR (NO BORDER) ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 p-4 backdrop-blur-md lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-900">
                NPR {totalAmount.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-400">total ({duration}h)</span>
            </div>
            <p className="text-[11px] font-bold text-emerald-600">
              {selectedTimeSlot} • {selectedDate}
            </p>
          </div>

          <button
            type="button"
            disabled={isHoldingSlot || isSelectedDateHoliday}
            onClick={handleBookSlot}
            className="rounded-full bg-lime-400 hover:bg-lime-500 px-6 py-3 text-sm font-black text-slate-950 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSelectedDateHoliday ? 'Venue Closed' : isHoldingSlot ? 'Reserving...' : 'Book Now'}
          </button>
        </div>
      </div>

      <Footer />

      {/* ─── LIGHTBOX MODAL ─── */}
      {lightboxOpen && (
        <ImageLightbox
          images={gallery}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
          onSelect={setLightboxIndex}
        />
      )}

      {/* ─── AMENITIES MODAL ─── */}
      <AmenitiesModal
        isOpen={showAmenitiesModal}
        onClose={() => setShowAmenitiesModal(false)}
        amenities={amenities}
      />

      {/* ─── ENLARGED REVIEW PHOTO MODAL ─── */}
      {previewReviewImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPreviewReviewImage(null)}
        >
          <div
            className="relative max-h-[85vh] max-w-3xl overflow-hidden rounded-2xl bg-black p-1 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewReviewImage(null)}
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 transition-all cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={previewReviewImage}
              alt="Review attachment"
              className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
