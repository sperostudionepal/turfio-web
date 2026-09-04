import { Users, LayoutGrid, MapPin, Star } from 'lucide-react';

const stats = [
  {
    id: 1,
    value: '15,000+',
    label: 'Players',
    icon: Users,
  },
  {
    id: 2,
    value: '200+',
    label: 'Registered Turfs',
    icon: LayoutGrid,
  },
  {
    id: 3,
    value: '24+',
    label: 'Districts',
    icon: MapPin,
  },
  {
    id: 4,
    value: '4.8',
    label: 'Rating',
    icon: Star,
  },
];

export default function HeroStats() {
  return (
    <section className="w-full bg-white pt-6 pb-10 md:pt-8 md:pb-12">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8 justify-items-center">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="flex items-center gap-3 min-w-[170px] justify-start sm:justify-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime-100/80 text-lime-600 sm:h-12 sm:w-12">
                  <Icon className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-xl font-bold tracking-tight text-lime-500 sm:text-2xl lg:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-slate-500 sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
