import { useState } from 'react';
import {
  Wallet,
  Building2,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  ChevronDown,
  Download,
  Activity,
  CreditCard,
  Star,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function CustomTrendTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl border border-slate-700 shadow-2xl text-xs">
        <p className="font-extrabold text-lime-400 mb-1">{label} 2026</p>
        <div className="space-y-1 font-semibold">
          <p className="flex justify-between gap-4 text-slate-300">
            <span>Gross GMV:</span>
            <strong className="text-white">NRs. {payload[0]?.value} Lakhs</strong>
          </p>
          <p className="flex justify-between gap-4 text-slate-300">
            <span>Net Commission:</span>
            <strong className="text-lime-300">NRs. {payload[1]?.value} Lakhs</strong>
          </p>
        </div>
      </div>
    );
  }
  return null;
}

function SuperadminOverviewPage({ setActiveTab }) {
  const [timeRange] = useState('This Month');

  // Platform Level High-Value Metrics
  const platformStats = [
    {
      title: 'Platform Gross GMV',
      value: 'NRs. 1,48,25,000',
      change: '+24.6%',
      subtext: 'vs last month (NRs. 1.19Cr)',
      icon: Wallet,
      iconBg: 'bg-lime-50 text-lime-500',
    },
    {
      title: 'Turfio Net Commission',
      value: 'NRs. 11,86,000',
      change: '+18.4%',
      subtext: '8% average platform take-rate',
      icon: CreditCard,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Active Arenas & Turfs',
      value: '42 Arenas',
      change: '+5 New',
      subtext: '3 Pending KYC approvals',
      icon: Building2,
      iconBg: 'bg-blue-50 text-blue-500',
    },
    {
      title: 'Platform Bookings',
      value: '6,480 Slots',
      change: '+15.2%',
      subtext: '84.2% completed rate',
      icon: Calendar,
      iconBg: 'bg-purple-50 text-purple-500',
    },
  ];

  // Revenue & GMV Trajectory
  const revenueTrendData = [
    { month: 'Jan', gmv: 82, net: 6.5, bookings: 3400 },
    { month: 'Feb', gmv: 94, net: 7.5, bookings: 3900 },
    { month: 'Mar', gmv: 110, net: 8.8, bookings: 4600 },
    { month: 'Apr', gmv: 105, net: 8.4, bookings: 4400 },
    { month: 'May', gmv: 128, net: 10.2, bookings: 5300 },
    { month: 'Jun', gmv: 148, net: 11.8, bookings: 6480 },
  ];

  // City-wide Turf Distribution
  const cityDistributionData = [
    { name: 'Kathmandu Valley', value: 24, gmv: 'NRs. 88 Lakhs', color: '#a3e635' },
    { name: 'Lalitpur', value: 9, gmv: 'NRs. 32 Lakhs', color: '#10b981' },
    { name: 'Pokhara', value: 5, gmv: 'NRs. 18 Lakhs', color: '#3b82f6' },
    { name: 'Bhaktapur', value: 3, gmv: 'NRs. 7 Lakhs', color: '#8b5cf6' },
    { name: 'Other Cities', value: 1, gmv: 'NRs. 3 Lakhs', color: '#f59e0b' },
  ];

  // Top Performing Arenas Leaderboard
  const topArenas = [
    {
      id: 'TURF-001',
      name: 'Kathmandu Futsal Arena',
      location: 'Naxal, Kathmandu',
      pitches: 3,
      monthlyBookings: 840,
      monthlyGMV: 'NRs. 18,50,000',
      commission: 'NRs. 1,48,000',
      rating: 4.9,
      status: 'Verified',
      avatar: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'TURF-002',
      name: 'Pokhara Sky Pitch & Lounge',
      location: 'Lakeside, Pokhara',
      pitches: 2,
      monthlyBookings: 620,
      monthlyGMV: 'NRs. 14,20,000',
      commission: 'NRs. 1,13,600',
      rating: 4.8,
      status: 'Verified',
      avatar: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'TURF-003',
      name: 'Patan Champions Court',
      location: 'Kumaripati, Lalitpur',
      pitches: 4,
      monthlyBookings: 790,
      monthlyGMV: 'NRs. 16,80,000',
      commission: 'NRs. 1,34,400',
      rating: 4.9,
      status: 'Verified',
      avatar: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'TURF-004',
      name: 'Bhaktapur Indoor Soccer Arena',
      location: 'Sallaghari, Bhaktapur',
      pitches: 2,
      monthlyBookings: 410,
      monthlyGMV: 'NRs. 9,40,000',
      commission: 'NRs. 75,200',
      rating: 4.7,
      status: 'Verified',
      avatar: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=200&auto=format&fit=crop&q=80',
    },
  ];

  // Realtime Live Feed Activity
  const recentPlatformEvents = [
    {
      id: 1,
      type: 'booking',
      title: 'New High-Value Match Booking',
      desc: 'Saugat S. booked 3 Hours (Night Peak) at Patan Champions Court',
      amount: 'NRs. 7,500',
      time: 'Just now',
      badge: 'Escrow Secured',
    },
    {
      id: 2,
      type: 'payout',
      title: 'Automated Payout Settled',
      desc: 'Batch #891 settled to Kathmandu Futsal via Nabil Bank API',
      amount: 'NRs. 1,65,000',
      time: '12m ago',
      badge: 'Success',
    },
    {
      id: 3,
      type: 'kyc',
      title: 'New Partner Onboarding Pending',
      desc: 'Biratnagar United Futsal uploaded PAN and arena photos',
      amount: 'Action Req',
      time: '45m ago',
      badge: 'KYC Review',
    },
    {
      id: 4,
      type: 'refund',
      title: 'Weather Disruption Refund',
      desc: 'Auto-credited player wallet for rainout at Lakeside Turf',
      amount: 'NRs. 2,200',
      time: '1h ago',
      badge: 'Refunded',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Platform Command Center
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed Active
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Real-time multi-arena telemetry, aggregate GMV velocity, partner settlements, and user growth.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/80 cursor-pointer">
            <span>{timeRange}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </div>

          {/* Export Report */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 text-xs font-extrabold transition-all cursor-pointer shadow-xs">
            <Download size={14} />
            <span>Export Platform Audit</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl overflow-hidden p-5 relative flex flex-col justify-between shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl shrink-0 ${stat.iconBg}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                      {stat.title}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mt-0.5">
                      {stat.value}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-black text-[11px]">
                  <ArrowUpRight size={12} /> {stat.change}
                </span>
                <span className="text-slate-400 font-medium text-[11px] truncate max-w-[150px]">
                  {stat.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Platform Revenue Velocity Chart & Geo Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Large 2-Col Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl overflow-hidden p-6 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-lime-100 flex items-center justify-center text-lime-700">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 tracking-tight">
                    Gross Merchandise Value & Net Take
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Tracking platform GMV (Lakhs) against 8% commission yield
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <span className="w-3 h-3 rounded-full bg-lime-400 inline-block" />
                <span>Gross GMV</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                <span>Net Margin</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gmvGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a3e635" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a3e635" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                  dy={4}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                />
                <Tooltip content={<CustomTrendTooltip />} />
                <Area
                  type="monotone"
                  dataKey="gmv"
                  stroke="#84cc16"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#gmvGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#netGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 1-Col City & Regional Breakdown */}
        <div className="bg-white rounded-xl overflow-hidden p-6 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <MapPin size={16} />
              </div>
              <h3 className="font-black text-sm text-slate-900 tracking-tight">
                Regional Arena Coverage
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400">42 Total</span>
          </div>

          <div className="space-y-3.5 my-auto">
            {cityDistributionData.map((city) => (
              <div key={city.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: city.color }}
                    />
                    <span className="text-slate-800">{city.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">{city.value} Arenas</span>
                    <span className="text-slate-900 font-extrabold">{city.gmv}</span>
                  </div>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(city.value / 42) * 100}%`,
                      backgroundColor: city.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab && setActiveTab('Arenas & Turfs')}
            className="w-full mt-4 py-2.5 rounded-full bg-slate-50 hover:bg-lime-50 text-slate-800 hover:text-slate-900 text-xs font-bold transition-all text-center cursor-pointer border border-slate-100"
          >
            Inspect All Partner Venues →
          </button>
        </div>
      </div>

      {/* Bottom Section: Top Venues Leaderboard + Live Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top Arenas Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl overflow-hidden p-6 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <Star size={16} />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 tracking-tight">
                  Top Performing Turf Partners
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Ranked by monthly gross bookings and player satisfaction score
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab && setActiveTab('Arenas & Turfs')}
              className="text-xs font-bold text-lime-700 hover:text-lime-800 transition-colors cursor-pointer"
            >
              View Full Directory
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-extrabold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                  <th className="pb-3 pr-3">Arena & Location</th>
                  <th className="pb-3 pr-3 text-center">Pitches</th>
                  <th className="pb-3 pr-3 text-right">Slots Booked</th>
                  <th className="pb-3 pr-3 text-right">Gross GMV</th>
                  <th className="pb-3 pr-3 text-right">Commission</th>
                  <th className="pb-3 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-semibold">
                {topArenas.map((arena) => (
                  <tr key={arena.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={arena.avatar}
                          alt={arena.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-100"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{arena.name}</div>
                          <div className="text-[11px] font-medium text-slate-400">
                            {arena.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                        {arena.pitches} Courts
                      </span>
                    </td>
                    <td className="py-3.5 pr-3 text-right font-extrabold text-slate-900">
                      {arena.monthlyBookings}
                    </td>
                    <td className="py-3.5 pr-3 text-right font-black text-slate-900">
                      {arena.monthlyGMV}
                    </td>
                    <td className="py-3.5 pr-3 text-right font-black text-emerald-600">
                      {arena.commission}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 font-extrabold text-slate-900 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[11px]">
                        ★ {arena.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Event Stream (1 Col) */}
        <div className="bg-white rounded-xl overflow-hidden p-6 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-lime-100 flex items-center justify-center text-lime-700">
                <Activity size={16} />
              </div>
              <h3 className="font-black text-sm text-slate-900 tracking-tight">
                Platform Activity Feed
              </h3>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="space-y-3.5 overflow-y-auto max-h-[290px] pr-1">
            {recentPlatformEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs text-slate-900">{evt.title}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-2xs">
                    {evt.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1 leading-snug">
                  {evt.desc}
                </p>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-2">
                  <span>{evt.time}</span>
                  <span className="text-slate-900 font-black">{evt.amount}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab && setActiveTab('Audit Logs')}
            className="w-full mt-4 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all text-center cursor-pointer shadow-xs"
          >
            Open Comprehensive Audit Log
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuperadminOverviewPage;
