import { Zap, ShieldCheck, Users, CheckCircle2 } from 'lucide-react';

const aboutCards = [
  {
    id: 1,
    icon: Zap,
    title: 'Instant Slot Booking',
    highlight: '100% Instant Confirmation',
    description:
      'Search grounds by location, view real-time availability, and confirm your court in under 30 seconds with zero phone call hassles.',
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: 'Verified Quality Turfs',
    highlight: 'Verified Quality Standards',
    description:
      'Handpicked top-tier futsal venues inspected for high-grade artificial grass, floodlighting, parking, and player safety amenities.',
  },
  {
    id: 3,
    icon: Users,
    title: 'Squad & Matchmaking',
    highlight: 'Built for Players & Owners',
    description:
      'Easily invite teammates, organize match lineups, challenge local opponent squads, and enjoy seamless game days together.',
  },
];

export default function AboutUsSection() {
  return (
    <section className="bg-white pt-10 pb-16 lg:pt-12 lg:pb-20 border-t border-slate-100">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-sm font-semibold text-lime-500">
            About Turfio
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Connecting Nepal's Futsal Community
          </h2>
          <p className="mt-3 text-base font-medium leading-relaxed text-slate-500">
            We are building the fastest, most reliable platform to discover, book, and play futsal. We eliminate phone call friction and double bookings so you can focus on the game.
          </p>
        </div>

        {/* 3 Cards Matching Review Card Design */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aboutCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="flex flex-col justify-between rounded-[24px] bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80 transition-transform duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Top: Icon badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100 text-lime-600">
                      <Icon className="h-6 w-6 stroke-[2.2]" />
                    </div>
                    <span className="rounded-full bg-lime-50 px-3 py-1 text-[11px] font-bold text-lime-600 ring-1 ring-lime-400/20">
                      Feature
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                    {card.description}
                  </p>
                </div>

                {/* Card Footer matching Review card footer style */}
                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100">
                  <CheckCircle2 className="h-4 w-4 text-lime-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">
                    {card.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
