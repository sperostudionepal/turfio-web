import {
  LayoutDashboard,
  Building2,
  CheckCircle2,
  Layers,
  CreditCard,
  Receipt,
  Users,
  ShieldCheck,
  Tag,
  Megaphone,
  Activity,
  ScrollText,
  Sliders,
  LogOut,
  ExternalLink,
} from 'lucide-react';

function SuperadminSidebar({ activeTab = 'Overview', setActiveTab, onLogout, onSwitchToVenueView }) {
  const overviewItems = [
    { label: 'Overview', icon: LayoutDashboard, href: '#' },
    { label: 'Live Stream', icon: Activity, badge: 'Live', badgeVariant: 'emerald', href: '#' },
  ];

  const venueItems = [
    { label: 'Arenas & Turfs', icon: Building2, badge: '18', href: '#' },
    { label: 'Verifications & KYC', icon: CheckCircle2, badge: '3 New', badgeVariant: 'amber', href: '#' },
    { label: 'Court Network', icon: Layers, href: '#' },
  ];

  const financialItems = [
    { label: 'Financials & GMV', icon: CreditCard, href: '#' },
    { label: 'Payouts & Settlement', icon: Receipt, badge: '4 Due', badgeVariant: 'rose', href: '#' },
  ];

  const userItems = [
    { label: 'User Directory', icon: Users, href: '#' },
    { label: 'Roles & Staff', icon: ShieldCheck, href: '#' },
  ];

  const marketingItems = [
    { label: 'Global Promotions', icon: Tag, href: '#' },
    { label: 'Announcements', icon: Megaphone, href: '#' },
  ];

  const systemItems = [
    { label: 'System Health', icon: Activity, href: '#' },
    { label: 'Audit Logs', icon: ScrollText, href: '#' },
    { label: 'Platform Settings', icon: Sliders, href: '#' },
  ];

  const renderBadge = (badge, variant) => {
    if (!badge) return null;
    let style = 'bg-lime-100 text-lime-800';
    if (variant === 'amber') style = 'bg-amber-100 text-amber-800';
    if (variant === 'rose') style = 'bg-rose-100 text-rose-800';
    if (variant === 'emerald') style = 'bg-emerald-100 text-emerald-800 animate-pulse';

    return (
      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${style}`}>
        {badge}
      </span>
    );
  };

  const renderNavSection = (title, items) => (
    <div className="mb-5">
      {title && (
        <h4 className="px-4 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase mb-1.5">
          {title}
        </h4>
      )}
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveTab && setActiveTab(item.label)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer rounded-full ${
                isActive
                  ? 'bg-lime-400 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  size={17}
                  className={isActive ? 'text-slate-900 stroke-[2.5]' : 'text-slate-400'}
                />
                <span>{item.label}</span>
              </div>
              {renderBadge(item.badge, item.badgeVariant)}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 bg-white shadow-[4px_0_24px_-4px_rgba(0,0,0,0.03)] px-3.5 py-5 flex flex-col h-full select-none shrink-0 relative z-20 border-r border-slate-100/60">
      {/* Superadmin Mode Badge */}
      <div className="mx-2 mb-4 px-3 py-2 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-wider text-lime-400">
            Platform Master
          </span>
        </div>
        <span className="text-[9px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md">
          v2.4
        </span>
      </div>

      {/* Navigation Links - Scrollable */}
      <nav className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
        {renderNavSection('COMMAND CENTER', overviewItems)}
        {renderNavSection('PARTNER VENUES', venueItems)}
        {renderNavSection('FINANCIALS & PAYOUTS', financialItems)}
        {renderNavSection('DIRECTORY & ACCESS', userItems)}
        {renderNavSection('GROWTH & ENGAGEMENT', marketingItems)}
        {renderNavSection('INFRASTRUCTURE', systemItems)}
      </nav>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 space-y-1 mt-2">
        {onSwitchToVenueView && (
          <button
            onClick={onSwitchToVenueView}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-lime-50 hover:text-slate-900 rounded-full transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink size={15} className="text-lime-600" />
              <span>Venue Owner View</span>
            </div>
          </button>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-full transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <LogOut size={15} className="text-rose-500" />
              <span>Log Out</span>
            </div>
          </button>
        )}
      </div>
    </aside>
  );
}

export default SuperadminSidebar;
