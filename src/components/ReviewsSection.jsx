import { useState } from 'react';
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Saugat Shahi',
    role: 'Regular Player • Lalitpur',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment:
      'Turfio made organizing our weekly futsal games effortless. Booking takes less than 30 seconds, and instant confirmation avoids all phone call hassles!',
  },
  {
    id: 2,
    name: 'Rohan Tamang',
    role: 'Turf Manager • Prime Futsal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment:
      'As a turf manager, Turfio increased our off-peak hour bookings by 40%. The automated schedule and seamless booking system are total game-changers.',
  },
  {
    id: 3,
    name: 'Anish Karki',
    role: 'Team Captain • Kathmandu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment:
      'Finding available grounds on weekend evenings used to be painful. With Turfio’s live slot search, we find and reserve top quality turfs in seconds.',
  },
  {
    id: 4,
    name: 'Pooja Shrestha',
    role: 'Futsal Enthusiast • Bhaktapur',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment:
      'The app UI is super smooth and intuitive! Booking a slot and getting instant confirmation takes seconds.',
  },
  {
    id: 5,
    name: 'Bibek Thapa',
    role: 'Arena Director • Great Himalayan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment:
      'Managing court schedules across multiple pitches used to cause double bookings. Turfio unified everything seamlessly!',
  },
];

export default function ReviewsSection({ isLoading = false, reviewsData = reviews }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviewsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reviewsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-white pt-12 pb-10 lg:pt-16 lg:pb-12 border-t border-slate-100">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        {/* Header */}
        <div className="text-center">
          <span className="text-sm font-semibold text-lime-500">
            Real Stories
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Loved by Players & Turf Owners
          </h2>
          <p className="mt-3 text-base font-medium text-slate-500">
            See why thousands of futsal lovers choose Turfio to book courts and organize matches.
          </p>

          {/* Aggregate Rating Pill */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-slate-50 px-4 py-2 ring-1 ring-slate-100">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-900">4.9 / 5</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">
              2,500+ Verified Player Reviews
            </span>
          </div>
        </div>

        {/* Carousel Container with Outward Floating Navigation Buttons */}
        <div className="relative mt-12 px-4 sm:px-6">
          {/* Left Fade Gradient */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 md:w-20 bg-gradient-to-r from-white via-white/80 to-transparent" />
          
          {/* Right Fade Gradient */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 md:w-20 bg-gradient-to-l from-white via-white/80 to-transparent" />

          {/* Left Navigation Icon Button (Pushed further left) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous review"
            className="absolute -left-3 sm:-left-5 lg:-left-6 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-md border border-slate-200/80 transition-all hover:bg-lime-400 hover:text-slate-900 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Right Navigation Icon Button (Pushed further right) */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next review"
            className="absolute -right-3 sm:-right-5 lg:-right-6 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-md border border-slate-200/80 transition-all hover:bg-lime-400 hover:text-slate-900 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Sliding Cards */}
          <div className="overflow-hidden py-2">
            {isLoading ? (
              <div className="flex gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`review-skeleton-${index}`}
                    className="w-full shrink-0 sm:w-1/2 lg:w-1/3"
                  >
                    <div className="flex h-full flex-col justify-between rounded-[24px] bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80 animate-pulse select-none min-h-[220px]">
                      <div>
                        {/* Header: Stars & Quote Icon Skeleton */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="h-4 w-4 rounded bg-slate-200/80" />
                            ))}
                          </div>
                          <div className="h-5 w-5 rounded bg-slate-200/60" />
                        </div>

                        {/* Comment Skeleton */}
                        <div className="mt-5 space-y-2.5">
                          <div className="h-3.5 w-full bg-slate-200/80 rounded-md" />
                          <div className="h-3.5 w-5/6 bg-slate-200/80 rounded-md" />
                          <div className="h-3.5 w-2/3 bg-slate-200/70 rounded-md" />
                        </div>
                      </div>

                      {/* Author Footer Skeleton */}
                      <div className="mt-6 flex items-center gap-3.5 pt-4 border-t border-slate-100">
                        <div className="h-11 w-11 rounded-full bg-slate-200/80 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-4 w-28 bg-slate-200/80 rounded-md" />
                          <div className="h-3 w-36 bg-slate-200/60 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1))}%)`,
                }}
              >
                {reviewsData.map((review) => (
                  <div
                    key={review.id}
                    className="w-full shrink-0 px-3 sm:w-1/2 lg:w-1/3"
                  >
                    <div className="flex h-full flex-col justify-between rounded-[24px] bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80">
                      <div>
                        {/* Header: Stars & Quote Icon */}
                        <div className="flex items-center justify-between">
                          <div className="flex text-amber-400">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                          <Quote className="h-5 w-5 text-lime-400/60" />
                        </div>

                        {/* Comment */}
                        <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                          "{review.comment}"
                        </p>
                      </div>

                      {/* Author Footer */}
                      <div className="mt-6 flex items-center gap-3.5 pt-4 border-t border-slate-100">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="h-11 w-11 rounded-full object-cover ring-2 ring-lime-400/30"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-slate-900">
                              {review.name}
                            </h3>
                            <CheckCircle2 className="h-3.5 w-3.5 text-lime-500" />
                          </div>
                          <p className="text-xs font-medium text-slate-400">
                            {review.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {!isLoading && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {reviewsData.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === index
                    ? 'w-8 bg-lime-400'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
