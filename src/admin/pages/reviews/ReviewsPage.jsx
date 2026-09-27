import { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Star,
  Smile,
  AlertCircle,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
} from 'lucide-react';
import reviewService from '../../../shared/services/reviewService';
import { getPageItems } from '../../../shared/utils/pagination';
import { downloadCsv } from '../../../shared/utils/reportExport';
import { getTodayNepalString } from '../../../shared/utils/dateTime';
import { ErrorNotice } from '../../components/dashboard/DashboardNotices';

const RATING_FILTERS = ['All Ratings', '5 Stars', '4 Stars', '3 Stars & Below'];

const matchesRatingFilter = (review, ratingFilter) => {
  if (ratingFilter === '5 Stars') return review.rating === 5;
  if (ratingFilter === '4 Stars') return review.rating === 4;
  if (ratingFilter === '3 Stars & Below') return review.rating <= 3;
  return true;
};

const initialsOf = (name) =>
  (name || '')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'P';

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

function ReviewsPage({ activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All Ratings');
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadStatus, setLoadStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [isRetrying, setIsRetrying] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const loadReviews = useCallback(() =>
    reviewService
      .getOwnerReviews()
      .then((items) => {
        setReviews(items);
        setLoadStatus('ready');
      })
      .catch(() => setLoadStatus('error')), []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const retryLoad = async () => {
    setIsRetrying(true);
    await loadReviews();
    setIsRetrying(false);
  };

  // Every number on this page is computed from the reviews players actually left.
  const stats = useMemo(() => {
    const total = reviews.length;
    const average = total ? reviews.reduce((sum, review) => sum + review.rating, 0) / total : 0;
    const fiveStar = reviews.filter((review) => review.rating === 5).length;
    const lowRated = reviews.filter((review) => review.rating <= 3).length;
    const percentOf = (count) => (total ? Math.round((count / total) * 1000) / 10 : 0);

    return [
      {
        title: 'Total Reviews',
        value: total.toLocaleString(),
        change: 'All time customer ratings',
        period: 'total',
        icon: Star,
        iconBg: 'bg-emerald-50 text-emerald-600',
      },
      {
        title: 'Average Rating',
        value: total ? `${average.toFixed(1)} / 5` : '— / 5',
        change: `${total} rating${total === 1 ? '' : 's'}`,
        period: 'all time',
        icon: Star,
        iconBg: 'bg-purple-50 text-purple-600',
      },
      {
        title: '5 Star Positive Ratings',
        value: `${fiveStar} (${percentOf(fiveStar)}%)`,
        change: `${percentOf(fiveStar)}% of reviews`,
        period: 'all time',
        icon: Smile,
        iconBg: 'bg-amber-50 text-amber-600',
      },
      {
        title: '3 Stars & Below',
        value: `${lowRated} (${percentOf(lowRated)}%)`,
        change: 'Needs attention',
        period: 'all time',
        icon: AlertCircle,
        iconBg: 'bg-rose-50 text-rose-600',
      },
    ];
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return reviews.filter((review) => {
      const matchesSearch =
        !query ||
        [review.name, review.email, review.comment, review.courtName, review.turfName].some((field) =>
          (field || '').toLowerCase().includes(query)
        );
      return matchesSearch && matchesRatingFilter(review, ratingFilter);
    });
  }, [reviews, searchQuery, ratingFilter]);

  const hasActiveFilters = Boolean(searchQuery.trim()) || ratingFilter !== 'All Ratings';
  const clearFilters = () => {
    setSearchQuery('');
    setRatingFilter('All Ratings');
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    if (filteredReviews.length === 0) return;
    const header = ['Customer', 'Email', 'Court', 'Venue', 'Rating', 'Review', 'Date'].map(csvCell).join(',');
    const rows = filteredReviews.map((review) =>
      [review.name, review.email, review.courtName, review.turfName, review.rating, review.comment, `${review.date} ${review.time}`]
        .map(csvCell)
        .join(',')
    );
    downloadCsv(`turfio-reviews-${getTodayNepalString()}.csv`, [header, ...rows].join('\n'));
  };

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

  const showSkeleton = loadStatus === 'loading';

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
                  Monitor player ratings and read pitch feedback across your courts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  disabled={filteredReviews.length === 0}
                  title={
                    filteredReviews.length === 0
                      ? 'No reviews to export'
                      : `Download ${filteredReviews.length} review${filteredReviews.length === 1 ? '' : 's'} as CSV`
                  }
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 text-xs font-semibold text-slate-700 hover:bg-white transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={14} className="text-slate-500" />
                  <span>Export Feedback</span>
                </button>
              </div>
            </div>

            {/* Top Row: 4 Metric Cards (computed from the real reviews) */}
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
                            {showSkeleton ? <span className="inline-block h-6 w-16 rounded-lg bg-slate-100 animate-pulse align-middle" /> : stat.value}
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
                    placeholder="Search player name, review keyword or court..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-white/80 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Rating Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto py-0.5">
                  {RATING_FILTERS.map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {
                        setRatingFilter(rating);
                        setCurrentPage(1);
                      }}
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

              {loadStatus === 'error' && (
                <ErrorNotice
                  message="Couldn't load your reviews."
                  onRetry={retryLoad}
                  busy={isRetrying}
                />
              )}

              {hasActiveFilters && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {filteredReviews.length} of {reviews.length} reviews
                  </span>
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 rounded-full text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Reviews Directory Table */}
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[900px] text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="text-xs font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider whitespace-nowrap">
                      <th className="pb-3 pr-4">Customer</th>
                      <th className="pb-3 pr-4">Court & Venue</th>
                      <th className="pb-3 pr-4">Rating & Review</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60 text-xs whitespace-nowrap">
                    {showSkeleton ? (
                      Array.from({ length: 5 }, (_, index) => (
                        <tr key={index}>
                          <td colSpan={5} className="py-3.5">
                            <div className="h-9 rounded-xl bg-slate-100 animate-pulse" />
                          </td>
                        </tr>
                      ))
                    ) : paginatedReviews.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center whitespace-normal">
                          <p className="text-sm font-bold text-slate-700">
                            {loadStatus === 'error' && reviews.length === 0
                              ? "Reviews couldn't be loaded"
                              : reviews.length === 0
                              ? 'No reviews yet'
                              : 'No reviews match your search or filter'}
                          </p>
                          <p className="text-xs text-slate-400 font-medium mt-1">
                            {loadStatus === 'error' && reviews.length === 0
                              ? 'Use Retry above to try again.'
                              : reviews.length === 0
                              ? 'Reviews players leave on your courts will show up here.'
                              : 'Try a different search, or clear the filters.'}
                          </p>
                          {reviews.length > 0 && filteredReviews.length === 0 && (
                            <button
                              onClick={clearFilters}
                              className="mt-3 px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                            >
                              Clear filters
                            </button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      paginatedReviews.map((rev) => (
                        <tr key={rev.id} className="hover:bg-white/40 transition-colors whitespace-nowrap">
                          {/* Customer Column */}
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {rev.avatar ? (
                                <img
                                  src={rev.avatar}
                                  alt={rev.name}
                                  className="w-9 h-9 rounded-full object-cover border border-white shadow-2xs shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0">
                                  {initialsOf(rev.name)}
                                </div>
                              )}
                              <div className="whitespace-nowrap">
                                <h4 className="font-extrabold text-slate-900 text-xs leading-tight whitespace-nowrap">{rev.name}</h4>
                                <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">{rev.email || '—'}</span>
                              </div>
                            </div>
                          </td>

                          {/* Court & Venue Column */}
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            <div className="whitespace-nowrap">
                              <h4 className="font-extrabold text-slate-900 text-xs leading-tight whitespace-nowrap">
                                {rev.courtName || 'Court'}
                              </h4>
                              <p className="text-[11px] text-slate-500 font-bold mt-0.5 whitespace-nowrap">
                                {rev.turfName || '—'}
                              </p>
                            </div>
                          </td>

                          {/* Rating & Review Column */}
                          <td className="py-3.5 pr-4 whitespace-nowrap">
                            <div className="space-y-0.5 whitespace-nowrap">
                              {renderStars(rev.rating)}
                              <p title={rev.comment} className="font-extrabold text-slate-900 text-xs whitespace-nowrap max-w-[280px] truncate">
                                {rev.comment}
                              </p>
                            </div>
                          </td>

                          {/* Date Column */}
                          <td className="py-3.5 pr-4 font-semibold text-slate-600 text-xs whitespace-nowrap">
                            <div className="whitespace-nowrap">
                              <div>{rev.date}</div>
                              <div className="text-[10px] text-slate-400">{rev.time}</div>
                            </div>
                          </td>

                          {/* Actions Column */}
                          <td className="py-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => setSelectedReview(rev)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-2xs"
                            >
                              <Eye size={13} />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Emerald Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3.5 border-t border-slate-100 text-xs text-slate-500 font-medium select-none">
                <div className="flex items-center gap-3">
                  <span>
                    Showing <strong className="text-slate-900 font-bold">{filteredReviews.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
                    <strong className="text-slate-900 font-bold">{Math.min(startIndex + itemsPerPage, filteredReviews.length)}</strong> of{' '}
                    <strong className="text-slate-900 font-bold">{filteredReviews.length}</strong> reviews
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
                    disabled={page === 1}
                    aria-label="Previous page"
                    onClick={() => setCurrentPage(Math.max(1, page - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  {getPageItems(page, totalPages).map((item) =>
                    typeof item === 'number' ? (
                      <button
                        key={item}
                        onClick={() => setCurrentPage(item)}
                        aria-label={'Page ' + item}
                        aria-current={page === item ? 'page' : undefined}
                        className={'min-w-7 h-7 px-1.5 rounded-lg text-xs font-bold transition-all ' + (page === item
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100')}
                      >
                        {item}
                      </button>
                    ) : (
                      <span key={item.key} className="w-5 text-center text-slate-400 font-bold" aria-hidden="true">
                        ...
                      </span>
                    )
                  )}
                  <button
                    disabled={page === totalPages}
                    aria-label="Next page"
                    onClick={() => setCurrentPage(Math.min(totalPages, page + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
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

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-base text-slate-900">Review from {selectedReview.name}</h3>
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
                  <span className="font-bold text-slate-900">{selectedReview.name}</span>
                  {renderStars(selectedReview.rating)}
                </div>
                <p className="text-slate-600 font-medium whitespace-pre-wrap break-words">"{selectedReview.comment}"</p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>
                  {selectedReview.courtName || 'Court'} · {selectedReview.turfName || 'Venue'}
                </span>
                <span>
                  {selectedReview.date} {selectedReview.time}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 rounded-xl border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Close
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
