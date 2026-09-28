import { useEffect, useState } from 'react';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    CircleDot,
    Eye,
    EyeOff,
    Flag,
    Hash,
    MapPin,
    Send,
    Star,
    Users,
    X,
} from 'lucide-react';
import Avatar from '../common/Avatar';

/* -------------------------------------------------------------------------- */
/* Shared bits (also used by ReviewsPage)                                     */
/* -------------------------------------------------------------------------- */

export function StarRating({ rating = 0, size = 13 }) {
    return (
        <div
            className="flex items-center gap-0.5"
            aria-label={`${rating} out of 5 stars`}
        >
            {Array.from({ length: 5 }, (_, index) => (
                <Star
                    key={index}
                    size={size}
                    className={
                        index < Math.round(rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-100 text-slate-200'
                    }
                />
            ))}
        </div>
    );
}

const STATUS_STYLES = {
    Published: 'bg-lime-50 text-lime-700',
    'Needs Response': 'bg-amber-50 text-amber-700',
    Hidden: 'bg-slate-100 text-slate-600',
};

export function ReviewStatusBadge({ status }) {
    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-bold leading-none ${STATUS_STYLES[status] || STATUS_STYLES.Published
                }`}
        >
            {status}
        </span>
    );
}

/* -------------------------------------------------------------------------- */
/* Reply panel (right column)                                                 */
/* Keyed by review id in the parent so its text resets when you navigate.     */
/* -------------------------------------------------------------------------- */

function ReplyPanel({
    review,
    reply,
    hidden,
    reported,
    onPostReply,
    onToggleHide,
    onReport,
}) {
    const firstName = (review.name || 'there').split(' ')[0];
    const template = `Thank you ${firstName}! We're glad you had a great experience. Looking forward to seeing you again${review.turfName ? ` at ${review.turfName}` : ''
        }!`;

    const [text, setText] = useState(
        reply || (review.rating >= 4 ? template : '')
    );
    const [saved, setSaved] = useState(false);

    const handlePost = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        onPostReply(trimmed);
        setSaved(true);
    };

    return (
        <div className="flex h-full flex-col gap-6">
            {/* Reply */}
            <section>
                <h4 className="text-[14px] font-bold text-slate-900">
                    Reply to Review
                </h4>

                <p className="mt-1 text-[12px] font-medium text-slate-400">
                    {reply
                        ? 'You replied to this review. Edit your reply below.'
                        : `Your reply is shown publicly under ${firstName}'s review.`}
                </p>

                <textarea
                    value={text}
                    onChange={(event) => {
                        setText(event.target.value.slice(0, 500));
                        setSaved(false);
                    }}
                    rows={6}
                    placeholder="Write a reply..."
                    className="mt-3 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13px] font-medium leading-relaxed text-slate-700 outline-none placeholder:text-slate-400 focus:border-lime-400"
                />

                <div className="mt-1.5 flex items-center justify-between">
                    <span
                        className={`text-[11px] font-semibold text-lime-700 transition-opacity ${saved ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        Reply saved
                    </span>

                    <span className="text-[11px] font-medium text-slate-400">
                        {text.length}/500
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handlePost}
                    disabled={!text.trim()}
                    className="mt-3 flex cursor-pointer items-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-xs font-bold text-slate-900 transition-colors hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Send size={14} />
                    <span>{reply ? 'Update Reply' : 'Post Reply'}</span>
                </button>
            </section>

            {/* Other actions */}
            <section className="border-t border-slate-100 pt-5">
                <h4 className="text-[14px] font-bold text-slate-900">
                    Other Actions
                </h4>

                <div className="mt-3 flex flex-wrap gap-2.5">
                    <button
                        type="button"
                        onClick={onToggleHide}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-[12px] font-bold text-slate-700 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                    >
                        {hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                        <span>{hidden ? 'Show Review' : 'Hide Review'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={onReport}
                        disabled={reported}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3.5 py-2 text-[12px] font-bold text-rose-600 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Flag size={14} />
                        <span>{reported ? 'Reported' : 'Report'}</span>
                    </button>
                </div>
            </section>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Modal                                                                      */
/* -------------------------------------------------------------------------- */

function ReviewDetailsModal({
    review,
    status,
    reply = '',
    hidden = false,
    reported = false,
    position,
    total,
    onClose,
    onPrev,
    onNext,
    onPostReply,
    onToggleHide,
    onReport,
}) {
    useEffect(() => {
        if (!review) return undefined;

        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [review, onClose]);

    if (!review) return null;

    const images = review.images || review.photos || [];
    const shownImages = images.slice(0, 3);
    const extraImages = images.length - shownImages.length;

    const bookingRows = [
        { icon: Hash, label: 'Booking ID', value: review.bookingId || '—' },
        { icon: CircleDot, label: 'Court', value: review.courtName || '—' },
        { icon: MapPin, label: 'Venue', value: review.turfName || '—' },
        {
            icon: CalendarDays,
            label: 'Date & Time',
            value: [review.date, review.time].filter(Boolean).join(' · ') || '—',
        },
        {
            icon: Users,
            label: 'Players',
            value: review.players ? `${review.players} players` : '—',
        },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={`Review from ${review.name}`}
                onClick={(event) => event.stopPropagation()}
                className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <h3 className="text-[16px] font-extrabold text-slate-900">
                        Review Details
                    </h3>

                    <div className="flex items-center gap-2">
                        {total > 1 && (
                            <span className="mr-1 text-[12px] font-medium text-slate-400">
                                {position} of {total}
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={onPrev}
                            disabled={!onPrev}
                            aria-label="Previous review"
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={15} />
                        </button>

                        <button
                            type="button"
                            onClick={onNext}
                            disabled={!onNext}
                            aria-label="Next review"
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronRight size={15} />
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Body: details on the left, reply on the right */}
                <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-2 md:overflow-hidden">
                    {/* Left: review details */}
                    <div className="scrollbar-thin space-y-5 p-5 md:overflow-y-auto md:border-r md:border-slate-100">
                        {/* Customer */}
                        <div className="flex items-start gap-3">
                            <Avatar name={review.name} src={review.avatar} className="h-11 w-11" />

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[15px] font-bold text-slate-900">
                                    {review.name}
                                </p>

                                <p className="mt-0.5 truncate text-[12px] font-medium text-slate-400">
                                    {review.bookingsCount != null
                                        ? `${review.bookingsCount} bookings`
                                        : review.email || '—'}
                                </p>
                            </div>

                            <div className="shrink-0 text-right">
                                <p className="text-[12px] font-medium text-slate-500">
                                    {review.date}
                                </p>

                                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                                    {review.time}
                                </p>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <StarRating rating={review.rating} size={18} />

                                <span className="text-[18px] font-extrabold leading-none text-slate-900">
                                    {Number(review.rating).toFixed(1)}
                                </span>
                            </div>

                            <ReviewStatusBadge status={status} />
                        </div>

                        {/* Comment */}
                        <p className="whitespace-pre-wrap break-words text-[13px] font-medium leading-relaxed text-slate-600">
                            {review.comment || 'No written feedback.'}
                        </p>

                        {/* Photos */}
                        {shownImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {shownImages.map((src, index) => (
                                    <div
                                        key={`${src}-${index}`}
                                        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100"
                                    >
                                        <img
                                            src={src}
                                            alt={`Review photo ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />

                                        {extraImages > 0 && index === shownImages.length - 1 && (
                                            <span className="absolute inset-0 flex items-center justify-center bg-slate-900/50 text-[13px] font-bold text-white">
                                                +{extraImages}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Booking information */}
                        <div className="rounded-xl border border-slate-100 p-4">
                            <h4 className="text-[13px] font-bold text-slate-900">
                                Booking Information
                            </h4>

                            <dl className="mt-3 space-y-2.5">
                                {bookingRows.map(({ icon: Icon, label, value }) => (
                                    <div
                                        key={label}
                                        className="grid grid-cols-[120px_1fr] items-center gap-3"
                                    >
                                        <dt className="flex items-center gap-2 text-[12px] font-medium text-slate-400">
                                            <Icon size={13} className="shrink-0" />
                                            {label}
                                        </dt>

                                        <dd className="min-w-0 truncate text-[12px] font-semibold text-slate-700">
                                            {value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>

                    {/* Right: reply + actions */}
                    <div className="scrollbar-thin p-5 md:overflow-y-auto">
                        <ReplyPanel
                            key={review.id}
                            review={review}
                            reply={reply}
                            hidden={hidden}
                            reported={reported}
                            onPostReply={onPostReply}
                            onToggleHide={onToggleHide}
                            onReport={onReport}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewDetailsModal;