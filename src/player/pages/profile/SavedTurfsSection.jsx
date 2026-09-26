import { useState } from 'react';
import { ArrowRight, Eye, Heart, Loader2, MapPin, Star } from 'lucide-react';

export default function SavedTurfsSection({
  items,
  isLoading,
  onRemove,
  onNavigate,
  onFindTurfs,
}) {
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = async (e, turfId) => {
    e.stopPropagation();

    try {
      setRemovingId(turfId);

      await onRemove(turfId);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="rounded-xl bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
            Saved Turfs
          </h2>

          <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
            Quickly return to the venues you have saved.
          </p>
        </div>

        <button
          type="button"
          onClick={onFindTurfs}
          className="
            inline-flex
            cursor-pointer
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-lime-400
            px-4
            py-2.5
            text-xs
            font-bold
            text-slate-900
            transition-colors
            hover:bg-lime-500
            sm:text-sm
          "
        >
          Find Turfs

          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-lime-500" />
        </div>
      ) : !items?.length ? (
        <div className="px-5 py-16 text-center sm:px-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <Heart className="h-6 w-6" />
          </div>

          <h3 className="text-base font-bold text-slate-900">
            No saved turfs
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs font-medium leading-5 text-slate-500 sm:text-sm">
            Save your favourite venues and they will appear here for quick
            access.
          </p>

          <button
            type="button"
            onClick={onFindTurfs}
            className="mt-5 cursor-pointer text-sm font-bold text-lime-700 hover:text-lime-800"
          >
            Explore turfs
          </button>
        </div>
      ) : (
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
          {items.map((item) => {
            const turf = item?.turf || item;

            const turfId =
              turf?._id ||
              turf?.id;

            const image =
              turf?.images?.[0]?.url ||
              turf?.images?.[0] ||
              turf?.image;

            const location =
              turf?.location ||
              turf?.address;

            return (
              <article
                key={turfId}
                className="
                  group
                  overflow-hidden
                  rounded-xl
                  bg-white
                  ring-1
                  ring-slate-100
                  transition-all
                  hover:ring-slate-200
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    onNavigate(`/turfs/${turfId}`)
                  }
                  className="block w-full cursor-pointer text-left"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    {image ? (
                      <img
                        src={image}
                        alt={
                          turf?.name ||
                          'Saved turf'
                        }
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <MapPin className="h-8 w-8" />
                      </div>
                    )}

                    <button
                      type="button"
                      aria-label="Remove saved turf"
                      disabled={removingId === turfId}
                      onClick={(e) =>
                        handleRemove(e, turfId)
                      }
                      className="
                        absolute
                        right-3
                        top-3
                        flex
                        h-9
                        w-9
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-full
                        bg-white/95
                        text-rose-500
                        shadow-sm
                        backdrop-blur
                        transition-colors
                        hover:bg-white
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {removingId === turfId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className="h-4 w-4 fill-current" />
                      )}
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="truncate text-sm font-bold text-slate-900">
                      {turf?.name ||
                        'Saved Turf'}
                    </h3>

                    {location && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />

                        <span className="truncate">
                          {typeof location === 'string'
                            ? location
                            : location?.address ||
                            location?.city}
                        </span>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />

                        <span className="text-xs font-bold text-slate-700">
                          {turf?.rating ||
                            'New'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-lime-700">
                        <Eye className="h-3.5 w-3.5" />

                        View Turf
                      </div>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}