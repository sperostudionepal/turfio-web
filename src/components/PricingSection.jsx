import { ShieldCheck, Tag, RefreshCw } from 'lucide-react';

const pillars = [
  {
    icon: Tag,
    title: 'Zero Booking Surcharges',
    subtitle: 'Direct Venue Rates',
    description: 'You pay exactly what the turf charges at the counter. No hidden service fees, surprise taxes, or booking markups.',
    highlight: '100% Free for Players',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent & Fair Pricing',
    subtitle: 'No Dynamic Surges',
    description: 'Fixed hourly rates set directly by arena owners. What you see is what you pay—during peak hours or rainy seasons alike.',
    highlight: 'Standard Ground Rates',
  },
  {
    icon: RefreshCw,
    title: 'Protected Weather & Rain Refunds',
    subtitle: 'Risk-Free Booking',
    description: 'If extreme rain or emergencies halt your match, enjoy instant rescheduling credits or refunds per arena policy.',
    highlight: 'Guaranteed Protection',
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-white pt-12 pb-8 lg:pt-16 lg:pb-10 border-t border-slate-100 scroll-mt-20">
      <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-20">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-sm font-semibold text-lime-500">
            Fair & Transparent
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Honest Pricing. Zero Hidden Fees.
          </h2>
          <p className="mt-3.5 text-base font-medium leading-relaxed text-slate-500">
            We believe futsal should be accessible to everyone. Turfio partners directly with verified arena owners across Nepal to guarantee fair, upfront rates with no extra booking convenience fees.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-[24px] bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80 transition-transform duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Top: Icon badge & Pill */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100 text-lime-600">
                      <Icon className="h-6 w-6 stroke-[2.2]" />
                    </div>
                    <span className="rounded-full bg-lime-50 px-3 py-1 text-[11px] font-bold text-lime-600 ring-1 ring-lime-400/20">
                      {pillar.highlight}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                    {pillar.description}
                  </p>
                </div>

                {/* Footer Subtitle */}
                <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700">
                    {pillar.subtitle}
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
