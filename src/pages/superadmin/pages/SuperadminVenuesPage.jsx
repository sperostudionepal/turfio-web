import { useState } from 'react';
import {
  Building2,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Percent,
  Phone,
  Mail,
  FileText,
  X,
  Ban,
  Download,
} from 'lucide-react';

function SuperadminVenuesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedArena, setSelectedArena] = useState(null);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [customCommissionRate, setCustomCommissionRate] = useState(8);

  // Robust mock multi-venue partner database
  const [arenas, setArenas] = useState([
    {
      id: 'TRF-KTM-001',
      name: 'Kathmandu Futsal Arena',
      legalBusinessName: 'Kathmandu Sports Pvt. Ltd.',
      panNumber: '602934812',
      ownerName: 'Bikash Shrestha',
      ownerEmail: 'bikash@kathmandufutsal.com',
      ownerPhone: '+977 9841234567',
      location: 'Naxal, Kathmandu',
      city: 'Kathmandu',
      pitchesCount: 3,
      commissionRate: 8,
      status: 'Verified',
      kycStatus: 'Approved',
      joinedDate: '2025-08-14',
      totalGMV: 'NRs. 48,50,000',
      payoutAccount: 'Nabil Bank (Acc: 01029384756)',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80',
      rating: 4.9,
      kycDocuments: [
        { name: 'Business Registration Certificate.pdf', verified: true },
        { name: 'PAN / VAT Certificate.pdf', verified: true },
        { name: 'Pitch Ownership Lease Deed.pdf', verified: true },
      ],
    },
    {
      id: 'TRF-PKR-002',
      name: 'Pokhara Sky Pitch & Lounge',
      legalBusinessName: 'Skyline Recreation & Sports Ltd.',
      panNumber: '601827461',
      ownerName: 'Anil Gurung',
      ownerEmail: 'anil@pokharasky.com',
      ownerPhone: '+977 9856012345',
      location: 'Lakeside - 6, Pokhara',
      city: 'Pokhara',
      pitchesCount: 2,
      commissionRate: 7.5,
      status: 'Verified',
      kycStatus: 'Approved',
      joinedDate: '2025-09-02',
      totalGMV: 'NRs. 32,80,000',
      payoutAccount: 'Global IME (Acc: 20491827364)',
      image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&auto=format&fit=crop&q=80',
      rating: 4.8,
      kycDocuments: [
        { name: 'Company Registration.pdf', verified: true },
        { name: 'Tax Clearance 2081.pdf', verified: true },
      ],
    },
    {
      id: 'TRF-LAL-003',
      name: 'Lalitpur Champions Arena',
      legalBusinessName: 'Champions Futsal & Fitness Club',
      panNumber: '609182374',
      ownerName: 'Ramesh Maharjan',
      ownerEmail: 'ramesh@lalitpurchampions.np',
      ownerPhone: '+977 9813928475',
      location: 'Kumaripati, Lalitpur',
      city: 'Lalitpur',
      pitchesCount: 4,
      commissionRate: 8.0,
      status: 'Pending KYC',
      kycStatus: 'Under Review',
      joinedDate: '2026-06-01',
      totalGMV: 'NRs. 0',
      payoutAccount: 'NIC Asia (Acc: 98123471625)',
      image: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=600&auto=format&fit=crop&q=80',
      rating: 4.9,
      kycDocuments: [
        { name: 'PAN Registration Document.pdf', verified: false },
        { name: 'Arena Lease Agreement.pdf', verified: false },
        { name: 'Citizenship Front & Back.pdf', verified: false },
      ],
    },
    {
      id: 'TRF-BHK-004',
      name: 'Bhaktapur Indoor Arena',
      legalBusinessName: 'Heritage Sports Center',
      panNumber: '604819283',
      ownerName: 'Sunil Prajapati',
      ownerEmail: 'sunil@bhaktapursports.com',
      ownerPhone: '+977 9801827364',
      location: 'Sallaghari, Bhaktapur',
      city: 'Bhaktapur',
      pitchesCount: 2,
      commissionRate: 8.5,
      status: 'Verified',
      kycStatus: 'Approved',
      joinedDate: '2025-11-20',
      totalGMV: 'NRs. 19,40,000',
      payoutAccount: 'Sanima Bank (Acc: 8172635481)',
      image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&auto=format&fit=crop&q=80',
      rating: 4.7,
      kycDocuments: [
        { name: 'Business License.pdf', verified: true },
        { name: 'Bank Cheque Copy.pdf', verified: true },
      ],
    },
    {
      id: 'TRF-BTW-005',
      name: 'Butwal Turf Hub',
      legalBusinessName: 'Lumbini Turf Enterprise',
      panNumber: '603819274',
      ownerName: 'Deepak Thapa',
      ownerEmail: 'deepak@butwalturf.com',
      ownerPhone: '+977 9847182930',
      location: 'Traffic Chowk, Butwal',
      city: 'Butwal',
      pitchesCount: 2,
      commissionRate: 7.0,
      status: 'Suspended',
      kycStatus: 'Flagged',
      joinedDate: '2025-10-10',
      totalGMV: 'NRs. 11,20,000',
      payoutAccount: 'Everest Bank (Acc: 1102938475)',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
      rating: 4.2,
      kycDocuments: [
        { name: 'Pending Trade License.pdf', verified: false },
      ],
    },
  ]);

  const handleApproveKYC = (arenaId) => {
    setArenas((prev) =>
      prev.map((a) =>
        a.id === arenaId
          ? { ...a, status: 'Verified', kycStatus: 'Approved' }
          : a
      )
    );
    setSelectedArena((prev) =>
      prev && prev.id === arenaId
        ? { ...prev, status: 'Verified', kycStatus: 'Approved' }
        : prev
    );
  };

  const handleToggleSuspend = (arenaId) => {
    setArenas((prev) =>
      prev.map((a) => {
        if (a.id === arenaId) {
          const newStatus = a.status === 'Suspended' ? 'Verified' : 'Suspended';
          return { ...a, status: newStatus };
        }
        return a;
      })
    );
    setSelectedArena((prev) =>
      prev && prev.id === arenaId
        ? { ...prev, status: prev.status === 'Suspended' ? 'Verified' : 'Suspended' }
        : prev
    );
  };

  const handleSaveCommission = (arenaId, newRate) => {
    setArenas((prev) =>
      prev.map((a) =>
        a.id === arenaId ? { ...a, commissionRate: Number(newRate) } : a
      )
    );
    if (selectedArena) {
      setSelectedArena({ ...selectedArena, commissionRate: Number(newRate) });
    }
    setIsCommissionModalOpen(false);
  };

  const filteredArenas = arenas.filter((a) => {
    const matchesQuery =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Verified' && a.status === 'Verified') ||
      (statusFilter === 'Pending' && a.status === 'Pending KYC') ||
      (statusFilter === 'Suspended' && a.status === 'Suspended');
    return matchesQuery && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 size={12} /> Verified
          </span>
        );
      case 'Pending KYC':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200/60">
            <Clock size={12} /> Review Pending
          </span>
        );
      case 'Suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200/60">
            <Ban size={12} /> Suspended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="text-lime-600" /> Partner Venues & Arenas
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Audit partner KYC submissions, configure take-rate commission tiers, and manage arena visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs border border-slate-200/60 cursor-pointer">
            <Download size={14} />
            <span>Export Partner Ledger</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by arena name, ID, city, or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition-all"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {['All', 'Verified', 'Pending', 'Suspended'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Venues Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="text-[11px] font-extrabold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                <th className="pb-3 pr-3">Arena ID & Name</th>
                <th className="pb-3 pr-3">Owner Contact</th>
                <th className="pb-3 pr-3">Location & Pitches</th>
                <th className="pb-3 pr-3 text-center">Commission</th>
                <th className="pb-3 pr-3 text-right">Lifetime GMV</th>
                <th className="pb-3 pr-3 text-center">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold">
              {filteredArenas.map((arena) => (
                <tr key={arena.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={arena.image}
                        alt={arena.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-100 shrink-0"
                      />
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs block">
                          {arena.name}
                        </span>
                        <span className="text-[11px] text-lime-700 font-bold">
                          {arena.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 pr-3">
                    <div className="text-slate-900 font-bold">{arena.ownerName}</div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {arena.ownerPhone}
                    </div>
                  </td>

                  <td className="py-3.5 pr-3">
                    <div className="text-slate-800 font-bold">{arena.location}</div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {arena.pitchesCount} Pitches • {arena.city}
                    </div>
                  </td>

                  <td className="py-3.5 pr-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedArena(arena);
                        setCustomCommissionRate(arena.commissionRate);
                        setIsCommissionModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-full bg-lime-100 hover:bg-lime-200 text-lime-900 font-black text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Percent size={11} /> {arena.commissionRate}%
                    </button>
                  </td>

                  <td className="py-3.5 pr-3 text-right font-black text-slate-900">
                    {arena.totalGMV}
                  </td>

                  <td className="py-3.5 pr-3 text-center">
                    {getStatusBadge(arena.status)}
                  </td>

                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        title="Inspect KYC & Details"
                        onClick={() => setSelectedArena(arena)}
                        className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        title={arena.status === 'Suspended' ? 'Unsuspend Arena' : 'Suspend Arena'}
                        onClick={() => handleToggleSuspend(arena.id)}
                        className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                          arena.status === 'Suspended'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200'
                        }`}
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

      {/* Inspect & KYC Modal */}
      {selectedArena && !isCommissionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{selectedArena.name}</h3>
                  {getStatusBadge(selectedArena.status)}
                </div>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  ID: {selectedArena.id} • Registered PAN: {selectedArena.panNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedArena(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <img
                src={selectedArena.image}
                alt={selectedArena.name}
                className="w-full h-44 rounded-2xl object-cover shadow-2xs"
              />

              {/* Business Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Legal Entity
                  </span>
                  <p className="font-extrabold text-slate-900">{selectedArena.legalBusinessName}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Payout Settlement Account
                  </span>
                  <p className="font-extrabold text-slate-900">{selectedArena.payoutAccount}</p>
                </div>
              </div>

              {/* Owner Contact */}
              <div className="p-4 rounded-2xl bg-lime-50/60 border border-lime-100 space-y-2 text-xs">
                <span className="text-[11px] font-black text-lime-900 uppercase tracking-wider block">
                  Primary Owner Contact
                </span>
                <div className="flex flex-col sm:flex-row justify-between gap-2 text-slate-800 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} className="text-lime-700" /> {selectedArena.ownerEmail}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone size={13} className="text-lime-700" /> {selectedArena.ownerPhone}
                  </span>
                </div>
              </div>

              {/* KYC Documents Section */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-900 block">
                  Uploaded Compliance & KYC Documents
                </span>
                <div className="space-y-2">
                  {selectedArena.kycDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-700">
                        <FileText size={15} className="text-slate-400" />
                        <span>{doc.name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          doc.verified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.verified ? 'Verified Document' : 'Requires Review'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                {selectedArena.status === 'Pending KYC' && (
                  <button
                    onClick={() => handleApproveKYC(selectedArena.id)}
                    className="flex-1 py-3 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 size={15} /> Approve & Verify Arena
                  </button>
                )}
                <button
                  onClick={() => setSelectedArena(null)}
                  className="px-5 py-3 rounded-full border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Commission Rate Config Modal */}
      {isCommissionModalOpen && selectedArena && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Custom Take-Rate</h3>
              <button
                onClick={() => setIsCommissionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Configure Turfio's platform commission take-rate for{' '}
              <strong className="text-slate-900">{selectedArena.name}</strong>.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Commission Percentage (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="30"
                  value={customCommissionRate}
                  onChange={(e) => setCustomCommissionRate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-sm focus:ring-2 focus:ring-lime-300 focus:border-lime-400 outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
                  %
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsCommissionModalOpen(false)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveCommission(selectedArena.id, customCommissionRate)}
                className="flex-1 py-2.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 font-black text-xs transition-all cursor-pointer shadow-xs"
              >
                Update Rate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperadminVenuesPage;
