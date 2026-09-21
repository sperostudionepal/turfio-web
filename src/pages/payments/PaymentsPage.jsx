import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Search,
  Download,
  Plus,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  RefreshCw,
  Wallet
} from 'lucide-react';

function PaymentsPage({ activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Top Stat Cards Data (matching Dashboard StatCards format)
  const stats = [
    {
      title: 'Total Collections',
      value: 'NRs. 1,46,125',
      change: '16.8%',
      period: 'from last month',
      icon: DollarSign,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'eSewa Digital Payments',
      value: 'NRs. 80,250',
      change: '54.9%',
      period: 'of total collections',
      icon: Wallet,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Pending Settlements',
      value: 'NRs. 31,250',
      change: '12%',
      period: 'awaiting cash clearing',
      icon: AlertCircle,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Refunded / Disputes',
      value: 'NRs. 8,000',
      change: '0.5%',
      period: 'from last month',
      icon: RefreshCw,
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  // Mock Payments Dataset
  const [payments] = useState([
    {
      txId: 'TXN-9401',
      refId: 'ESW-991823',
      bookingId: 'BK-1082',
      customerName: 'Rohan Shrestha',
      customerPhone: '+977 9841234567',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      date: '12 Jun 2026, 09:15 AM',
      method: 'eSewa',
      methodBg: 'bg-emerald-600 text-white',
      amount: 60.0,
      fee: 1.2,
      netAmount: 58.8,
      status: 'Completed',
    },
    {
      txId: 'TXN-9402',
      refId: 'KLT-448102',
      bookingId: 'BK-1083',
      customerName: 'Aman Tamang',
      customerPhone: '+977 9818765432',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80',
      date: '12 Jun 2026, 10:05 AM',
      method: 'Khalti',
      methodBg: 'bg-purple-700 text-white',
      amount: 50.0,
      fee: 1.0,
      netAmount: 49.0,
      status: 'Completed',
    },
    {
      txId: 'TXN-9403',
      refId: 'POS-774129',
      bookingId: 'BK-1084',
      customerName: 'Bikash Gurung',
      customerPhone: '+977 9801122334',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      date: '12 Jun 2026, 11:20 AM',
      method: 'VISA Card',
      methodBg: 'bg-blue-600 text-white font-serif italic',
      amount: 160.0,
      fee: 4.8,
      netAmount: 155.2,
      status: 'Completed',
    },
    {
      txId: 'TXN-9404',
      refId: 'ESW-112394',
      bookingId: 'BK-1085',
      customerName: 'Sujan Magar',
      customerPhone: '+977 9865432109',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
      date: '12 Jun 2026, 01:10 PM',
      method: 'eSewa',
      methodBg: 'bg-emerald-600 text-white',
      amount: 60.0,
      fee: 1.2,
      netAmount: 58.8,
      status: 'Completed',
    },
    {
      txId: 'TXN-9405',
      bookingId: 'BK-1086',
      customerName: 'Nabin Karki',
      customerPhone: '+977 9849988776',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&auto=format&fit=crop&q=80',
      date: '12 Jun 2026, 02:45 PM',
      method: 'Cash',
      methodBg: 'bg-slate-700 text-white',
      amount: 100.0,
      fee: 0.0,
      netAmount: 100.0,
      status: 'Pending',
    },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 w-fit">
            <CheckCircle2 size={13} /> Completed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 w-fit">
            <AlertCircle size={13} /> Pending
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 w-fit">
            <RefreshCw size={13} /> Refunded
          </span>
        );
      default:
        return null;
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.txId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased overflow-hidden select-none">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
          {/* Header Action Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Payments & Transactions
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                Track revenue, payment gateways, payouts, and transaction logs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2.5 rounded-full bg-white border border-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                <Download size={14} />
                <span>Export Statement</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20"
              >
                <Plus size={15} />
                <span>Record Payment</span>
              </button>
            </div>
          </div>

          {/* Top Row: 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                      <Icon size={18} />
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-slate-400 block">{stat.title}</span>
                    <h3 className="text-xl font-black text-slate-900 mt-0.5">{stat.value}</h3>

                    <div className="flex items-center gap-1 mt-1 text-[10px] font-bold">
                      {stat.isText ? (
                        <span className="text-slate-400 font-medium">{stat.change}</span>
                      ) : (
                        <>
                          <span className={stat.isUp ? 'text-emerald-600' : 'text-rose-600'}>
                            {stat.isUp ? '↗' : '↘'} {stat.change.split(' ')[0]}
                          </span>
                          <span className="text-slate-400 font-medium">{stat.change.split(' ').slice(1).join(' ')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unified Card Container: Search, Filter & Table */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4">
            {/* Filter & Search Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search TXN ID, Booking ID, customer..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-slate-50 border border-slate-100 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-0.5">
                {['All', 'Completed', 'Pending', 'Refunded'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      statusFilter === status
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Payments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Transaction ID</th>
                    <th className="pb-3 pr-4">Booking ID</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Date & Time</th>
                    <th className="pb-3 pr-4">Method</th>
                    <th className="pb-3 pr-4">Gross Amount</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {paginatedPayments.map((p) => (
                    <tr key={p.txId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pr-4 font-bold text-emerald-600 text-sm whitespace-nowrap">{p.txId}</td>
                      <td className="py-3.5 pr-4 font-bold text-slate-800 text-sm whitespace-nowrap">{p.bookingId}</td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.avatar}
                            alt={p.customerName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm leading-tight">{p.customerName}</h4>
                            <span className="text-xs text-slate-400 font-medium">{p.customerPhone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-medium text-slate-600 text-sm whitespace-nowrap">{p.date}</td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 ${p.methodBg}`}>
                          {p.method}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 font-extrabold text-slate-900 text-sm whitespace-nowrap">NRs. {(p.amount * 25).toLocaleString('en-NP')}</td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">{getStatusBadge(p.status)}</td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedPayment(p)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-xs"
                        >
                          Receipt
                        </button>
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
                  Showing <strong className="text-slate-900 font-bold">{filteredPayments.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
                  <strong className="text-slate-900 font-bold">{Math.min(startIndex + itemsPerPage, filteredPayments.length)}</strong> of{' '}
                  <strong className="text-slate-900 font-bold">{filteredPayments.length}</strong> entries
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

      {/* Payment Receipt Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900">Receipt {selectedPayment.txId}</span>
                {getStatusBadge(selectedPayment.status)}
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <img
                  src={selectedPayment.avatar}
                  alt={selectedPayment.customerName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{selectedPayment.customerName}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{selectedPayment.customerPhone}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Associated Booking</span>
                  <span className="font-bold text-emerald-600">{selectedPayment.bookingId}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Payment Gateway / Method</span>
                  <span className="font-bold text-slate-900">{selectedPayment.method}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Transaction Date</span>
                  <span className="font-bold text-slate-900">{selectedPayment.date}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Gross Amount</span>
                  <span className="font-black text-slate-900">NRs. {(selectedPayment.amount * 25).toLocaleString('en-NP')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Gateway Service Fee</span>
                  <span className="font-bold text-slate-600">NRs. {(selectedPayment.fee * 25).toLocaleString('en-NP')}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-medium">Net Arena Revenue</span>
                  <span className="font-black text-emerald-600">NRs. {(selectedPayment.netAmount * 25).toLocaleString('en-NP')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Manual Payment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-base text-slate-900">Record Payment</h3>
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
                <label className="font-bold text-slate-700 block mb-1">Booking ID</label>
                <input
                  type="text"
                  placeholder="e.g. BK-1089"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                    <option>eSewa</option>
                    <option>Khalti</option>
                    <option>VISA Card</option>
                    <option>Cash</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Amount (NRs.)</label>
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
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsPage;
