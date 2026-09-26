import { useState } from 'react';
import SuperadminSidebar from './SuperadminSidebar';
import SuperadminTopbar from './SuperadminTopbar';
import SuperadminOverviewPage from './SuperadminOverviewPage';
import SuperadminVenuesPage from './SuperadminVenuesPage';
import SuperadminFinancialsPage from './SuperadminFinancialsPage';
import SuperadminUsersPage from './SuperadminUsersPage';
import SuperadminAuditHealthPage from './SuperadminAuditHealthPage';
import SuperadminPromotionsPage from './SuperadminPromotionsPage';

function SuperadminDashboard({ onLogout, onSwitchToVenueView }) {
  const [activeTab, setActiveTab] = useState('Overview');

  const handleQuickAction = (actionType) => {
    if (actionType === 'verify_arena') {
      setActiveTab('Verifications & KYC');
    } else if (actionType === 'payout_batch') {
      setActiveTab('Payouts & Settlement');
    } else if (actionType === 'broadcast_alert') {
      setActiveTab('Announcements');
    }
  };

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'Overview':
      case 'Live Stream':
        return <SuperadminOverviewPage setActiveTab={setActiveTab} />;
      case 'Arenas & Turfs':
      case 'Verifications & KYC':
      case 'Court Network':
        return <SuperadminVenuesPage />;
      case 'Financials & GMV':
      case 'Payouts & Settlement':
        return <SuperadminFinancialsPage />;
      case 'User Directory':
      case 'Roles & Staff':
        return <SuperadminUsersPage />;
      case 'Global Promotions':
      case 'Announcements':
        return <SuperadminPromotionsPage />;
      case 'System Health':
      case 'Audit Logs':
      case 'Platform Settings':
        return <SuperadminAuditHealthPage />;
      default:
        return <SuperadminOverviewPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#fdfefe] text-slate-900 font-sans antialiased overflow-hidden select-none relative">
      {/* Top Header Bar across full window width */}
      <SuperadminTopbar
        onLogout={onLogout}
        onSwitchToVenueView={onSwitchToVenueView}
        onQuickAction={handleQuickAction}
      />

      {/* Main Body Section: Left Sidebar + Right Content Area */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Floating Left Sidebar */}
        <SuperadminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
          onSwitchToVenueView={onSwitchToVenueView}
        />

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
          {/* Scrollable Dashboard Body */}
          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-thin px-6 py-6 md:px-8 md:py-8">
            {renderCurrentView()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperadminDashboard;
