import {
  AlertTriangle,
  Bell,
  Calendar,
  Heart,
  Shield,
  Trophy,
  User,
} from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Personal Info', icon: User },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'savedTurfs', label: 'Saved Turfs', icon: Heart },
  { id: 'playerProfile', label: 'Skill Set & Style', icon: Trophy },
  { id: 'preferences', label: 'App Preferences', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true },
];

export default function ProfileSidebar({ activeTab, onTabChange }) {
  return (
    <div className="space-y-5 lg:col-span-3">
      <div className="rounded-xl bg-white p-3 shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3.5 text-xs font-bold transition-all sm:text-[13px] ${
                  isActive
                    ? tab.danger
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-lime-100/80 font-extrabold text-slate-950'
                    : tab.danger
                      ? 'text-rose-500 hover:bg-rose-50/50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive
                      ? tab.danger
                        ? 'text-rose-600'
                        : 'text-lime-700'
                      : 'text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
