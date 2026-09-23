import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Star,
  Settings,
  HelpCircle,
  LogOut,
  Building2,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { useOwnerContext } from '../../context/ownerContext';

function Sidebar(props) {
  // Explicit props win; otherwise fall back to the owner dashboard context so every page behaves the same.
  const ctx = useOwnerContext();
  const { activeTab = 'Dashboard' } = props;
  // Off-canvas open/close state comes from the dashboard context on pages that don't pass it
  const isOpen = props.isOpen ?? ctx.isMobileMenuOpen;
  const onClose = props.onClose ?? ctx.closeMobileMenu;
  const user = props.user ?? ctx.user;
  const venue = props.venue ?? ctx.venue;
  const setActiveTab = props.setActiveTab ?? ctx.setActiveTab;
  const onLogout = props.onLogout ?? ctx.onLogout;

  // Navigation structured specifically for Turf Arena Owners
  const mainItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '#' },
    // Number of bookings waiting for the owner to confirm; hidden when there are none
    { label: 'Bookings', icon: Calendar, badge: ctx.pendingCount > 0 ? String(ctx.pendingCount) : undefined, href: '#' },
    { label: 'Customers', icon: Users, href: '#' },
  ];

  const venueItems = [
    { label: 'Courts', icon: Building2, href: '#' },
    { label: 'Turf Images', icon: ImageIcon, href: '#' },
    { label: 'Invoices', icon: FileText, href: '#' },
  ];

  const manageItems = [
    { label: 'Reviews', icon: Star, href: '#' },
  ];

  const generalItems = [
    { label: 'Settings', icon: Settings, href: '#' },
    { label: 'Help & Support', icon: HelpCircle, href: '#' },
    { label: 'Log out', icon: LogOut, href: '#' },
  ];

  const handleNavClick = (item, isLogout) => {
    if (isLogout && onLogout) {
      onLogout();
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
          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item, isLogout)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all cursor-pointer rounded-full ${
                isLogout
                  ? 'text-rose-600 hover:bg-rose-50'
                  : isActive
                  ? 'bg-lime-400 text-slate-950 font-bold shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isLogout ? 'text-rose-500' : isActive ? 'text-slate-950' : 'text-slate-400'} />
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
                  {(venue?.name || 'T').substring(0, 1).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">{venue?.name || 'Your venue'}</p>
                  <p className="text-[10px] font-medium text-slate-400 truncate">{user?.email || ''}</p>
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
