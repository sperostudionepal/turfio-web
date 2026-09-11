import { useState } from 'react';
import {
  Users,
  Search,
  Shield,
  Ban,
  CheckCircle2,
  X,
  Download,
} from 'lucide-react';

function SuperadminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([
    {
      id: 'USR-8921',
      name: 'Saugat Shahi',
      email: 'saugat@example.com',
      phone: '+977 9841998877',
      role: 'player',
      status: 'active',
      joinedDate: '12 Jan 2026',
      totalBookings: 28,
      totalSpent: 'NRs. 56,000',
      avatar: 'SS',
      lastLogin: 'Today @ 11:20 AM',
    },
    {
      id: 'USR-1029',
      name: 'Bikash Shrestha',
      email: 'bikash@kathmandufutsal.com',
      phone: '+977 9841234567',
      role: 'turf_owner',
      status: 'active',
      joinedDate: '14 Aug 2025',
      totalBookings: 840,
      totalSpent: 'NRs. 18,50,000 (GMV)',
      avatar: 'BS',
      lastLogin: 'Yesterday @ 06:45 PM',
    },
    {
      id: 'USR-4819',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      phone: '+977 9851092837',
      role: 'player',
      status: 'active',
      joinedDate: '04 Mar 2026',
      totalBookings: 14,
      totalSpent: 'NRs. 31,500',
      avatar: 'AS',
      lastLogin: '3 days ago',
    },
    {
      id: 'USR-0042',
      name: 'Support Agent - Anita',
      email: 'anita.support@turfio.app',
      phone: '+977 9801928374',
      role: 'support',
      status: 'active',
      joinedDate: '01 Nov 2025',
      totalBookings: 0,
      totalSpent: 'N/A',
      avatar: 'AN',
      lastLogin: 'Just now',
    },
    {
      id: 'USR-7731',
      name: 'Kiran Thapa',
      email: 'kiran.thapa@yahoo.com',
      phone: '+977 9849182736',
      role: 'player',
      status: 'banned',
      joinedDate: '19 Feb 2026',
      totalBookings: 2,
      totalSpent: 'NRs. 4,000',
      avatar: 'KT',
      lastLogin: '2 weeks ago',
    },
  ]);

  const handleToggleBan = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, status: u.status === 'banned' ? 'active' : 'banned' };
        }
        return u;
      })
    );
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev) => ({
        ...prev,
        status: prev.status === 'banned' ? 'active' : 'banned',
      }));
    }
  };

  const handleChangeRole = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, role: newRole });
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      roleFilter === 'All' ||
      (roleFilter === 'Players' && u.role === 'player') ||
      (roleFilter === 'Turf Owners' && u.role === 'turf_owner') ||
      (roleFilter === 'Staff' && u.role === 'support');
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-900 text-lime-400">
            ROOT SUPERADMIN
          </span>
        );
      case 'turf_owner':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
            TURF OWNER
          </span>
        );
      case 'support':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800">
            SUPPORT STAFF
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">
            PLAYER
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="text-lime-600" /> User Directory & Access Control
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Manage player profiles, partner credentials, support privileges, and security bans.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs border border-slate-200/60 cursor-pointer">
          <Download size={14} />
          <span>Export Users Directory</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl overflow-hidden p-5 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {['All', 'Players', 'Turf Owners', 'Staff'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  roleFilter === role
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="text-[11px] font-extrabold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                <th className="pb-3 pr-3">User & Contact</th>
                <th className="pb-3 pr-3 text-center">Role</th>
                <th className="pb-3 pr-3">Activity & Spend</th>
                <th className="pb-3 pr-3">Joined Date</th>
                <th className="pb-3 pr-3 text-center">Account Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-lime-100 text-lime-950 font-black flex items-center justify-center text-xs shrink-0">
                        {u.avatar}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {u.email} • {u.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 pr-3 text-center">{getRoleBadge(u.role)}</td>

                  <td className="py-3.5 pr-3">
                    <div className="text-slate-900 font-bold">{u.totalSpent}</div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {u.totalBookings} lifetime bookings
                    </div>
                  </td>

                  <td className="py-3.5 pr-3 text-slate-600 font-medium">{u.joinedDate}</td>

                  <td className="py-3.5 pr-3 text-center">
                    {u.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-50 text-rose-700">
                        <Ban size={12} /> Banned
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                        title="View User Details & Security"
                      >
                        <Shield size={14} />
                      </button>
                      <button
                        onClick={() => handleToggleBan(u.id)}
                        className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                          u.status === 'banned'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'text-rose-600 border-slate-200 hover:bg-rose-50'
                        }`}
                        title={u.status === 'banned' ? 'Lift Ban' : 'Ban User'}
                      >
                        <Ban size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Inspect Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-lime-400 text-slate-950 font-black flex items-center justify-center text-sm">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-400 font-semibold">{selectedUser.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Email:</span>
                <span className="font-bold text-slate-900">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Phone:</span>
                <span className="font-bold text-slate-900">{selectedUser.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Last Login:</span>
                <span className="font-bold text-slate-900">{selectedUser.lastLogin}</span>
              </div>
            </div>

            {/* Role Adjustment */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Assign System Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['player', 'turf_owner', 'support'].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleChangeRole(selectedUser.id, r)}
                    className={`py-2 rounded-xl text-xs font-extrabold capitalize transition-all cursor-pointer ${
                      selectedUser.role === r
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => handleToggleBan(selectedUser.id)}
                className={`w-full py-2.5 rounded-full font-black text-xs transition-all cursor-pointer ${
                  selectedUser.status === 'banned'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                {selectedUser.status === 'banned' ? 'Unban Account' : 'Suspend & Ban Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperadminUsersPage;
