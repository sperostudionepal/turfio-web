import { useState, useRef, useEffect } from 'react';
import { Search, Bell, HelpCircle, ChevronDown, Plus, Settings, LogOut } from 'lucide-react';

function TopBar({ user, venue, onLogout }) {
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
    <header className="w-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] select-none relative z-30">
      <div className="flex items-center justify-between px-4 py-3.5 sm:py-4 md:px-6 lg:px-8 gap-6">
        {/* Left side: Brand Logo matching sidebar width */}
        <div className="w-64 shrink-0 flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="Turfio Logo"
            className="h-9 w-auto object-contain"
          />
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight text-slate-900">
              TURFIO
            </span>
            <span className="block text-[11px] font-medium tracking-wider text-slate-400">
              Futsal, your way
            </span>
          </span>
        </div>

        {/* Center: Search Input */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search bookings, turfs, customers..."
              className="w-full pl-11 pr-4 py-3.5 rounded-full bg-slate-100/80 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none transition-colors focus:bg-slate-100"
            />
          </div>
        </div>

        {/* Right side: Actions & Profile */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          {/* Quick Add Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Quick Add</span>
              <ChevronDown size={13} />
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

          {/* Icon Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Notifications Icon Badge */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-lime-400 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Bell size={15} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
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

            {/* Help Icon */}
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-lime-400 hover:text-slate-900 transition-colors cursor-pointer">
              <HelpCircle size={15} />
            </button>

            {/* Settings Icon */}
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-lime-400 hover:text-slate-900 transition-colors cursor-pointer">
              <Settings size={15} />
            </button>
          </div>

          {/* User Profile */}
          <div className="relative pl-2" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              {/* Circular Avatar */}
              <div className="w-9 h-9 rounded-full bg-lime-400 text-slate-900 font-extrabold flex items-center justify-center text-xs shadow-2xs ring-2 ring-white shrink-0">
                A
              </div>

              {/* Name Text */}
              <span className="hidden sm:block text-xs sm:text-sm font-bold text-slate-900">
                Admin
              </span>

              <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {venue?.name || 'Your Arena'}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400 truncate">
                    {user?.email || 'Owner account'}
                  </p>
                </div>

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                  >
                    <span>Log Out</span>
                    <LogOut size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
