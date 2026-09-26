import { Home, Calendar, CalendarDays, User } from 'lucide-react';

function MobileBottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'Dashboard', label: 'Home', icon: Home },
    { id: 'Bookings', label: 'Bookings', icon: CalendarDays },
    { id: 'Calendar', label: 'Calendar', icon: Calendar },
    { id: 'Settings', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 px-3 py-2 flex items-center justify-around md:hidden select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id || (activeTab === 'Dashboard' && item.id === 'Dashboard');

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab && setActiveTab(item.id)}
            className="flex flex-col items-center justify-center min-w-[56px] transition-all cursor-pointer relative"
          >
            {/* Top Circular Icon Container */}
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-[#f3fbe2] text-[#0f172a]'
                  : 'bg-transparent text-[#94a3b8] hover:text-[#64748b]'
              }`}
            >
              <Icon
                size={21}
                strokeWidth={isActive ? 2.3 : 1.8}
                className={isActive ? 'text-[#0f172a]' : 'text-[#94a3b8]'}
              />
            </div>

            {/* Item Label */}
            <span
              className={`text-xs tracking-tight transition-colors mt-0.5 ${
                isActive ? 'font-black text-[#0f172a]' : 'font-semibold text-[#94a3b8]'
              }`}
            >
              {item.label}
            </span>

            {/* Bottom Indicator Dot */}
            <div className="h-2 flex items-center justify-center mt-0.5">
              {isActive ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16]" />
              ) : (
                <span className="w-1.5 h-1.5 opacity-0" />
              )}
            </div>
          </button>
        );
      })}
    </nav>
  );
}

export default MobileBottomNav;
