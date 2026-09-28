import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Download,
  Eye,
  MessageSquare,
  Search,
  Star,
  ThumbsUp,
} from 'lucide-react';

import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';

import BookingFilterSelect from '../../components/bookings/BookingFilterSelect';
import BookingPagination from '../../components/bookings/BookingPagination';
import ReviewDetailsModal, {
  ReviewStatusBadge,
  StarRating,
} from '../../components/reviews/ReviewDetailsModal';
import { ErrorNotice } from '../../components/dashboard/DashboardNotices';
import Avatar from '../../components/common/Avatar';

import reviewService from '../../../shared/services/reviewService';
import { downloadCsv } from '../../../shared/utils/reportExport';
import { getTodayNepalString } from '../../../shared/utils/dateTime';

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const RATING_OPTIONS = [
  { value: 'All', label: 'All Ratings' },
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4 Stars' },
  { value: 'low', label: '3 Stars & Below' },
];

const STATUS_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'Published', label: 'Published' },
  { value: 'Needs Response', label: 'Needs Response' },
  { value: 'Hidden', label: 'Hidden' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'lowest', label: 'Lowest Rated' },
];

const HEADER_CLASS =
  'px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wide text-slate-400';

const matchesRatingFilter = (review, filter) => {
  if (filter === '5') return review.rating === 5;
  if (filter === '4') return review.rating === 4;
  if (filter === 'low') return review.rating <= 3;
  return true;
};

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

/* -------------------------------------------------------------------------- */
/* Stat card (same markup and sizing as the dashboard StatCards)              */
/* -------------------------------------------------------------------------- */

function ReviewStatCard({
  icon: Icon,
  iconWrapper,
  iconColor,
  title,
  value,
  subtext,
  loading,
}) {
  return (
    <div className="flex items-center rounded-xl border border-slate-100 bg-white px-4 py-4 shadow-[0_3px_18px_rgba(15,23,42,0.025)]">
      <div
        className={`mr-4 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl ${iconWrapper}`}
      >
        <Icon size={23} strokeWidth={2} className={iconColor} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-2 text-[13px] font-medium leading-tight text-slate-500">
          {title}
        </p>

        <h3 className="truncate text-[20px] font-extrabold leading-none tracking-[-0.025em] text-slate-950">
          {loading ? (
            <span className="inline-block h-5 w-16 animate-pulse rounded-md bg-slate-100 align-middle" />
          ) : (
            value
          )}
        </h3>

        <p className="mt-2 truncate text-[12px] font-medium leading-tight text-slate-400">
          {subtext}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

function ReviewsPage({ activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [courtFilter, setCourtFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const [reviews, setReviews] = useState([]);
  const [loadStatus, setLoadStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [isRetrying, setIsRetrying] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedId, setSelectedId] = useState(null);

  const [reviewStats, setReviewStats] = useState(null);

  const loadReviews = useCallback(
    () =>
      Promise.all([reviewService.getOwnerReviews(), reviewService.getOwnerReviewStats()])
        .then(([items, stats]) => {
          setReviews(items);
          setReviewStats(stats);
          setLoadStatus('ready');
        })
        .catch(() => setLoadStatus('error')),
    []
  );

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const retryLoad = async () => {
    setIsRetrying(true);
    await loadReviews();
    setIsRetrying(false);
  };

  const showSkeleton = loadStatus === 'loading';

  const statusOf = useCallback((review) => review.status, []);

  /* ---------------------------------------------------------------------- */
  /* Stats                                                                  */
  /* ---------------------------------------------------------------------- */

  const stats = {
    average: reviewStats?.average ?? '—',
    total: reviewStats?.total ?? '—',
    positivePercent: reviewStats ? `${reviewStats.positivePercent}%` : '—',
    positive: reviewStats?.positive ?? '—',
    lowRated: reviewStats?.lowRated ?? '—',
  };

  /* ---------------------------------------------------------------------- */
  /* Filters                                                                */
  /* ---------------------------------------------------------------------- */

  const courtOptions = useMemo(
    () => [
      { value: 'All', label: 'All Courts' },
      ...[...new Set(reviews.map((review) => review.courtName).filter(Boolean))]
        .sort()
        .map((court) => ({ value: court, label: court })),
    ],
    [reviews]
  );

  const filteredReviews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matched = reviews.filter((review) => {
      const matchesSearch =
        !query ||
        [
          review.name,
          review.email,
          review.comment,
          review.courtName,
          review.turfName,
          review.bookingId,
        ].some((field) => (field || '').toLowerCase().includes(query));

      return (
        matchesSearch &&
        matchesRatingFilter(review, ratingFilter) &&
        (courtFilter === 'All' || review.courtName === courtFilter) &&
        (statusFilter === 'All' || statusOf(review) === statusFilter)
      );
    });

    // Reviews arrive newest-first from the service, so we only reorder here.
    if (sortBy === 'oldest') return [...matched].reverse();
    if (sortBy === 'highest') {
      return [...matched].sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'lowest') {
      return [...matched].sort((a, b) => a.rating - b.rating);
    }
    return matched;
  }, [
    reviews,
    searchQuery,
    ratingFilter,
    courtFilter,
    statusFilter,
    sortBy,
    statusOf,
  ]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    ratingFilter !== 'All' ||
    courtFilter !== 'All' ||
    statusFilter !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setRatingFilter('All');
    setCourtFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  const withReset = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  /* ---------------------------------------------------------------------- */
  /* Pagination                                                             */
  /* ---------------------------------------------------------------------- */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / itemsPerPage)
  );
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  /* ---------------------------------------------------------------------- */
  /* Modal                                                                  */
  /* ---------------------------------------------------------------------- */

  const selectedIndex = filteredReviews.findIndex(
    (review) => review.id === selectedId
  );
  const selectedReview =
    selectedIndex >= 0 ? filteredReviews[selectedIndex] : null;

  const openReview = (review) => setSelectedId(review.id);
  const closeReview = useCallback(() => setSelectedId(null), []);

  const goTo = (offset) => {
    const next = filteredReviews[selectedIndex + offset];
    if (next) setSelectedId(next.id);
  };

  const refreshReviews = async () => { const [items, nextStats] = await Promise.all([reviewService.getOwnerReviews(), reviewService.getOwnerReviewStats()]); setReviews(items); setReviewStats(nextStats); };
  const handlePostReply = async (text) => { await reviewService.replyToReview(selectedId, text); await refreshReviews(); };
  const handleToggleHide = async () => { if (!selectedReview) return; await reviewService.setReviewVisibility(selectedId, !selectedReview.isHidden); await refreshReviews(); };
  const handleReport = async () => { await reviewService.reportReview(selectedId); await refreshReviews(); };

  /* ---------------------------------------------------------------------- */
  /* Export                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleExport = () => {
    if (filteredReviews.length === 0) return;

    const header = [
      'Customer',
      'Email',
      'Booking ID',
      'Court',
      'Venue',
      'Rating',
      'Review',
      'Status',
      'Date',
    ]
      .map(csvCell)
      .join(',');

    const rows = filteredReviews.map((review) =>
      [
        review.name,
        review.email,
        review.bookingId,
        review.courtName,
        review.turfName,
        review.rating,
        review.comment,
        statusOf(review),
        `${review.date} ${review.time}`,
      ]
        .map(csvCell)
        .join(',')
    );

    downloadCsv(
      `turfio-reviews-${getTodayNepalString()}.csv`,
      [header, ...rows].join('\n')
    );
  };

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      <div className="relative flex h-screen flex-col overflow-hidden bg-white font-sans text-slate-900 antialiased select-none">
        <TopBar />

        <div className="relative flex min-h-0 flex-1">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="scrollbar-thin flex-1 overflow-y-auto">
              <div className="mx-auto w-full space-y-6 px-5 py-6 md:px-6 md:py-7 xl:px-7">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                      Reviews
                    </h1>

                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Manage customer reviews, respond to feedback, and
                      maintain your venue&apos;s reputation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleExport}
                    disabled={filteredReviews.length === 0}
                    title={
                      filteredReviews.length === 0
                        ? 'No reviews to export'
                        : `Download ${filteredReviews.length} review${filteredReviews.length === 1 ? '' : 's'
                        } as CSV`
                    }
                    className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-xs font-bold text-slate-900 transition-colors hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download size={14} />
                    <span>Export Reviews</span>
                  </button>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <ReviewStatCard
                    icon={Star}
                    iconWrapper="bg-amber-50"
                    iconColor="text-amber-500"
                    title="Average Rating"
                    value={`${stats.average} / 5`}
                    subtext={`Across ${stats.total} review${stats.total === 1 ? '' : 's'}`}
                    loading={showSkeleton}
                  />

                  <ReviewStatCard
                    icon={MessageSquare}
                    iconWrapper="bg-blue-50"
                    iconColor="text-blue-600"
                    title="Total Reviews"
                    value={stats.total.toLocaleString()}
                    subtext="All time customer ratings"
                    loading={showSkeleton}
                  />

                  <ReviewStatCard
                    icon={ThumbsUp}
                    iconWrapper="bg-lime-100"
                    iconColor="text-green-600"
                    title="Positive Reviews"
                    value={stats.positivePercent}
                    subtext={`${stats.positive} rated 4 stars or more`}
                    loading={showSkeleton}
                  />

                  <ReviewStatCard
                    icon={AlertCircle}
                    iconWrapper="bg-rose-50"
                    iconColor="text-rose-500"
                    title="Needs Attention"
                    value={stats.lowRated.toLocaleString()}
                    subtext="Rated 3 stars or below"
                    loading={showSkeleton}
                  />
                </div>

                {/* Reviews table card */}
                <div className="overflow-visible rounded-xl border border-slate-100 bg-white shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
                  {/* Filters */}
                  <div className="border-b border-slate-100 px-5 py-3">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                      <div className="relative min-w-[260px] flex-1 xl:max-w-[420px]">
                        <Search
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(event) => {
                            setSearchQuery(event.target.value);
                            setCurrentPage(1);
                          }}
                          placeholder="Search reviews by name, booking ID, or comment..."
                          className="h-[44px] w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-[12px] font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-lime-400"
                        />
                      </div>

                      <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap xl:w-auto xl:flex-nowrap xl:justify-end">
                        <BookingFilterSelect
                          value={ratingFilter}
                          onChange={withReset(setRatingFilter)}
                          className="w-full sm:w-[150px]"
                          options={RATING_OPTIONS}
                        />

                        <BookingFilterSelect
                          value={courtFilter}
                          onChange={withReset(setCourtFilter)}
                          className="w-full sm:w-[150px]"
                          options={courtOptions}
                        />

                        <BookingFilterSelect
                          value={statusFilter}
                          onChange={withReset(setStatusFilter)}
                          className="w-full sm:w-[165px]"
                          options={STATUS_OPTIONS}
                        />

                        <BookingFilterSelect
                          value={sortBy}
                          onChange={withReset(setSortBy)}
                          className="w-full sm:w-[160px]"
                          options={SORT_OPTIONS}
                        />

                        {hasActiveFilters && (
                          <button
                            type="button"
                            onClick={clearFilters}
                            className="h-[44px] shrink-0 px-2 text-[12px] font-bold text-slate-500 hover:text-slate-900"
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {loadStatus === 'error' && (
                    <div className="px-5 pt-4">
                      <ErrorNotice
                        message="Couldn't load your reviews."
                        onRetry={retryLoad}
                        busy={isRetrying}
                      />
                    </div>
                  )}

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1150px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className={HEADER_CLASS}>Customer</th>
                          <th className={HEADER_CLASS}>Rating</th>
                          <th className={HEADER_CLASS}>Review</th>
                          <th className={HEADER_CLASS}>Booking</th>
                          <th className={HEADER_CLASS}>Date</th>
                          <th className={HEADER_CLASS}>Status</th>
                          <th className={`${HEADER_CLASS} text-right`}>
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {showSkeleton ? (
                          Array.from({ length: 10 }, (_, index) => (
                            <tr
                              key={index}
                              className="border-b border-slate-100"
                            >
                              <td colSpan={7} className="px-5 py-3">
                                <div className="h-11 animate-pulse rounded-lg bg-slate-50" />
                              </td>
                            </tr>
                          ))
                        ) : paginatedReviews.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-16 text-center">
                              <p className="text-[14px] font-bold text-slate-800">
                                {loadStatus === 'error' && reviews.length === 0
                                  ? "Reviews couldn't be loaded"
                                  : reviews.length === 0
                                    ? 'No reviews yet'
                                    : 'No reviews match your filters'}
                              </p>

                              <p className="mt-1 text-[12px] font-medium text-slate-400">
                                {loadStatus === 'error' && reviews.length === 0
                                  ? 'Use Retry above to try again.'
                                  : reviews.length === 0
                                    ? 'Reviews players leave on your courts will show up here.'
                                    : 'Try changing or clearing your filters.'}
                              </p>

                              {hasActiveFilters && (
                                <button
                                  type="button"
                                  onClick={clearFilters}
                                  className="mt-3 text-[12px] font-bold text-lime-600"
                                >
                                  Clear filters
                                </button>
                              )}
                            </td>
                          </tr>
                        ) : (
                          paginatedReviews.map((review) => {
                            const images = review.images || review.photos || [];
                            const status = statusOf(review);

                            return (
                              <tr
                                key={review.id}
                                onClick={() => openReview(review)}
                                className="h-[58px] cursor-pointer border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/70"
                              >
                                {/* Customer */}
                                <td className="px-4 py-3">
                                  <div className="flex min-w-[190px] items-center gap-2.5">
                                    <Avatar name={review.name} src={review.avatar} className="h-8 w-8 border border-slate-100" />

                                    <div className="min-w-0">
                                      <p className="max-w-[160px] truncate text-[13px] font-bold text-slate-900">
                                        {review.name}
                                      </p>

                                      <p className="mt-0.5 max-w-[160px] truncate text-[11px] font-medium text-slate-400">
                                        {review.bookingsCount != null
                                          ? `${review.bookingsCount} bookings`
                                          : review.email || '—'}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                {/* Rating */}
                                <td className="px-4 py-3">
                                  <StarRating rating={review.rating} />
                                </td>

                                {/* Review + photos */}
                                <td className="px-4 py-3">
                                  <div className="flex min-w-[340px] items-center gap-3">
                                    <p
                                      title={review.comment}
                                      className="w-[190px] shrink-0 truncate text-[13px] font-medium text-slate-600"
                                    >
                                      {review.comment || '—'}
                                    </p>

                                    {images.length > 0 ? (
                                      <div className="flex items-center gap-1.5">
                                        {images.slice(0, 3).map((src, index) => (
                                          <img
                                            key={`${src}-${index}`}
                                            src={src}
                                            alt=""
                                            className="h-8 w-8 rounded-md object-cover"
                                          />
                                        ))}

                                        {images.length > 3 && (
                                          <span className="text-[11px] font-semibold text-slate-400">
                                            +{images.length - 3}
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-[11px] font-medium text-slate-400">
                                        No images
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Booking */}
                                <td className="px-4 py-3">
                                  <p className="whitespace-nowrap text-[13px] font-bold text-slate-800">
                                    {review.bookingId || '—'}
                                  </p>

                                  <p className="mt-0.5 whitespace-nowrap text-[11px] font-medium text-slate-400">
                                    {review.courtName || 'Court'}
                                  </p>
                                </td>

                                {/* Date */}
                                <td className="px-4 py-3">
                                  <p className="whitespace-nowrap text-[13px] font-medium text-slate-600">
                                    {review.date}
                                  </p>

                                  <p className="mt-0.5 whitespace-nowrap text-[11px] font-medium text-slate-400">
                                    {review.time}
                                  </p>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3">
                                  <ReviewStatusBadge status={status} />
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3 text-right">
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openReview(review);
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-700 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                                  >
                                    <Eye size={13} />
                                    <span>View</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <BookingPagination
                    filteredBookingsCount={filteredReviews.length}
                    itemsPerPage={itemsPerPage}
                    label="reviews"
                    onItemsPerPageChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                    onPageChange={setCurrentPage}
                    page={page}
                    startIndex={startIndex}
                    totalPages={totalPages}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <ReviewDetailsModal
        review={selectedReview}
        status={selectedReview ? statusOf(selectedReview) : 'Published'}
        reply={selectedReview?.reply || ''}
        hidden={Boolean(selectedReview?.isHidden)}
        reported={Boolean(selectedReview?.isReported)}
        position={selectedIndex + 1}
        total={filteredReviews.length}
        onClose={closeReview}
        onPrev={selectedIndex > 0 ? () => goTo(-1) : undefined}
        onNext={
          selectedIndex >= 0 && selectedIndex < filteredReviews.length - 1
            ? () => goTo(1)
            : undefined
        }
        onPostReply={handlePostReply}
        onToggleHide={handleToggleHide}
        onReport={handleReport}
      />
    </>
  );
}

export default ReviewsPage;