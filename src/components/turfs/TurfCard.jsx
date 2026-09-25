import { Compass, Users, Car, Star, MapPin } from 'lucide-react';

/**
 * Shared turf card used by the landing page and the Find Turfs listing.
 * The location line sits under the rating; optional `status` renders below it; `actions` renders on the right of the price row.
 * Extra props (data-*, mouse handlers) are forwarded to the root element.
 */
export default function TurfCard({ turf, onClick, status = null, actions = null, className = '', ...rootProps }) {
  return (
    <div
      onClick={onClick}
      className={`group flex flex-col justify-between bg-white cursor-pointer ${className}`}
      {...rootProps}
    >
      <div className="w-full">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-slate-100">
          <img
            src={turf.image}
            alt={turf.title}
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
            <div className="flex text-lime-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-lime-400 text-lime-400" />
              ))}
            </div>
            <span className="ml-1 text-xs font-semibold text-slate-600">
              {turf.rating} ({turf.reviews})
            </span>
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
        {actions}
      </div>
    </div>
  );
}
