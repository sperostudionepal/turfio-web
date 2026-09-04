import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  FileText,
  Search,
  Download,
  Plus,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Printer,
  Send,
  ArrowUpRight,
  MoreHorizontal,
  Eye
} from 'lucide-react';

function InvoicesPage({ activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Top Stat Cards Data (matching Dashboard StatCards format)
  const stats = [
    {
      title: 'Total Invoiced Amount',
      value: 'NRs. 1,62,800',
      change: '14.2%',
      period: 'from last month',
      icon: FileText,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Paid Invoices',
      value: '912',
      change: '88.4%',
      period: 'collection rate',
      icon: CheckCircle2,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Unpaid & Pending',
      value: '48',
      change: '3.1%',
      period: 'awaiting settlement',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Overdue Invoices',
      value: '12',
      change: '1.2%',
      period: 'requires follow-up',
      icon: AlertCircle,
      iconBg: 'bg-rose-50 text-rose-600',
    },
  ];

  // Mock Invoices Dataset
  const [invoices] = useState([
    {
      invoiceId: 'INV-2026-001',
      bookingId: 'BK-1082',
      customerName: 'Rohan Shrestha',
      customerPhone: '+977 9841234567',
      customerEmail: 'rohan.s@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      issueDate: '10 Jun 2026',
      dueDate: '12 Jun 2026',
      court: 'Main Pro Pitch',
      slot: '09:00 AM - 10:00 AM',
      subtotal: 60.0,
      vat: 0.0,
      totalAmount: 60.0,
      status: 'Paid',
    },
    {
      invoiceId: 'INV-2026-002',
      bookingId: 'BK-1083',
      customerName: 'Aman Tamang',
      customerPhone: '+977 9818765432',
      customerEmail: 'aman.tamang@hotmail.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80',
      issueDate: '11 Jun 2026',
      dueDate: '12 Jun 2026',
      court: 'Standard Pitch',
      slot: '10:00 AM - 11:00 AM',
      subtotal: 50.0,
      vat: 0.0,
      totalAmount: 50.0,
      status: 'Paid',
    },
    {
      invoiceId: 'INV-2026-003',
      bookingId: 'BK-1084',
      customerName: 'Bikash Gurung',
      customerPhone: '+977 9801122334',
      customerEmail: 'bikash.g@yahoo.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      issueDate: '12 Jun 2026',
      dueDate: '12 Jun 2026',
      court: 'Rooftop Open Turf',
      slot: '11:00 AM - 01:00 PM',
      subtotal: 160.0,
      vat: 0.0,
      totalAmount: 160.0,
      status: 'Unpaid',
    },
    {
      invoiceId: 'INV-2026-004',
      bookingId: 'BK-1085',
      customerName: 'Sujan Magar',
      customerPhone: '+977 9865432109',
      customerEmail: 'sujan.magar@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
      issueDate: '09 Jun 2026',
      dueDate: '12 Jun 2026',
      court: 'Main Pro Pitch',
      slot: '01:00 PM - 02:00 PM',
      subtotal: 60.0,
      vat: 0.0,
      totalAmount: 60.0,
      status: 'Paid',
    },
    {
      invoiceId: 'INV-2026-005',
      bookingId: 'BK-1086',
      customerName: 'Nabin Karki',
      customerPhone: '+977 9849988776',
      customerEmail: 'karki.nabin@outlook.com',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&auto=format&fit=crop&q=80',
      issueDate: '11 Jun 2026',
      dueDate: '15 Jun 2026',
      court: 'Standard Pitch',
      slot: '02:00 PM - 04:00 PM',
      subtotal: 100.0,
      vat: 0.0,
      totalAmount: 100.0,
      status: 'Overdue',
    },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 w-fit">
            <CheckCircle2 size={13} /> Paid
          </span>
        );
      case 'Unpaid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 w-fit">
            <Clock size={13} /> Unpaid
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 w-fit">
            <AlertCircle size={13} /> Overdue
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 w-fit">
            <XCircle size={13} /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

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
                    Invoices & Billing
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                    Generate, manage, and track tax invoices and customer receipts.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 text-xs font-semibold text-slate-700 hover:bg-white transition-all shadow-xs">
                    <Download size={14} className="text-slate-500" />
                    <span>Export All</span>
                  </button>

                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                  >
                    <Plus size={15} />
                    <span>Create Invoice</span>
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
                      placeholder="Search Invoice ID, customer, booking..."
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
                    {['All', 'Paid', 'Unpaid', 'Overdue', 'Cancelled'].map((status) => (
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

                {/* Invoices Directory Table */}
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full min-w-[900px] text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider whitespace-nowrap">
                        <th className="pb-3 pr-4">Invoice ID</th>
                        <th className="pb-3 pr-4">Booking ID</th>
                        <th className="pb-3 pr-4">Customer</th>
                        <th className="pb-3 pr-4">Issue Date</th>
                        <th className="pb-3 pr-4">Due Date</th>
                        <th className="pb-3 pr-4">Total Amount</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/60 text-sm whitespace-nowrap">
                      {paginatedInvoices.map((inv) => (
                        <tr key={inv.invoiceId} className="hover:bg-white/40 transition-colors whitespace-nowrap">
                          <td className="py-3.5 pr-4 font-bold text-emerald-600 text-sm whitespace-nowrap">{inv.invoiceId}</td>
                          <td className="py-3.5 pr-4 font-bold text-slate-800 text-sm whitespace-nowrap">{inv.bookingId}</td>
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img
                                src={inv.avatar}
                                alt={inv.customerName}
                                className="w-9 h-9 rounded-full object-cover border border-white shadow-2xs shrink-0"
                              />
                              <div className="whitespace-nowrap">
                                <h4 className="font-bold text-slate-900 text-sm leading-tight whitespace-nowrap">{inv.customerName}</h4>
                                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{inv.customerPhone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 pr-4 font-medium text-slate-600 text-sm whitespace-nowrap">{inv.issueDate}</td>
                          <td className="py-3.5 pr-4 font-medium text-slate-600 text-sm whitespace-nowrap">{inv.dueDate}</td>
                          <td className="py-3.5 pr-4 font-extrabold text-slate-900 text-sm whitespace-nowrap">NRs. {(inv.totalAmount * 132).toLocaleString('en-NP')}</td>
                          <td className="py-3.5 pr-4 whitespace-nowrap">{getStatusBadge(inv.status)}</td>
                          <td className="py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                title={`Print Invoice ${inv.invoiceId}`}
                                onClick={() => alert(`Printing Invoice ${inv.invoiceId}...`)}
                                className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-2xs"
                              >
                                <Printer size={14} />
                              </button>
                              <button
                                title={`Download PDF Invoice ${inv.invoiceId}`}
                                onClick={() => alert(`Downloading PDF for Invoice ${inv.invoiceId}...`)}
                                className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-2xs"
                              >
                                <Download size={14} />
                              </button>
                              <button
                                title="View Full Invoice Details"
                                onClick={() => setSelectedInvoice(inv)}
                                className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-2xs"
                              >
                                <Eye size={14} />
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
                      Showing <strong className="text-slate-900 font-bold">{filteredInvoices.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
                      <strong className="text-slate-900 font-bold">{Math.min(startIndex + itemsPerPage, filteredInvoices.length)}</strong> of{' '}
                      <strong className="text-slate-900 font-bold">{filteredInvoices.length}</strong> entries
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

      {/* View Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/80 w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 pb-4 border-b border-slate-100/80 flex items-center justify-between bg-white/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 tracking-tight">{selectedInvoice.invoiceId}</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Ref: {selectedInvoice.bookingId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedInvoice.status)}
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors ml-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs">
              {/* Arena Info & Bill To */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div>
                  <h4 className="font-black text-xs text-emerald-950 uppercase tracking-wider">TURFIO ARENA</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Kathmandu, Nepal</p>
                  <p className="text-[11px] text-slate-500 font-medium">+977 1-4200000</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Billed To</span>
                  <h5 className="font-extrabold text-slate-900 text-sm mt-0.5">{selectedInvoice.customerName}</h5>
                  <p className="text-[11px] text-slate-500 font-medium">{selectedInvoice.customerPhone}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{selectedInvoice.customerEmail}</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3.5">Description</th>
                      <th className="py-2.5 px-3.5">Slot</th>
                      <th className="py-2.5 px-3.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60 text-xs">
                    <tr>
                      <td className="py-3 px-3.5 font-bold text-slate-900">{selectedInvoice.court}</td>
                      <td className="py-3 px-3.5 text-slate-500 font-medium">{selectedInvoice.slot}</td>
                      <td className="py-3 px-3.5 text-right font-black text-slate-900">
                        NRs. {(selectedInvoice.subtotal * 132).toLocaleString('en-NP')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Invoice Totals */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2 shadow-2xs">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-bold text-slate-900">NRs. {(selectedInvoice.subtotal * 132).toLocaleString('en-NP')}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span className="font-semibold">VAT (0%)</span>
                  <span className="font-bold text-slate-900">NRs. 0</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-extrabold text-slate-900">
                  <span>Total Amount Due</span>
                  <span className="font-black text-emerald-600 text-base">
                    NRs. {(selectedInvoice.totalAmount * 132).toLocaleString('en-NP')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex items-center justify-between gap-2">
                <button
                  onClick={() => alert(`Printing Invoice ${selectedInvoice.invoiceId}...`)}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all text-xs"
                >
                  <Printer size={14} />
                  <span>Print</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Invoice sent to ${selectedInvoice.customerEmail}`)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all text-xs"
                  >
                    <Send size={14} />
                    <span>Send PDF</span>
                  </button>
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-base text-slate-900">Generate New Invoice</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsCreateModalOpen(false);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Booking</label>
                <select className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option>BK-1082 (Rohan Shrestha - $60.00)</option>
                  <option>BK-1083 (Aman Tamang - $50.00)</option>
                  <option>BK-1084 (Bikash Gurung - $160.00)</option>
                  <option>BK-1085 (Sujan Magar - $60.00)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Issue Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tax / VAT (%)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  defaultValue="0.00"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default InvoicesPage;
