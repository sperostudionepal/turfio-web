import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import StatCards from '../../components/dashboard/StatCards';
import ScheduleCard from '../../components/dashboard/ScheduleCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import RecentBookingsTable from '../../components/dashboard/RecentBookingsTable';
import RevenueSummaryDonut from '../../components/dashboard/RevenueSummaryDonut';
import CourtsPage from '../turfs/CourtsPage';
import TurfImagesPage from '../turfs/TurfImagesPage';
import BookingsPage from '../bookings/BookingsPage';
import CustomersPage from '../customers/CustomersPage';
import PaymentsPage from '../payments/PaymentsPage';
import InvoicesPage from '../invoices/InvoicesPage';
import PricingPage from '../pricing/PricingPage';
import CouponsPage from '../coupons/CouponsPage';
import AnnouncementsPage from '../announcements/AnnouncementsPage';
import AnalyticsPage from '../analytics/AnalyticsPage';
import ReviewsPage from '../reviews/ReviewsPage';
import ActivityLogsPage from '../activity/ActivityLogsPage';
import SettingsPage from '../settings/SettingsPage';
import SupportPage from '../support/SupportPage';
import { Calendar, Download } from 'lucide-react';
import turfService from '../../services/turfService';
import { OwnerContext } from '../../context/ownerContext';
import PeriodSelect from '../../components/dashboard/PeriodSelect';
import NeedsActionCard from '../../components/dashboard/NeedsActionCard';
import { DashboardSkeleton, ErrorNotice, NoVenueNotice, EmptyBookingsNotice } from '../../components/dashboard/DashboardNotices';
import { PERIOD_OPTIONS, getPeriodRange } from '../../utils/dashboardStats';
import { deriveBookingStatus, isActiveBooking } from '../../utils/bookingStatus';
import { buildBookingsCsv, getReportBookings, downloadCsv } from '../../utils/reportExport';
import { getTodayNepalString, formatDateDisplay } from '../../utils/dateTime';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [venue, setVenue] = useState(null);
  const [ownerBookings, setOwnerBookings] = useState([]);
  // Load state, so the page can show skeletons / errors / empty states instead of misleading zeros.
  const [venueStatus, setVenueStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [bookingsStatus, setBookingsStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [bookingsLoaded, setBookingsLoaded] = useState(false); // true once bookings loaded at least once
  const [isRetrying, setIsRetrying] = useState(false);
  const [period, setPeriod] = useState('month');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Lets the top bar / dashboard cards open the Bookings tab with a search, filter or the New Booking form.
  // Changing the nonce remounts the Bookings page so it starts from these values.
  const [bookingIntent, setBookingIntent] = useState({ nonce: 0, search: '', status: 'All', date: 'all', openAdd: false });
  // Same deep-link pattern for the top bar's global search jumping straight to a Payment or Customer ID.
  const [paymentIntent, setPaymentIntent] = useState({ nonce: 0, search: '' });
  const [customerIntent, setCustomerIntent] = useState({ nonce: 0, search: '' });

  const loadVenue = () => {
    const userId = user?._id || user?.id;
    if (!userId) return Promise.resolve(null);
    return turfService
      .getTurfs({ owner: userId, limit: 1 })
      .then((turfs) => {
        setVenue(turfs[0] || null);
        setVenueStatus('ready');
        return turfs[0] || null;
      })
      .catch((error) => {
        setVenueStatus('error');
        throw error;
      });
  };

  // Keeps the previous list on failure so a flaky refresh doesn't blank the page.
  const loadBookings = () =>
    turfService
      .getOwnerBookings()
      .then((items) => {
        setOwnerBookings(items);
        setBookingsLoaded(true);
        setBookingsStatus('ready');
      })
      .catch(() => setBookingsStatus('error'));

  const userId = user?._id || user?.id;

  useEffect(() => {
    if (!userId) return;
    loadVenue().catch(() => {});
  }, [userId]);

  // Reload whenever the owner lands back on the dashboard, so confirms/cancels made on other tabs show up.
  useEffect(() => {
    if (!userId || activeTab !== 'Dashboard') return;
    loadBookings();
  }, [userId, activeTab]);

  // Reload bookings after something changed them.
  const refreshBookings = loadBookings;

  const retry = async (load) => {
    setIsRetrying(true);
    try {
      await load();
    } catch {
      // the failed state stays visible; nothing else to do
    } finally {
      setIsRetrying(false);
    }
  };

  // Plain tab changes start the Bookings page clean; openBookings() is the deep-link version.
  const goToTab = (tab) => {
    setBookingIntent((prev) => ({ nonce: prev.nonce + 1, search: '', status: 'All', date: 'all', openAdd: false }));
    setActiveTab(tab);
  };
  const openBookings = ({ search = '', status = 'All', date = 'all', openAdd = false } = {}) => {
    setBookingIntent((prev) => ({ nonce: prev.nonce + 1, search, status, date, openAdd }));
    setActiveTab('Bookings');
  };
  const openPayments = ({ search = '' } = {}) => {
    setPaymentIntent((prev) => ({ nonce: prev.nonce + 1, search }));
    setActiveTab('Payments');
  };
  const openCustomers = ({ search = '' } = {}) => {
    setCustomerIntent((prev) => ({ nonce: prev.nonce + 1, search }));
    setActiveTab('Customers');
  };

  const pendingCount = ownerBookings.filter((b) => isActiveBooking(b) && deriveBookingStatus(b) === 'Pending').length;

  const refreshVenue = loadVenue;

  // Shared by every owner page (Sidebar/TopBar read it) so the venue name, user and
  // logout action are identical no matter which tab is open.
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
    toggleMobileMenu: () => setIsMobileMenuOpen((open) => !open),
    closeMobileMenu: () => setIsMobileMenuOpen(false),
  };
  const pageProps = { user, venue, activeTab, setActiveTab: goToTab, onLogout, refreshVenue };

  const tabPages = {
    Courts: <CourtsPage {...pageProps} />,
    'Turf Images': <TurfImagesPage {...pageProps} />,
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
    Invoices: <InvoicesPage {...pageProps} />,
    Pricing: <PricingPage {...pageProps} />,
    Coupons: <CouponsPage {...pageProps} />,
    Announcements: <AnnouncementsPage {...pageProps} />,
    Analytics: <AnalyticsPage {...pageProps} />,
    Reviews: <ReviewsPage {...pageProps} />,
    'Activity Logs': <ActivityLogsPage {...pageProps} />,
    // Keyed by venue so the form re-seeds once the venue has loaded (and not on later refreshes).
    Settings: <SettingsPage key={venue?.id || 'no-venue'} {...pageProps} />,
    'Help & Support': <SupportPage {...pageProps} />,
  };

  if (tabPages[activeTab]) {
    return <OwnerContext.Provider value={ownerContext}>{tabPages[activeTab]}</OwnerContext.Provider>;
  }

  const todayLabel = formatDateDisplay(getTodayNepalString()) || 'Today';
  const noVenue = venueStatus === 'ready' && !venue;

  const reportRange = getPeriodRange(period);
  const reportCount = getReportBookings(ownerBookings, reportRange).length;
  const handleExportReport = () => {
    if (reportCount === 0) return;
    downloadCsv(`turfio-bookings-${period}-${getTodayNepalString()}.csv`, buildBookingsCsv(ownerBookings, reportRange));
  };

  return (
    <OwnerContext.Provider value={ownerContext}>
    <div className="flex flex-col h-screen bg-[#fdfefe] text-slate-900 font-sans antialiased overflow-hidden select-none relative">
      {/* Top Header Bar across full window width */}
      <TopBar
        user={user}
        venue={venue}
        setActiveTab={goToTab}
        onLogout={onLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Body Section: Left Sidebar + Right Content Area */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Floating Left Sidebar */}
        <Sidebar
          user={user}
          venue={venue}
          activeTab={activeTab}
          setActiveTab={goToTab}
          onLogout={onLogout}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
          {/* Scrollable Dashboard Body */}
          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-thin px-6 py-6 md:px-8 md:py-8">
            {/* Welcome Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  Welcome back, {user?.firstName || 'Admin'}! 👋
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  Here's what's happening with your futsal arena · {todayLabel}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Period filter: drives the stat cards and revenue summary */}
                <PeriodSelect
                  value={period}
                  onChange={setPeriod}
                  options={PERIOD_OPTIONS}
                  icon={Calendar}
                  ariaLabel="Dashboard period"
                  className="bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:bg-slate-100 py-1"
                />

                {/* Export Report Action */}
                <button
                  onClick={handleExportReport}
                  disabled={reportCount === 0}
                  title={reportCount === 0 ? 'No bookings in this period to export' : `Download ${reportCount} booking${reportCount === 1 ? '' : 's'} as CSV`}
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={14} />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            {venueStatus === 'error' && (
              <ErrorNotice
                message="Couldn't load your venue details."
                onRetry={() => retry(loadVenue)}
                busy={isRetrying}
              />
            )}
            {noVenue && <NoVenueNotice onListTurf={() => { window.location.href = '/list-turf'; }} />}
            {bookingsStatus === 'error' && (
              <ErrorNotice
                message={
                  bookingsLoaded
                    ? "Couldn't refresh your bookings. Showing the last data that loaded."
                    : "Couldn't load your bookings."
                }
                onRetry={() => retry(loadBookings)}
                busy={isRetrying}
              />
            )}

            {noVenue ? null : !bookingsLoaded ? (
              bookingsStatus === 'loading' ? <DashboardSkeleton /> : null
            ) : (
              <>
                {ownerBookings.length === 0 && (
                  <EmptyBookingsNotice
                    onAddBooking={() => openBookings({ openAdd: true })}
                    onSetup={() => goToTab('Courts')}
                  />
                )}

                {/* Bookings waiting on the owner (hidden when there are none) */}
              <NeedsActionCard
                bookings={ownerBookings}
                onChanged={refreshBookings}
                onViewAll={() => openBookings({ status: 'Pending' })}
              />

              {/* Top Row: 4 Metric Cards */}
              <StatCards bookings={ownerBookings} venue={venue} period={period} />

              {/* Middle Row: Today's Schedule, Bookings Overview Bar Chart, Revenue Summary Donut */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <ScheduleCard bookings={ownerBookings} venue={venue} />
                <RevenueChart bookings={ownerBookings} />
                <RevenueSummaryDonut bookings={ownerBookings} period={period} />
              </div>

              {/* Bottom Row: Recent Bookings. Payments now live on their own dashboard page (see Sidebar). */}
              <RecentBookingsTable bookings={ownerBookings} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </OwnerContext.Provider>
  );
}

export default Dashboard;
