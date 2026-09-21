import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  AlertCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  UserCheck,
  DollarSign,
  Calendar,
  Eye,
  ArrowUpRight,
  MoreHorizontal,
  MessageSquare
} from 'lucide-react';
import turfService from '../../services/turfService';
import { getTodayNepalString } from '../../utils/dateTime';

function CustomersPage({ user, activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (!user?.id) return;
    turfService.getOwnerBookings().then((bookings) => {
      const grouped = new Map();
      bookings.forEach((booking) => {
        const customer = booking.user;
        if (!customer?._id) return;
        const existing = grouped.get(customer._id) || {
          id: `CUS-${customer._id.slice(-6).toUpperCase()}`,
          name: [customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Customer',
          phone: customer.phone || '—',
          email: customer.email || '—',
          avatar: customer.profilePicture || '/logo.png',
          membership: 'Registered Player',
          tierBg: 'bg-emerald-50 text-emerald-700',
          totalBookings: 0,
          totalSpend: 0,
          lastActive: '',
          status: 'Active',
        };
        existing.totalBookings += 1;
        existing.totalSpend += Number(booking.totalPaidAmount || 0);
        // Bookings arrive newest first; keep the most recent date.
        if (booking.dateStr && !(existing.lastActive > booking.dateStr)) existing.lastActive = booking.dateStr;
        grouped.set(customer._id, existing);
      });
      setCustomers([...grouped.values()]);
    }).catch(() => setCustomers([]));
  }, [user?.id]);

  // Top Stat Cards Data (matching Dashboard StatCards format)

  // Real customers are loaded from bookings; keep the old fixture out of the rendered state.
  const [customers, setCustomers] = useState([]);
  // Stat cards are worked out from the owner's real customers.
  const formatNpr = (amount) => `NRs. ${Math.round(amount).toLocaleString('en-IN')}`;
  const percentOf = (count) => (customers.length ? Math.round((count / customers.length) * 100) : 0);
  const thisMonth = getTodayNepalString().slice(0, 7);
  const totalBookings = customers.reduce((sum, c) => sum + c.totalBookings, 0);
  const totalSpend = customers.reduce((sum, c) => sum + c.totalSpend, 0);
  const returningCount = customers.filter((c) => c.totalBookings > 1).length;
  const activeThisMonth = customers.filter((c) => String(c.lastActive).startsWith(thisMonth)).length;

  const stats = [
    {
      title: 'Total Customers',
      value: customers.length.toLocaleString('en-IN'),
      change: totalBookings.toLocaleString('en-IN'),
      period: totalBookings === 1 ? 'booking' : 'bookings',
      icon: Users,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Returning Players',
      value: returningCount.toLocaleString('en-IN'),
      change: `${percentOf(returningCount)}%`,
      period: 'booked more than once',
      icon: Award,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Active This Month',
      value: activeThisMonth.toLocaleString('en-IN'),
      change: `${percentOf(activeThisMonth)}%`,
      period: 'played this month',
      icon: UserCheck,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Avg Customer Spend',
      value: formatNpr(customers.length ? totalSpend / customers.length : 0),
      change: formatNpr(totalSpend),
      period: 'collected in total',
      icon: DollarSign,
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'All' || c.membership.includes(tierFilter);
    return matchesSearch && matchesTier;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

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
                    Customer & Player Directory
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                    Manage registered players, VIP membership tiers, and booking history.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 text-xs font-semibold text-slate-700 hover:bg-white transition-all shadow-xs">
                    <Download size={14} className="text-slate-500" />
                    <span>Export List</span>
                  </button>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                  >
                    <Plus size={15} />
                    <span>Add Customer</span>
                  </button>
                </div>
              </div>

              {/* Top Row: 4 Metric Cards (Identical to Dashboard StatCards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  const liveValue = stat.title === 'Total Registered Players'
                    ? customers.length.toLocaleString()
                    : stat.title === 'Active Recurrent Players'
                    ? customers.filter((customer) => customer.totalBookings > 1).length.toLocaleString()
                    : stat.title === 'Avg Customer Spend'
                    ? `NRs. ${customers.length ? Math.round(customers.reduce((sum, customer) => sum + customer.totalSpend, 0) / customers.length).toLocaleString('en-NP') : '0'}`
                    : customers.filter((customer) => customer.membership.includes('Platinum')).length.toLocaleString();
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
                              {liveValue}
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
                      placeholder="Search customer name, ID, phone..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-white/80 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  {/* Tier Filter Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-0.5">
                    {['All', 'Platinum', 'Gold', 'Silver', 'Regular'].map((tier) => (
                      <button
                        key={tier}
                        onClick={() => {
                          setTierFilter(tier);
                          setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                          tierFilter === tier
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/80'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customers Directory Table */}
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full min-w-[900px] text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider whitespace-nowrap">
                        <th className="pb-3 pr-4">Customer ID</th>
                        <th className="pb-3 pr-4">Player Details</th>
                        <th className="pb-3 pr-4">Contact Info</th>
                        <th className="pb-3 pr-4">Tier Status</th>
                        <th className="pb-3 pr-4">Total Bookings</th>
                        <th className="pb-3 pr-4">Lifetime Spend</th>
                        <th className="pb-3 pr-4">Last Active</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/60 text-sm whitespace-nowrap">
                      {paginatedCustomers.map((c) => (
                        <tr key={c.id} className="hover:bg-white/40 transition-colors whitespace-nowrap">
                          <td className="py-3.5 pr-4 font-bold text-emerald-600 text-sm whitespace-nowrap">{c.id}</td>
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img
                                src={c.avatar}
                                alt={c.name}
                                className="w-9 h-9 rounded-full object-cover border border-white shadow-2xs shrink-0"
                              />
                              <div className="whitespace-nowrap">
                                <h4 className="font-bold text-slate-900 text-sm leading-tight whitespace-nowrap">{c.name}</h4>
                                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{c.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 pr-4 text-xs font-medium text-slate-600 whitespace-nowrap">{c.email}</td>
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${c.tierBg}`}>
                              {c.membership}
                            </span>
                          </td>
                          <td className="py-3.5 pr-4 font-bold text-slate-900 text-sm whitespace-nowrap">{c.totalBookings} matches</td>
                          <td className="py-3.5 pr-4 font-extrabold text-slate-900 text-sm whitespace-nowrap">NRs. {Number(c.totalSpend || 0).toLocaleString('en-NP')}</td>
                          <td className="py-3.5 pr-4 font-medium text-slate-500 text-xs whitespace-nowrap">{c.lastActive || '—'}</td>
                          <td className="py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`tel:${c.phone}`}
                                title={`Call ${c.name}`}
                                className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-2xs"
                              >
                                <Phone size={14} />
                              </a>
                              <a
                                href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                title={`Message ${c.name} on WhatsApp`}
                                className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-2xs"
                              >
                                <MessageSquare size={14} />
                              </a>
                              <button
                                onClick={() => setSelectedCustomer(c)}
                                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-2xs"
                              >
                                View Profile
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
                      Showing <strong className="text-slate-900 font-bold">{filteredCustomers.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
                      <strong className="text-slate-900 font-bold">{Math.min(startIndex + itemsPerPage, filteredCustomers.length)}</strong> of{' '}
                      <strong className="text-slate-900 font-bold">{filteredCustomers.length}</strong> entries
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

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/80 w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 pb-4 border-b border-slate-100/80 flex items-center justify-between bg-white/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-slate-900 tracking-tight">Player Profile</span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  ID: {selectedCustomer.id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${selectedCustomer.tierBg}`}>
                  {selectedCustomer.membership}
                </span>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors ml-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs">
              {/* Customer Profile Card */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{selectedCustomer.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">{selectedCustomer.phone}</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">{selectedCustomer.email}</p>
                  </div>
                </div>
              </div>

              {/* Player Stats Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    <Calendar size={13} /> Matches Booked
                  </div>
                  <p className="font-extrabold text-sm text-slate-900">{selectedCustomer.totalBookings} Matches</p>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                    <Award size={13} /> Tier Status
                  </div>
                  <p className="font-extrabold text-sm text-slate-900">{selectedCustomer.membership}</p>
                </div>
              </div>

              {/* Lifetime Spend Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2 shadow-2xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Last Active</span>
                  <span className="font-bold text-slate-900">{selectedCustomer.lastActive || '—'}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm">
                  <span className="font-extrabold text-slate-900">Lifetime Spend</span>
                  <span className="font-black text-emerald-600 text-base">
                    NRs. {Number(selectedCustomer.totalSpend || 0).toLocaleString('en-NP')}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-1">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs text-xs"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-base text-slate-900">Add Registered Player</h3>
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
                <label className="font-bold text-slate-700 block mb-1">Player Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rohan Shrestha"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+977 98..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Membership Tier</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold">
                    <option>Regular Player</option>
                    <option>Silver Club</option>
                    <option>Gold Member</option>
                    <option>VIP Platinum</option>
                  </select>
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
                  Save Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomersPage;
