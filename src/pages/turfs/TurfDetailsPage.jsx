import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  MapPin,
  Share2,
  Heart,
  Compass,
  Users,
  Ruler,
  Layers,
  Car,
  Wifi,
  Droplets,
  ShowerHead,
  Coffee,
  Cross,
  Lightbulb,
  GlassWater,
  Wind,
  Dumbbell,
  Lock,
  Phone,
  Mail,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  CheckCircle2,
  Shield,
  Zap,
  FileText,
  Headphones,
  Quote,
  Grid,
  ImageIcon,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

/* ------------------------------------------------------------------ */
/*  Amenity → Lucide icon mapping                                      */
/* ------------------------------------------------------------------ */
const AMENITY_ICONS = {
  Parking: Car,
  WiFi: Wifi,
  Washrooms: Droplets,
  'Changing Rooms': ShowerHead,
  Canteen: Coffee,
  'First Aid': Cross,
  Floodlights: Lightbulb,
  'Drinking Water': GlassWater,
  AC: Wind,
  'Sports Equipment': Dumbbell,
  'Locker Rooms': Lock,
  'Spectator Seating': Users,
};

/* ================================================================== */
/*  LIGHTBOX                                                           */
/* ================================================================== */
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight')
        setIdx((p) => (p + 1) % images.length);
      if (e.key === 'ArrowLeft')
        setIdx((p) => (p - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/95">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="rounded-full bg-black/50 px-4 py-2 text-sm font-semibold tracking-widest text-white/70 uppercase">
          {idx + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main image area */}
      <div className="relative flex flex-1 items-center justify-center px-4 sm:px-16">
        <button
          onClick={() =>
            setIdx((p) => (p - 1 + images.length) % images.length)
          }
          className="absolute left-4 sm:left-6 hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <img
          src={images[idx]}
          alt={`Photo ${idx + 1}`}
          className="max-h-[75vh] max-w-full select-none rounded-2xl object-contain"
        />

        <button
          onClick={() => setIdx((p) => (p + 1) % images.length)}
          className="absolute right-4 sm:right-6 hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex h-24 sm:h-28 items-center justify-center gap-2 border-t border-white/10 bg-black/50 px-4 py-4 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-full aspect-video shrink-0 overflow-hidden rounded-lg transition-all cursor-pointer ${
              i === idx
                ? 'ring-2 ring-lime-400 opacity-100 scale-105'
                : 'opacity-40 hover:opacity-80'
            }`}
          >
            <img
              src={img}
              alt=""
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  TURF DETAILS PAGE                                                  */
/* ================================================================== */
export default function TurfDetailsPage({
  turf,
  user,
  onLogin,
  onLogout,
  onListTurf,
  onHome,
  onFindTurfs,
  onBookNow,
  onBack,
}) {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [saved, setSaved] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [expandedPolicy, setExpandedPolicy] = useState(null);
  const reviewsRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  if (!turf) return null;

  /* ---------- derived ---------- */
  const images =
    turf.gallery?.length > 0 ? turf.gallery : [turf.image];
  const thumbs = images.slice(1, 5);

  const reviewsList = turf.reviewsList || [];
  const totalReviews = reviewsList.length || turf.reviews || 0;
  const avgRating = reviewsList.length
    ? (
        reviewsList.reduce((s, r) => s + r.rating, 0) /
        reviewsList.length
      ).toFixed(1)
    : turf.rating;

  // Rating distribution
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviewsList.forEach((r) => {
    const s = Math.min(5, Math.max(1, Math.floor(r.rating)));
    dist[s]++;
  });

  const scrollReviews = (dir) =>
    reviewsRef.current?.scrollBy({
      left: dir * 350,
      behavior: 'smooth',
    });

  /* ---------- render ---------- */
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* -------- NAVBAR -------- */}
      <Navbar
        onLogin={onLogin}
        user={user}
        onLogout={onLogout}
        onListTurf={onListTurf}
        onHome={onHome}
        onFindTurfs={onFindTurfs}
      />

      {/* -------- BREADCRUMB -------- */}
      <div className="border-b border-slate-100">
        <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-20 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={onHome}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-slate-300">/</span>
            <button
              onClick={onFindTurfs}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Find Turfs
            </button>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-700 truncate max-w-[200px]">
              {turf.title}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* IMAGE GALLERY                                                    */}
      {/* ================================================================ */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-20 pt-6 pb-2">
          {/* Mobile hero */}
          <div
            className="block lg:hidden relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-slate-100 cursor-pointer group"
            onClick={() => setLightboxIdx(0)}
          >
            <img
              src={images[0]}
              alt={turf.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/turf-sample.png';
              }}
            />
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur-sm">
                <ImageIcon className="h-3.5 w-3.5" />
                1 / {images.length}
              </div>
            )}
          </div>

          {/* Desktop grid */}
          <div className="hidden lg:grid grid-cols-4 grid-rows-2 gap-1.5 rounded-[20px] overflow-hidden h-[460px]">
            <div
              className="col-span-2 row-span-2 relative overflow-hidden bg-slate-100 cursor-pointer group"
              onClick={() => setLightboxIdx(0)}
            >
              <img
                src={images[0]}
                alt={turf.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/turf-sample.png';
                }}
              />
            </div>
            {thumbs.map((img, i) => (
              <div
                key={i}
                className="relative overflow-hidden bg-slate-100 cursor-pointer group"
                onClick={() => setLightboxIdx(i + 1)}
              >
                <img
                  src={img}
                  alt={`Gallery ${i + 2}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/turf-sample.png';
                  }}
                />
                {i === thumbs.length - 1 && images.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 text-white transition-colors group-hover:bg-slate-900/50">
                    <span className="text-sm font-bold">
                      +{images.length - 5} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show all photos */}
          {images.length > 1 && (
            <button
              onClick={() => setLightboxIdx(0)}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 cursor-pointer"
            >
              <Grid className="h-4 w-4" />
              Show all {images.length} photos
            </button>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* TWO-COLUMN CONTENT                                               */}
      {/* ================================================================ */}
      <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-20 pt-8 pb-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* ============================================================ */}
          {/* LEFT COLUMN                                                   */}
          {/* ============================================================ */}
          <div className="lg:col-span-2 space-y-10">
            {/* ---- TITLE & QUICK INFO ---- */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl lg:leading-[1.15]">
                    {turf.title}
                  </h1>
                  <div className="mt-2.5 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <MapPin className="h-4 w-4 text-lime-500 shrink-0" />
                    <span className="truncate">
                      {turf.address || turf.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <button
                    onClick={() =>
                      navigator.share?.({
                        title: turf.title,
                        text: turf.description,
                      })
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
                  >
                    <Share2 className="h-[18px] w-[18px]" />
                  </button>
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                      saved
                        ? 'border-rose-200 bg-rose-50 text-rose-500'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Heart
                      className={`h-[18px] w-[18px] ${saved ? 'fill-rose-500' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Signature divider */}
              <div className="mt-5 flex items-center gap-3">
                <span className="h-1.5 w-14 rounded-full bg-lime-400" />
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
              </div>

              {/* Info pills */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {/* Rating pill */}
                <div className="inline-flex items-center gap-2 rounded-full bg-lime-50 px-3.5 py-1.5">
                  <Star className="h-4 w-4 fill-lime-400 text-lime-400" />
                  <span className="text-sm font-bold text-slate-900">
                    {avgRating}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    ({totalReviews} reviews)
                  </span>
                </div>

                {/* Attribute pills */}
                <InfoPill icon={Compass} text={turf.type} />
                <InfoPill icon={Users} text={turf.size} />
                {turf.surface && (
                  <InfoPill icon={Layers} text={turf.surface} />
                )}
                {turf.dimensions && (
                  <InfoPill icon={Ruler} text={turf.dimensions} />
                )}
              </div>
            </div>

            {/* ---- KEY HIGHLIGHTS ---- */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <HighlightCard icon={Compass} value={turf.type} label="Turf Type" />
              <HighlightCard icon={Users} value={turf.size} label="Team Size" />
              <HighlightCard
                icon={Layers}
                value={turf.surface || '—'}
                label="Surface Type"
              />
              <HighlightCard
                icon={Ruler}
                value={turf.dimensions || '—'}
                label="Pitch Size"
              />
            </div>

            <div className="border-t border-slate-100" />

            {/* ---- ABOUT ---- */}
            {turf.description && (
              <>
                <section>
                  <span className="text-sm font-semibold text-lime-500">
                    Overview
                  </span>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                    About This Venue
                  </h2>
                  <p className="mt-4 text-[15px] font-medium leading-relaxed text-slate-500">
                    {descExpanded || turf.description.length <= 200
                      ? turf.description
                      : `${turf.description.substring(0, 200)}...`}
                  </p>
                  {turf.description.length > 200 && (
                    <button
                      onClick={() => setDescExpanded(!descExpanded)}
                      className="mt-3 text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-lime-600 hover:decoration-lime-400 transition-colors cursor-pointer"
                    >
                      {descExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </section>
                <div className="border-t border-slate-100" />
              </>
            )}

            {/* ---- AMENITIES ---- */}
            {turf.amenities?.length > 0 && (
              <>
                <section>
                  <span className="text-sm font-semibold text-lime-500">
                    Facilities
                  </span>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                    Amenities
                  </h2>
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {turf.amenities.map((name) => {
                      const Icon = AMENITY_ICONS[name] || CheckCircle2;
                      return (
                        <div
                          key={name}
                          className="flex flex-col items-center gap-3 rounded-[24px] bg-white p-5 ring-1 ring-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100 text-lime-600">
                            <Icon className="h-6 w-6 stroke-[2.2]" />
                          </div>
                          <span className="text-sm font-bold text-slate-700 text-center">
                            {name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>
                <div className="border-t border-slate-100" />
              </>
            )}

            {/* ---- OPERATING HOURS ---- */}
            {turf.operatingHours?.length > 0 && (
              <>
                <section>
                  <span className="text-sm font-semibold text-lime-500">
                    Schedule
                  </span>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                    Operating Hours
                  </h2>
                  <div className="mt-6 rounded-[24px] bg-white ring-1 ring-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                    {turf.operatingHours.map((slot, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between px-6 py-4 ${
                          i !== turf.operatingHours.length - 1
                            ? 'border-b border-slate-100'
                            : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-600">
                            <Clock className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">
                            {slot.day}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-slate-500">
                          {slot.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
                <div className="border-t border-slate-100" />
              </>
            )}

            {/* ---- REVIEWS ---- */}
            {reviewsList.length > 0 && (
              <>
                <section>
                  <span className="text-sm font-semibold text-lime-500">
                    Real Stories
                  </span>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                    Reviews & Ratings
                  </h2>

                  {/* Aggregate rating pill */}
                  <div className="mt-4 inline-flex items-center gap-3 rounded-full bg-slate-50 px-4 py-2 ring-1 ring-slate-100">
                    <div className="flex text-lime-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(Number(avgRating))
                              ? 'fill-lime-400 text-lime-400'
                              : 'fill-slate-200 text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {avgRating} / 5
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-medium text-slate-500">
                      {totalReviews} Verified Reviews
                    </span>
                  </div>

                  {/* Rating distribution bars */}
                  <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
                    {/* Big number */}
                    <div className="flex flex-col items-center text-center shrink-0 sm:pr-8 sm:border-r sm:border-slate-100">
                      <span className="text-6xl font-extrabold tracking-tight text-slate-900">
                        {avgRating}
                      </span>
                      <div className="mt-2 flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`h-4 w-4 ${
                              n <= Math.round(Number(avgRating))
                                ? 'fill-lime-400 text-lime-400'
                                : 'fill-slate-200 text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="mt-1.5 text-xs font-medium text-slate-400">
                        {totalReviews} ratings
                      </span>
                    </div>

                    {/* Bars */}
                    <div className="flex-1 space-y-2.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = dist[star] || 0;
                        const pct =
                          reviewsList.length > 0
                            ? (count / reviewsList.length) * 100
                            : 0;
                        return (
                          <div
                            key={star}
                            className="flex items-center gap-3"
                          >
                            <span className="w-3 text-sm font-bold text-slate-700">
                              {star}
                            </span>
                            <Star className="h-3.5 w-3.5 fill-slate-200 text-slate-200" />
                            <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-lime-400 transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-5 text-right text-xs font-semibold text-slate-400">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review cards carousel */}
                  <div className="relative mt-8 -mx-6 px-6 lg:mx-0 lg:px-0">
                    {/* Edge fades */}
                    <div className="pointer-events-none absolute left-0 top-0 bottom-6 z-10 w-8 lg:w-16 bg-gradient-to-r from-white via-white/80 to-transparent hidden lg:block" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-6 z-10 w-8 lg:w-16 bg-gradient-to-l from-white via-white/80 to-transparent hidden lg:block" />

                    <div
                      ref={reviewsRef}
                      className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                      }}
                    >
                      {reviewsList.map((review, i) => (
                        <div
                          key={i}
                          className="min-w-[300px] max-w-[320px] shrink-0 snap-start flex h-full flex-col justify-between rounded-[24px] bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80"
                        >
                          <div>
                            {/* Stars & quote */}
                            <div className="flex items-center justify-between">
                              <div className="flex text-amber-400">
                                {[...Array(review.rating)].map(
                                  (_, j) => (
                                    <Star
                                      key={j}
                                      className="h-4 w-4 fill-amber-400 text-amber-400"
                                    />
                                  )
                                )}
                              </div>
                              <Quote className="h-5 w-5 text-lime-400/60" />
                            </div>

                            {/* Comment */}
                            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600 line-clamp-4">
                              "{review.comment}"
                            </p>
                          </div>

                          {/* Author */}
                          <div className="mt-6 flex items-center gap-3.5 pt-4 border-t border-slate-100">
                            <img
                              src={review.avatar}
                              alt={review.name}
                              className="h-11 w-11 rounded-full object-cover ring-2 ring-lime-400/30"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/image.png';
                              }}
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-sm font-bold text-slate-900">
                                  {review.name}
                                </h3>
                                <CheckCircle2 className="h-3.5 w-3.5 text-lime-500" />
                              </div>
                              <p className="text-xs font-medium text-slate-400">
                                {review.date}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Scroll arrows */}
                    {reviewsList.length > 2 && (
                      <div className="hidden md:flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => scrollReviews(-1)}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-md border border-slate-200/80 transition-all hover:bg-lime-400 hover:text-slate-900 active:scale-95 cursor-pointer"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => scrollReviews(1)}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-md border border-slate-200/80 transition-all hover:bg-lime-400 hover:text-slate-900 active:scale-95 cursor-pointer"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </section>
                <div className="border-t border-slate-100" />
              </>
            )}

            {/* ---- POLICIES ---- */}
            {turf.policies?.length > 0 && (
              <section>
                <span className="text-sm font-semibold text-lime-500">
                  Good to know
                </span>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                  Policies & Rules
                </h2>
                <div className="mt-6 rounded-[24px] bg-white ring-1 ring-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                  {turf.policies.map((policy, i) => (
                    <div
                      key={i}
                      className={
                        i !== turf.policies.length - 1
                          ? 'border-b border-slate-100'
                          : ''
                      }
                    >
                      <button
                        onClick={() =>
                          setExpandedPolicy(
                            expandedPolicy === i ? null : i
                          )
                        }
                        className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-slate-50/60 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-600">
                            <Shield className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">
                            {policy.title}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                            expandedPolicy === i ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {expandedPolicy === i && (
                        <div className="px-6 pb-5 pl-[3.75rem]">
                          <p className="text-sm font-medium leading-relaxed text-slate-500">
                            {policy.description}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ============================================================ */}
          {/* RIGHT SIDEBAR                                                 */}
          {/* ============================================================ */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-5">
              {/* ---- BOOKING CARD ---- */}
              <div className="rounded-[24px] bg-white p-2 sm:p-2.5 shadow-[0_10px_25px_-10px_rgba(15,23,42,0.1)] ring-1 ring-slate-100">
                <div className="p-5 pb-0">
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                      {turf.price}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-slate-400">
                    Starting price per hour
                  </p>
                </div>

                <div className="p-5 space-y-3">
                  {/* Date field — hero search panel style */}
                  <label className="group flex items-center gap-2.5 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50 focus-within:bg-slate-50">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors group-focus-within:bg-lime-100 group-focus-within:text-lime-600">
                      <Calendar className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 relative">
                      <span className="block text-[12px] font-medium text-slate-400">
                        Date
                      </span>
                      <span className="mt-0.5 block text-[15px] font-semibold text-slate-900">
                        Select date
                      </span>
                      <input
                        type="date"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                  </label>

                  <div className="h-px bg-slate-100" />

                  {/* Time field */}
                  <label className="group flex items-center gap-2.5 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50 focus-within:bg-slate-50 relative">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors group-focus-within:bg-lime-100 group-focus-within:text-lime-600">
                      <Clock className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 relative">
                      <span className="block text-[12px] font-medium text-slate-400">
                        Time
                      </span>
                      <span className="mt-0.5 block text-[15px] font-semibold text-slate-900">
                        Select time
                      </span>
                      <input
                        type="time"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                  </label>

                  <div className="h-px bg-slate-100" />

                  {/* Players field */}
                  <label className="group flex items-center gap-2.5 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50 focus-within:bg-slate-50">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors group-focus-within:bg-lime-100 group-focus-within:text-lime-600">
                      <Users className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-medium text-slate-400">
                        Players
                      </span>
                      <select className="mt-0.5 w-full appearance-none border-0 bg-transparent p-0 text-[15px] font-semibold text-slate-900 outline-none cursor-pointer">
                        <option value="Random">Random</option>
                        <option value="5v5">5v5</option>
                        <option value="7v7">7v7</option>
                        <option value="9v9">9v9</option>
                      </select>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                  </label>
                </div>

                {/* CTA */}
                <div className="px-5 pb-5">
                  <button
                    onClick={onBookNow}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime-400 px-7 py-3.5 text-[15px] font-semibold text-slate-900 transition-transform hover:-translate-y-0.5 hover:bg-lime-500 active:scale-95 cursor-pointer"
                  >
                    Book Now
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <p className="mt-3 text-center text-xs font-medium text-slate-400">
                    You won't be charged yet
                  </p>
                </div>
              </div>

              {/* ---- TRUST SIGNALS ---- */}
              <div className="rounded-[24px] bg-white p-5 ring-1 ring-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                <div className="space-y-3.5">
                  {[
                    { icon: Zap, text: 'Free cancellation up to 2 hours before' },
                    { icon: CheckCircle2, text: 'Instant booking confirmation' },
                    { icon: FileText, text: 'No hidden charges' },
                    { icon: Shield, text: 'Secure payment' },
                    { icon: Headphones, text: '24/7 customer support' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-400/10 text-lime-500">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium text-slate-600 leading-snug pt-1">
                          {item.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ---- CONTACT ---- */}
              <div className="rounded-[24px] bg-white p-5 ring-1 ring-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                <h3 className="text-base font-bold text-slate-900 mb-4">
                  Contact Venue
                </h3>
                <div className="space-y-3">
                  {turf.phone && (
                    <a
                      href={`tel:${turf.phone}`}
                      className="flex items-center gap-3 rounded-xl p-2 -mx-2 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-600">
                        <Phone className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-medium text-slate-400">
                          Phone
                        </div>
                        <div className="text-sm font-bold text-slate-700">
                          {turf.phone}
                        </div>
                      </div>
                    </a>
                  )}
                  {turf.email && (
                    <a
                      href={`mailto:${turf.email}`}
                      className="flex items-center gap-3 rounded-xl p-2 -mx-2 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-600">
                        <Mail className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-medium text-slate-400">
                          Email
                        </div>
                        <div className="text-sm font-bold text-slate-700">
                          {turf.email}
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* ---- LOCATION ---- */}
              <div className="rounded-[24px] bg-white p-5 ring-1 ring-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                <h3 className="text-base font-bold text-slate-900 mb-4">
                  Location
                </h3>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="h-4 w-4 text-lime-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed text-slate-500">
                    {turf.address || turf.location}
                  </p>
                </div>
                <div className="h-36 rounded-2xl bg-slate-50 ring-1 ring-slate-100 flex flex-col items-center justify-center overflow-hidden group cursor-pointer">
                  <MapPin className="h-7 w-7 text-slate-300 mb-1.5 group-hover:text-lime-500 transition-colors" />
                  <span className="text-xs font-semibold text-slate-400">
                    {turf.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- MOBILE STICKY BOTTOM BAR ---- */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-slate-100 bg-white/95 backdrop-blur-md px-6 py-3.5 lg:hidden">
        <div>
          <div className="text-lg font-extrabold text-slate-900">
            {turf.price}
          </div>
          <div className="text-[11px] font-medium text-slate-400">
            per hour
          </div>
        </div>
        <button
          onClick={onBookNow}
          className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-7 py-3 text-[15px] font-semibold text-slate-900 transition-transform hover:-translate-y-0.5 hover:bg-lime-500 active:scale-95 cursor-pointer"
        >
          Book Now
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Spacer for mobile sticky bar */}
      <div className="h-20 lg:hidden" />

      {/* ---- FOOTER ---- */}
      <Footer />

      {/* ---- LIGHTBOX ---- */}
      {lightboxIdx !== null && (
        <Lightbox
          images={images}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small helper components                                            */
/* ------------------------------------------------------------------ */
function InfoPill({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-100">
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      {text}
    </span>
  );
}

function HighlightCard({ icon: Icon, value, label }) {
  return (
    <div className="rounded-[24px] bg-white p-5 ring-1 ring-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] text-center transition-transform duration-300 hover:-translate-y-1">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-lime-100/80 text-lime-600">
        <Icon className="h-5 w-5 stroke-[2.2]" />
      </div>
      <div className="mt-3 text-sm font-bold text-slate-900">{value}</div>
      <div className="mt-0.5 text-xs font-medium text-slate-500">{label}</div>
    </div>
  );
}
