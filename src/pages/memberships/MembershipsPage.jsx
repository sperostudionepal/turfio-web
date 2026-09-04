import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import { Award, Search, Plus, Download, ChevronLeft, ChevronRight, CheckCircle2, X, Users, DollarSign, Sparkles } from 'lucide-react';

function MembershipsPage({ activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Top Stat Cards Data
  const stats = [
    {
      title: 'Active VIP Members',
      value: '142 Members',
      change: '+8.4% from last month',
      isUp: true,
      icon: Award,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Platinum Tier',
      value: '28 Members',
      change: '20% discount on all slots',
      isText: true,
      icon: Sparkles,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Gold Tier',
      value: '64 Members',
      change: '15% discount on all slots',
      isText: true,
      icon: Users,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Monthly Recurring Rev',
      value: '$14,200.00',
      change: '+12.1% from last month',
      isUp: true,
      icon: DollarSign,
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  const [memberships] = useState([
    { id: 'MEM-01', plan: 'Platinum VIP', member: 'Bikash Gurung', price: '$150/mo', discount: '20% Off All Slots', status: 'Active', validUntil: '31 Dec 2026' },
    { id: 'MEM-02', plan: 'Gold Member', member: 'Rohan Shrestha', price: '$100/mo', discount: '15% Off All Slots', status: 'Active', validUntil: '15 Nov 2026' },
    { id: 'MEM-03', plan: 'Gold Member', member: 'Nabin Karki', price: '$100/mo', discount: '15% Off All Slots', status: 'Active', validUntil: '20 Oct 2026' },
    { id: 'MEM-04', plan: 'Silver Club', member: 'Aman Tamang', price: '$50/mo', discount: '10% Off Off-Peak', status: 'Active', validUntil: '05 Aug 2026' },
    { id: 'MEM-05', plan: 'Silver Club', member: 'Sujan Magar', price: '$50/mo', discount: '10% Off Off-Peak', status: 'Expired', validUntil: '01 May 2026' },
  ]);

  const filtered = memberships.filter((m) =>
    (m.plan.toLowerCase().includes(searchQuery.toLowerCase()) || m.member.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === 'All' || m.status === statusFilter)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased overflow-hidden select-none">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Arena Memberships</h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Manage VIP plans, subscription tiers, and member discounts.</p>
            </div>
            <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20">
              <Plus size={15} /> <span>New Plan</span>
            </button>
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

          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search plan or member..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-slate-50 border border-slate-100 text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-0.5">
                {['All', 'Active', 'Expired'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      statusFilter === s ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Plan ID</th>
                    <th className="pb-3 pr-4">Membership Plan</th>
                    <th className="pb-3 pr-4">Member Name</th>
                    <th className="pb-3 pr-4">Price</th>
                    <th className="pb-3 pr-4">Perks & Discount</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {paginated.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pr-4 font-bold text-emerald-600 text-sm whitespace-nowrap">{m.id}</td>
                      <td className="py-3.5 pr-4 font-bold text-slate-900 text-sm whitespace-nowrap">{m.plan}</td>
                      <td className="py-3.5 pr-4 font-medium text-slate-700 text-sm whitespace-nowrap">{m.member}</td>
                      <td className="py-3.5 pr-4 font-extrabold text-slate-900 text-sm whitespace-nowrap">{m.price}</td>
                      <td className="py-3.5 pr-4 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full w-fit">{m.discount}</td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${m.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <button className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-900 hover:text-white transition-all">Edit Plan</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MembershipsPage;
