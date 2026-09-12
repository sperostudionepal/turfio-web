import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  UserCheck,
  Star,
  Settings,
  HelpCircle,
  LogOut,
  Building2,
  Image as ImageIcon,
  User,
  X,
} from 'lucide-react';

function Sidebar({ user, venue, activeTab = 'Dashboard', setActiveTab, onLogout, onSwitchToPlayer, isOpen, onClose }) {
  // Navigation structured specifically for Turf Arena Owners
  const mainItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { label: 'Bookings', icon: Calendar, badge: '24', href: '#' },
    { label: 'Customers', icon: Users, href: '#' },
  ];

  const venueItems = [
    { label: 'Courts', icon: Building2, href: '#' },
    { label: 'Turf Images', icon: ImageIcon, href: '#' },
    { label: 'Invoices', icon: FileText, href: '#' },
  ];

  const manageItems = [
    { label: 'Staff', icon: UserCheck, href: '#' },
    { label: 'Reviews', icon: Star, href: '#' },
  ];

  const generalItems = [
    { label: 'Switch to Player View', icon: User, href: '#' },
    { label: 'Settings', icon: Settings, href: '#' },
    { label: 'Help & Support', icon: HelpCircle, href: '#' },
    { label: 'Log out', icon: LogOut, href: '#' },
  ];

  const handleNavClick = (item, isLogout, isSwitchPlayer) => {
    if (isLogout && onLogout) {
      onLogout();
    } else if (isSwitchPlayer && onSwitchToPlayer) {
      onSwitchToPlayer();
    } else if (setActiveTab) {
      setActiveTab(item.label);
    }
    if (onClose) {
      onClose();
    }
  };

  const renderNavSection = (title, items) => (
    <div className="mb-5">
      {title && (
        <h4 className="px-4 text-xs font-medium tracking-wide text-slate-400 mb-2">
          {title}
        </h4>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.label;
          const isLogout = item.label === 'Log out';
          const isSwitchPlayer = item.label === 'Switch to Player View';
          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item, isLogout, isSwitchPlayer)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all cursor-pointer rounded-full ${
                isLogout
                  ? 'text-rose-600 hover:bg-rose-50'
                  : isSwitchPlayer
                  ? 'text-slate-800 hover:bg-slate-50'
                  : isActive
                  ? 'bg-lime-400 text-slate-950 font-bold shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isLogout ? 'text-rose-500' : isSwitchPlayer ? 'text-slate-600' : isActive ? 'text-slate-950' : 'text-slate-400'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  isActive ? 'bg-slate-950 text-lime-400' : 'bg-lime-100 text-slate-900'
                }`}>
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
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`w-72 bg-white shadow-[0_0_25px_rgba(0,0,0,0.05)] border-r border-slate-100 px-3 py-5 flex flex-col h-full select-none shrink-0 transition-transform duration-300 ${
          isOpen ? 'fixed inset-y-0 left-0 lg:static translate-x-0 z-50' : 'fixed inset-y-0 -translate-x-full lg:static lg:translate-x-0 z-30'
        }`}
      >
        {/* Mobile Header Close Button & Brand */}
        <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Turfio" className="h-6 w-auto" />
            <span className="text-sm font-extrabold text-slate-900">TURFIO</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links - Scrollbar Hidden */}
        <nav className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Mobile Venue Switcher Card */}
          <div className="lg:hidden mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-lime-400 text-slate-900 font-black flex items-center justify-center text-xs shrink-0">
                  {(venue?.name || 'K').substring(0, 1).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">{venue?.name || 'Kathmandu Futsal'}</p>
                  <p className="text-[10px] font-medium text-slate-400 truncate">{user?.email || 'dev.shahi.apps@gmail.com'}</p>
                </div>
              </div>
            </div>
          </div>

          {renderNavSection('Main', mainItems)}
          {renderNavSection('Venue & Rates', venueItems)}
          {renderNavSection('Management', manageItems)}
          {renderNavSection('Account', generalItems)}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
