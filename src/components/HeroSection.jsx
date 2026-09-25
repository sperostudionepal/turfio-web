import { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Headphones,
  MapPin,
  Search,
  Shield,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { getTodayNepalString } from '../utils/dateTime';
import CustomDatePicker from './common/CustomDatePicker';
import CustomDropdown from './common/CustomDropdown';
import LocationAutocomplete from './common/LocationAutocomplete';
import { TIME_SLOT_OPTIONS } from '../utils/turfSearch';
import { getNearbyLocation } from '../utils/geolocation';

// Starts empty like the Find Turfs search bar.
const initialForm = {
  location: '',
  date: '',
  time: '',
  players: 'Any Size',
};

export default function HeroSection({
  onFindTurfs,
}) {
  const [form, setForm] = useState(initialForm);
  // Set when a suggestion is picked; only used while the text still matches it, like Find Turfs.
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [isLocating, setIsLocating] = useState(false);

  // Same lookup as the "Nearby" option in the location box; if it is denied or unavailable the
  // visitor still lands on the full listing.
  const exploreNearMe = async () => {
    if (isLocating) return;
    setIsLocating(true);
    try {
      const place = await getNearbyLocation();
      onFindTurfs?.({ location: place.display_name, coords: { lat: place.lat, lng: place.lon } });
    } catch (err) {
      console.error('Geolocation error:', err);
      onFindTurfs?.();
    } finally {
      setIsLocating(false);
    }
  };

  const submitSearch = () => {
    const coords = selectedLocation && selectedLocation.name === form.location.trim() ? selectedLocation.coords : null;
    onFindTurfs?.({ ...form, coords });
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white">
      <section className="relative isolate overflow-hidden bg-white">
        {/* Low-Visibility Background Image Overlay */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.07]">
          <picture>
            <source srcSet="/image.webp" type="image/webp" />
            <img
              src="/image.png"
              alt="Hero Background"
              className="h-full w-full object-cover object-center grayscale"
              loading="eager"
              fetchPriority="low"
              decoding="async"
            />
          </picture>
        </div>

        <div className="relative mx-auto max-w-[1440px] px-6 pb-10 pt-8 md:pt-12 lg:px-10 lg:pb-16 lg:pt-16">
          <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_0.78fr] lg:gap-6 xl:gap-8">
            {/* Left column */}
            <div className="max-w-[700px]">
              <p className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3.5 py-1.5 text-[14px] font-semibold text-slate-700">
                <Star className="h-3.5 w-3.5 fill-lime-400 text-lime-400" />
                #1 Futsal Booking Platform
              </p>

              <h1 className="mt-7 font-bebas text-[3.5rem] font-black uppercase leading-[0.92] tracking-[-0.04em] text-slate-900 sm:text-[4.2rem] lg:whitespace-nowrap lg:text-[4rem] xl:text-[4.5rem]">
                Book better games.
              </h1>
              <h2 className="font-bebas text-[3.5rem] font-black uppercase leading-[0.92] tracking-[-0.04em] text-lime-500 sm:text-[4.2rem] lg:whitespace-nowrap lg:text-[4rem] xl:text-[4.5rem]">
                Play without the hassle.
              </h2>

              <div className="mt-6 flex items-center gap-3">
                <span className="h-1.5 w-14 rounded-full bg-lime-400" />
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
              </div>

              <p className="mt-7 max-w-md text-[17px] leading-[1.5] text-slate-500">
                Book premium futsal turfs instantly.
                <span className="block">Anytime, anywhere.</span>
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); onFindTurfs?.(); }}
                  className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-6 py-3.5 text-[15px] font-semibold text-slate-900 transition-transform hover:-translate-y-0.5 hover:bg-lime-500"
                >
                  Book a Turf
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); exploreNearMe(); }}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-[15px] font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                >
                  Explore near me
                </a>
              </div>

              <div className="mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
                {[
                  { icon: Zap, title: 'Instant Booking', text: 'In just a few taps' },
                  { icon: Shield, title: 'Trusted Turfs', text: 'Verified & quality checked' },
                  { icon: Headphones, title: '24/7 Support', text: "We're here to help" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex min-w-0 items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime-400/10 text-lime-500">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="whitespace-nowrap text-[14px] font-semibold text-slate-900">{item.title}</p>
                        <p className="whitespace-nowrap text-[13px] leading-tight text-slate-400">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right column - hero image with floating cards (Hidden on mobile) */}
            <div className="hidden lg:flex relative mx-auto h-full w-full max-w-[460px] items-center justify-center lg:mr-0 lg:-translate-x-26">
              {/* Top Left Floating Card: Live Slot */}
              <div className="absolute top-10 -left-30 xl:-left-38 z-10 flex items-center gap-3 rounded-2xl bg-white py-2.5 px-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border border-slate-100/80">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Live Slot</div>
                  <div className="text-[10px] font-medium text-slate-400">Available right now</div>
                </div>
              </div>

              {/* Top Right Floating Card: 4.9 Rating (Shifted further upward) */}
              <div className="absolute -top-10 -right-20 xl:-right-28 z-20 flex items-center gap-3 rounded-2xl bg-white py-2.5 px-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border border-slate-100/80">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-600">
                  <Star className="h-4 w-4 fill-lime-400 text-lime-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">4.9 Rating</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] font-medium text-slate-400">From 500+ players</div>
                </div>
              </div>

              {/* Bottom Left Floating Card: Matchmaking (Shifted upward) */}
              <div className="absolute bottom-28 -left-30 xl:-left-38 z-20 flex items-center gap-3 rounded-2xl bg-white py-2.5 px-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border border-slate-100/80">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-600">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Matchmaking</div>
                  <div className="text-[10px] font-medium text-slate-400">Build team & play</div>
                </div>
              </div>

              {/* Hero Mockup Image with CSS mask fade to seamlessly reveal background pattern */}
              <picture>
                <source srcSet="/hero-mockup.webp" type="image/webp" />
                <img
                  src="/hero-mockup.png"
                  alt="Hero Mockup"
                  className="h-full w-full object-contain [mask-image:linear-gradient(to_bottom,black_65%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,black_65%,transparent_98%)]"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width="460"
                  height="600"
                />
              </picture>
            </div>
          </div>

          {/* Search panel (Fully rounded pill shape, shifted slightly higher) */}
          <div className="relative z-50 mx-auto mt-2 w-full max-w-[1200px] sm:mt-3 lg:mt-4">
            <div className="rounded-full bg-white shadow-[0_10px_25px_-10px_rgba(15,23,42,0.1)] ring-1 ring-slate-100">
              <form
                onSubmit={(e) => { e.preventDefault(); submitSearch(); }}
                className="flex flex-col items-stretch divide-y divide-slate-100/90 lg:divide-y-0 lg:flex-row lg:items-center lg:gap-0"
              >
                <label className="group flex flex-[1.3] items-center gap-2.5 rounded-full px-6 py-3.5 text-left transition-colors hover:bg-slate-50 focus-within:bg-slate-50 cursor-pointer">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-950 transition-colors group-focus-within:bg-lime-100 group-focus-within:text-lime-700">
                    <MapPin className="h-4 w-4 stroke-[2.2]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold text-slate-900">Location</span>
                    <LocationAutocomplete
                      value={form.location}
                      onChange={(value) => updateField('location', value)}
                      onSelect={(location) => {
                        const lat = Number(location.lat);
                        const lng = Number(location.lon ?? location.lng);
                        const name = location.display_name || '';
                        updateField('location', name);
                        setSelectedLocation(
                          Number.isFinite(lat) && Number.isFinite(lng) ? { name, coords: { lat, lng } } : null
                        );
                      }}
                      placeholder="Search location"
                      className="mt-0.5"
                      inputClassName="w-full border-0 bg-transparent p-0 text-[15px] font-medium text-slate-400 outline-none placeholder:text-slate-400"
                    />
                  </span>
                </label>

                <div className="hidden h-9 w-px shrink-0 self-center bg-slate-200 lg:block" />

                <div className="flex-1 min-w-0">
                  <CustomDatePicker
                    variant="searchPill"
                    label="Date"
                    value={form.date}
                    onChange={(value) => updateField('date', value)}
                    minDate={getTodayNepalString()}
                  />
                </div>

                <div className="hidden h-9 w-px shrink-0 self-center bg-slate-200 lg:block" />

                <div className="flex-1 min-w-0">
                  <CustomDropdown
                    variant="searchPill"
                    label="Time"
                    icon={Clock}
                    value={form.time}
                    onChange={(value) => updateField('time', value)}
                    options={TIME_SLOT_OPTIONS}
                    placeholder="HH:MM"
                  />
                </div>

                <div className="hidden h-9 w-px shrink-0 self-center bg-slate-200 lg:block" />

                <label className="group flex flex-1 items-center gap-3 rounded-full px-5 py-3.5 text-left transition-colors hover:bg-slate-50 focus-within:bg-slate-50 cursor-pointer">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-950 transition-colors group-focus-within:bg-lime-100 group-focus-within:text-lime-700">
                    <Users className="h-4 w-4 stroke-[2.2]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold text-slate-900">Players</span>
                    <select
                      value={form.players}
                      onChange={(event) => updateField('players', event.target.value)}
                      className="mt-0.5 w-full appearance-none border-0 bg-transparent p-0 text-[15px] font-medium text-slate-400 outline-none cursor-pointer"
                    >
                      <option value="Any Size">Random</option>
                      <option value="5v5">5v5</option>
                      <option value="7v7">7v7</option>
                    </select>
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-600" />
                </label>

                <div className="flex items-center justify-center p-2 lg:p-2 lg:pr-3">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime-400 px-7 py-3.5 text-[15px] font-semibold text-slate-900 transition-colors hover:bg-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-300 lg:w-auto cursor-pointer"
                  >
                    Search Turfs
                    <Search className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}