import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProfileInfoCard from './ProfileInfoCard';
import PlayerProfileCard from './PlayerProfileCard';
import PreferencesForm from './PreferencesForm';
import SecuritySettings from './SecuritySettings';
import DangerZone from './DangerZone';
import useAuthStore from '../../store/useAuthStore';
import useWishlistStore from '../../store/useWishlistStore';
import turfService from '../../services/turfService';
import { useToast } from '../../components/common/toastContext';
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
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Key,
  ShieldCheck,
  MapPin,
  Star,
} from 'lucide-react';

export default function ProfilePage({
  onHome,
  onFindTurfs,
  onListTurf,
  onLogin,
  onLogout,
  onDashboard,
  onViewTurfDetails,
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
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const wishlistItems = useWishlistStore((s) => s.items);
  const wishlistLoading = useWishlistStore((s) => s.isLoading);
  const isWishlistLoaded = useWishlistStore((s) => s.isLoaded);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);

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

  // Fetched on mount (not gated to the savedTurfs tab) since the saved-turfs count
  // also shows in the stats card on the default Personal Info tab.
  useEffect(() => {
    if (!user || isWishlistLoaded) return;
    fetchWishlist();
  }, [user, isWishlistLoaded, fetchWishlist]);

  const tabs = [
    { id: 'profile', label: 'Personal Info', icon: User },
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

                {activeTab === 'savedTurfs' && (
                  <div className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">Saved Turfs</h3>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                          {wishlistItems.length > 0
                            ? `${wishlistItems.length} ${wishlistItems.length === 1 ? 'turf' : 'turfs'} you've bookmarked for later`
                            : 'Turfs you bookmark will show up here'}
                        </p>
                      </div>
                    </div>

                    {wishlistLoading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="aspect-[4/3] w-full rounded-2xl bg-slate-100" />
                            <div className="mt-3 h-3.5 w-3/4 rounded-full bg-slate-100" />
                            <div className="mt-2 h-3 w-1/2 rounded-full bg-slate-100" />
                          </div>
                        ))}
                      </div>
                    ) : wishlistItems.length === 0 ? (
                      <div className="text-center py-14">
                        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
                          <Heart className="h-8 w-8" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900">No saved turfs yet</h4>
                        <p className="text-xs font-medium text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                          Tap the heart icon on any turf's page to save it here so you can find it again later.
                        </p>
                        <button
                          type="button"
                          onClick={onFindTurfs}
                          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-lime-400 px-5 py-2.5 text-xs font-bold text-slate-900 hover:bg-lime-500 transition-all active:scale-95 cursor-pointer shadow-xs"
                        >
                          Browse Turfs
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {wishlistItems.map((turf) => (
                          <div
                            key={turf.id}
                            onClick={() => onViewTurfDetails?.(turf)}
                            className="group cursor-pointer"
                          >
                            {/* Image with overlaid unsave + verified badge */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
                              <img
                                src={turf.image}
                                alt={turf.title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/image.png';
                                }}
                              />
                              {turf.isVerified && (
                                <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-800 shadow-xs backdrop-blur-sm">
                                  Verified
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  const res = await removeFromWishlist(turf.id);
                                  if (res.success) showToast('Removed from saved turfs');
                                }}
                                aria-label="Remove from saved turfs"
                                title="Remove from saved turfs"
                                className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-rose-500 hover:bg-white hover:scale-110 transition-all cursor-pointer shadow-xs backdrop-blur-sm active:scale-95"
                              >
                                <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                              </button>
                            </div>

                            {/* Details */}
                            <div className="pt-3">
                              <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
                                {turf.type && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                                    <span className="truncate">{turf.city || turf.location}</span>
                                  </span>
                                )}
                                {turf.size && (
                                  <span className="flex items-center gap-1 shrink-0">
                                    <Users className="h-3 w-3 text-slate-400" />
                                    {turf.size}
                                  </span>
                                )}
                              </div>

                              <h4 className="mt-1.5 text-sm font-bold text-slate-900 truncate group-hover:text-lime-600 transition-colors">
                                {turf.title}
                              </h4>

                              <div className="mt-1 flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-lime-400 text-lime-400" />
                                <span className="text-xs font-semibold text-slate-600">
                                  {turf.rating} {turf.reviews > 0 && `(${turf.reviews})`}
                                </span>
                              </div>

                              <div className="mt-2.5 flex items-center justify-between">
                                <span className="text-sm font-black text-slate-900">{turf.price}</span>
                                <span className="text-[11px] font-bold text-lime-700 group-hover:underline">
                                  View Details
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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

