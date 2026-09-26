import { useState, useEffect } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { useToast } from '../../../shared/components/common/toastContext';

export default function PreferencesForm({ user, onUpdatePreferences }) {
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [preferences, setPreferences] = useState({
    notifications: {
      email: user?.notifications?.email ?? true,
    },
    preferredLocation: user?.preferredLocation || user?.city || 'Kathmandu',
    theme: user?.theme || 'light',
    language: user?.language || 'en',
  });

  useEffect(() => {
    if (user) {
      setPreferences({
        notifications: {
          email: user.notifications?.email ?? true,
        },
        preferredLocation: user.preferredLocation || user.city || 'Kathmandu',
        theme: user.theme || 'light',
        language: user.language || 'en',
      });
    }
  }, [user]);

  const handleToggleEmail = () => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        email: !prev.notifications.email,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);
      const res = await onUpdatePreferences(preferences);
      if (res.success) {
        showToast('Preferences updated successfully!', 'success');
      } else {
        showToast(res.error || 'Failed to update preferences.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error updating preferences.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3 pb-2">
        <div className="w-10 h-10 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center font-bold shrink-0">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">App Preferences</h3>
          <p className="text-xs font-medium text-slate-500">Manage notifications, location, and visual theme settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Notifications */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booking Notifications</h4>
          <div className="space-y-3">
            {/* Email toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Email Notifications</p>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Receive booking receipts, match invites, and schedule updates via email</p>
              </div>
              <button
                type="button"
                onClick={handleToggleEmail}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.notifications.email ? 'bg-lime-400' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    preferences.notifications.email ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Location, Theme & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Preferred Location */}
          <div>
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
              Preferred Location
            </label>
            <select
              value={preferences.preferredLocation}
              onChange={(e) => setPreferences({ ...preferences, preferredLocation: e.target.value })}
              className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-100/80 transition-all cursor-pointer"
            >
              <option value="Kathmandu">Kathmandu</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Bhaktapur">Bhaktapur</option>
              <option value="Pokhara">Pokhara</option>
              <option value="Chitwan">Chitwan</option>
              <option value="Butwal">Butwal</option>
            </select>
          </div>

          {/* App Theme */}
          <div>
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
              App Theme
            </label>
            <select
              value={preferences.theme}
              onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
              className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-100/80 transition-all cursor-pointer"
            >
              <option value="light">Turfio Light (Default)</option>
              <option value="dark">Turfio Dark</option>
              <option value="system">Match System Theme</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
              Display Language
            </label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-100/80 transition-all cursor-pointer"
            >
              <option value="en">English (EN)</option>
              <option value="np">नेपाली (NP)</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-lime-400 text-xs sm:text-sm font-bold text-slate-900 hover:bg-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-900" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 text-slate-900" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
