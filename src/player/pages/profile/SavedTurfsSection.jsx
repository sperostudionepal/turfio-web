import { useState } from 'react';
import { ArrowRight, Heart, Loader2 } from 'lucide-react';
import TurfCard from '../../components/turfs/TurfCard';
import { getTurfDetailsPath, getTurfRoutePath } from '../../../shared/utils/turfPaths';

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
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-lime-400 px-4 py-2.5 text-xs font-bold text-slate-900 transition-colors hover:bg-lime-500 sm:text-sm"
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
          <h3 className="text-base font-bold text-slate-900">No saved turfs</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs font-medium leading-5 text-slate-500 sm:text-sm">
            Save your favourite venues and they will appear here for quick access.
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
          {items.map((turf) => {
            const turfId = turf?.id || turf?._id;

            return (
              <div key={turfId} className="relative">
                <TurfCard
                  turf={turf}
                  onSelect={() => onNavigate(getTurfDetailsPath(turf))}
                  onDirections={() => onNavigate(getTurfRoutePath(turf))}
                  className="h-full select-none rounded-[22px]"
                />
                <button
                  type="button"
                  aria-label="Remove saved turf"
                  disabled={removingId === turfId}
                  onClick={(e) => handleRemove(e, turfId)}
                  className="absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/95 text-rose-500 shadow-sm backdrop-blur transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {removingId === turfId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className="h-4 w-4 fill-current" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
