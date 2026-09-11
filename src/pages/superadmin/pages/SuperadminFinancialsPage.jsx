import { useState } from 'react';
import {
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  X,
  Send,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

function SuperadminFinancialsPage() {
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Financial KPIs
  const financialCards = [
    {
      title: 'Current Escrow Balance',
      value: 'NRs. 42,60,000',
      change: '+14.2%',
      subtext: 'Held for upcoming bookings',
      color: 'bg-lime-50 text-lime-500',
    },
    {
      title: 'Platform Take Yield (Net)',
      value: 'NRs. 11,86,000',
      change: '+18.4%',
      subtext: '8% avg commission this month',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Due for Payout',
      value: 'NRs. 28,40,000',
      change: '4 Batches',
      subtext: 'Scheduled for Friday release',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Refunds & Disputes',
      value: 'NRs. 1,12,000',
      change: '0.8%',
      subtext: 'Low chargeback / rainout rate',
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  // Payout Settlements to Arenas
  const [payoutBatches, setPayoutBatches] = useState([
    {
      id: 'PAY-BATCH-2026-081',
      arenaName: 'Kathmandu Futsal Arena',
      accountNumber: 'Nabil Bank (01029384756)',
      period: '01 Jun - 07 Jun 2026',
      grossVolume: 'NRs. 4,80,000',
      commissionDeducted: 'NRs. 38,400 (8%)',
      netPayout: 'NRs. 4,41,600',
      status: 'Pending Release',
      method: 'ConnectIPS / Nabil API',
    },
    {
      id: 'PAY-BATCH-2026-082',
      arenaName: 'Pokhara Sky Pitch & Lounge',
      accountNumber: 'Global IME (20491827364)',
      period: '01 Jun - 07 Jun 2026',
      grossVolume: 'NRs. 3,60,000',
      commissionDeducted: 'NRs. 27,000 (7.5%)',
      netPayout: 'NRs. 3,33,000',
      status: 'Pending Release',
      method: 'ConnectIPS / Bank Transfer',
    },
    {
      id: 'PAY-BATCH-2026-080',
      arenaName: 'Patan Champions Court',
      accountNumber: 'NIC Asia (98123471625)',
      period: '24 May - 31 May 2026',
      grossVolume: 'NRs. 4,20,000',
      commissionDeducted: 'NRs. 33,600 (8%)',
      netPayout: 'NRs. 3,86,400',
      status: 'Settled',
      method: 'eSewa Corporate Payout',
    },
    {
      id: 'PAY-BATCH-2026-079',
      arenaName: 'Bhaktapur Indoor Soccer Arena',
      accountNumber: 'Sanima Bank (8172635481)',
      period: '24 May - 31 May 2026',
      grossVolume: 'NRs. 2,10,000',
      commissionDeducted: 'NRs. 17,850 (8.5%)',
      netPayout: 'NRs. 1,92,150',
      status: 'Settled',
      method: 'Bank Direct Payout',
    },
  ]);

  // Platform Commission Yield by Day
  const dailyCommissionData = [
    { day: 'Mon', gmv: 34, commission: 2.7 },
    { day: 'Tue', gmv: 42, commission: 3.3 },
    { day: 'Wed', gmv: 48, commission: 3.8 },
    { day: 'Thu', gmv: 45, commission: 3.6 },
    { day: 'Fri', gmv: 68, commission: 5.4 },
    { day: 'Sat', gmv: 85, commission: 6.8 },
    { day: 'Sun', gmv: 54, commission: 4.3 },
  ];

  const handleExecutePayout = (batchId) => {
    setPayoutBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: 'Settled' } : b))
    );
    setIsPayoutModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Settled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 size={12} /> Settled
          </span>
        );
      case 'Pending Release':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200/60">
            <Clock size={12} /> Due Payout
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
            <CreditCard className="text-lime-600" /> Platform Financials & Partner Settlements
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Reconcile Khalti / eSewa transaction fees, disburse arena payout batches, and manage escrow reserves.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 text-xs font-extrabold transition-all cursor-pointer shadow-xs">
            <Download size={14} />
            <span>Download Bank Settlement File</span>
          </button>
        </div>
      </div>

      {/* Top 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl overflow-hidden p-5 relative flex flex-col justify-between shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100 hover:-translate-y-0.5 transition-all"
          >
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                {card.title}
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                {card.value}
              </h3>
            </div>
            <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-slate-50">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-black text-[11px]">
                {card.change}
              </span>
              <span className="text-slate-400 font-medium text-[11px]">{card.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Commission Yield Breakdown Chart */}
      <div className="bg-white rounded-xl overflow-hidden p-6 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-base text-slate-900 tracking-tight">
              Weekly Gross Volume vs Platform Fee Harvest
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Gross bookings volume (Thousand NRs.) and resulting platform net take
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Current Week (Peak Friday-Saturday)
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyCommissionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-2xl text-xs font-bold shadow-xl">
                        <p className="text-lime-400">{payload[0]?.payload.day}</p>
                        <p>Gross: NRs. {payload[0]?.payload.gmv * 1000}</p>
                        <p className="text-emerald-400">
                          Turfio Cut: NRs. {payload[0]?.payload.commission * 1000}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="gmv" radius={[8, 8, 8, 8]}>
                {dailyCommissionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.day === 'Sat' || entry.day === 'Fri' ? '#a3e635' : '#e2e8f0'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payout Batches Table */}
      <div className="bg-white rounded-xl overflow-hidden p-6 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-base text-slate-900 tracking-tight">
              Arena Payout & Settlement Batches
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Weekly automated escrow disbursement to verified turf bank accounts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPayoutBatches((prev) =>
                  prev.map((b) => ({ ...b, status: 'Settled' }))
                );
              }}
              className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Send size={13} />
              <span>Release All Due Batches</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="text-[11px] font-extrabold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                <th className="pb-3 pr-3">Batch ID & Arena</th>
                <th className="pb-3 pr-3">Billing Cycle</th>
                <th className="pb-3 pr-3 text-right">Gross GMV</th>
                <th className="pb-3 pr-3 text-right">Commission Taken</th>
                <th className="pb-3 pr-3 text-right">Net Payout</th>
                <th className="pb-3 pr-3 text-center">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold">
              {payoutBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-3">
                    <div>
                      <span className="font-extrabold text-slate-900 block">
                        {batch.arenaName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {batch.id} • {batch.accountNumber}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 pr-3 text-slate-600 font-medium">
                    {batch.period}
                  </td>

                  <td className="py-3.5 pr-3 text-right font-black text-slate-900">
                    {batch.grossVolume}
                  </td>

                  <td className="py-3.5 pr-3 text-right font-bold text-emerald-700">
                    {batch.commissionDeducted}
                  </td>

                  <td className="py-3.5 pr-3 text-right font-black text-slate-900 text-sm">
                    {batch.netPayout}
                  </td>

                  <td className="py-3.5 pr-3 text-center">
                    {getStatusBadge(batch.status)}
                  </td>

                  <td className="py-3.5 text-right">
                    {batch.status === 'Pending Release' ? (
                      <button
                        onClick={() => {
                          setSelectedBatch(batch);
                          setIsPayoutModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 font-black text-xs transition-colors cursor-pointer shadow-2xs"
                      >
                        Release Payout
                      </button>
                    ) : (
                      <span className="text-slate-400 font-bold text-[11px]">
                        Reconciled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Confirmation Modal */}
      {isPayoutModalOpen && selectedBatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Disburse Escrow Payout</h3>
              <button
                onClick={() => setIsPayoutModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              You are authorizing automated transfer of{' '}
              <strong className="text-slate-900">{selectedBatch.netPayout}</strong> from the
              escrow account to{' '}
              <strong className="text-slate-900">{selectedBatch.arenaName}</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary Bank:</span>
                <span className="font-bold text-slate-900">{selectedBatch.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Period Covered:</span>
                <span className="font-bold text-slate-900">{selectedBatch.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Bookings:</span>
                <span className="font-bold text-slate-900">{selectedBatch.grossVolume}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Platform Commission:</span>
                <span className="font-bold text-emerald-700">
                  {selectedBatch.commissionDeducted}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsPayoutModalOpen(false)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExecutePayout(selectedBatch.id)}
                className="flex-1 py-2.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 font-black text-xs transition-all cursor-pointer shadow-xs"
              >
                Confirm Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperadminFinancialsPage;
