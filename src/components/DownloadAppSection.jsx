import { Clock, Star, Users } from 'lucide-react';

export default function DownloadAppSection() {
  return (
    <section className="bg-white pt-10 pb-12 lg:pt-12 lg:pb-14 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Text, App Store Buttons, QR Code */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <span className="text-sm font-semibold text-lime-500">
              Play anywhere
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Download Turfio
            </h2>
            <p className="mt-3 max-w-md text-base font-medium text-slate-500">
              Your next match is just a tap away.
            </p>

            {/* App Store & Google Play Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {/* App Store Badge */}
              <a
                href="#"
                className="transition-transform hover:-translate-y-0.5"
              >
                <img
                  src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  className="h-11 w-auto object-contain"
                />
              </a>

              {/* Google Play Badge */}
              <a
                href="#"
                className="transition-transform hover:-translate-y-0.5"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/3840px-Google_Play_Store_badge_EN.svg.png"
                  alt="Get it on Google Play"
                  className="h-11 w-auto object-contain"
                />
              </a>
            </div>

            {/* QR Code Row */}
            <div className="mt-8 flex items-center gap-4">
              {/* QR Code Graphic */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 border border-slate-200 shadow-sm">
                <svg
                  className="h-full w-full text-slate-900"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  {/* Finder Pattern Top-Left */}
                  <rect x="5" y="5" width="30" height="30" rx="4" />
                  <rect x="11" y="11" width="18" height="18" fill="white" rx="2" />
                  <rect x="15" y="15" width="10" height="10" rx="1" />

                  {/* Finder Pattern Top-Right */}
                  <rect x="65" y="5" width="30" height="30" rx="4" />
                  <rect x="71" y="11" width="18" height="18" fill="white" rx="2" />
                  <rect x="75" y="15" width="10" height="10" rx="1" />

                  {/* Finder Pattern Bottom-Left */}
                  <rect x="5" y="65" width="30" height="30" rx="4" />
                  <rect x="11" y="71" width="18" height="18" fill="white" rx="2" />
                  <rect x="15" y="75" width="10" height="10" rx="1" />

                  {/* Random Modules */}
                  <rect x="42" y="8" width="6" height="6" />
                  <rect x="52" y="8" width="6" height="6" />
                  <rect x="42" y="20" width="6" height="6" />
                  <rect x="52" y="26" width="6" height="6" />
                  <rect x="8" y="42" width="6" height="6" />
                  <rect x="20" y="42" width="6" height="6" />
                  <rect x="26" y="50" width="6" height="6" />
                  <rect x="42" y="42" width="8" height="8" />
                  <rect x="54" y="42" width="6" height="6" />
                  <rect x="66" y="42" width="6" height="6" />
                  <rect x="80" y="42" width="6" height="6" />
                  <rect x="42" y="54" width="6" height="6" />
                  <rect x="54" y="54" width="8" height="8" />
                  <rect x="66" y="54" width="6" height="6" />
                  <rect x="78" y="54" width="8" height="8" />
                  <rect x="42" y="66" width="6" height="6" />
                  <rect x="52" y="76" width="6" height="6" />
                  <rect x="66" y="66" width="8" height="8" />
                  <rect x="78" y="76" width="6" height="6" />
                  <rect x="42" y="82" width="8" height="8" />
                  <rect x="66" y="82" width="6" height="6" />
                  <rect x="82" y="84" width="8" height="8" />
                </svg>
              </div>

              {/* QR Label */}
              <div className="flex flex-col text-sm font-bold text-slate-800">
                <span>Scan to</span>
                <span>Download</span>
              </div>
            </div>
          </div>

          {/* Right Column: Phone Mockups Image with Outermost Floating Cards */}
          <div className="relative flex justify-center lg:col-span-7">
            {/* Organic Lime Background Blob (Balanced Glow) */}
            <div className="absolute inset-0 mx-auto my-auto h-[240px] w-[300px] rounded-full bg-lime-300/25 blur-2xl sm:h-[280px] sm:w-[360px]" />

            {/* Relative Image Wrapper for Positioning Floating Badges */}
            <div className="relative mx-auto py-0">
              {/* Top Left Floating Card: Live Slot */}
              <div className="absolute top-8 -left-28 sm:-left-36 lg:-left-48 z-10 flex items-center gap-3 rounded-2xl bg-white py-2.5 px-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border border-slate-100/80">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Live Slot</div>
                  <div className="text-[10px] font-medium text-slate-400">Available right now</div>
                </div>
              </div>

              {/* Bottom Left Floating Card: Today's Game */}
              <div className="absolute bottom-8 -left-24 sm:-left-32 lg:-left-44 z-10 flex items-center gap-3 rounded-2xl bg-white py-2.5 px-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border border-slate-100/80">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Today's Game</div>
                  <div className="text-[10px] font-semibold text-slate-500">8:00 PM - 9:00 PM</div>
                </div>
              </div>

              {/* Top Right Floating Card: 4.9 Rating (Shifted further right) */}
              <div className="absolute top-10 -right-28 sm:-right-36 lg:-right-52 z-10 flex items-center gap-3 rounded-2xl bg-white py-2.5 px-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border border-slate-100/80">
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

              {/* Bottom Right Floating Card: Invite Friends */}
              <div className="absolute bottom-4 -right-28 sm:-right-36 lg:-right-48 z-10 flex items-center gap-3 rounded-2xl bg-white py-2.5 px-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] border border-slate-100/80">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-600">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Invite Friends</div>
                  <div className="text-[10px] font-medium text-slate-400">Build team & play together</div>
                </div>
              </div>

              {/* Central Phone Mockups Image */}
              <img
                src="/mockup.png"
                alt="Turfio App Mobile Mockup"
                className="relative z-0 w-full max-w-[420px] object-contain drop-shadow-md transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
