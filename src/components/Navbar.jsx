import { useState, useRef, useEffect } from 'react';
import { Menu, X, User as UserIcon, LogOut, ChevronDown, Bell, ArrowRight, Globe, Clock, HelpCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

function getDisplayName(user) {
  if (!user) return '';
  const f = (user.firstName || '').trim();
  const l = (user.lastName || '').trim();
  if (f && l) {
    if (f === l || f.toLowerCase().includes(l.toLowerCase())) return f;
    return `${f} ${l}`;
  }
  return f || user.username || 'Player';
}

export default function Navbar({
  onLogin,
  user,
  onLogout,
  onListTurf,
  onHome,
  onFindTurfs,
  onDashboard,
  onProfile,
  onHowItWorks,
  onFeatures,
  onPricing,
  onAboutUs,
  isInitializing = false,
  hideTopbar = false,
}) {
  const dismissTurfBanner = useAuthStore((s) => s.dismissTurfBanner);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [selectedLang, setSelectedLang] = useState({ code: 'EN', label: 'English' });

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const langRef = useRef(null);

  const displayName = getDisplayName(user);

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'NP', label: 'नेपाली' },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_0_25px_rgba(0,0,0,0.04)]">
      {/* Contextual Top Banner: Turf Approval Banner for approved venue admins OR Marketing Topbar for non-logged-in visitors */}
      {!hideTopbar && (user && user.isTurfAdmin && !user.turfApprovalBannerSeen ? (
        /* Turf Approval Notification Banner */
        <div className="border-b border-lime-100/40 bg-lime-50">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3.5 lg:px-10 text-[13px] font-medium text-slate-900">
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-base">🎉</span>
              <span>Congratulations! Your turf listing request has been approved and your venue is ready.</span>
              <button
                type="button"
                onClick={() => {
                  if (onDashboard) onDashboard();
                  else {
                    window.history.pushState({}, '', '/dashboard');
                    window.dispatchEvent(new Event('popstate'));
                  }
                }}
                className="ml-1 inline-flex items-center gap-1 font-semibold text-lime-600 hover:text-lime-700 transition-colors cursor-pointer"
              >
                Go to Dashboard <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => dismissTurfBanner()}
              className="p-1 hover:bg-lime-100/80 rounded-full transition-colors cursor-pointer text-slate-500 hover:text-slate-800 shrink-0"
              title="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : !user || (user.role !== 'owner' && user.role !== 'admin' && !user.isTurfAdmin) ? (
        /* Topbar — shown ONLY for logged out visitors and non-admin player accounts */
        <div className="border-b border-lime-100/40 bg-lime-50">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3.5 lg:px-10">
            {/* Left — announcement */}
            <div className="flex items-center gap-2 text-[13px] font-medium text-slate-900">
              <Clock className="h-3.5 w-3.5 shrink-0 text-lime-500" />
              Book faster with our new AI Match Assistant
              <a href="#" className="ml-1 inline-flex items-center gap-1 font-semibold text-lime-600 hover:text-lime-700 transition-colors">
                Learn more <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            {/* Right — links + language */}
            <div className="hidden sm:flex items-center gap-4 text-[13px] font-medium text-slate-900">
              <button onClick={onListTurf} className="font-bold text-lime-500 hover:text-lime-600 transition-colors cursor-pointer">
                List Your Turf
              </button>
              <span className="text-slate-300">|</span>
              <a href="#" className="font-bold text-slate-900 hover:text-slate-800 transition-colors flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-lime-500" />
                Help Center
              </a>
              <span className="text-slate-300">|</span>
              {/* Language dropdown */}
              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  onClick={() => setLangOpen((o) => !o)}
                  className="inline-flex items-center gap-1.5 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <Globe className="h-3.5 w-3.5 text-lime-500" />
                  <span className="font-semibold">{selectedLang.code}</span>
                  <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
                </button>

                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 w-36 rounded-xl bg-white border border-slate-100 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] overflow-hidden z-[9999]">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                        className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-semibold transition-colors cursor-pointer ${
                          selectedLang.code === lang.code
                            ? 'bg-lime-50 text-lime-600'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Globe className="h-3.5 w-3.5 shrink-0 text-lime-500" />
                        <span>{lang.label}</span>
                        {selectedLang.code === lang.code && (
                          <span className="ml-auto text-lime-500 font-bold">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null)}

      {/* Main Navbar Row */}
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3.5 sm:py-4 lg:px-10">
        {/* Brand Logo */}
        <a href="#" onClick={(e) => { e.preventDefault(); onHome?.(); }} className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
          <picture>
            <source srcSet="/logo.webp" type="image/webp" />
            <img
              src="/logo.png"
              alt="Turfio Logo"
              className="h-9 w-auto object-contain"
              loading="eager"
              decoding="async"
              width="36"
              height="36"
            />
          </picture>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight text-slate-900">
              TURFIO
            </span>
            <span className="block text-[11px] font-medium tracking-wider text-slate-400">
              Futsal, your way
            </span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-9 text-[15px] font-medium text-slate-700 lg:flex">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onFindTurfs?.(); }}
            className="transition-colors hover:text-slate-900"
          >
            Find Turfs
          </a>
          <a
            href="#popular-turfs"
            onClick={(e) => { e.preventDefault(); onHowItWorks?.(); }}
            className="transition-colors hover:text-slate-900"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            onClick={(e) => { e.preventDefault(); onFeatures?.(); }}
            className="transition-colors hover:text-slate-900"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={(e) => { e.preventDefault(); onPricing?.(); }}
            className="transition-colors hover:text-slate-900"
          >
            Pricing
          </a>
          <a
            href="#about-us"
            onClick={(e) => { e.preventDefault(); onAboutUs?.(); }}
            className="transition-colors hover:text-slate-900"
          >
            About Us
          </a>
        </nav>

        {/* Desktop Action Buttons & Profile / Notifications */}
        <div className="flex items-center gap-3 sm:gap-4">
          {isInitializing ? (
            <div className="flex items-center gap-3 sm:gap-4 animate-pulse select-none">
              {/* Notifications Bell Skeleton - exact 32x32 circle */}
              <div className="h-8 w-8 rounded-full bg-slate-200/80 shrink-0" />

              {/* Profile Button Skeleton - exact wrapper with gap-2.5 and p-1 */}
              <div className="flex items-center gap-2.5 p-1 rounded-full">
                {/* Avatar Skeleton - exact 36x36 (w-9 h-9) */}
                <div className="w-9 h-9 rounded-full bg-slate-200/80 shrink-0" />

                {/* Display Name Skeleton - exact text-xs/text-sm line height & width */}
                <div className="hidden sm:block h-3.5 w-24 rounded-full bg-slate-200/80 my-0.5" />

                {/* Chevron icon placeholder - 14x14 */}
                <div className="hidden sm:block h-3.5 w-3.5 rounded-full bg-slate-200/70" />
              </div>
            </div>
          ) : user ? (
            <>
              {/* Mock Notifications Bell Button */}
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label="Notifications"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/80 text-slate-700 hover:bg-slate-200/70 transition-all cursor-pointer"
                >
                  <Bell size={15} />
                  {/* Unread dot */}
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-lime-400 border border-white" />
                </button>

                {/* Notifications Dropdown Popup */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2.5 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-step-fade">
                    <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                      <span className="text-xs font-extrabold text-slate-900">Notifications</span>
                      <span className="text-[10px] font-bold text-lime-800 bg-lime-100 px-2 py-0.5 rounded-full">
                        2 New
                      </span>
                    </div>

                    <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                      <div className="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-lime-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">Match Confirmed!</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Hattiban Futsal Arena • Today @ 05:00 PM</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">10m ago</span>
                        </div>
                      </div>

                      <div className="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-lime-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">Team Invite Received</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Kathmandu Ballers invited you to join their squad.</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">1h ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Standalone Avatar + User Name Trigger */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="group flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100/80 transition-all cursor-pointer"
                >
                  {/* Standalone Circular Avatar */}
                  {user?.profilePicture && !avatarError ? (
                    <img
                      src={user.profilePicture}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                      className="w-9 h-9 rounded-full object-cover shadow-2xs ring-2 ring-white shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-lime-400 text-slate-900 font-extrabold flex items-center justify-center text-sm shadow-2xs ring-2 ring-white shrink-0">
                      {displayName[0]?.toUpperCase() || 'U'}
                    </div>
                  )}

                  {/* Standalone Name Text with Ellipsis Truncation */}
                  <span className="hidden sm:block text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[120px] sm:max-w-[140px] pr-1">
                    {displayName}
                  </span>

                  <ChevronDown size={14} className="text-slate-400 hidden sm:block shrink-0" />
                </button>

                {/* Profile Dropdown Menu (Airbnb Style) */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 animate-step-fade overflow-hidden transition-all w-48 sm:w-52 py-1.5">
                    {/* User Links */}
                    <div className="py-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          if (onProfile) {
                            onProfile();
                          } else {
                            window.history.pushState({}, '', '/profile');
                            window.dispatchEvent(new Event('popstate'));
                          }
                        }}
                        className="w-full flex items-center gap-3 px-4.5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                      >
                        <UserIcon size={18} className="text-slate-700 shrink-0" />
                        <span>My Profile</span>
                      </button>

                      {onLogout && (
                        <>
                          <div className="border-t border-slate-100 my-1" />
                          <button
                            type="button"
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4.5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                          >
                            <LogOut size={18} className="text-rose-500 shrink-0" />
                            <span>Log Out</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onLogin}
                className="hidden text-[15px] font-semibold text-slate-900 sm:block hover:text-slate-700 transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={onLogin}
                className="hidden rounded-full bg-lime-400 px-5 py-2.5 text-[15px] font-semibold text-slate-900 transition-colors hover:bg-lime-500 sm:inline-flex cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Floating Overlay Popup Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border-b border-slate-100/80 shadow-xl px-6 py-5 lg:hidden">
          <nav className="flex flex-col gap-3.5 text-sm font-semibold text-slate-800">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onFindTurfs?.();
              }}
              className="py-1 transition-colors hover:text-lime-600"
            >
              Find Turfs
            </a>
            <a
              href="#popular-turfs"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onHowItWorks?.();
              }}
              className="py-1 transition-colors hover:text-lime-600"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onFeatures?.();
              }}
              className="py-1 transition-colors hover:text-lime-600"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onPricing?.();
              }}
              className="py-1 transition-colors hover:text-lime-600"
            >
              Pricing
            </a>
            <a
              href="#about-us"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onAboutUs?.();
              }}
              className="py-1 transition-colors hover:text-lime-600"
            >
              About Us
            </a>

            {/* Log In & Sign Up / Logout Buttons inside Mobile Popup */}
            <div className="mt-3 pt-4 border-t border-slate-100 flex items-center gap-3">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-rose-600 text-center hover:bg-rose-50 transition-colors"
                >
                  Log Out
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onLogin) onLogin();
                    }}
                    className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-900 text-center hover:bg-slate-50 transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onLogin) onLogin();
                    }}
                    className="flex-1 rounded-full bg-lime-400 py-2.5 text-sm font-semibold text-slate-900 text-center hover:bg-lime-500 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}