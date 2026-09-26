import { X } from 'lucide-react';
import { useOwnerAuth } from '../../../shared/store/useAuthStore';

// Shown to a venue owner until they dismiss it after their listing request was approved.
export default function ApprovalBanner() {
  const show = useOwnerAuth((s) => s.user?.role === 'admin' && s.user?.turfApprovalBannerSeen === false);
  const dismiss = useOwnerAuth((s) => s.dismissTurfBanner);

  if (!show) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-lime-100 bg-lime-50 px-4 py-3 text-[13px] font-medium text-slate-900">
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-base" aria-hidden="true">🎉</span>
        <span>Congratulations! Your turf listing request has been approved and your venue is ready.</span>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss notification"
        title="Dismiss notification"
        className="shrink-0 cursor-pointer rounded-full p-1 text-slate-500 transition-colors hover:bg-lime-100/80 hover:text-slate-800"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
