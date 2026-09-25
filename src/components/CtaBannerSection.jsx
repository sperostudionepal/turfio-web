import { ArrowRight } from 'lucide-react';

export default function CtaBannerSection({ onBookNow }) {
  return (
    <section className="bg-white py-6 lg:py-8">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-lime-200/50 via-lime-50/70 to-lime-100/60 p-5 sm:p-6 lg:p-7">
          {/* Football Graphic in Original Crisp Colors */}
          <picture>
            <source srcSet="/football-480.webp" type="image/webp" />
            <img
              src="/football-480.png"
              alt="Football"
              className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 h-[160%] max-h-[160px] w-auto object-contain pointer-events-none z-0"
              loading="lazy"
              decoding="async"
              width="240"
              height="160"
            />
          </picture>

          <div className="relative z-10 flex flex-col items-center justify-between gap-5 md:flex-row md:gap-8 pl-28 sm:pl-40 md:pl-48 lg:pl-52">
            {/* Left Text Group */}
            <div className="text-center md:text-left">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                Ready for your next match?
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-600 sm:text-base">
                Book your turf in under 30 seconds.
              </p>
            </div>

            {/* Right Action Button */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={onBookNow}
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
  );
}
