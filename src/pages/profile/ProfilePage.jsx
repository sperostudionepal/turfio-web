import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileInfoCard from './ProfileInfoCard';
import PlayerProfileCard from './PlayerProfileCard';
import PreferencesForm from './PreferencesForm';
import SecuritySettings from './SecuritySettings';
import DangerZone from './DangerZone';
import UserBookingDetailModal from '../../components/bookings/UserBookingDetailModal';
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
  ChevronLeft,
  HelpCircle,
  Key,
  ShieldCheck,
  MapPin,
  Star,
  Eye,
} from 'lucide-react';
import { formatNepalDateTime } from '../../utils/dateTime';
import { getPageItems } from '../../utils/pagination';

export default function ProfilePage() {
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
  const navigate = useNavigate();
  const handleFindTurfs = () => navigate('/turfs');

  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const wishlistItems = useWishlistStore((s) => s.items);
  const wishlistLoading = useWishlistStore((s) => s.isLoading);
  const isWishlistLoaded = useWishlistStore((s) => s.isLoaded);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);

  // Re-fetch on entering Security & 2FA specifically: hasPassword (and other account-state
  // flags) can go stale between the initial mount and whenever the user actually opens this
  // tab, so this tab always renders off freshly-confirmed data instead of a cached guess.
  useEffect(() => {
    if (activeTab === 'security') {
      initialize();
    }
  }, [activeTab, initialize]);

  useEffect(() => {
    if (activeTab !== 'bookings' || !user) return;
    setBookingsLoading(true);
    turfService
      .getMyBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setBookingsLoading(false));
  }, [activeTab, user]);

  // Handler for requesting cancellation
  const handleRequestCancellation = async (bookingId, reason) => {
    try {
      await turfService.requestCancellation(bookingId, reason);
      showToast('Cancellation request submitted successfully', 'success');
      // Refresh bookings
      const updatedBookings = await turfService.getMyBookings();
      setBookings(updatedBookings);
      setSelectedBooking(null);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit cancellation request', { cause: error });
    }
  };

  // Fetched on mount (not gated to the savedTurfs tab) since the saved-turfs count
  // also shows in the stats card on the default Personal Info tab.
  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!userId || isWishlistLoaded) return;
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
    <div className="bg-white font-sans">
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
              onClick={() => navigate('/login?redirectTo=%2Fprofile')}
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
                  <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.08)] overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-slate-900">My Bookings</h3>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {bookings.length > 0 
                              ? `${bookings.length} ${bookings.length === 1 ? 'booking' : 'bookings'} found`
                              : 'No bookings yet'}
                          </p>
                        </div>
                        {bookings.length > 0 && (
                          <span className="text-xs font-bold text-slate-400 px-3 py-1 rounded-full bg-slate-50">
                            Total: {bookings.length}
                          </span>
                        )}
                      </div>
                    </div>

                    {bookingsLoading ? (
                      <div className="p-6">
                        <p className="text-sm text-slate-500 text-center">Loading bookings...</p>
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                          <Calendar className="h-8 w-8" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900">No bookings yet</h4>
                        <p className="text-sm text-slate-500 mt-1">Book your first turf to get started</p>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                              <tr>
                                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  Booking ID
                                </th>
                                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  Venue & Court
                                </th>
                                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  Date & Time
                                </th>
                                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  Amount
                                </th>
                                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  Payment Status
                                </th>
                                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {(() => {
                                const totalPages = Math.max(1, Math.ceil(bookings.length / itemsPerPage));
                                const page = Math.min(currentPage, totalPages);
                                const startIndex = (page - 1) * itemsPerPage;
                                const paginatedBookings = bookings.slice(startIndex, startIndex + itemsPerPage);
                                
                                return paginatedBookings.map((booking) => {
                                  const totalAmount = Number(booking.totalAmount || 0);
                                  const paidAmount = Number(booking.totalPaidAmount || 0);
                                  const dueAmount = Math.max(0, totalAmount - paidAmount);
                                  
                                  return (
                                    <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                          <p className="text-sm font-bold text-lime-600">
                                            {booking.bookingId || booking.shortCode || '—'}
                                          </p>
                                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                            {formatNepalDateTime(booking.createdAt)}
                                          </p>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="min-w-0">
                                          <p className="text-sm font-bold text-slate-900 truncate">
                                            {booking.turf?.name || 'Turf booking'}
                                          </p>
                                          <p className="text-xs text-slate-500 font-medium">
                                            {booking.court?.name || 'Court 1'}
                                          </p>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div>
                                          <p className="text-xs font-bold text-slate-900">
                                            {booking.dateStr || new Date(booking.date).toLocaleDateString()}
                                          </p>
                                          <p className="text-xs text-slate-500 font-medium">
                                            {booking.timeSlot}
                                          </p>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div>
                                          <p className="text-sm font-black text-slate-900">
                                            NPR {totalAmount.toLocaleString()}
                                          </p>
                                          {dueAmount > 0 && (
                                            <p className="text-[10px] font-bold text-amber-600 mt-0.5">
                                              Due: NPR {dueAmount.toLocaleString()}
                                            </p>
                                          )}
                                          {booking.paymentType === 'venue' && booking.depositAmount > 0 && (
                                            <p className="text-[10px] font-medium text-emerald-600 mt-0.5">
                                              Deposit: NPR {Number(booking.depositAmount).toLocaleString()}
                                            </p>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${
                                            booking.paymentStatus === 'Paid'
                                              ? 'bg-emerald-100 text-emerald-700'
                                              : booking.paymentStatus === 'Partial'
                                              ? 'bg-amber-100 text-amber-700'
                                              : 'bg-slate-100 text-slate-700'
                                          }`}>
                                            {booking.paymentStatus}
                                          </span>
                                          <span className="text-[10px] font-medium text-slate-500">
                                            {booking.paymentMethod || 'eSewa'}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                          booking.status === 'Confirmed'
                                            ? 'bg-blue-100 text-blue-700'
                                            : booking.status === 'Completed'
                                            ? 'bg-slate-100 text-slate-700'
                                            : booking.status === 'Cancelled' && booking.refund && booking.refund.status === 'Processed'
                                            ? 'bg-purple-100 text-purple-700'
                                            : booking.status === 'Cancelled'
                                            ? 'bg-rose-100 text-rose-700'
                                            : 'bg-rose-100 text-rose-700'
                                        }`}>
                                          {booking.status === 'Cancelled' && booking.refund && booking.refund.status === 'Processed' ? 'Refunded' : booking.status}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                        <button
                                          onClick={() => setSelectedBooking(booking)}
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-500 text-xs font-bold text-slate-900 transition-all"
                                        >
                                          <Eye className="h-3.5 w-3.5" />
                                          View Details
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination Controls */}
                        {bookings.length > 0 && (
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                            <div className="flex items-center gap-3">
                              <span>
                                Showing <strong className="text-slate-900 font-bold">{bookings.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}</strong> to{' '}
                                <strong className="text-slate-900 font-bold">{Math.min(currentPage * itemsPerPage, bookings.length)}</strong> of{' '}
                                <strong className="text-slate-900 font-bold">{bookings.length}</strong> entries
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span>Rows:</span>
                                <select
                                  value={itemsPerPage}
                                  onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all"
                                >
                                  <option value={5}>5</option>
                                  <option value={10}>10</option>
                                  <option value={20}>20</option>
                                  <option value={50}>50</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-lime-50 hover:text-lime-600 hover:border-lime-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:border-slate-200 disabled:cursor-not-allowed transition-all"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </button>
                              {(() => {
                                const totalPages = Math.max(1, Math.ceil(bookings.length / itemsPerPage));
                                return getPageItems(currentPage, totalPages).map((item) =>
                                  typeof item === 'number' ? (
                                    <button
                                      key={item}
                                      onClick={() => setCurrentPage(item)}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        currentPage === item
                                          ? 'bg-lime-400 text-slate-900 border border-lime-500'
                                          : 'border border-slate-200 text-slate-600 hover:bg-lime-50 hover:text-lime-600 hover:border-lime-200'
                                      }`}
                                    >
                                      {item}
                                    </button>
                                  ) : (
                                    <span key={item.key} className="px-2 text-slate-400">
                                      …
                                    </span>
                                  )
                                );
                              })()}
                              <button
                                disabled={currentPage >= Math.ceil(bookings.length / itemsPerPage)}
                                onClick={() => setCurrentPage(Math.min(Math.ceil(bookings.length / itemsPerPage), currentPage + 1))}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-lime-50 hover:text-lime-600 hover:border-lime-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:border-slate-200 disabled:cursor-not-allowed transition-all"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </>
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
                          onClick={handleFindTurfs}
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
                            onClick={() => navigate(`/turfs/${turf.slug || turf.id || turf._id}`)}
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

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <UserBookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onRequestCancellation={handleRequestCancellation}
        />
      )}
    </div>
  );
}

