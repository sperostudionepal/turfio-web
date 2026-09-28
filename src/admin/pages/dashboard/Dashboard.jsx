import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Download } from 'lucide-react';

import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';

import StatCards from '../../components/dashboard/StatCards';
import RevenueOverview from '../../components/dashboard/RevenueOverview';
import BookingsByTime from '../../components/dashboard/BookingsByTime';
import CourtStatus from '../../components/dashboard/CourtStatus';

import TodaysSchedule from '../../components/dashboard/TodaysSchedule';
import DashboardRecentBookings from '../../components/dashboard/DashboardRecentBookings';

// New dashboard row
import CustomerInsights from '../../components/dashboard/CustomerInsights';
import TopCustomers from '../../components/dashboard/TopCustomers';
import RecentReviews from '../../components/dashboard/RecentReviews';

import CourtsPage from '../turfs/CourtsPage';
import TurfImagesPage from '../turfs/TurfImagesPage';
import BookingsPage from '../bookings/BookingsPage';
import CustomersPage from '../customers/CustomersPage';
import PaymentsPage from '../payments/PaymentsPage';
import PricingPage from '../pricing/PricingPage';
import PromoCodesPage from '../promoCodes/PromoCodesPage';
import AnnouncementsPage from '../announcements/AnnouncementsPage';
import ReviewsPage from '../reviews/ReviewsPage';
import ActivityLogsPage from '../activity/ActivityLogsPage';
import SettingsPage from '../settings/SettingsPage';
import SupportPage from '../support/SupportPage';

import turfService from '../../../shared/services/turfService';
import reviewService from '../../../shared/services/reviewService';
import { buildDashboardViewData } from '../../../shared/utils/dashboardViewData';

import { OwnerContext } from '../../context/ownerContext';

import PeriodSelect from '../../components/dashboard/PeriodSelect';
import BookingDateRangeCalendar from '../../components/bookings/BookingDateRangeCalendar';

import {
  DashboardSkeleton,
  ErrorNotice,
  NoVenueNotice,
} from '../../components/dashboard/DashboardNotices';

import {
  PERIOD_OPTIONS,
  getPeriodRange,
} from '../../../shared/utils/dashboardStats';

import {
  deriveBookingStatus,
  isActiveBooking,
} from '../../../shared/utils/bookingStatus';

import {
  buildBookingsCsv,
  getReportBookings,
  downloadCsv,
} from '../../../shared/utils/reportExport';

import {
  getTodayNepalString,
  formatDateDisplay,
} from '../../../shared/utils/dateTime';

const TAB_TO_PATH = {
  Dashboard: '',
  Bookings: 'bookings',
  Payments: 'payments',
  Customers: 'customers',
  Courts: 'courts',
  'Turf Images': 'images',
  Invoices: 'invoices',
  Pricing: 'pricing',
  'Promo Codes': 'promo-codes',
  Announcements: 'announcements',
  Reviews: 'reviews',
  'Activity Logs': 'activity-logs',
  Settings: 'settings',
  'Help & Support': 'support',
};

const PATH_TO_TAB = Object.fromEntries(
  Object.entries(TAB_TO_PATH).map(([tab, path]) => [path, tab])
);

function Dashboard({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const section = location.pathname
    .replace(/^\/dashboard\/?/, '')
    .split('/')[0];

  const activeTab = PATH_TO_TAB[section] || 'Dashboard';

  const setActiveTab = (tab) =>
    navigate(
      `/dashboard${TAB_TO_PATH[tab] ? `/${TAB_TO_PATH[tab]}` : ''}`
    );

  const [venue, setVenue] = useState(null);
  const [venues, setVenues] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [ownerCustomers, setOwnerCustomers] = useState([]);
  const [ownerReviews, setOwnerReviews] = useState([]);

  const [venueStatus, setVenueStatus] = useState('loading');
  const [bookingsStatus, setBookingsStatus] = useState('loading');
  const [bookingsLoaded, setBookingsLoaded] = useState(false);

  const [isRetrying, setIsRetrying] = useState(false);
  const [period, setPeriod] = useState('month');
  const [periodSelection, setPeriodSelection] = useState('month');
  const [customRange, setCustomRange] = useState({ from: '', to: '' });
  const [dashboardRangeOpen, setDashboardRangeOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [bookingIntent, setBookingIntent] = useState({
    nonce: 0,
    search: '',
    status: 'All',
    date: 'all',
    openAdd: false,
  });

  const [paymentIntent, setPaymentIntent] = useState({
    nonce: 0,
    search: '',
  });

  const [customerIntent, setCustomerIntent] = useState({
    nonce: 0,
    search: '',
  });

  const loadVenue = () => {
    const userId = user?._id || user?.id;

    if (!userId) {
      return Promise.resolve(null);
    }

    return turfService
      .getOwnerTurfs()
      .then((turfs) => {
        setVenues(turfs);
        setVenue(turfs[0] || null);
        setVenueStatus('ready');

        return turfs[0] || null;
      })
      .catch((error) => {
        setVenueStatus('error');
        throw error;
      });
  };

  const loadBookings = useCallback(
    () => Promise.all([
      turfService.getOwnerBookings(),
      turfService.getOwnerCustomers(),
      reviewService.getOwnerReviews(),
    ])
      .then(([items, customers, reviews]) => {
        setOwnerBookings(items);
        setOwnerCustomers(Array.isArray(customers) ? customers : []);
        setOwnerReviews(Array.isArray(reviews) ? reviews : []);
        setBookingsLoaded(true);
        setBookingsStatus('ready');
      })
      .catch(() => {
        setBookingsStatus('error');
      }),
    []
  );

  const userId = user?._id || user?.id;

  useEffect(() => {
    if (!userId) {
      return;
    }

    loadVenue().catch(() => { });
  }, [userId]);

  useEffect(() => {
    if (!userId || activeTab !== 'Dashboard') {
      return;
    }

    loadBookings();
  }, [userId, activeTab, loadBookings]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const reloadWhenVisible = () => {
      if (!document.hidden) {
        loadBookings();
      }
    };

    window.addEventListener('focus', reloadWhenVisible);

    document.addEventListener(
      'visibilitychange',
      reloadWhenVisible
    );

    return () => {
      window.removeEventListener(
        'focus',
        reloadWhenVisible
      );

      document.removeEventListener(
        'visibilitychange',
        reloadWhenVisible
      );
    };
  }, [userId, loadBookings]);

  const refreshBookings = loadBookings;

  const retry = async (load) => {
    setIsRetrying(true);

    try {
      await load();
    } catch {
      // Keep the current error state visible.
    } finally {
      setIsRetrying(false);
    }
  };

  const goToTab = (tab) => {
    setBookingIntent((prev) => ({
      nonce: prev.nonce + 1,
      search: '',
      status: 'All',
      date: 'all',
      openAdd: false,
    }));

    setActiveTab(tab);
  };

  const openBookings = ({
    search = '',
    status = 'All',
    date = 'all',
    openAdd = false,
  } = {}) => {
    setBookingIntent((prev) => ({
      nonce: prev.nonce + 1,
      search,
      status,
      date,
      openAdd,
    }));

    setActiveTab('Bookings');
  };

  const openPayments = ({ search = '' } = {}) => {
    setPaymentIntent((prev) => ({
      nonce: prev.nonce + 1,
      search,
    }));

    setActiveTab('Payments');
  };

  const openCustomers = ({ search = '' } = {}) => {
    setCustomerIntent((prev) => ({
      nonce: prev.nonce + 1,
      search,
    }));

    setActiveTab('Customers');
  };

  const pendingCount = ownerBookings.filter(
    (booking) =>
      isActiveBooking(booking) &&
      deriveBookingStatus(booking) === 'Pending'
  ).length;

  const refreshVenue = loadVenue;

  const ownerContext = {
    user,
    venue,
    setActiveTab: goToTab,
    onLogout,
    refreshVenue,
    refreshBookings,
    openBookings,
    openPayments,
    openCustomers,
    pendingCount,
    isMobileMenuOpen,

    toggleMobileMenu: () =>
      setIsMobileMenuOpen((open) => !open),

    closeMobileMenu: () =>
      setIsMobileMenuOpen(false),
  };

  const pageProps = {
    user,
    venue,
    activeTab,
    setActiveTab: goToTab,
    onLogout,
    refreshVenue,
  };

  const tabPages = {
    Courts: (
      <CourtsPage {...pageProps} />
    ),

    'Turf Images': (
      <TurfImagesPage {...pageProps} />
    ),

    Bookings: (
      <BookingsPage
        key={bookingIntent.nonce}
        {...pageProps}
        ownerBookings={ownerBookings}
        refreshBookings={refreshBookings}
        initialSearch={bookingIntent.search}
        initialStatus={bookingIntent.status}
        initialDateFilter={bookingIntent.date}
        initialAddOpen={bookingIntent.openAdd}
      />
    ),

    Customers: (
      <CustomersPage
        key={customerIntent.nonce}
        {...pageProps}
        initialSearch={customerIntent.search}
      />
    ),

    Payments: (
      <PaymentsPage
        key={paymentIntent.nonce}
        {...pageProps}
        initialSearch={paymentIntent.search}
      />
    ),

    Invoices: (
      <PaymentsPage {...pageProps} initialTab="Invoices" />
    ),

    Pricing: (
      <PricingPage {...pageProps} />
    ),

    'Promo Codes': (
      <PromoCodesPage {...pageProps} />
    ),

    Announcements: (
      <AnnouncementsPage {...pageProps} />
    ),

    Reviews: (
      <ReviewsPage {...pageProps} />
    ),

    'Activity Logs': (
      <ActivityLogsPage {...pageProps} />
    ),

    Settings: (
      <SettingsPage
        key={venue?.id || 'no-venue'}
        {...pageProps}
      />
    ),

    'Help & Support': (
      <SupportPage {...pageProps} />
    ),
  };

  // Keep dashboard hooks above any tab-specific return so every render calls
  // hooks in the same order when navigating between Dashboard and child pages.
  const dashboardData = useMemo(() => buildDashboardViewData({
    bookings: ownerBookings,
    venues,
    customers: ownerCustomers,
    reviews: ownerReviews,
    period, customRange,
  }), [ownerBookings, venues, ownerCustomers, ownerReviews, period, customRange]);

  if (tabPages[activeTab]) {
    return (
      <OwnerContext.Provider value={ownerContext}>
        {tabPages[activeTab]}
      </OwnerContext.Provider>
    );
  }

  const todayLabel =
    formatDateDisplay(getTodayNepalString()) || 'Today';

  const noVenue =
    venueStatus === 'ready' && !venue;

  const reportRange = getPeriodRange(period, undefined, customRange);

  const reportCount = getReportBookings(
    ownerBookings,
    reportRange
  ).length;

  const handleExportReport = () => {
    if (reportCount === 0) {
      return;
    }

    downloadCsv(
      `turfio-bookings-${period}-${getTodayNepalString()}.csv`,
      buildBookingsCsv(
        ownerBookings,
        reportRange
      )
    );
  };

  return (
    <OwnerContext.Provider value={ownerContext}>
      <div className="relative flex h-screen flex-col overflow-hidden bg-white font-sans text-slate-900 antialiased select-none">

        {/* =====================================================
            TOP HEADER
        ====================================================== */}
        <TopBar
          user={user}
          venue={venue}
          setActiveTab={goToTab}
          onLogout={onLogout}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() =>
            setIsMobileMenuOpen(!isMobileMenuOpen)
          }
        />

        {/* =====================================================
            MAIN LAYOUT
        ====================================================== */}
        <div className="relative flex min-h-0 flex-1">

          {/* Sidebar */}
          <Sidebar
            user={user}
            venue={venue}
            activeTab={activeTab}
            setActiveTab={goToTab}
            onLogout={onLogout}
            isOpen={isMobileMenuOpen}
            onClose={() =>
              setIsMobileMenuOpen(false)
            }
          />

          {/* =====================================================
              DASHBOARD CONTENT
          ====================================================== */}
          <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="scrollbar-thin flex-1 overflow-y-auto">
              <div className="mx-auto w-full space-y-6 px-5 py-6 md:px-6 md:py-7 xl:px-7">

                {/* =====================================================
                    WELCOME HEADER
                ====================================================== */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900">
                      Welcome back, {user?.firstName || 'Admin'}! 👋
                    </h1>

                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Here&apos;s what&apos;s happening with your futsal arena ·{' '}
                      {todayLabel}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2.5">
                    <div className="relative">
                      <PeriodSelect
                      value={periodSelection}
                      onChange={(value) => {
                        setPeriodSelection(value);
                        if (value === 'custom') setDashboardRangeOpen(true);
                        else { setDashboardRangeOpen(false); setPeriod(value); }
                      }}
                      options={PERIOD_OPTIONS}
                      icon={Calendar}
                      ariaLabel="Dashboard period"
                      className="bg-white py-1 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:bg-slate-100"
                    />
                      {dashboardRangeOpen && period === 'custom' && (
                        <BookingDateRangeCalendar
                          value={customRange}
                          onApply={(range) => { setCustomRange(range); setPeriod('custom'); setPeriodSelection('custom'); setDashboardRangeOpen(false); }}
                          onClose={() => { setDashboardRangeOpen(false); if (period !== 'custom') setPeriodSelection(period); }}
                        />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleExportReport}
                      disabled={reportCount === 0}
                      title={
                        reportCount === 0
                          ? 'No bookings in this period to export'
                          : `Download ${reportCount} booking${reportCount === 1 ? '' : 's'
                          } as CSV`
                      }
                      className="flex cursor-pointer items-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-xs font-bold text-slate-900 transition-colors hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Download size={14} />

                      <span>
                        Export Report
                      </span>
                    </button>
                  </div>
                </div>

                {/* =====================================================
                    VENUE ERROR
                ====================================================== */}
                {venueStatus === 'error' && (
                  <ErrorNotice
                    message="Couldn't load your venue details."
                    onRetry={() =>
                      retry(loadVenue)
                    }
                    busy={isRetrying}
                  />
                )}

                {/* =====================================================
                    NO VENUE
                ====================================================== */}
                {noVenue && (
                  <NoVenueNotice
                    onListTurf={() => {
                      window.location.href =
                        '/list-turf';
                    }}
                  />
                )}

                {/* =====================================================
                    BOOKING ERROR
                ====================================================== */}
                {bookingsStatus === 'error' && (
                  <ErrorNotice
                    message={
                      bookingsLoaded
                        ? "Couldn't refresh your bookings. Showing the last data that loaded."
                        : "Couldn't load your bookings."
                    }
                    onRetry={() =>
                      retry(loadBookings)
                    }
                    busy={isRetrying}
                  />
                )}

                {noVenue ? null : !bookingsLoaded ? (
                  bookingsStatus === 'loading' ? (
                    <DashboardSkeleton />
                  ) : null
                ) : (
                  <>
                    {/* =====================================================
                        STAT CARDS
                    ====================================================== */}
                    <StatCards stats={dashboardData.stats} />

                    {/* =====================================================
                        PRIMARY DASHBOARD ROW

                        Today's Schedule
                        Revenue Overview
                        Bookings by Time
                    ====================================================== */}
                    <section className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[4fr_5fr_4fr]">

                      {/* Today's Schedule */}
                      <div className="min-w-0">
                        <TodaysSchedule
                          schedule={dashboardData.schedule}
                          onViewCalendar={() =>
                            goToTab('Bookings')
                          }
                        />
                      </div>

                      {/* Revenue Overview */}
                      <div className="min-w-0">
                        <RevenueOverview {...dashboardData.revenue} />
                      </div>

                      {/* Bookings Heatmap */}
                      <div className="min-w-0">
                        <BookingsByTime rows={dashboardData.heatRows} />
                      </div>
                    </section>

                    {/* =====================================================
                        SECONDARY DASHBOARD ROW

                        Court Status
                        Recent Bookings
                    ====================================================== */}
                    <section className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[5fr_8fr]">

                      {/* Court Status */}
                      <div className="min-w-0">
                        <CourtStatus
                          courts={dashboardData.courts}
                          onViewAll={() =>
                            goToTab('Courts')
                          }
                        />
                      </div>

                      {/* Recent Bookings */}
                      <div className="min-w-0">
                        <DashboardRecentBookings
                          bookings={dashboardData.recentBookings}
                          onViewAll={() =>
                            goToTab('Bookings')
                          }
                        />
                      </div>
                    </section>

                    {/* =====================================================
                        CUSTOMER INSIGHTS ROW

                        Customer Insights
                        Top Customers
                        Recent Reviews
                    ====================================================== */}
                    <section className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 xl:grid-cols-[1.05fr_1fr_1fr]">

                      {/* Customer Insights */}
                      <div className="min-w-0">
                        <CustomerInsights
                          insights={dashboardData.insights}
                          onViewAll={() =>
                            goToTab('Customers')
                          }
                        />
                      </div>

                      {/* Top Customers */}
                      <div className="min-w-0">
                        <TopCustomers customers={dashboardData.topCustomers} />
                      </div>

                      {/* Recent Reviews */}
                      <div className="min-w-0 lg:col-span-2 xl:col-span-1">
                        <RecentReviews
                          reviews={dashboardData.recentReviews}
                          onViewAll={() =>
                            goToTab('Reviews')
                          }
                        />
                      </div>
                    </section>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </OwnerContext.Provider>
  );
}

export default Dashboard;