import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProfileInfoCard from './ProfileInfoCard';
import PlayerProfileCard from './PlayerProfileCard';
import GamePreferencesCard from './GamePreferencesCard';
import PreferencesForm from './PreferencesForm';
import SecuritySettings from './SecuritySettings';
import DangerZone from './DangerZone';
import useAuthStore from '../../store/useAuthStore';
import turfService from '../../services/turfService';
import {
  User,
  Users,
  Calendar,
  Heart,
  Trophy,
  Bell,
  Shield,
  AlertTriangle,
  Loader2,
  LogIn,
  Crown,
  ArrowRight,
  Check,
  ChevronRight,
  HelpCircle,
  Key,
  ShieldCheck,
  Star,
  Edit2,
} from 'lucide-react';

export default function ProfilePage({
  onHome,
  onFindTurfs,
  onListTurf,
  onLogin,
  onLogout,
  onDashboard,
}) {
  const {
    user,
    isInitializing,
    isLoading,
    initialize,
    updateProfile,
    uploadAvatar,
    changePassword,
    updatePreferences,
    toggleTwoFactor,
    deleteAccount,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Fetch current user data on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (activeTab !== 'bookings' || !user) return;
    setBookingsLoading(true);
    turfService
      .getMyBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setBookingsLoading(false));
  }, [activeTab, user]);

  const tabs = [
    { id: 'profile', label: 'Personal Info', icon: User },
    { id: 'gameStats', label: 'Game Stats', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'savedTurfs', label: 'Saved Turfs', icon: Heart },
    { id: 'playerProfile', label: 'Skill Set & Style', icon: Trophy },
    { id: 'preferences', label: 'App Preferences', icon: Bell },
    { id: 'security', label: 'Security & 2FA', icon: Shield },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Top Navbar */}
      <Navbar
        user={user}
        isInitializing={isInitializing}
        onLogin={onLogin}
        onLogout={onLogout}
        onHome={onHome}
        onFindTurfs={onFindTurfs}
        onListTurf={onListTurf}
        onDashboard={onDashboard}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 py-6 sm:px-8 lg:px-12">
        {/* Auth Check & Loading States */}
        {isInitializing ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-lime-500 mb-3" />
            <p className="text-sm font-semibold text-slate-500">Loading profile data...</p>
          </div>
        ) : !user ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-[0_0_25px_rgba(0,0,0,0.04)] my-12">
            <div className="w-16 h-16 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center mx-auto mb-4 font-bold">
              <LogIn className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Sign in to view your profile</h2>
            <p className="text-sm font-medium text-slate-500 mt-2 mb-6">
              You need to be logged in to manage your Turfio account details, booking preferences, and security settings.
            </p>
            <button
              type="button"
              onClick={onLogin}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-lime-400 text-sm font-bold text-slate-900 hover:bg-lime-500 transition-all cursor-pointer shadow-xs"
            >
              Log In to Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 1. Left Sidebar (Navigation & Upgrade Card) - 3 cols */}
            <div className="lg:col-span-3 space-y-5">
              {/* Nav Card */}
              <div className="bg-white rounded-2xl p-3 shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
                          isActive
                            ? tab.danger
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-lime-100/80 text-slate-950 font-extrabold'
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

              {/* Upgrade Promo Card */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.08)] relative overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                  <Crown className="h-4 w-4 fill-amber-500 text-amber-500" />
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Play More. Unlock More.</h4>
                <p className="text-[11px] font-medium text-slate-500 mt-1 mb-4 leading-relaxed">
                  Get early access to new features and exclusive perks.
                </p>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-lime-400 text-xs font-bold text-slate-900 hover:bg-lime-500 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Upgrade to Pro</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                {/* Decorative background circle */}
                <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full border-8 border-lime-100/50 pointer-events-none" />
              </div>
            </div>

            {/* 2. Middle & Right Columns */}
            {activeTab === 'profile' ? (
              <>
                {/* Middle Main Profile Column - 6 cols */}
                <div className="lg:col-span-6 space-y-6">
                  <ProfileInfoCard
                    user={user}
                    onUpdateProfile={updateProfile}
                    onUploadAvatar={uploadAvatar}
                    isLoading={isLoading}
                  />
                </div>

                {/* Right Widgets Column - 3 cols */}
                <div className="lg:col-span-3 space-y-5">
                  {/* Widget 1: Profile Completion */}
                  <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.08)] space-y-4">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Profile Completion</h4>
                    
                    <div className="flex items-center gap-4">
                      {/* Circular Progress Ring */}
                      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-100"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-lime-500"
                            strokeDasharray="85, 100"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-xs sm:text-sm font-black text-slate-900">85%</span>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900">Almost there!</p>
                        <p className="text-xs font-medium text-slate-500 leading-snug mt-0.5">
                          Complete your profile to get better match recommendations.
                        </p>
                      </div>
                    </div>

                    {/* Checklist Container */}
                    <div className="bg-lime-50/70 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold text-slate-800">
                        <div className="w-5 h-5 rounded-full bg-lime-500 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                        <span>Basic Information</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold text-slate-800">
                        <div className="w-5 h-5 rounded-full bg-lime-500 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                        <span>Add Profile Photo</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold text-slate-800">
                        <div className="w-5 h-5 rounded-full bg-lime-500 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                        <span>Verify Email</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold text-slate-800">
                        <div className="w-5 h-5 rounded-full bg-lime-500 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                        <span>Add Playing Preferences</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-medium text-slate-400">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0" />
                        <span>Write a Short Bio</span>
                      </div>
                    </div>
                  </div>

                  {/* Widget 2: Playing Preferences */}
                  <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.08)] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Playing Preferences</h4>
                      <button
                        type="button"
                        onClick={() => setActiveTab('playerProfile')}
                        className="text-xs font-bold text-lime-700 hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime-400 text-xs font-bold text-slate-900">
                        <Users className="h-3.5 w-3.5" />
                        5v5
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                        Indoor
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                        Casual
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                        Competitive
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                        Evening
                      </span>
                    </div>
                  </div>

                  {/* Widget 3: Account Settings */}
                  <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.08)] space-y-3">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Account Settings</h4>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab('security')}
                        className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold text-slate-800">
                          <Key className="h-4 w-4 text-slate-400" />
                          <span>Change Password</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('security')}
                        className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold text-slate-800">
                          <ShieldCheck className="h-4 w-4 text-slate-400" />
                          <span>Two-Factor Authentication</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('preferences')}
                        className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold text-slate-800">
                          <Bell className="h-4 w-4 text-slate-400" />
                          <span>Notification Preferences</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Widget 4: Need Help? */}
                  <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs hover:bg-slate-100/80 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-white text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                      <HelpCircle className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-[15px] font-bold text-slate-900">Need Help?</p>
                      <p className="text-xs font-medium text-slate-500 leading-snug mt-0.5">
                        Visit our Help Center or contact support.
                      </p>
                    </div>
                    <ChevronRight className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  </div>
                </div>
              </>
            ) : (
              /* Non-profile active tab (9 cols wide) */
              <div className="lg:col-span-9 space-y-6">
                {activeTab === 'playerProfile' && (
                  <PlayerProfileCard
                    user={user}
                    onUpdateProfile={updateProfile}
                    isLoading={isLoading}
                  />
                )}

                {activeTab === 'preferences' && (
                  <PreferencesForm
                    user={user}
                    onUpdatePreferences={updatePreferences}
                  />
                )}

                {activeTab === 'security' && (
                  <SecuritySettings
                    user={user}
                    onChangePassword={changePassword}
                    onToggleTwoFactor={toggleTwoFactor}
                  />
                )}

                {activeTab === 'danger' && (
                  <DangerZone
                    user={user}
                    onDeleteAccount={deleteAccount}
                  />
                )}

                {activeTab === 'bookings' && (
                  <div className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
                    <h3 className="text-lg font-black text-slate-900 mb-4">My Bookings</h3>
                    {bookingsLoading ? (
                      <p className="text-sm text-slate-500">Loading bookings...</p>
                    ) : bookings.length === 0 ? (
                      <p className="text-sm text-slate-500">No bookings yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {bookings.map((booking) => (
                          <div key={booking._id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                            <div>
                              <p className="font-bold text-slate-900">{booking.turf?.name || 'Turf booking'}</p>
                              <p className="text-xs text-slate-500">{booking.dateStr} · {booking.timeSlot}</p>
                            </div>
                            <span className="text-sm font-black text-slate-900">
                              NPR {Number(booking.totalAmount || 0).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {(activeTab === 'gameStats' || activeTab === 'savedTurfs') && (
                  <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
                    <div className="w-14 h-14 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center mx-auto mb-3 font-bold">
                      <Trophy className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 capitalize">{activeTab} Details</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1 max-w-sm mx-auto">
                      View your detailed stats, match history, and saved turfs directly from your player profile dashboard.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onHome={onHome} onFindTurfs={onFindTurfs} onListTurf={onListTurf} />
    </div>
  );
}

