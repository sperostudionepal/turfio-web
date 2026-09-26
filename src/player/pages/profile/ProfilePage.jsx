import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProfileInfoCard from './ProfileInfoCard';
import PlayerProfileCard from './PlayerProfileCard';
import PreferencesForm from './PreferencesForm';
import SecuritySettings from './SecuritySettings';
import DangerZone from './DangerZone';
import MyBookingsCard from './MyBookingsCard';

import UserBookingDetailModal from '../../components/bookings/UserBookingDetailModal';

import useAuthStore from '../../../shared/store/useAuthStore';
import useWishlistStore from '../../../shared/store/useWishlistStore';
import turfService from '../../../shared/services/turfService';
import { useToast } from '../../../shared/components/common/toastContext';

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
  HelpCircle,
  Key,
  ShieldCheck,
  MapPin,
  Star,
  Eye,
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
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const wishlistItems = useWishlistStore((s) => s.items);
  const wishlistLoading = useWishlistStore((s) => s.isLoading);
  const isWishlistLoaded = useWishlistStore((s) => s.isLoaded);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);

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

  const tabs = [
    {
      id: 'profile',
      label: 'Personal Info',
      icon: User,
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
    },
    {
      id: 'savedTurfs',
      label: 'Saved Turfs',
      icon: Heart,
    },
    {
      id: 'playerProfile',
      label: 'Skill Set & Style',
      icon: Trophy,
    },
    {
      id: 'preferences',
      label: 'App Preferences',
      icon: Bell,
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
    },
    {
      id: 'danger',
      label: 'Danger Zone',
      icon: AlertTriangle,
      danger: true,
    },
  ];

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
            {/* Sidebar */}
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
                        onClick={() => {
                          setActiveTab(tab.id);
                          setCurrentPage(1);
                        }}
                        className={`
                          flex
                          w-full
                          cursor-pointer
                          items-center
                          gap-3
                          rounded-lg
                          px-4
                          py-3.5
                          text-xs
                          font-bold
                          transition-all
                          sm:text-[13px]

                          ${isActive
                            ? tab.danger
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-lime-100/80 font-extrabold text-slate-950'
                            : tab.danger
                              ? 'text-rose-500 hover:bg-rose-50/50'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }
                        `}
                      >
                        <Icon
                          className={`
                            h-4
                            w-4

                            ${isActive
                              ? tab.danger
                                ? 'text-rose-600'
                                : 'text-lime-700'
                              : 'text-slate-400'
                            }
                          `}
                        />

                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

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
                              {user?.skillLevel ||
                                'Weekend Warrior'}
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
                              {user?.primaryPosition ||
                                user?.position ||
                                'Midfielder'}
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
                              {user?.preferredMatchType ||
                                user?.matchType ||
                                '5v5'}
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
                  <PlayerProfileCard
                    user={user}
                    onUpdateProfile={updateProfile}
                  />
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

function SavedTurfsSection({
  items,
  isLoading,
  onRemove,
  onNavigate,
  onFindTurfs,
}) {
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = async (e, turfId) => {
    e.stopPropagation();

    try {
      setRemovingId(turfId);

      await onRemove(turfId);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="rounded-xl bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
            Saved Turfs
          </h2>

          <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
            Quickly return to the venues you have saved.
          </p>
        </div>

        <button
          type="button"
          onClick={onFindTurfs}
          className="
            inline-flex
            cursor-pointer
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-lime-400
            px-4
            py-2.5
            text-xs
            font-bold
            text-slate-900
            transition-colors
            hover:bg-lime-500
            sm:text-sm
          "
        >
          Find Turfs

          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-lime-500" />
        </div>
      ) : !items?.length ? (
        <div className="px-5 py-16 text-center sm:px-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <Heart className="h-6 w-6" />
          </div>

          <h3 className="text-base font-bold text-slate-900">
            No saved turfs
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs font-medium leading-5 text-slate-500 sm:text-sm">
            Save your favourite venues and they will appear here for quick
            access.
          </p>

          <button
            type="button"
            onClick={onFindTurfs}
            className="mt-5 cursor-pointer text-sm font-bold text-lime-700 hover:text-lime-800"
          >
            Explore turfs
          </button>
        </div>
      ) : (
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
          {items.map((item) => {
            const turf = item?.turf || item;

            const turfId =
              turf?._id ||
              turf?.id;

            const image =
              turf?.images?.[0]?.url ||
              turf?.images?.[0] ||
              turf?.image;

            const location =
              turf?.location ||
              turf?.address;

            return (
              <article
                key={turfId}
                className="
                  group
                  overflow-hidden
                  rounded-xl
                  bg-white
                  ring-1
                  ring-slate-100
                  transition-all
                  hover:ring-slate-200
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    onNavigate(`/turfs/${turfId}`)
                  }
                  className="block w-full cursor-pointer text-left"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    {image ? (
                      <img
                        src={image}
                        alt={
                          turf?.name ||
                          'Saved turf'
                        }
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <MapPin className="h-8 w-8" />
                      </div>
                    )}

                    <button
                      type="button"
                      aria-label="Remove saved turf"
                      disabled={removingId === turfId}
                      onClick={(e) =>
                        handleRemove(e, turfId)
                      }
                      className="
                        absolute
                        right-3
                        top-3
                        flex
                        h-9
                        w-9
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-full
                        bg-white/95
                        text-rose-500
                        shadow-sm
                        backdrop-blur
                        transition-colors
                        hover:bg-white
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {removingId === turfId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className="h-4 w-4 fill-current" />
                      )}
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="truncate text-sm font-bold text-slate-900">
                      {turf?.name ||
                        'Saved Turf'}
                    </h3>

                    {location && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />

                        <span className="truncate">
                          {typeof location === 'string'
                            ? location
                            : location?.address ||
                            location?.city}
                        </span>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />

                        <span className="text-xs font-bold text-slate-700">
                          {turf?.rating ||
                            'New'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-lime-700">
                        <Eye className="h-3.5 w-3.5" />

                        View Turf
                      </div>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}