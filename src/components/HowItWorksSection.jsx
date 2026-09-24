import { Search, Calendar } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Search Turfs',
    description: 'Find futsal courts near you',
    icon: Search,
  },
  {
    id: 2,
    title: 'Choose Time',
    description: 'Pick your preferred date and time',
    icon: Calendar,
  },
  {
    id: 3,
    title: 'Play & Enjoy',
    description: 'Show up and enjoy your game',
    customIcon: (
      <svg
        className="h-8 w-8 text-slate-900 stroke-[1.8]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="12,7 15,10 13.5,14 10.5,14 9,10" />
        <line x1="12" y1="7" x2="12" y2="2" />
        <line x1="15" y1="10" x2="19.5" y2="8.5" />
        <line x1="13.5" y1="14" x2="17" y2="18" />
        <line x1="10.5" y1="14" x2="7" y2="18" />
        <line x1="9" y1="10" x2="4.5" y2="8.5" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white pt-8 pb-12 lg:pt-10 lg:pb-14 border-t border-slate-100/60 scroll-mt-[var(--nav-h,72px)]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        {/* Header */}
        <div className="text-center">
          <span className="text-sm font-semibold text-lime-500">
            Get Started
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-base font-medium text-slate-500">
            Book your next match in three simple steps.
          </p>
        </div>

        {/* Steps Flow */}
        <div className="mt-16 flex flex-col items-center justify-center gap-10 md:flex-row md:gap-4 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="contents">
                {/* Step Item */}
                <div className="flex items-center gap-4">
                  {/* Circle Icon Badge */}
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-lime-400 bg-white">
                    {step.customIcon ? (
                      step.customIcon
                    ) : (
                      <Icon className="h-8 w-8 text-slate-900 stroke-[1.8]" />
                    )}
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-lime-400 text-xs font-bold text-slate-900">
                      {step.id}
                    </span>
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-0.5 max-w-[160px] text-xs font-medium leading-snug text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting Dashed Line (shown between items on md+ screens) */}
                {index < steps.length - 1 && (
                  <div className="hidden h-0.5 flex-1 max-w-[120px] border-t-2 border-dashed border-lime-400 md:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
