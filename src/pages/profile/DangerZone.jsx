import { useState } from 'react';
import { AlertTriangle, Trash2, ShieldAlert, Loader2 } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export default function DangerZone({ user, onDeleteAccount }) {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const REQUIRED_CONFIRM_TEXT = 'DELETE';
  const isMatch = confirmInput.trim() === REQUIRED_CONFIRM_TEXT || confirmInput.trim().toLowerCase() === user?.email?.toLowerCase();

  const handleDelete = async () => {
    if (!isMatch || isDeleting) return;

    try {
      setIsDeleting(true);
      const res = await onDeleteAccount();
      if (res.success) {
        showToast('Your account has been permanently deleted.', 'info');
        window.location.href = '/';
      } else {
        showToast(res.error || 'Failed to delete account.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error deleting account.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3 pb-2">
        <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-rose-600 tracking-tight">Danger Zone</h3>
          <p className="text-xs font-medium text-slate-500">Irreversible account operations and account termination</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-rose-50/50">
        <div>
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Delete Account</h4>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            Permanently delete your user profile, booking history, and personal settings from Turfio
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setConfirmInput('');
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 font-bold">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Confirm Account Deletion</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">
              This action is <strong className="text-rose-600">permanent and cannot be undone</strong>. All your player stats, venue bookings, and reviews will be purged.
            </p>

            <div className="mt-5">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Type <span className="font-bold text-rose-600">DELETE</span> or your email (<span className="text-slate-900">{user?.email}</span>) to confirm:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-[13px] sm:text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-100/80 transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!isMatch || isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Deleting...
                  </>
                ) : (
                  'Permanently Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
