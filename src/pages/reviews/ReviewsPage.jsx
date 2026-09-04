import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Star,
  Smile,
  MessageCircle,
  Clock,
  Search,
  Calendar,
  ChevronDown,
  Download,
  ChevronLeft,
  ChevronRight,
  CornerUpLeft,
  MoreVertical,
  CheckCircle2,
  X,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
  MessageSquare
} from 'lucide-react';

function ReviewsPage({ activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All Ratings');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Top Stat Cards Data (4 KPI Standard)
  const stats = [
    {
      title: 'Total Reviews',
      value: '156',
      change: 'All time customer ratings',
      period: 'total',
      isText: true,
      icon: Star,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Average Rating',
      value: '4.6 / 5',
      change: '0.3 points',
      period: 'from last month',
      isUp: true,
      icon: Star,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      title: '5 Star Positive Ratings',
      value: '112 (71.8%)',
      change: 'High satisfaction',
      period: 'from last month',
      isText: true,
      icon: Smile,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Response Rate',
      value: '92%',
      change: '8.4%',
      period: 'from last month',
      isUp: true,
      icon: MessageCircle,
      iconBg: 'bg-blue-50 text-blue-600',
    },
  ];

  // Mock Reviews Dataset
  const [reviews] = useState([
    {
      id: 'REV-001',
      customer: 'Rohan Shrestha',
      email: 'rohan@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      isVerified: true,
      court: 'Court 1',
      bookingId: '#BK-2026-0128',
      bookingTime: '12 Jun 2026 • 08:00 AM',
      rating: 5,
      headline: 'Excellent court and great experience!',
      reviewText: 'The turf was in perfect condition and the staff was very helpful. Will book again!',
      date: '12 Jun 2026',
      time: '10:45 AM',
      status: 'Published',
      statusBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'REV-002',
      customer: 'Aman Tamang',
      email: 'aman@example.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80',
      isVerified: true,
      court: 'Court 2',
      bookingId: '#BK-2026-0127',
      bookingTime: '11 Jun 2026 • 10:00 AM',
      rating: 4,
      headline: 'Good experience',
      reviewText: 'Nice court, but changing room could be cleaner.',
      date: '11 Jun 2026',
      time: '11:20 AM',
      status: 'Published',
      statusBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'REV-003',
      customer: 'Sita Magar',
      email: 'sita@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
      isVerified: true,
      court: 'Court 3',
      bookingId: '#BK-2026-0126',
      bookingTime: '10 Jun 2026 • 06:00 PM',
      rating: 5,
      headline: 'Amazing!',
      reviewText: 'Very well maintained court with perfect lighting. Will book again!',
      date: '10 Jun 2026',
      time: '07:30 PM',
      status: 'Published',
      statusBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'REV-004',
      customer: 'Bikash Gurung',
      email: 'bikash@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      isVerified: true,
      court: 'Court 1',
      bookingId: '#BK-2026-0125',
      bookingTime: '09 Jun 2026 • 09:00 AM',
      rating: 3,
      headline: 'Average',
      reviewText: 'The turf was okay, but there were lots of water patches.',
      date: '09 Jun 2026',
      time: '10:10 AM',
      status: 'Pending',
      statusBg: 'bg-amber-50 text-amber-600',
    },
    {
      id: 'REV-005',
      customer: 'Prakash Yadav',
      email: 'prakash@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
      isVerified: true,
      court: 'Court 2',
      bookingId: '#BK-2026-0124',
      bookingTime: '08 Jun 2026 • 07:00 PM',
      rating: 5,
      headline: 'Perfect for weekend games!',
      reviewText: 'Loved the experience. Great location and smooth booking process.',
      date: '08 Jun 2026',
      time: '08:15 PM',
      status: 'Published',
      statusBg: 'bg-emerald-50 text-emerald-600',
    },
  ]);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <div className="flex flex-col h-screen bg-[#f3f5fc] text-slate-900 font-sans antialiased overflow-hidden select-none relative">
      {/* Top Header Bar across full window width */}
      <TopBar />

      {/* Main Body Section: Left Sidebar + Right Content Area */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Soft Ambient Background Orbs */}
        <div className="absolute top-[45%] right-[35%] w-[400px] h-[400px] bg-amber-200/20 rounded-full blur-[160px] pointer-events-none" />

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
                  <span>Customer Reviews & Feedback</span>
                  <Star size={20} className="text-amber-500 fill-amber-500/20" />
                </h1>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                  Monitor player ratings, manage pitch feedback, and post official arena replies.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 text-xs font-semibold text-slate-700 hover:bg-white transition-all shadow-xs">
                  <Download size={14} className="text-slate-500" />
                  <span>Export Feedback</span>
                </button>
              </div>
            </div>

            {/* Top Row: 4 Metric Cards (Standard Glassmorphism) */}
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

            {/* Unified Card Container: Search, Filter & Reviews Directory */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-5 space-y-4 shadow-xs hover:shadow-md transition-all">
              {/* Filter Bar */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
                {/* Search Box */}
                <div className="relative w-full lg:w-96">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search player name, review keyword or booking..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-white/80 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Rating Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto py-0.5">
                  {['All Ratings', '5 Stars', '4 Stars', '3 Stars & Below'].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setRatingFilter(rating)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        ratingFilter === rating
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/80'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews Directory Table */}
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[900px] text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider whitespace-nowrap">
                      <th className="pb-3 pr-4">Customer</th>
                      <th className="pb-3 pr-4">Court Pitch & Booking</th>
                      <th className="pb-3 pr-4">Rating & Review Headline</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60 text-xs whitespace-nowrap">
                    {filteredReviews.map((rev) => (
                      <tr key={rev.id} className="hover:bg-white/40 transition-colors whitespace-nowrap">
                        {/* Customer Column */}
                        <td className="py-3.5 pr-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              src={rev.avatar}
                              alt={rev.customer}
                              className="w-9 h-9 rounded-full object-cover border border-white shadow-2xs shrink-0"
                            />
                            <div className="whitespace-nowrap">
                              <h4 className="font-extrabold text-slate-900 text-xs leading-tight whitespace-nowrap">{rev.customer}</h4>
                              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">{rev.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Court & Booking Column */}
                        <td className="py-3.5 pr-4 whitespace-nowrap">
                          <div className="whitespace-nowrap">
                            <h4 className="font-extrabold text-slate-900 text-xs leading-tight whitespace-nowrap">{rev.court}</h4>
                            <p className="text-[11px] text-slate-500 font-bold mt-0.5 whitespace-nowrap">Booking {rev.bookingId}</p>
                          </div>
                        </td>

                        {/* Rating & Review Column */}
                        <td className="py-3.5 pr-4 whitespace-nowrap">
                          <div className="space-y-0.5 whitespace-nowrap">
                            {renderStars(rev.rating)}
                            <h5 className="font-extrabold text-slate-900 text-xs whitespace-nowrap">{rev.headline}</h5>
                          </div>
                        </td>

                        {/* Date Column */}
                        <td className="py-3.5 pr-4 font-semibold text-slate-600 text-xs whitespace-nowrap">
                          <div className="whitespace-nowrap">
                            <div>{rev.date}</div>
                            <div className="text-[10px] text-slate-400">{rev.time}</div>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="py-3.5 pr-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${rev.statusBg}`}>
                            {rev.status}
                          </span>
                        </td>

                        {/* Actions Column */}
                        <td className="py-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedReview(rev)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-2xs"
                          >
                            <CornerUpLeft size={13} />
                            <span>Reply</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Emerald Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3.5 border-t border-slate-100 text-xs text-slate-500 font-medium select-none">
                <span>
                  Showing <strong className="text-slate-900 font-bold">1 to 5</strong> of{' '}
                  <strong className="text-slate-900 font-bold">156</strong> reviews
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
                    32
                  </button>
                  <button className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600">
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

      {/* Reply Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-base text-slate-900">Reply to {selectedReview.customer}</h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{selectedReview.customer}</span>
                  {renderStars(selectedReview.rating)}
                </div>
                <p className="text-slate-600 font-medium italic">"{selectedReview.reviewText}"</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Official Response</label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank you for your feedback! We look forward to hosting your next match..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 rounded-xl border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReview(null);
                    setReplyText('');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  Post Official Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReviewsPage;
