import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  FileText,
  TrendingUp,
  UserCheck,
  Users,
  Settings,
  Search,
  Calendar,
  ChevronDown,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  X
} from 'lucide-react';

function ActivityLogsPage({ activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [userFilter, setUserFilter] = useState('All Users');
  const [selectedLog, setSelectedLog] = useState(null);

  // Top Stat Cards Data
  const stats = [
    {
      title: 'Total Activities',
      value: '1,248',
      change: 'All time activities',
      isText: true,
      icon: FileText,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      title: "Today's Activities",
      value: '56',
      change: '12.5% from yesterday',
      isUp: true,
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Admin Actions',
      value: '32',
      change: '6.7% from yesterday',
      isUp: true,
      icon: UserCheck,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'User Actions',
      value: '24',
      change: '9.1% from yesterday',
      isUp: true,
      icon: Users,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'System Events',
      value: '8',
      change: '11.1% from yesterday',
      isUp: false,
      icon: Settings,
      iconBg: 'bg-rose-50 text-rose-600',
    },
  ];

  // Mock Activity Logs Dataset
  const [logs] = useState([
    {
      id: 'LOG-001',
      time: '12 Jun 2026, 10:45 AM',
      user: 'Rohan Shrestha',
      role: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      action: 'Created',
      actionTag: 'bg-emerald-50 text-emerald-600 dot-emerald',
      detailsTitle: 'Created new booking for Court 1',
      detailsSub: 'Booking ID: #BK-2026-0128',
      ip: '192.168.1.10',
    },
    {
      id: 'LOG-002',
      time: '12 Jun 2026, 10:30 AM',
      user: 'Aman Tamang',
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80',
      action: 'Updated',
      actionTag: 'bg-blue-50 text-blue-600 dot-blue',
      detailsTitle: 'Updated court information',
      detailsSub: 'Court: Court 2',
      ip: '192.168.1.11',
    },
    {
      id: 'LOG-003',
      time: '12 Jun 2026, 10:15 AM',
      user: 'Bikash Gurung',
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      action: 'Cancelled',
      actionTag: 'bg-amber-50 text-amber-600 dot-amber',
      detailsTitle: 'Cancelled booking',
      detailsSub: 'Booking ID: #BK-2026-0127',
      ip: '192.168.1.12',
    },
    {
      id: 'LOG-004',
      time: '12 Jun 2026, 09:50 AM',
      user: 'System',
      role: 'System',
      isSystemIcon: true,
      action: 'System Event',
      actionTag: 'bg-purple-50 text-purple-600 dot-purple',
      detailsTitle: 'Payment received via eSewa',
      detailsSub: 'Amount: NPR 1,200.00',
      ip: '192.168.1.1',
    },
    {
      id: 'LOG-005',
      time: '12 Jun 2026, 09:30 AM',
      user: 'Sita Magar',
      role: 'Customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
      action: 'Created',
      actionTag: 'bg-emerald-50 text-emerald-600 dot-emerald',
      detailsTitle: 'New customer registered',
      detailsSub: 'Customer ID: #TUF-2026-0067',
      ip: '192.168.1.13',
    },
    {
      id: 'LOG-006',
      time: '12 Jun 2026, 09:10 AM',
      user: 'Rohan Shrestha',
      role: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      action: 'Updated',
      actionTag: 'bg-blue-50 text-blue-600 dot-blue',
      detailsTitle: 'Updated pricing for morning slot',
      detailsSub: 'Slot: 08:00 AM - 12:00 PM',
      ip: '192.168.1.10',
    },
    {
      id: 'LOG-007',
      time: '12 Jun 2026, 08:55 AM',
      user: 'System',
      role: 'System',
      isSystemIcon: true,
      action: 'System Event',
      actionTag: 'bg-purple-50 text-purple-600 dot-purple',
      detailsTitle: 'Daily backups completed successfully',
      detailsSub: 'Backup ID: #BKUP-2026-0612',
      ip: '192.168.1.1',
    },
    {
      id: 'LOG-008',
      time: '12 Jun 2026, 08:30 AM',
      user: 'Prakash Yadav',
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
      action: 'Deleted',
      actionTag: 'bg-amber-50 text-amber-600 dot-amber',
      detailsTitle: 'Deleted customer',
      detailsSub: 'Customer ID: #TUF-2026-0065',
      ip: '192.168.1.14',
    },
  ]);

  const getDotColor = (action) => {
    switch (action) {
      case 'Created':
        return 'bg-emerald-500';
      case 'Updated':
        return 'bg-blue-500';
      case 'Cancelled':
      case 'Deleted':
        return 'bg-amber-500';
      case 'System Event':
        return 'bg-purple-500';
      default:
        return 'bg-slate-400';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detailsTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detailsSub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.includes(searchQuery);
    return matchesSearch;
  });

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased overflow-hidden select-none">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {/* Header Banner */}
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Activity Logs
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
              Track all important activities happening in your platform.
            </p>
          </div>

          {/* Stat Cards 5-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
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

          {/* Main Card Container: Filters & Table */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full lg:w-96">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search activities, users, actions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-100 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Right Dropdowns & Action */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                {/* Date Picker Button */}
                <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                  <Calendar size={14} className="text-slate-400" />
                  <span>12 Jun 2026 - 12 Jun 2026</span>
                  <ChevronDown size={13} className="text-slate-400" />
                </button>

                {/* Actions Dropdown */}
                <div className="relative">
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="appearance-none px-4 py-2.5 pr-8 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option>All Actions</option>
                    <option>Created</option>
                    <option>Updated</option>
                    <option>Cancelled</option>
                    <option>Deleted</option>
                    <option>System Event</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Users Dropdown */}
                <div className="relative">
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="appearance-none px-4 py-2.5 pr-8 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option>All Users</option>
                    <option>Super Admin</option>
                    <option>Admin</option>
                    <option>System</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Export Logs Button */}
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
                  <Download size={14} />
                  <span>Export Logs</span>
                </button>
              </div>
            </div>

            {/* Activity Logs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Time</th>
                    <th className="pb-3 pr-4">User</th>
                    <th className="pb-3 pr-4">Action</th>
                    <th className="pb-3 pr-4">Details</th>
                    <th className="pb-3 pr-4">IP Address</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-slate-600 whitespace-nowrap">{log.time}</td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2.5">
                          {log.isSystemIcon ? (
                            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <Settings size={15} />
                            </div>
                          ) : (
                            <img
                              src={log.avatar}
                              alt={log.user}
                              className="w-8 h-8 rounded-full object-cover border border-slate-100 shrink-0"
                            />
                          )}
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-xs leading-tight">{log.user}</h4>
                            <span className="text-[10px] text-slate-400 font-medium">{log.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${log.actionTag}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(log.action)}`} />
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs leading-tight">{log.detailsTitle}</h4>
                          <span className="text-[11px] text-slate-400 font-medium">{log.detailsSub}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 font-medium text-slate-600 whitespace-nowrap">{log.ip}</td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-xs"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3.5 border-t border-slate-100 text-xs text-slate-500 font-medium select-none">
              <span>
                Showing <strong className="text-slate-900 font-bold">1</strong> to{' '}
                <strong className="text-slate-900 font-bold">8</strong> of{' '}
                <strong className="text-slate-900 font-bold">1,248</strong> activities
              </span>

              {/* Navigation Controls */}
              <div className="flex items-center gap-1.5">
                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30">
                  <ChevronLeft size={15} />
                </button>
                <button className="w-7 h-7 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
                  1
                </button>
                <button className="w-7 h-7 rounded-lg text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100">
                  2
                </button>
                <button className="w-7 h-7 rounded-lg text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100">
                  3
                </button>
                <span className="px-1 text-slate-400">...</span>
                <button className="w-7 h-7 rounded-lg text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100">
                  156
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-base text-slate-900">Activity Log Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Log ID</span>
                <span className="font-bold text-emerald-600">{selectedLog.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Timestamp</span>
                <span className="font-bold text-slate-900">{selectedLog.time}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Performed By</span>
                <span className="font-bold text-slate-900">{selectedLog.user} ({selectedLog.role})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Action Type</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedLog.actionTag}`}>
                  {selectedLog.action}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">IP Address</span>
                <span className="font-bold text-slate-900">{selectedLog.ip}</span>
              </div>
              <div className="py-1.5 space-y-1">
                <span className="text-slate-400 font-medium block">Description</span>
                <p className="font-bold text-slate-900 leading-snug">{selectedLog.detailsTitle}</p>
                <p className="text-[11px] text-slate-500 font-medium">{selectedLog.detailsSub}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityLogsPage;
