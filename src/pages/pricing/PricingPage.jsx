import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Tag,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
  Edit2
} from 'lucide-react';

function PricingPage({ activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dayTypeFilter, setDayTypeFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Top Stat Cards Data (matching Dashboard StatCards format)
  const stats = [
    {
      title: 'Active Pricing Tariffs',
      value: '7 Tariffs',
      change: '100%',
      period: 'configured for arena',
      icon: Tag,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Peak Hourly Rate',
      value: 'NRs. 2,125 / hr',
      change: '35%',
      period: 'weekend prime floodlight',
      icon: Sparkles,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Off-Peak Saver Rate',
      value: 'NRs. 1,125 / hr',
      change: '25%',
      period: 'morning 06:00 - 10:00 AM',
      icon: Clock,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Average Slot Rate',
      value: 'NRs. 1,560 / hr',
      change: '5.4%',
      period: 'seasonal adjustment',
      icon: TrendingUp,
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  // Mock Pricing Rates Dataset for Single Futsal Arena
  const [pricingRates] = useState([
    {
      id: 'RATE-101',
      title: 'Morning Saver',
      timeSlot: '06:00 AM - 10:00 AM',
      dayType: 'Weekdays',
      hourlyRate: 45.0,
      peakStatus: 'Off-Peak',
      description: 'Budget-friendly early morning hourly slot for regular teams.',
      status: 'Active',
    },
    {
      id: 'RATE-102',
      title: 'Standard Afternoon',
      timeSlot: '10:00 AM - 04:00 PM',
      dayType: 'Weekdays',
      hourlyRate: 55.0,
      peakStatus: 'Standard',
      description: 'Regular weekday rate for afternoon practice sessions.',
      status: 'Active',
    },
    {
      id: 'RATE-103',
      title: 'Prime Evening Peak',
      timeSlot: '04:00 PM - 09:00 PM',
      dayType: 'Weekdays',
      hourlyRate: 75.0,
      peakStatus: 'Peak',
      description: 'High demand evening floodlight slot for competitive matches.',
      status: 'Active',
    },
    {
      id: 'RATE-104',
      title: 'Late Night Special',
      timeSlot: '09:00 PM - 11:00 PM',
      dayType: 'Weekdays',
      hourlyRate: 50.0,
      peakStatus: 'Off-Peak',
      description: 'Late night discounted rate for night matches.',
      status: 'Active',
    },
    {
      id: 'RATE-105',
      title: 'Weekend Morning',
      timeSlot: '06:00 AM - 12:00 PM',
      dayType: 'Weekends',
      hourlyRate: 65.0,
      peakStatus: 'Standard',
      description: 'Popular Saturday & Sunday morning tournament rate.',
      status: 'Active',
    },
  ]);


  const getStatusBadge = (status) => {
    return status === 'Active' ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 w-fit">
        <CheckCircle2 size={13} /> Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 w-fit">
        Inactive
      </span>
    );
  };

  const filteredRates = pricingRates.filter((rate) => {
    const matchesSearch =
      rate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rate.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rate.timeSlot.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDay = dayTypeFilter === 'All' || rate.dayType === dayTypeFilter;
    return matchesSearch && matchesDay;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRates.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRates = filteredRates.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="flex flex-col h-screen bg-[#f3f5fc] text-slate-900 font-sans antialiased overflow-hidden select-none relative">
        {/* Top Header Bar across full window width */}
        <TopBar />

        {/* Main Body Section: Left Sidebar + Right Content Area */}
        <div className="flex flex-1 min-h-0 relative">
          {/* Soft Ambient Background Orbs */}
          <div className="absolute top-[45%] right-[35%] w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-[160px] pointer-events-none" />

          {/* Floating Left Glass Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Floating Right Main Glass Container */}
          <div className="flex-1 flex flex-col min-w-0 backdrop-blur-md overflow-hidden relative z-10">
            {/* Scrollable Main Area */}
            <main className="flex-1 overflow-y-auto space-y-4 scrollbar-thin p-4">
              {/* Header Action Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Arena Pricing & Rates
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                    Configure hourly rates, peak time slots, weekend tariffs, and special pricing.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 text-xs font-semibold text-slate-700 hover:bg-white transition-all shadow-xs">
                    <Download size={14} className="text-slate-500" />
                    <span>Export Rates</span>
                  </button>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                  >
                    <Plus size={15} />
                    <span>Add New Rate</span>
                  </button>
                </div>
              </div>

              {/* Top Row: 4 Metric Cards (Identical to Dashboard StatCards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.title}
                      className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-5 relative flex flex-col justify-between shadow-xs hover:shadow-md hover:bg-white/80 transition-all"
                    >
                      {/* Top row: Icon on left, Title & Value on right, Options menu top right */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3.5 rounded-2xl shrink-0 ${stat.iconBg}`}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <span className="text-[12px] font-semibold text-slate-400 block leading-tight">
                              {stat.title}
                            </span>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-1">
                              {stat.value}
                            </h3>
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1 transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>

                      {/* Bottom row: Percentage badge & period */}
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-emerald-600 bg-emerald-50/80 px-1.5 py-1 rounded-md flex items-center gap-0.5 font-bold">
                          <ArrowUpRight size={12} /> {stat.change}
                        </span>
                        <span className="text-slate-400 font-medium">{stat.period}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Unified Card Container: Search, Filter & Table with Glassmorphism */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-5 space-y-4 shadow-xs hover:shadow-md transition-all">
                {/* Filter & Search Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  {/* Search Box */}
                  <div className="relative w-full md:w-80">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search rate title, slot, or day..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-white/80 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  {/* Day Type Filter Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-0.5">
                    {['All', 'Weekdays', 'Weekends', 'Holidays'].map((dayType) => (
                      <button
                        key={dayType}
                        onClick={() => {
                          setDayTypeFilter(dayType);
                          setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                          dayTypeFilter === dayType
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/80'
                        }`}
                      >
                        {dayType}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing Rates Table */}
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full min-w-[900px] text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider whitespace-nowrap">
                        <th className="pb-3 pr-4">Tariff ID</th>
                        <th className="pb-3 pr-4">Tariff Title & Applies To</th>
                        <th className="pb-3 pr-4">Time Slot Hours</th>
                        <th className="pb-3 pr-4">Day Classification</th>
                        <th className="pb-3 pr-4">Hourly Rate</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/60 text-sm whitespace-nowrap">
                      {paginatedRates.map((rate) => (
                        <tr key={rate.id} className="hover:bg-white/40 transition-colors whitespace-nowrap">
                          <td className="py-3.5 pr-4 font-bold text-emerald-600 text-sm whitespace-nowrap">{rate.id}</td>
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            <div className="whitespace-nowrap">
                              <h4 className="font-bold text-slate-900 text-sm leading-tight whitespace-nowrap">{rate.title}</h4>
                              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{rate.appliesTo}</span>
                            </div>
                          </td>
                          <td className="py-3.5 pr-4 font-bold text-slate-800 text-xs whitespace-nowrap">{rate.timeSlot}</td>
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100/80 text-slate-700">
                              {rate.dayType}
                            </span>
                          </td>
                          <td className="py-3.5 pr-4 font-extrabold text-slate-900 text-sm whitespace-nowrap">NRs. {(rate.hourlyRate * 25).toLocaleString('en-NP')} / hr</td>
                          <td className="py-3.5 pr-4 whitespace-nowrap">{getStatusBadge(rate.status)}</td>
                          <td className="py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                title="View Tariff Summary"
                                onClick={() => setSelectedRate(rate)}
                                className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-2xs"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                title="Edit Tariff Details"
                                onClick={() => setSelectedRate(rate)}
                                className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-2xs"
                              >
                                <Edit2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Emerald Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3.5 border-t border-slate-100/60 text-xs text-slate-500 font-medium select-none">
                  <div className="flex items-center gap-3">
                    <span>
                      Showing <strong className="text-slate-900 font-bold">{filteredRates.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
                      <strong className="text-slate-900 font-bold">{Math.min(startIndex + itemsPerPage, filteredRates.length)}</strong> of{' '}
                      <strong className="text-slate-900 font-bold">{filteredRates.length}</strong> entries
                    </span>

                    <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                      <span>Rows:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-2 py-1 rounded-lg bg-white/80 border border-slate-200 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:border-slate-200 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={15} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          currentPage === page
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:border-slate-200 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* View / Edit Rate Modal */}
      {selectedRate && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/80 w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 pb-4 border-b border-slate-100/80 flex items-center justify-between bg-white/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-slate-900 tracking-tight">{selectedRate.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  Tariff ID: {selectedRate.id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedRate.status)}
                <button
                  onClick={() => setSelectedRate(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors ml-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSelectedRate(null);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tariff Title</label>
                <input
                  type="text"
                  defaultValue={selectedRate.title}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Day Category</label>
                  <select
                    defaultValue={selectedRate.dayType}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold"
                  >
                    <option>Weekdays</option>
                    <option>Weekends</option>
                    <option>Holidays</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hourly Price (NRs.)</label>
                  <input
                    type="number"
                    defaultValue={selectedRate.hourlyRate * 25}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-black"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRate(null)}
                  className="px-4 py-2 rounded-xl border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  Save Rate Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Rate Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-base text-slate-900">Add Pricing Tariff</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsAddModalOpen(false);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tariff Title</label>
                <input
                  type="text"
                  placeholder="e.g. Early Bird Special"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Day Category</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option>Weekdays</option>
                    <option>Weekends</option>
                    <option>Holidays</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    placeholder="60.00"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  Save Tariff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default PricingPage;
