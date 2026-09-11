import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Shield,
  Server,
  Zap,
  RefreshCw,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

function SuperadminTopbar({ onLogout, onSwitchToVenueView, onQuickAction }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const quickActionsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target)) {
        setIsQuickActionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full bg-white shadow-[0_0_25px_rgba(0,0,0,0.05)] border-b border-slate-100 select-none relative z-30">
      <div className="flex items-center justify-between px-4 py-3 sm:py-3.5 md:px-6 lg:px-8 gap-4">
        {/* Left side: Brand Logo + Superadmin Tag */}
        <div className="w-64 shrink-0 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Turfio Logo"
            className="h-9 w-auto object-contain"
          />
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900">
                TURFIO
              </span>
              <span className="bg-lime-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md tracking-wider uppercase">
                SUPERADMIN
              </span>
            </div>
            <span className="block text-[11px] font-medium tracking-wide text-slate-400">
              Platform Master Console
            </span>
          </div>
        </div>

        {/* Center: Global Search across entire platform */}
        <div className="flex-1 max-w-lg hidden md:block">
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search across all arenas, owners, bookings, transactions, KYC..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-100/80 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-lime-300 focus:border-lime-400"
            />
          </div>
        </div>

        {/* Right side: Status Ping, Quick Actions, Notifications, Profile */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Live Cluster Health indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/60 text-slate-700 text-xs font-bold">
            <Server size={13} className="text-slate-500" />
            <span className="text-[11px] text-slate-500 font-medium">Cluster:</span>
            <span className="text-emerald-600 font-extrabold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
              Operational (99.98%)
            </span>
          </div>

          {/* Quick Platform Action Dropdown */}
          <div className="relative" ref={quickActionsRef}>
            <button
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Zap size={14} className="fill-slate-900 text-slate-900" />
              <span className="hidden sm:inline">Platform Ops</span>
              <ChevronDown size={13} />
            </button>

            {isQuickActionsOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-100 p-1.5 z-40 text-xs font-bold text-slate-700 shadow-xl animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    onQuickAction && onQuickAction('verify_arena');
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-lime-50 hover:text-slate-900 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Review Pending KYC</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    onQuickAction && onQuickAction('payout_batch');
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-lime-50 hover:text-slate-900 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <RefreshCw size={15} className="text-lime-600" />
                  <span>Process Payout Batch</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    onQuickAction && onQuickAction('broadcast_alert');
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-lime-50 hover:text-slate-900 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <AlertTriangle size={15} className="text-amber-500" />
                  <span>Broadcast System Notice</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-lime-400 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <Bell size={15} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Platform Alerts</span>
                  <span className="text-[10px] font-extrabold text-lime-900 bg-lime-200 px-2 py-0.5 rounded-full">
                    3 Action Required
                  </span>
                </div>

                <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                  <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">New Turf KYC Application</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Lalitpur Champions Arena submitted tax PAN & trade license.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-medium">8m ago</span>
                    </div>
                  </div>

                  <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">High Volume Refund Request</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Heavy rain cancellation at Pokhara Sky Pitch (NRs. 12,000).</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-medium">35m ago</span>
                    </div>
                  </div>

                  <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Khalti Gateway Settlement</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Successfully reconciled NRs. 450,200 platform batch.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-medium">2h ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative pl-1" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-slate-900 text-lime-400 font-black flex items-center justify-center text-xs ring-2 ring-lime-400 shrink-0">
                SA
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-extrabold text-slate-900 leading-tight">
                  Super Admin
                </span>
                <span className="text-[10px] font-semibold text-lime-600 leading-tight">
                  Root Level
                </span>
              </div>
              <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Shield size={13} className="text-lime-600" />
                    <p className="text-xs font-bold text-slate-900 truncate">
                      Root Master Account
                    </p>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                    superadmin@turfio.app
                  </p>
                </div>

                {onSwitchToVenueView && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onSwitchToVenueView();
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                  >
                    <span>View Venue Dashboard</span>
                    <ExternalLink size={13} className="text-slate-400" />
                  </button>
                )}

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left border-t border-slate-100 mt-1"
                  >
                    <span>Log Out Master</span>
                    <LogOut size={13} />
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

export default SuperadminTopbar;
