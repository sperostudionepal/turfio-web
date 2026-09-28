import {
    MoreVertical,
    Star,
} from 'lucide-react';
import Avatar from '../common/Avatar';



function RatingStars({ rating }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
                <Star
                    key={index}
                    size={13}
                    strokeWidth={2}
                    className={
                        index < rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-100 text-slate-200'
                    }
                />
            ))}
        </div>
    );
}

function RecentReviews({ onViewAll, reviews = [] }) {
    return (
        <div className="h-full rounded-xl border border-slate-100 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-[16px] font-bold text-slate-900">
                    Recent Reviews
                </h3>

                <button
                    type="button"
                    onClick={onViewAll}
                    className="shrink-0 text-[12px] font-bold text-blue-500 transition-colors hover:text-blue-600"
                >
                    View All
                </button>
            </div>

            {/* Reviews */}
            <div className="mt-3">
                {reviews.map((review, index) => (
                    <div
                        key={review.id}
                        className={`
              flex
              items-start
              gap-3
              py-3
              ${index !== reviews.length - 1
                                ? 'border-b border-slate-100'
                                : ''
                            }
            `}
                    >
                        {/* Avatar */}
                        <Avatar name={review.name} src={review.avatarUrl} className="h-10 w-10" />

                        {/* Review */}
                        <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="truncate text-[12px] font-bold text-slate-800">
                                    {review.name}
                                </span>

                                <RatingStars rating={review.rating} />

                                <span className="ml-auto shrink-0 text-[10px] font-semibold text-slate-400">
                                    {review.date}
                                </span>
                            </div>

                            <p className="mt-1.5 truncate text-[11px] font-medium leading-relaxed text-slate-500">
                                {review.review}
                            </p>
                        </div>

                        {/* Menu */}
                        <button
                            type="button"
                            className="mt-0.5 flex h-7 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                        >
                            <MoreVertical
                                size={14}
                                strokeWidth={2}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentReviews;