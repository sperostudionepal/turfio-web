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
  Maximize2,
  ImageIcon,
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
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
  }, [turf?.id]);

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

            {/* Quick info bar */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Compass, label: 'Type', value: turf.type },
                { icon: Users, label: 'Capacity', value: turf.size },
                { icon: Zap, label: 'Surface', value: turf.surface || 'Artificial' },
                { icon: MapPin, label: 'Dimensions', value: turf.dimensions || 'Standard' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3.5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-slate-400">{item.label}</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* About */}
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">About This Turf</h2>
              <div className="mt-1 h-1 w-10 rounded-full bg-lime-400" />
              <p className="mt-4 text-[15px] leading-relaxed text-slate-600 font-medium">
                {turf.description || 'A premium futsal turf with excellent facilities, perfect for your next game. Book your slot now and experience the best playing conditions in the area.'}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Amenities & Facilities</h2>
              <div className="mt-1 h-1 w-10 rounded-full bg-lime-400" />
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {(turf.amenities || ['Parking', 'Washrooms', 'Floodlights']).map((amenity) => {
                  const Icon = amenityIconMap[amenity] || Check;
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3.5 py-3 transition-colors hover:border-lime-200 hover:bg-lime-50/40"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lime-100/80 text-lime-600">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-slate-700">{amenity}</span>
                    </div>
                  );
                })}
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
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Location</h2>
              <div className="mt-1 h-1 w-10 rounded-full bg-lime-400" />
              <div className="mt-4 rounded-2xl border border-slate-100 overflow-hidden">
                {/* Map placeholder */}
                <div className="h-52 bg-slate-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-lime-500 mx-auto" />
                    <p className="mt-2 text-sm font-semibold text-slate-500">Map view</p>
                    <p className="text-xs text-slate-400">Interactive map coming soon</p>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-lime-500" />
                    {turf.address || turf.location}
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(turf.address || turf.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-lime-600 hover:text-lime-700 transition-colors"
                  >
                    Get Directions <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Reviews & Ratings */}
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Reviews & Ratings</h2>
              <div className="mt-1 h-1 w-10 rounded-full bg-lime-400" />

              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-12">
                {/* Rating summary */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                  <span className="text-4xl font-black text-slate-900">{turf.rating}</span>
                  <StarRating rating={turf.rating} size="h-5 w-5" />
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    {turf.reviews} reviews
                  </p>
                </div>

                {/* Breakdown bars */}
                <div className="sm:col-span-8 flex flex-col justify-center gap-2">
                  {ratingBreakdown.map((row) => (
                    <div key={row.stars} className="flex items-center gap-2.5">
                      <span className="w-5 text-right text-xs font-bold text-slate-500">
                        {row.stars}
                      </span>
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all"
                          style={{ width: `${row.percent}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs font-medium text-slate-400">
                        {row.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual reviews */}
              {turf.reviewsList && turf.reviewsList.length > 0 && (
                <div className="mt-6 space-y-4">
                  {turf.reviewsList.map((review, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-100 bg-white p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-lime-400/20"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-slate-900">{review.name}</span>
                              <CheckCircle2 className="h-3.5 w-3.5 text-lime-500" />
                            </div>
                            <p className="text-xs font-medium text-slate-400">{review.date}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="h-3.5 w-3.5" />
                      </div>
                      <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                        "{review.comment}"
                      </p>
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

                <div className="my-5 h-px bg-slate-100" />

                {/* Date picker */}
                <div className="space-y-3">
                  <label className="group flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition-colors focus-within:border-lime-400 focus-within:ring-1 focus-within:ring-lime-400 hover:border-slate-300">
                    <Calendar className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-lime-500" />
                    <div className="flex-1 min-w-0">
                      <span className="block text-[11px] font-medium text-slate-400">Select Date</span>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="mt-0.5 w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 outline-none"
                      />
                    </div>
                  </label>

                  {/* Time slot picker */}
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-[11px] font-medium text-slate-400">Select Time Slot</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.slice(0, 9).map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`rounded-xl px-2 py-2 text-xs font-semibold transition-all ${
                            selectedTime === slot
                              ? 'bg-lime-400 text-slate-900 ring-2 ring-lime-300'
                              : 'border border-slate-200 bg-white text-slate-600 hover:border-lime-300 hover:bg-lime-50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    {timeSlots.length > 9 && !selectedTime && (
                      <p className="mt-2 text-center text-[11px] font-medium text-slate-400">
                        Scroll for more slots
                      </p>
                    )}
                  </div>
                </div>

                <div className="my-5 h-px bg-slate-100" />

                {/* Book now CTA */}
                <button
                  type="button"
                  onClick={() => onBookNow?.(turf)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-lime-400 px-6 py-3.5 text-[15px] font-bold text-slate-900 transition-all hover:bg-lime-500 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-lime-300"
                >
                  Book Now
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-3 text-center text-xs font-medium text-slate-400">
                  <CheckCircle2 className="inline h-3 w-3 text-lime-500 mr-1" />
                  Instant confirmation • No hidden fees
                </p>
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
