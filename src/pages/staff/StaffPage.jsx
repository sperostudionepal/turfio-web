import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  UserCheck,
  Search,
  Plus,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Shield,
  Key,
  Users,
  DollarSign,
  Eye,
  Edit2,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';

function StaffPage({ activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Top Stat Cards Data
  const stats = [
    {
      title: 'Active Employees',
      value: '6 Staff',
      change: '100% active on roster',
      isText: true,
      icon: UserCheck,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Arena Managers',
      value: '1 Manager',
      change: 'Shift: Morning (06:00 AM)',
      isText: true,
      icon: ShieldCheck,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Cashiers & Reception',
      value: '2 Staff',
      change: 'POS & Billing operations',
      isText: true,
      icon: Users,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Monthly Payroll',
      value: 'NRs. 69,000',
      change: '6 active employee salaries',
      isText: true,
      icon: DollarSign,
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  // Mock Staff Members Dataset
  const [staffList] = useState([
    {
      id: 'EMP-501',
      name: 'Ramesh Adhikari',
      role: 'Arena Manager',
      phone: '+977 9841001122',
      email: 'ramesh.manager@turfio.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      shift: 'Morning (06:00 AM - 02:00 PM)',
      salary: 'NRs. 35,000',
      joinedDate: '15 Jan 2024',
      status: 'Active',
    },
    {
      id: 'EMP-502',
      name: 'Suman Shrestha',
      role: 'Cashier & Reception',
      phone: '+977 9812233445',
      email: 'suman.cashier@turfio.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80',
      shift: 'Evening (02:00 PM - 10:00 PM)',
      salary: 'NRs. 24,000',
      joinedDate: '01 Mar 2024',
      status: 'Active',
    },
    {
      id: 'EMP-503',
      name: 'Kiran Thapa',
      role: 'Ground Staff',
      phone: '+977 9803344556',
      email: 'kiran.ground@turfio.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      shift: 'Full Day (07:00 AM - 05:00 PM)',
      salary: 'NRs. 20,000',
      joinedDate: '10 May 2024',
      status: 'Active',
    },
    {
      id: 'EMP-504',
      name: 'Sunita Gurung',
      role: 'Cashier & Reception',
      phone: '+977 9845566778',
      email: 'sunita.reception@turfio.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      shift: 'Morning (06:00 AM - 02:00 PM)',
      salary: 'NRs. 24,000',
      joinedDate: '20 Jun 2024',
      status: 'Active',
    },
    {
      id: 'EMP-505',
      name: 'Sunil Gurung',
      role: 'Ground Staff',
      phone: '+977 9865432109',
      email: 'sunil.g@turfio.com',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&auto=format&fit=crop&q=80',
      shift: 'Evening (02:00 PM - 10:00 PM)',
      salary: 'NRs. 20,000',
      joinedDate: '05 Jan 2025',
      status: 'Active',
    },
  ]);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Arena Manager':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 w-fit">
            <ShieldCheck size={13} /> Arena Manager
          </span>
        );
      case 'Cashier & Reception':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 w-fit">
            Cashier
          </span>
        );
      case 'Ground Staff':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 w-fit">
            Ground Staff
          </span>
        );
      case 'Referee':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 w-fit">
            Referee
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    return status === 'Active' ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 w-fit">
        <CheckCircle2 size={13} /> Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 w-fit">
        <Clock size={13} /> On Leave
      </span>
    );
  };

  const filteredStaff = staffList.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phone.includes(searchQuery) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || emp.role.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStaff = filteredStaff.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="flex flex-col h-screen bg-[#f3f5fc] text-slate-900 font-sans antialiased overflow-hidden select-none relative">
      {/* Top Header Bar across full window width */}
      <TopBar />

      {/* Main Body Section: Left Sidebar + Right Content Area */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Soft Ambient Background Orbs */}
        <div className="absolute top-[45%] right-[35%] w-[400px] h-[400px] bg-purple-200/20 rounded-full blur-[160px] pointer-events-none" />

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
                  Staff & Employee Roster
                </h1>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                  Manage arena cashiers, referees, ground staff, shift schedules, and monthly payroll.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 text-xs font-semibold text-slate-700 hover:bg-white transition-all shadow-xs">
                  <Download size={14} className="text-slate-500" />
                  <span>Export Roster</span>
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                >
                  <Plus size={15} />
                  <span>Add Employee</span>
                </button>
              </div>
            </div>

            {/* Top Row: 4 Metric Cards (Glassmorphic Standard) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.title}
                    className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-5 relative flex flex-col justify-between shadow-xs hover:shadow-md hover:bg-white/80 transition-all"
                  >
                    {/* Top row: Icon on left, Title & Value on right */}
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
                    placeholder="Search staff name, ID or phone..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-white/80 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Role Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-0.5">
                  {['All', 'Manager', 'Cashier', 'Ground Staff', 'Referee'].map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setRoleFilter(role);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        roleFilter === role
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/80'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Staff Directory Table */}
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[900px] text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider whitespace-nowrap">
                      <th className="pb-3 pr-4">ID</th>
                      <th className="pb-3 pr-4">Employee</th>
                      <th className="pb-3 pr-4">Contact Info</th>
                      <th className="pb-3 pr-4">Role</th>
                      <th className="pb-3 pr-4">Shift Details</th>
                      <th className="pb-3 pr-4">Salary</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60 text-sm whitespace-nowrap">
                    {paginatedStaff.map((emp) => (
                      <tr key={emp.id} className="hover:bg-white/40 transition-colors whitespace-nowrap">
                        <td className="py-3.5 pr-4 font-bold text-emerald-600 text-sm whitespace-nowrap">{emp.id}</td>
                        <td className="py-3.5 pr-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-9 h-9 rounded-full object-cover border border-white shadow-2xs shrink-0"
                            />
                            <div className="whitespace-nowrap">
                              <h4 className="font-bold text-slate-900 text-sm leading-tight whitespace-nowrap">{emp.name}</h4>
                              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Joined {emp.joinedDate}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 whitespace-nowrap">
                          <div className="text-xs space-y-0.5 whitespace-nowrap">
                            <div className="font-bold text-slate-800 flex items-center gap-1 whitespace-nowrap">
                              <Phone size={11} className="text-slate-400" /> {emp.phone}
                            </div>
                            <div className="text-slate-500 font-medium flex items-center gap-1 whitespace-nowrap">
                              <Mail size={11} className="text-slate-400" /> {emp.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 whitespace-nowrap">{getRoleBadge(emp.role)}</td>
                        <td className="py-3.5 pr-4 font-medium text-slate-600 text-sm whitespace-nowrap">{emp.shift}</td>
                        <td className="py-3.5 pr-4 font-extrabold text-slate-900 text-sm whitespace-nowrap">{emp.salary} / mo</td>
                        <td className="py-3.5 pr-4 whitespace-nowrap">{getStatusBadge(emp.status)}</td>
                        <td className="py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              title="View Employee Profile"
                              onClick={() => setSelectedStaff(emp)}
                              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-2xs"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              title="Edit Employee Details & Shift"
                              onClick={() => setSelectedStaff(emp)}
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3.5 border-t border-slate-100 text-xs text-slate-500 font-medium select-none">
              <div className="flex items-center gap-3">
                <span>
                  Showing <strong className="text-slate-900 font-bold">{filteredStaff.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
                  <strong className="text-slate-900 font-bold">{Math.min(startIndex + itemsPerPage, filteredStaff.length)}</strong> of{' '}
                  <strong className="text-slate-900 font-bold">{filteredStaff.length}</strong> entries
                </span>

                <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                  <span>Rows:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
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
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
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

      {/* Staff Profile Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900">Employee Details</span>
                {getStatusBadge(selectedStaff.status)}
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <img
                  src={selectedStaff.avatar}
                  alt={selectedStaff.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{selectedStaff.name}</h4>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5 space-y-0.5">
                    <p>{selectedStaff.phone}</p>
                    <p>{selectedStaff.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Employee ID</span>
                  <span className="font-bold text-slate-900">{selectedStaff.id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Assigned Role</span>
                  {getRoleBadge(selectedStaff.role)}
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Shift Schedule</span>
                  <span className="font-bold text-slate-900">{selectedStaff.shift}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Monthly Salary</span>
                  <span className="font-black text-slate-900">{selectedStaff.salary}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-medium">Date Joined</span>
                  <span className="font-bold text-slate-900">{selectedStaff.joinedDate}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-base text-slate-900">Add Staff Member</h3>
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
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Suman Shrestha"
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
                  <label className="font-bold text-slate-700 block mb-1">Role</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold">
                    <option>Cashier & Reception</option>
                    <option>Arena Manager</option>
                    <option>Ground Staff</option>
                    <option>Referee</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Shift Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Morning (06:00 AM - 02:00 PM)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
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
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default StaffPage;
