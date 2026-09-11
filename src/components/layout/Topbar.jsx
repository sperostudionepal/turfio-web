import { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, ChevronRight, Plus, Settings, LogOut, User, Menu, X, Layers } from 'lucide-react';

function TopBar({ user, venue, userVenues, onSelectVenue, onLogout, onSwitchToPlayer, onToggleMobileMenu, isMobileMenuOpen }) {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full bg-white shadow-[0_0_25px_rgba(0,0,0,0.05)] border-b border-slate-100 select-none relative z-40">
      <div className="flex items-center justify-between px-4 py-3.5 sm:py-4 md:px-6 lg:px-8 gap-3 sm:gap-6">
        
        {/* Left Side (Mobile: Hamburger toggle + Brand Logo | Desktop: Brand Logo + Venue Switcher) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Mobile Hamburger Toggle */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              aria-label="Toggle Navigation Menu"
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-xl lg:hidden transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}

          {/* Brand Logo Container (Mirrors Player View Navbar.jsx) */}
          <div className="flex lg:w-64 shrink-0 items-center gap-2.5">
            <picture>
              <source srcSet="/logo.webp" type="image/webp" />
              <img
                src="/logo.png"
                alt="Turfio Logo"
                className="h-9 w-auto object-contain"
                loading="eager"
                decoding="async"
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
          </div>

          {/* Venue Switcher Button (Desktop only on topbar; moved inside mobile sidebar) */}
          <div className="hidden md:block relative shrink-0" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full transition-colors cursor-pointer text-left ${
                isProfileOpen ? 'bg-slate-100' : 'hover:bg-slate-100/80'
              }`}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-lime-400 text-slate-900 font-black flex items-center justify-center text-sm sm:text-base shrink-0 shadow-2xs">
                {(venue?.name || 'K').substring(0, 1).toUpperCase()}
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 max-w-[120px] sm:max-w-[170px] truncate">
                {venue?.name || 'Kathmandu Futsal'}
              </span>
              <ChevronDown size={14} className="text-slate-500 shrink-0 ml-0.5" />
            </button>

            {/* Venue Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100/60 p-2 z-50">
                {/* Active Venue Hero Header */}
                <div className="flex flex-col items-center justify-center p-3 text-center border-b border-slate-200/70 mb-1.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 font-extrabold flex items-center justify-center text-sm mb-2">
                    {(venue?.name || 'K').substring(0, 2).toUpperCase()}
                  </div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    {venue?.name || 'Kathmandu Futsal'}
                  </p>
                  <p className="text-xs font-medium text-slate-400 mt-0.5 truncate max-w-[200px]">
                    {user?.email || 'dev.shahi.apps@gmail.com'}
                  </p>
                  <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                    <span>{user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()) : 'Admin'}</span>
                  </div>
                </div>

                {/* Venues List */}
                <div className="py-0.5">
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {(userVenues && userVenues.length > 0 ? userVenues : [
                      { id: '1', name: venue?.name || 'Hattiban Futsal', location: 'Baluwatar' },
                      { id: '2', name: 'Valley Sports Complex', location: 'Jhawakhel' },
                    ]).map((v) => {
                      const isSelected = (venue?.id || venue?._id || '1') === (v.id || v._id);
                      return (
                        <button
                          key={v.id || v._id}
                          type="button"
                          onClick={() => {
                            if (onSelectVenue) onSelectVenue(v);
                            setIsProfileOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-slate-100/90 text-slate-900 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                              isSelected ? 'bg-lime-400 text-slate-900' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {(v.name || 'T').substring(0, 2).toUpperCase()}
                            </div>
                            <div className="truncate">
                              <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{v.name}</p>
                              {v.location && <p className="text-xs text-slate-400 truncate leading-tight">{v.location}</p>}
                            </div>
                          </div>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-500 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions Section */}
                <div className="pt-1.5 mt-1.5 border-t border-slate-200/70 space-y-1">
                  {/* List New Turf Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      window.location.href = '/list-turf';
                    }}
                    className="w-full flex items-center justify-start px-2.5 py-2 rounded-md text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-2.5">
                      <div className="w-7 h-7 flex items-center justify-center shrink-0">
                        <Plus size={16} className="text-slate-500" />
                      </div>
                      <span>List New Turf</span>
                    </span>
                  </button>

                  {onSwitchToPlayer && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        onSwitchToPlayer();
                      }}
                      className="w-full flex items-center justify-start px-2.5 py-2 rounded-md text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        <div className="w-7 h-7 flex items-center justify-center shrink-0">
                          <Layers size={16} className="text-slate-500" />
                        </div>
                        <span>Switch to Player View</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center / Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md items-center">
          <div className="relative flex items-center w-full">
            <Search size={17} className="absolute left-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search bookings, turfs, customers..."
              className="w-full pl-11 pr-16 py-2.5 sm:py-3 rounded-full bg-slate-100/80 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-colors focus:bg-slate-100"
            />
            <div className="absolute right-3.5 flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-400 pointer-events-none">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right side: Actions & Icons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Mobile Search Icon Button (Side by side with Notification bell) */}
          <button
            type="button"
            aria-label="Search"
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-full bg-slate-100/90 text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
          >
            <Search size={17} />
          </button>

          {/* Quick Add Icon Button (Desktop only) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
              title="Quick Add"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 transition-colors cursor-pointer shrink-0"
            >
              <Plus size={16} />
            </button>

            {isQuickAddOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-2xl border border-slate-100 p-1.5 z-40 text-xs font-semibold text-slate-700 shadow-xl">
                <button
                  onClick={() => setIsQuickAddOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>📅 New Booking</span>
                </button>
                <button
                  onClick={() => setIsQuickAddOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>🏟️ New Court</span>
                </button>
                <button
                  onClick={() => setIsQuickAddOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>👤 New Customer</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Icon Badge (Visible on both Mobile and Desktop) */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100/90 text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2.5 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] font-bold text-lime-800 bg-lime-100 px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>

                <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                  <div className="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-lime-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Booking Confirmed!</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Main Turf • Today @ 05:00 PM</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">10m ago</span>
                    </div>
                  </div>

                  <div className="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-lime-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Payment Received</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">NRs. 2,500 from a recent booking.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">1h ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Setup Guide Pill Button (Desktop only) */}
          <div className="relative hidden md:block pl-1">
            <button
              type="button"
              className="flex h-9 items-center gap-2.5 px-4 rounded-full bg-slate-100/90 hover:bg-slate-200/70 text-slate-800 transition-colors cursor-pointer shrink-0"
            >
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-800">
                Setup guide
              </span>
              <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 -rotate-90 transform" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-slate-200/80"
                    fill="transparent"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-lime-500"
                    strokeDasharray="56.5"
                    strokeDashoffset="18"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
