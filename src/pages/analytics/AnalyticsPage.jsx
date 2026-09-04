import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import { BarChart3, TrendingUp, DollarSign, Calendar, Download, Users, CircleDot } from 'lucide-react';
import StatCards from '../../components/dashboard/StatCards';
import RevenueChart from '../../components/dashboard/RevenueChart';

function AnalyticsPage({ activeTab, setActiveTab }) {
  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased overflow-hidden select-none">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Arena Analytics & Reports</h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Deep financial insights, peak slot performance, and occupancy trends.</p>
            </div>
            <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all">
              <Download size={14} /> <span>Download Full Report</span>
            </button>
          </div>

          {/* Top Metric Cards */}
          <StatCards />

          {/* Main Financial Chart Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <RevenueChart />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AnalyticsPage;
