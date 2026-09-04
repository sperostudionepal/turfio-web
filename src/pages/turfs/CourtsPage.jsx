import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Plus,
  Search,
  CircleDot,
  Star,
  CheckCircle2,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  X,
  Building2,
  ArrowUpRight,
  MoreHorizontal,
  Power
} from 'lucide-react';

function CourtsPage({ activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Mock Single Court / Turf Data
  const [courts, setCourts] = useState([
    {
      id: 'CRT-001',
      name: 'Main Pro Pitch',
      type: 'Indoor Arena',
      size: '5v5 (40x20m)',
      surface: 'FIFA Quality Pro Turf',
      lighting: 'LED Floodlights (500 Lux)',
      hourlyRate: 60.0,
      peakRate: 85.0,
      status: 'Available',
      rating: 4.9,
      reviewsCount: 128,
      todayBookings: 8,
      totalHoursBooked: '6.5 hrs',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80',
      amenities: ['Air Conditioned', 'HD Recording', 'Scoreboard', 'Player Bench'],
      location: 'Ground Floor - Main Sector',
    },
    {
      id: 'CRT-002',
      name: 'Standard Practice Pitch',
      type: 'Indoor Arena',
      size: '5v5 (38x18m)',
      surface: 'Monofilament Synthetic Turf',
      lighting: 'High-Bay LED',
      hourlyRate: 50.0,
      peakRate: 70.0,
      status: 'In Use',
      rating: 4.7,
      reviewsCount: 94,
      todayBookings: 6,
      totalHoursBooked: '5.0 hrs',
      image: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=600&auto=format&fit=crop&q=80',
      amenities: ['Scoreboard', 'Player Bench', 'Locker Room'],
      location: 'Ground Floor - Sector B',
    },
    {
      id: 'CRT-003',
      name: 'Rooftop Open Turf',
      type: 'Outdoor Roof Turf',
      size: '7v7 (50x30m)',
      surface: 'All-Weather AstroTurf',
      lighting: 'Stadium Floodlight Poles',
      hourlyRate: 80.0,
      peakRate: 110.0,
      status: 'Maintenance',
      rating: 4.8,
      reviewsCount: 156,
      todayBookings: 0,
      totalHoursBooked: '0 hrs',
      image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&auto=format&fit=crop&q=80',
      amenities: ['Panoramic View', 'Night Floodlights', 'Spectator Stand'],
      location: '3rd Floor Rooftop',
    },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 w-fit">
            <CheckCircle2 size={13} /> Available
          </span>
        );
      case 'In Use':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 w-fit">
            <CircleDot size={13} className="animate-pulse" /> In Use
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 w-fit">
            <Wrench size={13} /> Maintenance
          </span>
        );
      default:
        return null;
    }
  };

  const filteredCourts = courts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.surface.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Top Stat Cards Data (matching Dashboard StatCards format)
  const stats = [
    {
      title: 'Total Active Pitches',
      value: '3 Courts',
      change: '100%',
      period: 'operational capacity',
      icon: Building2,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Today Slot Occupancy',
      value: '82.5%',
      change: '12.4%',
      period: 'from last week',
      icon: CircleDot,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Average Peak Rate',
      value: 'NRs. 2,200',
      change: '8.3%',
      period: 'evening floodlight tariff',
      icon: Star,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Pitch Maintenance Status',
      value: 'Optimal',
      change: '0 Courts',
      period: 'under repair',
      icon: Wrench,
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  const totalPages = Math.max(1, Math.ceil(filteredCourts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourts = filteredCourts.slice(startIndex, startIndex + itemsPerPage);

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
            {/* Scrollable Main Body */}
            <main className="flex-1 overflow-y-auto space-y-4 scrollbar-thin p-4">
              {/* Header Action Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Futsal Courts & Turfs
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                    Manage pitch details, synthetic turf specifications, lighting, and maintenance.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                >
                  <Plus size={15} />
                  <span>Add New Pitch</span>
                </button>
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
                      placeholder="Search court name, ID or turf material..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-white/80 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  {/* Status Filter Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-0.5">
                    {['All', 'Available', 'In Use', 'Maintenance'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                          statusFilter === status
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/80'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Courts Table */}
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full min-w-[900px] text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider whitespace-nowrap">
                        <th className="pb-3 pr-4">Court ID</th>
                        <th className="pb-3 pr-4">Pitch Name & Details</th>
                        <th className="pb-3 pr-4">Surface / Material</th>
                        <th className="pb-3 pr-4">Tariff Range (Day - Peak)</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/60 text-sm whitespace-nowrap">
                      {paginatedCourts.map((court) => (
                        <tr key={court.id} className="hover:bg-white/40 transition-colors whitespace-nowrap">
                          <td className="py-3.5 pr-4 font-bold text-emerald-600 text-sm whitespace-nowrap">{court.id}</td>
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img
                                src={court.image}
                                alt={court.name}
                                className="w-10 h-10 rounded-xl object-cover border border-white shadow-2xs shrink-0"
                              />
                              <div className="whitespace-nowrap">
                                <h4 className="font-bold text-slate-900 text-sm leading-tight whitespace-nowrap">{court.name}</h4>
                                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{court.size} • {court.location}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 pr-4 font-medium text-slate-700 text-sm whitespace-nowrap">{court.surface}</td>
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            <div>
                              <span className="font-extrabold text-slate-900 text-sm block">
                                NRs. {(court.hourlyRate * 25).toLocaleString('en-NP')} – {(court.peakRate * 25).toLocaleString('en-NP')} / hr
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400">
                                Day: NRs. {(court.hourlyRate * 25).toLocaleString('en-NP')} • Peak: NRs. {(court.peakRate * 25).toLocaleString('en-NP')}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 pr-4 whitespace-nowrap">{getStatusBadge(court.status)}</td>
                          <td className="py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                title={court.status === 'Maintenance' ? 'Re-open Court' : 'Mark Under Maintenance'}
                                onClick={() => {
                                  setCourts((prev) =>
                                    prev.map((c) =>
                                      c.id === court.id
                                        ? { ...c, status: c.status === 'Maintenance' ? 'Available' : 'Maintenance' }
                                        : c
                                    )
                                  );
                                }}
                                className={`p-1.5 rounded-xl border transition-all shadow-2xs ${
                                  court.status === 'Maintenance'
                                    ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                              >
                                <Power size={14} />
                              </button>
                              <button
                                title="View Court Specs"
                                onClick={() => setSelectedCourt(court)}
                                className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-2xs"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                title="Edit Court Rate & Pitch Details"
                                onClick={() => setSelectedCourt(court)}
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
                      Showing <strong className="text-slate-900 font-bold">{filteredCourts.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
                      <strong className="text-slate-900 font-bold">{Math.min(startIndex + itemsPerPage, filteredCourts.length)}</strong> of{' '}
                      <strong className="text-slate-900 font-bold">{filteredCourts.length}</strong> entries
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

      {/* Edit / View Court Modal */}
      {selectedCourt && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/80 w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 pb-4 border-b border-slate-100/80 flex items-center justify-between bg-white/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-slate-900 tracking-tight">{selectedCourt.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  Pitch ID: {selectedCourt.id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedCourt.status)}
                <button
                  onClick={() => setSelectedCourt(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors ml-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs">
              <img src={selectedCourt.image} alt={selectedCourt.name} className="w-full h-40 rounded-2xl object-cover border border-white shadow-2xs" />

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100/60 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Standard Rate</span>
                  <p className="font-black text-sm text-slate-900">NRs. {(selectedCourt.hourlyRate * 25).toLocaleString('en-NP')} / hr</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100/60 space-y-1">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Peak Rate</span>
                  <p className="font-black text-sm text-slate-900">NRs. {(selectedCourt.peakRate * 25).toLocaleString('en-NP')} / hr</p>
                </div>
              </div>

              {/* Pitch Spec Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2 shadow-2xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Pitch Size</span>
                  <span className="font-bold text-slate-900">{selectedCourt.size}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Turf Surface</span>
                  <span className="font-bold text-slate-900">{selectedCourt.surface}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Lighting Specs</span>
                  <span className="font-bold text-slate-900">{selectedCourt.lighting}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1">
                <button
                  onClick={() => setSelectedCourt(null)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs text-xs"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Court Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-base text-slate-900">Add New Pitch / Court</h3>
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
                <label className="font-bold text-slate-700 block mb-1">Pitch Name</label>
                <input
                  type="text"
                  placeholder="e.g. Arena Pitch 4"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pitch Size</label>
                  <input
                    type="text"
                    placeholder="5v5 (40x20m)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Standard Rate (NRs.)</label>
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
                  Save Pitch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CourtsPage;
