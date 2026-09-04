import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
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
  Trophy,
  MessageSquare,
  Tag,
  Key
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BackToTopButton from '../../components/BackToTopButton';

/* ─── amenity icon map ─── */
const amenityIconMap = {
  Parking: Car,
  WiFi: Wifi,
  Washrooms: Droplets,
  'Changing Rooms': Users,
  Canteen: Zap,
  'First Aid': Shield,
  Floodlights: Zap,
  'Drinking Water': Droplets,
  'Locker Rooms': Shield,
  'Spectator Seating': Users,
};

/* ─── star component ─── */
function StarRating({ rating, size = 'h-4 w-4' }) {
  return (
    <div className="flex">
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

/* ─── image gallery lightbox ─── */
function ImageLightbox({ images, currentIndex, onClose, onPrev, onNext }) {
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <img
        src={images[currentIndex]}
        alt={`Gallery ${currentIndex + 1}`}
        className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
      />

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── similar turfs data (subset for "Similar Turfs" section) ─── */
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

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const PERIODS = ['AM', 'PM'];

function CustomTimePickerDropdown({ timeObj, duration, onChange, isTimeSlotAvailable }) {
  return (
    <div className="absolute top-[110%] left-0 w-[200px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 z-50 overflow-hidden cursor-default" onClick={(e) => e.stopPropagation()}>
      {/* Top Display */}
      <div className="flex items-center justify-center gap-2 p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="w-16 h-14 bg-[#96D800] rounded-xl flex items-center justify-center text-white text-2xl font-bold">
          {timeObj.hour}
        </div>
        <span className="text-2xl font-bold text-slate-800 pb-1">:</span>
        <div className="w-16 h-14 bg-[#96D800] rounded-xl flex items-center justify-center text-white text-2xl font-bold">
          00
        </div>
        <div className="w-16 h-14 bg-[#96D800] rounded-xl flex items-center justify-center text-white text-xl font-bold ml-2">
          {timeObj.period}
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-2 h-[200px] divide-x divide-slate-100 relative bg-white">
        {/* Hours */}
        <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth py-2">
          <div className="text-[10px] font-bold text-slate-500 text-center mb-2 tracking-widest">HOURS</div>
          {HOURS.map((h) => {
            const isAvailable = isTimeSlotAvailable ? isTimeSlotAvailable(h, timeObj.period, duration) : true;
            return (
              <button
                key={`h-${h}`}
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (isAvailable) {
                    onChange({ ...timeObj, hour: h, minute: '00' });
                  }
                }}
                className={`w-12 h-10 mx-auto flex items-center justify-center rounded-lg text-sm font-semibold transition-colors mb-1 ${
                  !isAvailable 
                    ? 'text-slate-300 cursor-not-allowed line-through bg-slate-50' 
                    : timeObj.hour === h ? 'bg-[#96D800] text-white' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                {h}
              </button>
            );
          })}
        </div>
        {/* Periods */}
        <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth py-2">
          <div className="text-[10px] font-bold text-slate-500 text-center mb-2 tracking-widest">PERIOD</div>
          {PERIODS.map((p) => {
            const isAvailable = isTimeSlotAvailable ? isTimeSlotAvailable(timeObj.hour, p, duration) : true;
            return (
              <button
                key={`p-${p}`}
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (isAvailable) {
                    onChange({ ...timeObj, period: p, minute: '00' });
                  }
                }}
                className={`w-12 h-10 mx-auto flex items-center justify-center rounded-lg text-sm font-semibold transition-colors mb-1 ${
                  !isAvailable 
                    ? 'text-slate-300 cursor-not-allowed line-through bg-slate-50' 
                    : timeObj.period === p ? 'bg-[#96D800] text-white' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
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
  user,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimeObj, setSelectedTimeObj] = useState({ hour: '06', minute: '00', period: 'AM' });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [duration, setDuration] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
  }, [turf?.id]);

  // ── FILTERING & TIME HELPERS ──
  // Mock booked slots for demonstration of filtering (e.g. today)
  const mockedBookedSlots = ['07:00 AM', '08:00 AM', '05:00 PM'];
  
  const isTimeSlotAvailable = (hourStr, period, checkDuration) => {
    let startHour24 = parseInt(hourStr, 10);
    if (period === 'PM' && startHour24 !== 12) startHour24 += 12;
    if (period === 'AM' && startHour24 === 12) startHour24 = 0;
    
    // Check every 1-hour block for overlap
    for (let i = 0; i < Math.ceil(checkDuration); i++) {
      let checkHour24 = (startHour24 + i) % 24;
      let checkPeriod = checkHour24 >= 12 ? 'PM' : 'AM';
      let checkHour12 = checkHour24 % 12;
      if (checkHour12 === 0) checkHour12 = 12;
      let checkTimeStr = `${checkHour12.toString().padStart(2, '0')}:00 ${checkPeriod}`;
      
      if (mockedBookedSlots.includes(checkTimeStr)) {
        return false;
      }
    }
    return true;
  };

  const getEndTimeStr = () => {
    let h = parseInt(selectedTimeObj.hour, 10);
    if (selectedTimeObj.period === 'PM' && h !== 12) h += 12;
    if (selectedTimeObj.period === 'AM' && h === 12) h = 0;
    
    let endHour24 = h + Math.floor(duration);
    let endMinute = (duration % 1) * 60; 
    
    let endPeriod = (endHour24 % 24) >= 12 ? 'PM' : 'AM';
    let endHour12 = (endHour24 % 24) % 12;
    if (endHour12 === 0) endHour12 = 12;
    
    const endMinStr = endMinute === 0 ? '00' : endMinute.toString().padStart(2, '0');
    return `${endHour12.toString().padStart(2, '0')}:${endMinStr} ${endPeriod}`;
  };

  if (!turf) return null;

  const gallery = turf.gallery || [turf.image];
  const similarTurfs = allTurfs.filter((t) => t.id !== turf.id);

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

  const handlePrevMain = (e) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextMain = (e) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  /* ─── time slots ─── */
  const timeSlots = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM',
  ];

  /* ─── rating breakdown ─── */
  const ratingBreakdown = [
    { stars: 5, percent: 72 },
    { stars: 4, percent: 18 },
    { stars: 3, percent: 7 },
    { stars: 2, percent: 2 },
    { stars: 1, percent: 1 },
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar
        onLogin={onLogin}
        user={user}
        onLogout={onLogout}
        onListTurf={onListTurf}
        onHome={onHome}
        onFindTurfs={onFindTurfs}
      />

      {/* ─── BREADCRUMB (Matches Navbar px exactly: px-6 md:px-14 lg:px-20 max-w-[1440px], seamless background without border stroke) ─── */}
      <div className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 pt-5 pb-2 md:px-14 lg:px-20">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <button onClick={onHome} className="transition-colors hover:text-slate-900 cursor-pointer">
              Home
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <button onClick={onFindTurfs} className="transition-colors hover:text-slate-900 cursor-pointer">
              Find Turfs
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="font-semibold text-slate-900 truncate max-w-[240px]">
              {turf.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ─── REDESIGNED IMAGE SHOWCASE & CAROUSEL (Matches Navbar px exactly: px-6 md:px-14 lg:px-20 max-w-[1440px]) ─── */}
      <section className="mx-auto max-w-[1440px] px-6 pt-6 pb-2 md:px-14 lg:px-20">
        <div className="space-y-3">
          {/* Main Hero Showcase Window */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.4/1] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] group">
            {/* Active Display Image */}
            <img
              src={gallery[activeImageIndex] || gallery[0]}
              alt={`${turf.title} - View ${activeImageIndex + 1}`}
              className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 cursor-pointer select-none"
              onClick={() => openLightbox(activeImageIndex)}
              onError={(e) => { e.target.onerror = null; e.target.src = '/image.png'; }}
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20 pointer-events-none" />

            {/* Floating Carousel Navigation Arrows */}
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevMain}
                  aria-label="Previous photo"
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xl backdrop-blur-md border border-white/60 transition-all duration-200 hover:bg-lime-400 hover:scale-110 active:scale-95 cursor-pointer z-10"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                <button
                  type="button"
                  onClick={handleNextMain}
                  aria-label="Next photo"
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xl backdrop-blur-md border border-white/60 transition-all duration-200 hover:bg-lime-400 hover:scale-110 active:scale-95 cursor-pointer z-10"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </>
            )}

            {/* Bottom Indicator Dots (Mobile) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:hidden z-10">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeImageIndex ? 'w-6 bg-lime-400' : 'w-1.5 bg-white/50'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail Strip with Active Lime Border & View All Button */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {gallery.map((img, i) => {
                const isActive = i === activeImageIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative shrink-0 h-16 sm:h-20 aspect-[16/10] overflow-hidden rounded-2xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'ring-3 ring-lime-400 ring-offset-2 scale-100 shadow-md'
                        : 'opacity-65 hover:opacity-100 hover:scale-95'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/image.png'; }}
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-lime-400/10 pointer-events-none" />
                    )}
                  </button>
                );
              })}

              {/* View All Photos Thumbnail Trigger */}
              <button
                type="button"
                onClick={() => openLightbox(activeImageIndex)}
                className="shrink-0 h-16 sm:h-20 px-4 sm:px-5 rounded-2xl bg-slate-100 hover:bg-lime-100/80 text-slate-800 hover:text-lime-900 border border-slate-200/80 font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <ImageIcon className="h-4 w-4 text-lime-600" />
                <span>All {gallery.length} Photos</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── MAIN CONTENT: TWO COLUMNS (Matches Navbar px exactly: px-6 md:px-14 lg:px-20 max-w-[1440px]) ─── */}
      <section className="mx-auto max-w-[1440px] px-6 py-6 md:px-14 lg:px-20 lg:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Turf header */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-lime-100 px-2.5 py-1 text-xs font-semibold text-lime-700">
                      <Compass className="h-3 w-3" /> {turf.type}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      <Users className="h-3 w-3" /> {turf.size}
                    </span>
                    {turf.surface && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {turf.surface}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                    {turf.title}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="h-4 w-4 text-lime-500" />
                      {turf.location || 'Kathmandu, Nepal'}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <StarRating rating={turf.rating} />
                      <span className="text-slate-900">{turf.rating}</span>
                      <span className="text-slate-400">({turf.reviews} reviews)</span>
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                      isFavorited
                        ? 'border-rose-200 bg-rose-50 text-rose-500'
                        : 'border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:border-rose-200'
                    }`}
                  >
                    <Heart className={`h-4.5 w-4.5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors hover:text-slate-600 hover:border-slate-300">
                    <Share2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="py-8 border-b border-slate-200">
              <h2 className="text-[22px] font-semibold text-slate-900 mb-4">About This Turf</h2>
              <p className="text-[16px] leading-[26px] text-slate-700">
                {turf.description || 'A premium futsal turf with excellent facilities, perfect for your next game. Book your slot now and experience the best playing conditions in the area.'}
              </p>
            </div>

            {/* Amenities */}
            <div className="py-8 border-b border-slate-200">
              <h2 className="text-[22px] font-semibold text-slate-900 mb-6">What this place offers</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {(turf.amenities || ['Parking', 'WiFi', 'Washrooms', 'Changing Rooms', 'First Aid', 'Drinking Water']).slice(0, 10).map((amenity) => {
                  const Icon = amenityIconMap[amenity] || Check;
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-4 py-2"
                    >
                      <Icon className="h-6 w-6 text-slate-800 shrink-0" strokeWidth={1.5} />
                      <span className="text-[16px] text-slate-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8">
                <button className="px-6 py-3.5 rounded-xl border border-slate-900 bg-white text-slate-900 font-semibold text-[16px] hover:bg-slate-50 transition-colors cursor-pointer active:scale-[0.98]">
                  Show all {(turf.amenities || [1,2,3,4,5,6]).length} amenities
                </button>
              </div>
            </div>

            {/* Available courts */}
            {turf.courts && turf.courts.length > 0 && (
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Available Courts</h2>
                <div className="mt-1 h-1 w-10 rounded-full bg-lime-400" />
                <div className="mt-4 space-y-3">
                  {turf.courts.map((court, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-4 transition-colors hover:border-lime-200"
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-100 text-lime-600 font-bold text-sm">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{court.name}</p>
                          <p className="text-xs font-medium text-slate-400">
                            {court.type} • {court.size}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-lime-600">{court.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="py-6 border-b border-slate-200">
              <h2 className="text-[22px] font-semibold text-slate-900 mb-4">Where you'll be</h2>
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                {/* Map iframe */}
                <div className="h-96 bg-slate-100 flex items-center justify-center relative">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(turf.address || turf.location || 'Kathmandu')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    title="Google Maps Preview"
                  ></iframe>
                </div>
                <div className="px-5 py-4 bg-white">
                  <p className="text-[16px] font-semibold text-slate-900">
                    {turf.address || turf.location}
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(turf.address || turf.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-[15px] font-semibold text-slate-900 underline hover:text-slate-600 transition-colors"
                  >
                    Get Directions <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Reviews & Ratings */}
            <div className="py-12 border-b border-slate-200">
              <div className="flex flex-col items-center justify-center text-center mb-10">
                <div className="flex items-center justify-center gap-6 mb-2">
                  <img src="/grain_left.png" alt="left laurel" className="h-20 w-auto object-contain" />
                  <span className="text-[80px] font-bold text-slate-900 leading-none tracking-tight">
                    {turf.rating}
                  </span>
                  <img src="/grain_right.png" alt="right laurel" className="h-20 w-auto object-contain" />
                </div>
                <h3 className="text-[22px] font-semibold text-slate-900 mt-2">Players favorite</h3>
                <p className="mt-2 text-[16px] text-slate-500 max-w-sm mx-auto">
                  One of the most loved turfs on Turfio based on ratings, reviews, and reliability
                </p>
                <div className="mt-3 font-semibold text-[14px] text-slate-900 underline cursor-pointer">
                  {turf.reviews} reviews
                </div>
              </div>

              {/* Sub ratings */}
              

              {/* Individual reviews */}
              {turf.reviewsList && turf.reviewsList.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 border-t border-slate-200 pt-8">
                  {turf.reviewsList.map((review, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="flex items-center gap-4 mb-3">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-[16px] font-semibold text-slate-900">{review.name}</div>
                          <div className="text-[14px] text-slate-500">2 years on Turfio</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <StarRating rating={review.rating} size="h-3 w-3" />
                        <span className="text-[12px] font-semibold text-slate-900 ml-1">·</span>
                        <span className="text-[14px] font-medium text-slate-900">{review.date}</span>
                      </div>
                      <p className="text-[16px] leading-relaxed text-slate-800 line-clamp-4">
                        {review.comment}
                      </p>
                      <button className="mt-2 text-left text-[15px] font-semibold text-slate-900 underline self-start hover:text-slate-600 transition-colors">Show more</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Policies */}
            {turf.policies && turf.policies.length > 0 && (
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Turf Policies</h2>
                <div className="mt-1 h-1 w-10 rounded-full bg-lime-400" />
                <div className="mt-4 space-y-3">
                  {turf.policies.map((policy, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-100 bg-white px-5 py-4"
                    >
                      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Shield className="h-4 w-4 text-lime-500" />
                        {policy.title}
                      </h3>
                      <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                        {policy.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN (STICKY SIDEBAR) ── */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-36 space-y-5">
              {/* Booking card */}
              <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)]">
                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">{turf.price}</span>
                  <span className="text-sm font-medium text-slate-400">per hour</span>
                </div>

                <div className="mt-1 flex items-center gap-1.5">
                  <StarRating rating={turf.rating} size="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold text-slate-600">
                    {turf.rating} ({turf.reviews})
                  </span>
                </div>

                {/* Date, Time & Duration Picker (Airbnb Style) */}
                <div className="rounded-lg border border-slate-400 overflow-visible mb-4 bg-white relative">
                  {/* Date picker */}
                  <label className="flex flex-col border-b border-slate-400 px-3 py-2.5 cursor-pointer hover:bg-slate-50/50 transition-colors relative group">
                    <span className="text-[10px] font-bold uppercase text-slate-800 tracking-wider">Date</span>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full border-0 bg-transparent p-0 pt-0.5 text-[14px] font-medium text-slate-900 outline-none cursor-pointer"
                    />
                  </label>

                  <div className="flex divide-x divide-slate-400">
                    {/* Custom Time slot picker */}
                    <div 
                      className="flex-1 flex flex-col px-3 py-2.5 cursor-pointer hover:bg-slate-50/50 transition-colors relative"
                      onClick={() => setShowTimePicker(!showTimePicker)}
                    >
                      <span className="text-[10px] font-bold uppercase text-slate-800 tracking-wider">Time</span>
                      <div className="w-full text-[14px] font-medium text-slate-900 pt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                        {`${selectedTimeObj.hour}:00 ${selectedTimeObj.period} - ${getEndTimeStr()}`}
                      </div>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 pointer-events-none" />
                      
                      {showTimePicker && (
                        <CustomTimePickerDropdown 
                          timeObj={selectedTimeObj} 
                          duration={duration}
                          onChange={setSelectedTimeObj} 
                          isTimeSlotAvailable={isTimeSlotAvailable}
                        />
                      )}
                    </div>

                    {/* Duration picker */}
                    <label className="flex-1 flex flex-col px-3 py-2.5 cursor-pointer hover:bg-slate-50/50 transition-colors relative group">
                      <span className="text-[10px] font-bold uppercase text-slate-800 tracking-wider">Duration</span>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full border-0 bg-transparent p-0 pt-0.5 text-[14px] font-medium text-slate-900 outline-none cursor-pointer appearance-none"
                      >
                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6].map((d) => (
                          <option key={d} value={d}>{d} {d === 1 ? 'hour' : 'hours'}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 pointer-events-none" />
                    </label>
                  </div>
                </div>

                {/* Book now CTA */}
                <button
                  type="button"
                  onClick={() => onBookNow?.({ ...turf, selectedDate, selectedTime: `${selectedTimeObj.hour}:00 ${selectedTimeObj.period}`, duration })}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-lime-400 hover:bg-lime-500 px-6 py-3.5 text-[16px] font-bold text-slate-900 transition-all active:scale-[0.98] focus:outline-none"
                >
                  Book Now
                </button>

                <p className="mt-3 text-center text-[14px] text-slate-500">
                  You won't be charged yet
                </p>

                {/* Price Breakdown Preview */}
                {selectedDate && (
                  <div className="mt-5 space-y-3 text-[15px] text-slate-700">
                    <div className="flex justify-between">
                      <span className="underline">
                        NPR {turf.price.match(/(\d+,?\d*)/) ? parseInt(turf.price.match(/(\d+,?\d*)/)[1].replace(/,/g, ''), 10) : 0} x {duration} {duration === 1 ? 'hour' : 'hours'}
                      </span>
                      <span>
                        NPR {((turf.price.match(/(\d+,?\d*)/) ? parseInt(turf.price.match(/(\d+,?\d*)/)[1].replace(/,/g, ''), 10) : 0) * duration).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="underline">Service fee</span>
                      <span>NPR 0</span>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between font-semibold text-slate-900 text-[16px]">
                      <span>Total</span>
                      <span>
                        NPR {((turf.price.match(/(\d+,?\d*)/) ? parseInt(turf.price.match(/(\d+,?\d*)/)[1].replace(/,/g, ''), 10) : 0) * duration).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact info */}
              <div className="rounded-[24px] border border-slate-100 bg-white p-5">
                <h3 className="text-sm font-extrabold text-slate-900">Contact Information</h3>
                <div className="mt-3 space-y-3">
                  {turf.phone && (
                    <a
                      href={`tel:${turf.phone}`}
                      className="flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-lime-600 transition-colors"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-100/80 text-lime-600">
                        <Phone className="h-3.5 w-3.5" />
                      </span>
                      {turf.phone}
                    </a>
                  )}
                  {turf.email && (
                    <a
                      href={`mailto:${turf.email}`}
                      className="flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-lime-600 transition-colors"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-100/80 text-lime-600">
                        <Mail className="h-3.5 w-3.5" />
                      </span>
                      {turf.email}
                    </a>
                  )}
                </div>
              </div>

              {/* Operating hours */}
              {turf.operatingHours && (
                <div className="rounded-[24px] border border-slate-100 bg-white p-5">
                  <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                    <Clock className="h-4 w-4 text-lime-500" />
                    Operating Hours
                  </h3>
                  <div className="mt-3 space-y-2.5">
                    {turf.operatingHours.map((schedule, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-600">{schedule.day}</span>
                        <span className="font-bold text-slate-900">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SIMILAR TURFS ─── */}
      {similarTurfs.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50/40 py-10 lg:py-14">
          <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-20">
            <div className="text-center">
              <span className="text-sm font-semibold text-lime-500">Explore more</span>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Similar Turfs Near You
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarTurfs.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onViewTurfDetails?.(t)}
                  className="group cursor-pointer rounded-[24px] border border-slate-100 bg-white overflow-hidden transition-shadow hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={t.image}
                      alt={t.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/image.png'; }}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <Compass className="h-3 w-3 text-slate-400" /> {t.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-slate-400" /> {t.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" /> {t.location}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-bold text-slate-900 group-hover:text-lime-600 transition-colors">
                      {t.title}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <StarRating rating={t.rating} size="h-3.5 w-3.5" />
                      <span className="text-xs font-semibold text-slate-600">
                        {t.rating} ({t.reviews})
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700">{t.price}</span>
                      <span className="rounded-full bg-lime-400 px-4 py-1.5 text-xs font-bold text-slate-900 transition-colors group-hover:bg-lime-500">
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA BANNER ─── */}
      <section className="bg-white py-6 lg:py-8">
        <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-20">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-lime-200/50 via-lime-50/70 to-lime-100/60 p-5 sm:p-6 lg:p-7">
            <img
              src="/football.png"
              alt="Football"
              className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 h-[160%] max-h-[160px] w-auto object-contain pointer-events-none z-0"
            />
            <div className="relative z-10 flex flex-col items-center justify-between gap-5 md:flex-row md:gap-8 pl-28 sm:pl-40 md:pl-48 lg:pl-52">
              <div className="text-center md:text-left">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                  Ready for your next match?
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-600 sm:text-base">
                  Book your turf in under 30 seconds.
                </p>
              </div>
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => onBookNow?.(turf)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-lime-400 px-6 py-3.5 text-[15px] font-semibold text-slate-900 transition-colors hover:bg-lime-500 active:scale-95"
                >
                  Book a Turf Now
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTopButton />

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={gallery}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />
      )}
    </div>
  );
}
