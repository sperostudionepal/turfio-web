import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProfileInfoCard from './ProfileInfoCard';
import PlayerProfileCard from './PlayerProfileCard';
import GamePreferencesCard from './GamePreferencesCard';
import PreferencesForm from './PreferencesForm';
import SecuritySettings from './SecuritySettings';
import DangerZone from './DangerZone';
import MyBookingsCard from './MyBookingsCard';
import SavedTurfsSection from './SavedTurfsSection';
import ProfileSidebar from './ProfileSidebar';

import UserBookingDetailModal from '../../components/bookings/UserBookingDetailModal';

import useAuthStore from '../../../shared/store/useAuthStore';
import useWishlistStore from '../../../shared/store/useWishlistStore';
import turfService from '../../../shared/services/turfService';
import { useToast } from '../../../shared/components/common/toastContext';

import {
  Users,
  MapPin,
  ArrowRight,
  Loader2,
  LogIn,
  Trophy
} from 'lucide-react';

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
    deleteAccount,
  } = useAuthStore();

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleFindTurfs = () => navigate('/turfs');

  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const wishlistItems = useWishlistStore((s) => s.items);
  const wishlistLoading = useWishlistStore((s) => s.isLoading);
  const isWishlistLoaded = useWishlistStore((s) => s.isLoaded);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (activeTab !== 'bookings' || !user) return;

    let isActive = true;
    setBookingsLoading(true);
    setBookingsError('');

    turfService
      .getMyBookings()
      .then((data) => {
        if (isActive) setBookings(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        if (isActive) {
          setBookingsError(error?.message || 'Failed to load bookings from the server.');
        }
      })
      .finally(() => {
        if (isActive) setBookingsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [activeTab, user]);

  const handleRequestCancellation = async (bookingId, reason) => {
    try {
      await turfService.requestCancellation(bookingId, reason);

      showToast(
        'Cancellation request submitted successfully',
        'success'
      );

      const updatedBookings = await turfService.getMyBookings();

      setBookings(updatedBookings);
      setSelectedBooking(null);
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        'Failed to submit cancellation request',
        { cause: error }
      );
    }
  };

  useEffect(() => {
    const userId = user?._id || user?.id;

    if (!userId || isWishlistLoaded) return;

    fetchWishlist();
  }, [user, isWishlistLoaded, fetchWishlist]);



  return (
    <div className="bg-white font-sans">
      <main
        className="
          mx-auto
          w-full
          max-w-[1440px]
          flex-1
          px-6
          py-6
          lg:px-10
        "
      >
        {isInitializing ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-lime-500" />

            <p className="text-sm font-semibold text-slate-500">
              Loading profile data...
            </p>
          </div>
        ) : !user ? (
          <div className="mx-auto my-12 max-w-lg rounded-2xl bg-white p-8 text-center shadow-[0_0_25px_rgba(0,0,0,0.04)] sm:p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-lime-100 font-bold text-lime-700">
              <LogIn className="h-8 w-8" />
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              Sign in to view your profile
            </h2>

            <p className="mb-6 mt-2 text-sm font-medium text-slate-500">
              You need to be logged in to manage your Turfio account details,
              booking preferences, and security settings.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate('/login?redirectTo=%2Fprofile')
              }
              className="
                inline-flex
                cursor-pointer
                items-center
                gap-2
                rounded-full
                bg-lime-400
                px-8
                py-3
                text-sm
                font-bold
                text-slate-900
                shadow-xs
                transition-all
                hover:bg-lime-500
              "
            >
              Log In to Account
            </button>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              gap-6
              lg:grid-cols-[repeat(13,minmax(0,1fr))]
            "
          >
            <ProfileSidebar
              activeTab={activeTab}
              onTabChange={(tabId) => {
                setActiveTab(tabId);
                setCurrentPage(1);
              }}
            />

            {activeTab === 'profile' ? (
              <>
                {/* Main profile area */}
                <div className="space-y-6 lg:col-span-7">
                  <ProfileInfoCard
                    user={user}
                    onUpdateProfile={updateProfile}
                    onUploadAvatar={uploadAvatar}
                    isLoading={isLoading}
                  />
                </div>

                {/* Right widgets */}
                <div className="space-y-5 lg:col-span-3">
                  <div className="space-y-4 rounded-xl bg-white p-5 shadow-[0_4px_25px_rgba(0,0,0,0.08)] sm:p-6">
                    <h4 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
                      Profile Completion
                    </h4>

                    <div className="flex items-center gap-4">
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                        <svg
                          className="h-full w-full -rotate-90 transform"
                          viewBox="0 0 36 36"
                        >
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

                        <span className="absolute text-xs font-black text-slate-900 sm:text-sm">
                          85%
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-900 sm:text-sm">
                          Almost there!
                        </p>

                        <p className="mt-0.5 text-xs font-medium leading-snug text-slate-500">
                          Complete your profile to get better match
                          recommendations.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5 rounded-2xl bg-lime-50/70 p-4">
                      {[
                        'Basic Information',
                        'Add Profile Photo',
                        'Verify Email',
                        'Add Playing Preferences',
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 sm:text-[13px]"
                        >
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-500 text-xs font-bold text-white">
                            ✓
                          </div>

                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-xl bg-white p-5 shadow-[0_4px_25px_rgba(0,0,0,0.08)] sm:p-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
                        Playing Preferences
                      </h4>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveTab('playerProfile')
                        }
                        className="cursor-pointer text-xs font-bold text-lime-700 hover:text-lime-800"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                            <Trophy className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Skill Level
                            </p>

                            <p className="text-xs font-bold text-slate-800 sm:text-[13px]">
                              {user?.skillLevel ?? '—'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                            <MapPin className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Position
                            </p>

                            <p className="text-xs font-bold text-slate-800 sm:text-[13px]">
                              {user?.primaryPosition ?? '—'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                            <Users className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Match Type
                            </p>

                            <p className="text-xs font-bold text-slate-800 sm:text-[13px]">
                              {user?.preferredMatchType ?? '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveTab('playerProfile')
                      }
                      className="
                        mt-1
                        flex
                        w-full
                        cursor-pointer
                        items-center
                        justify-center
                        gap-1.5
                        rounded-lg
                        bg-slate-50
                        px-4
                        py-2.5
                        text-xs
                        font-bold
                        text-slate-700
                        transition-colors
                        hover:bg-slate-100
                      "
                    >
                      View Player Profile

                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6 lg:col-span-10">
                {activeTab === 'playerProfile' && (
                  <>
                    <PlayerProfileCard
                      user={user}
                      onUpdateProfile={updateProfile}
                    />
                    <GamePreferencesCard
                      user={user}
                      onUpdateProfile={updateProfile}
                    />
                  </>
                )}

                {activeTab === 'preferences' && (
                  <PreferencesForm
                    user={user}
                    onUpdatePreferences={updatePreferences}
                    isLoading={isLoading}
                  />
                )}

                {activeTab === 'security' && (
                  <SecuritySettings
                    user={user}
                    onChangePassword={changePassword}
                    isLoading={isLoading}
                  />
                )}

                {activeTab === 'danger' && (
                  <DangerZone
                    user={user}
                    onDeleteAccount={deleteAccount}
                    isLoading={isLoading}
                  />
                )}

                {activeTab === 'bookings' && (
                  <MyBookingsCard
                    bookings={bookings}
                    isLoading={bookingsLoading}
                    error={bookingsError}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    onSelectBooking={setSelectedBooking}
                    onFindTurfs={handleFindTurfs}
                  />
                )}

                {activeTab === 'savedTurfs' && (
                  <SavedTurfsSection
                    items={wishlistItems}
                    isLoading={wishlistLoading}
                    onRemove={removeFromWishlist}
                    onNavigate={navigate}
                    onFindTurfs={handleFindTurfs}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

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
