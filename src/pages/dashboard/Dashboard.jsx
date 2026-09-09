import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import StatCards from '../../components/dashboard/StatCards';
import ScheduleCard from '../../components/dashboard/ScheduleCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import RecentBookingsTable from '../../components/dashboard/RecentBookingsTable';
import RecentPaymentsTable from '../../components/dashboard/RecentPaymentsTable';
import RevenueSummaryDonut from '../../components/dashboard/RevenueSummaryDonut';
import CourtsPage from '../turfs/CourtsPage';
import BookingsPage from '../bookings/BookingsPage';
import CustomersPage from '../customers/CustomersPage';
import PaymentsPage from '../payments/PaymentsPage';
import InvoicesPage from '../invoices/InvoicesPage';
import PricingPage from '../pricing/PricingPage';
import StaffPage from '../staff/StaffPage';
import MembershipsPage from '../memberships/MembershipsPage';
import CouponsPage from '../coupons/CouponsPage';
import AnnouncementsPage from '../announcements/AnnouncementsPage';
import AnalyticsPage from '../analytics/AnalyticsPage';
import ReviewsPage from '../reviews/ReviewsPage';
import ActivityLogsPage from '../activity/ActivityLogsPage';
import SettingsPage from '../settings/SettingsPage';
import SupportPage from '../support/SupportPage';
import { Calendar, ChevronDown, Download } from 'lucide-react';
import turfService from '../../services/turfService';
import { getTodayNepalString, formatDateDisplay } from '../../utils/dateTime';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [venue, setVenue] = useState(null);
  const [ownerBookings, setOwnerBookings] = useState([]);

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    turfService
      .getTurfs({ owner: userId, limit: 1 })
      .then((turfs) => setVenue(turfs[0] || null))
      .catch(() => setVenue(null));
  }, [user?._id, user?.id]);

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    turfService.getOwnerBookings().then(setOwnerBookings).catch(() => setOwnerBookings([]));
  }, [user?._id, user?.id]);

  if (activeTab === 'Courts') return <CourtsPage user={user} venue={venue} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />;
  if (activeTab === 'Bookings') return <BookingsPage user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} ownerBookings={ownerBookings} />;
  if (activeTab === 'Customers') return <CustomersPage user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />;
  if (activeTab === 'Payments') return <PaymentsPage activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />;
  if (activeTab === 'Invoices') return <InvoicesPage user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />;
  if (activeTab === 'Pricing') return <PricingPage activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />;
  if (activeTab === 'Staff') return <StaffPage activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />;
  if (activeTab === 'Memberships') return <MembershipsPage activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />;
  if (activeTab === 'Coupons') return <CouponsPage activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />;
  if (activeTab === 'Announcements') return <AnnouncementsPage activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />;
  if (activeTab === 'Analytics') return <AnalyticsPage activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />;
  if (activeTab === 'Reviews') return <ReviewsPage activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />;
  if (activeTab === 'Activity Logs') return <ActivityLogsPage activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />;
  if (activeTab === 'Settings') return <SettingsPage activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />;
  if (activeTab === 'Help & Support') return <SupportPage activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />;

  const todayLabel = formatDateDisplay(getTodayNepalString()) || 'Today';

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden select-none relative">
      {/* Top Header Bar across full window width */}
      <TopBar user={user} venue={venue} onLogout={onLogout} />

      {/* Main Body Section: Left Sidebar + Right Content Area */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Floating Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

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
                  Here's what's happening with your futsal arena today.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Date Filter */}
                <button className="flex items-center gap-2 px-4 py-3 rounded-full bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] cursor-pointer">
                  <Calendar size={14} className="text-slate-400" />
                  <span>{todayLabel}</span>
                  <ChevronDown size={13} className="text-slate-400" />
                </button>

                {/* Export Report Action */}
                <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 text-xs font-semibold transition-colors cursor-pointer">
                  <Download size={14} />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            {/* Top Row: 4 Metric Cards */}
            <StatCards bookings={ownerBookings} venue={venue} />

            {/* Middle Row: Today's Schedule, Bookings Overview Bar Chart, Revenue Summary Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <ScheduleCard bookings={ownerBookings} venue={venue} />
              <RevenueChart bookings={ownerBookings} />
              <RevenueSummaryDonut bookings={ownerBookings} />
            </div>

            {/* Bottom Row: Recent Bookings & Recent Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <RecentBookingsTable bookings={ownerBookings} />
              <RecentPaymentsTable bookings={ownerBookings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
