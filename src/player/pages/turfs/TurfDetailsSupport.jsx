import { useEffect } from 'react';
import { Car, CheckCircle2, ChevronLeft, ChevronRight, Coffee, Droplets, Shield, Star, Trophy, Users, Wifi, X, Zap } from 'lucide-react';

/* ─── Amenity Icon Mapping ─── */
export const amenityIconMap = {
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
export function StarRating({ rating, size = 'h-4 w-4' }) {
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
export function ImageLightbox({ images, currentIndex, onClose, onPrev, onNext, onSelect }) {
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
          width="1600" height="1000" decoding="async"
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
            <img src={img} alt={`Thumbnail ${idx + 1}`} width="160" height="112" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Amenities Full Modal ─── */
export function AmenitiesModal({ isOpen, onClose, amenities }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9990] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 md:p-8 shadow-2xl"
      >
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
            const activeItems = group.items.filter((item) => amenities.includes(item));
            if (activeItems.length === 0) return null;
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
export const allTurfs = [
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



export const DURATION_OPTIONS = [
  { value: 1, label: '1 Hour' },
  { value: 2, label: '2 Hours' },
  { value: 3, label: '3 Hours' },
  { value: 4, label: '4 Hours' },
  { value: 5, label: '5 Hours' },
  { value: 6, label: '6 Hours' },
];

