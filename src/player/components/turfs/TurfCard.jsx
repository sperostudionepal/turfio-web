import { Compass, Users, Car, Star, MapPin, Navigation } from 'lucide-react';

/**
 * Shared turf card used by the landing page and the Find Turfs listing.
 * Card click and "Book Now" call onSelect(turf); the arrow button calls onDirections(turf).
 * The location line sits under the rating; optional `status` renders below it.
 * Extra props (data-*, mouse handlers) are forwarded to the root element.
 */
/**
 * @typedef {Object} TurfCardProps
 * @property {Object} turf
 * @property {(turf: Object) => void} [onSelect]
 * @property {(turf: Object) => void} [onDirections]
 * @property {string|null} [status]
 * @property {string} [className]
 */
/** @param {TurfCardProps & Record<string, unknown>} props */
export default function TurfCard({ turf, onSelect, onDirections, status = null, className = '', ...rootProps }) {
  return (
    <div
      onClick={() => onSelect?.(turf)}
      className={`group flex flex-col justify-between bg-white cursor-pointer ${className}`}
      {...rootProps}
    >
      <div className="w-full">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-slate-100">
          <img
            src={turf.image}
            alt={turf.title}
            width="800"
            height="450"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/image.png';
            }}
          />
        </div>

        <div className="pt-3 px-0 pb-0">
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
            {turf.type && (
              <span className="flex items-center gap-1">
                <Compass className="h-3.5 w-3.5 text-slate-400" />
                {turf.type}
              </span>
            )}
            {turf.size && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                {turf.size}
              </span>
            )}
            {turf.parking && (
              <span className="flex items-center gap-1">
                <Car className="h-3.5 w-3.5 text-slate-400" />
                {turf.parking}
              </span>
            )}
          </div>

          <h3 className="mt-2 text-base font-bold text-slate-900 group-hover:text-lime-600 transition-colors truncate">
            {turf.title}
          </h3>

          <div className="mt-1 flex items-center gap-1">
            {turf.reviews > 0 ? (
              <>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(turf.rating)
                          ? 'fill-lime-400 text-lime-400'
                          : i < turf.rating
                            ? 'fill-lime-400/50 text-lime-400'
                            : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-xs font-semibold text-slate-600">
                  {Number(turf.rating).toFixed(1)} ({turf.reviews})
                </span>
              </>
            ) : (
              <span className="text-xs font-semibold text-slate-400">No reviews yet</span>
            )}
          </div>

          {turf.location && (
            <p className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{turf.location}</span>
            </p>
          )}

          {status && <div className="mt-1 flex items-center gap-1">{status}</div>}
        </div>
      </div>

      <div className="pt-3 px-0 pb-1 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600">{turf.price}</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDirections?.(turf);
            }}
            title="Get Directions"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-lime-100 hover:text-lime-800 text-slate-700 transition-all active:scale-95 cursor-pointer"
          >
            <Navigation className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(turf);
            }}
            className="rounded-full bg-lime-400 px-4 py-2 text-xs font-bold text-slate-900 transition-all hover:bg-lime-500 active:scale-95 cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
