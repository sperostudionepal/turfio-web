import { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Users,
  FileText,
  UserCheck,
  Star,
  Settings,
  HelpCircle,
  LogOut,
  Building2,
} from 'lucide-react';

function Sidebar({ activeTab = 'Dashboard', setActiveTab, onLogout }) {
  // Navigation structured specifically for Turf Arena Owners
  const mainItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { label: 'Bookings', icon: Calendar, badge: '24', href: '#' },
    { label: 'Schedule', icon: CalendarDays, href: '#' },
    { label: 'Customers', icon: Users, href: '#' },
  ];

  const venueItems = [
    { label: 'Courts', icon: Building2, href: '#' },
    { label: 'Invoices', icon: FileText, href: '#' },
  ];

  const manageItems = [
    { label: 'Staff', icon: UserCheck, href: '#' },
    { label: 'Reviews', icon: Star, href: '#' },
  ];

  const generalItems = [
    { label: 'Settings', icon: Settings, href: '#' },
    { label: 'Help & Support', icon: HelpCircle, href: '#' },
    { label: 'Log out', icon: LogOut, href: '#' },
  ];

  const renderNavSection = (title, items) => (
    <div className="mb-6">
      {title && (
        <h4 className="px-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
          {title}
        </h4>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.label;
          const isLogout = item.label === 'Log out';
          return (
            <button
              key={item.label}
              onClick={() => {
                if (isLogout && onLogout) {
                  onLogout();
                } else if (setActiveTab) {
                  setActiveTab(item.label);
                }
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer rounded-full ${
                isLogout
                  ? 'text-rose-600 hover:bg-rose-50'
                  : isActive
                  ? 'bg-lime-50 text-slate-900 font-bold'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isLogout ? 'text-rose-500' : isActive ? 'text-lime-500' : 'text-slate-400'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-lime-50 text-lime-500 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 bg-white shadow-[4px_0_24px_-4px_rgba(0,0,0,0.03)] px-3 py-6 flex flex-col h-full select-none shrink-0 relative z-20">
      {/* Navigation Links - Scrollbar Hidden */}
      <nav className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {renderNavSection('MAIN', mainItems)}
        {renderNavSection('VENUE & RATES', venueItems)}
        {renderNavSection('MANAGEMENT', manageItems)}
        {renderNavSection('ACCOUNT', generalItems)}
      </nav>
    </aside>
  );
}

export default Sidebar;
