import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Search,
  Download,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  RefreshCw,
  Wallet,
  Receipt,
} from 'lucide-react';
import turfService from '../../services/turfService';
import { formatNepalDateTimeParts } from '../../utils/dateTime';

const METHOD_BADGE = {
  eSewa: 'bg-emerald-600 text-white',
  Khalti: 'bg-purple-700 text-white',
  Fonepay: 'bg-sky-600 text-white',
  'Card/Other Wallets': 'bg-blue-600 text-white',
  'Pay at Venue': 'bg-slate-700 text-white',
};

const formatNpr = (amount) => `NRs. ${Math.round(Number(amount) || 0).toLocaleString('en-NP')}`;

function PaymentsPage({ activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState({ totalCollected: 0, byMethod: {}, pendingSettlement: 0 });
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => {
    turfService
      .getOwnerPayments()
      .then((result) => {
        setPayments(result?.payments || []);
        setPaymentStats(result?.stats || { totalCollected: 0, byMethod: {}, pendingSettlement: 0 });
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  const onlinePayments = paymentStats.totalCollected - (paymentStats.byMethod['Pay at Venue'] || 0);

  const stats = [
    {
      title: 'Total Collections',
      value: formatNpr(paymentStats.totalCollected),
      icon: DollarSign,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Online Payments',
      value: formatNpr(onlinePayments),
      icon: Wallet,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Pending Settlements',
      value: formatNpr(paymentStats.pendingSettlement),
      icon: AlertCircle,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Total Transactions',
      value: payments.length.toLocaleString('en-IN'),
      icon: Receipt,
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  const getStatusBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 w-fit">
            <CheckCircle2 size={13} /> Completed
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
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (p.paymentId || '').toLowerCase().includes(query) ||
      (p.bookingId || '').toLowerCase().includes(query) ||
      (p.customer?.name || '').toLowerCase().includes(query) ||
      (p.customer?.phone || '').includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased overflow-hidden select-none">
      {/* Top Header Bar across full window width */}
      <TopBar />

      {/* Main Body Section: Left Sidebar + Right Content Area */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

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
            </div>
          </div>

          {status === 'error' && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl p-4">
              Couldn't load payments right now. Try refreshing the page.
            </div>
          )}

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
                  placeholder="Search Payment ID, Booking ID, customer..."
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
                {['All', 'Completed', 'Refunded'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setStatusFilter(option);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      statusFilter === option
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Payments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Payment ID</th>
                    <th className="pb-3 pr-4">Booking ID</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Date & Time</th>
                    <th className="pb-3 pr-4">Method</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {status === 'loading' && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-xs font-semibold text-slate-400">
                        Loading payments…
                      </td>
                    </tr>
                  )}
                  {status === 'ready' && paginatedPayments.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-xs font-semibold text-slate-400">
                        No payments found.
                      </td>
                    </tr>
                  )}
                  {paginatedPayments.map((p) => (
                    <tr key={p.paymentId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pr-4 font-bold text-emerald-600 text-sm whitespace-nowrap">{p.paymentId}</td>
                      <td className="py-3.5 pr-4 font-bold text-slate-800 text-sm whitespace-nowrap">{p.bookingId}</td>
                      <td className="py-3.5 pr-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-tight">{p.customer?.name || 'Customer'}</h4>
                          <span className="text-xs text-slate-400 font-medium">{p.customer?.phone || '—'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        {(() => {
                          const { date, time } = formatNepalDateTimeParts(p.paidAt);
                          return (
                            <div className="leading-tight">
                              <p className="font-medium text-slate-600 text-sm">{date}</p>
                              <p className="text-xs text-slate-400 font-medium">{time}</p>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 ${METHOD_BADGE[p.method] || 'bg-slate-200 text-slate-700'}`}>
                          {p.method}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 font-extrabold text-slate-900 text-sm whitespace-nowrap">{formatNpr(p.amount)}</td>
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
      </div>

      {/* Payment Receipt Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900">Receipt {selectedPayment.paymentId}</span>
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
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{selectedPayment.customer?.name || 'Customer'}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{selectedPayment.customer?.phone || '—'}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Associated Booking</span>
                  <span className="font-bold text-emerald-600">{selectedPayment.bookingId}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Payment Method</span>
                  <span className="font-bold text-slate-900">{selectedPayment.method}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Transaction Date</span>
                  <span className="font-bold text-slate-900">
                    {(() => {
                      const { date, time } = formatNepalDateTimeParts(selectedPayment.paidAt);
                      return `${date}, ${time}`;
                    })()}
                  </span>
                </div>
                {selectedPayment.transactionId && (
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Gateway Transaction ID</span>
                    <span className="font-bold text-slate-900">{selectedPayment.transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-medium">Amount</span>
                  <span className="font-black text-emerald-600">{formatNpr(selectedPayment.amount)}</span>
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
    </div>
  );
}

export default PaymentsPage;
