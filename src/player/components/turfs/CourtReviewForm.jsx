import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Loader2, Star, Trash2 } from 'lucide-react';
import reviewService from '../../../shared/services/reviewService';
import { useToast } from '../../../shared/components/common/toastContext';

const COMMENT_MAX_LENGTH = 2000;

/* ─── Clickable Star Input ─── */
function StarInput({ value, onChange, size = 'h-8 w-8' }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            className={`${size} transition-colors ${
              star <= active ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/**
 * Lets a signed-in player rate one court of a turf and leave a review message. A player gets one
 * review per court, so a court they already reviewed is loaded for editing instead of resubmitted.
 *
 * Remount this (via `key`) when the court the player is looking at changes, so the form starts
 * from that court's existing review rather than the previous one.
 */
export default function CourtReviewForm({
  turfId,
  courts = [],
  defaultCourtId,
  user,
  reviews = [],
  onSaved,
}) {
  const { showToast } = useToast();
  const location = useLocation();
  const userId = user?._id || user?.id;

  const courtOptions = useMemo(
    () =>
      courts
        .filter((court) => court._id || court.id)
        .map((court) => ({ id: String(court._id || court.id), name: court.name })),
    [courts],
  );

  const [pickedCourtId, setPickedCourtId] = useState(() => {
    const preferred = defaultCourtId ? String(defaultCourtId) : '';
    return courtOptions.some((option) => option.id === preferred)
      ? preferred
      : courtOptions[0]?.id || '';
  });
  const courtId = courtOptions.some((option) => option.id === pickedCourtId)
    ? pickedCourtId
    : courtOptions[0]?.id || '';

  const myReview = useMemo(
    () =>
      reviews.find(
        (review) => String(review.userId) === String(userId) && String(review.courtId) === courtId,
      ),
    [reviews, userId, courtId],
  );

  const [rating, setRating] = useState(myReview?.rating || 0);
  const [comment, setComment] = useState(myReview?.comment || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!userId) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-center">
        <h4 className="text-base font-bold text-slate-900 tracking-tight">Played on this turf?</h4>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Log in to rate a court and share your experience with other players.
        </p>
        <Link
          to={`/login?redirectTo=${encodeURIComponent(location.pathname + location.search)}`}
          className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-full bg-lime-400 px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-lime-500 active:scale-[0.98]"
        >
          Log In To Review
        </Link>
      </div>
    );
  }

  if (courtOptions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm font-medium text-slate-500">
        This venue hasn't listed its courts yet, so reviews aren't open.
      </div>
    );
  }

  const selectedCourt = courtOptions.find((option) => option.id === courtId);

  const handleCourtChange = (nextCourtId) => {
    setPickedCourtId(nextCourtId);
    const existing = reviews.find(
      (review) => String(review.userId) === String(userId) && String(review.courtId) === nextCourtId,
    );
    setRating(existing?.rating || 0);
    setComment(existing?.comment || '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!rating) {
      showToast('Please pick a star rating', 'error');
      return;
    }
    if (!comment.trim()) {
      showToast('Please write a review message', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (myReview) {
        await reviewService.updateReview(myReview.id, { rating, comment: comment.trim() });
        showToast('Your review was updated', 'success');
      } else {
        await reviewService.createReview(turfId, { courtId, rating, comment: comment.trim() });
        showToast(`Thanks for reviewing ${selectedCourt?.name || 'this court'}!`, 'success');
      }
      await onSaved?.();
    } catch (err) {
      showToast(err.message || 'Could not save your review', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!myReview) return;
    setIsDeleting(true);
    try {
      await reviewService.deleteReview(myReview.id);
      showToast('Your review was deleted', 'info');
      setRating(0);
      setComment('');
      await onSaved?.();
    } catch (err) {
      showToast(err.message || 'Could not delete your review', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-slate-900 tracking-tight">
            {myReview ? 'Edit your review' : 'Rate this court'}
          </h4>
          <p className="mt-0.5 text-[13px] font-medium text-slate-500">
            The turf rating is the average of all its courts.
          </p>
        </div>
        {myReview && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Delete
          </button>
        )}
      </div>

      {/* Court selector */}
      <div className="mt-5">
        <label htmlFor="review-court" className="mb-1 block text-xs font-bold text-slate-700">
          Which court did you play on?
        </label>
        <div className="relative">
          <select
            id="review-court"
            value={courtId}
            onChange={(event) => handleCourtChange(event.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-10 text-sm font-semibold text-slate-900 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-400/30"
          >
            {courtOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>
        {myReview && (
          <p className="mt-1.5 text-xs font-medium text-slate-400">
            You already reviewed {selectedCourt?.name || 'this court'} — pick another court to review
            it too.
          </p>
        )}
      </div>

      {/* Star rating */}
      <div className="mt-5">
        <span className="mb-1.5 block text-xs font-bold text-slate-700">Your rating</span>
        <div className="flex items-center gap-3">
          <StarInput value={rating} onChange={setRating} />
          <span className="text-sm font-bold text-slate-900">{rating ? `${rating}.0` : '—'}</span>
        </div>
      </div>

      {/* Review message */}
      <div className="mt-5">
        <label htmlFor="review-comment" className="mb-1 block text-xs font-bold text-slate-700">
          Review message
        </label>
        <textarea
          id="review-comment"
          rows={4}
          value={comment}
          maxLength={COMMENT_MAX_LENGTH}
          onChange={(event) => setComment(event.target.value)}
          placeholder="How was the pitch, the lighting and the overall experience?"
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-400/30"
        />
        <div className="mt-1 text-right text-[11px] font-semibold text-slate-400">
          {comment.length}/{COMMENT_MAX_LENGTH}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving || isDeleting}
        className="mt-2 w-full cursor-pointer rounded-full bg-lime-400 py-3 text-sm font-black text-slate-950 transition-all hover:bg-lime-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </span>
        ) : myReview ? (
          'Update Review'
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
}
