import { useState, useEffect } from 'react';
import { Clock, Check, Edit2, Loader2 } from 'lucide-react';
import { useToast } from '../../../shared/components/common/toastContext';

export default function GamePreferencesCard({ user, onUpdateProfile }) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const buildFormData = (source) => ({
    preferredTime: Array.isArray(source?.preferredTime) ? source.preferredTime : [],
    travelPreference: source?.travelPreference ?? '',
    weeklyAvailability: Array.isArray(source?.weeklyAvailability) ? source.weeklyAvailability : [],
    gameVibe: Array.isArray(source?.gameVibe) ? source.gameVibe[0] ?? '' : '',
    fitnessLevel: source?.fitnessLevel ?? '',
  });

  const [formData, setFormData] = useState(() => buildFormData(user));
  const [initialFormData, setInitialFormData] = useState(() => buildFormData(user));

  useEffect(() => {
    if (user) {
      const next = buildFormData(user);
      setFormData(next);
      setInitialFormData(next);
    }
  }, [user]);

  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const travelDistances = ['2km', '5km', '10km', '15km', '20km+'];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const gameVibes = ['Just for Fun', 'Friendly', 'Competitive', 'Tournament'];

  const toggleTimeSlot = (time) => {
    if (!isEditing) return;
    if (formData.preferredTime.includes(time)) {
      setFormData((prev) => ({
        ...prev,
        preferredTime: prev.preferredTime.filter((t) => t !== time),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        preferredTime: [...prev.preferredTime, time],
      }));
    }
  };

  const toggleDay = (day) => {
    if (!isEditing) return;
    if (formData.weeklyAvailability.includes(day)) {
      setFormData((prev) => ({
        ...prev,
        weeklyAvailability: prev.weeklyAvailability.filter((d) => d !== day),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        weeklyAvailability: [...prev.weeklyAvailability, day],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);
      const changedFields = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) =>
          JSON.stringify(value) !== JSON.stringify(initialFormData?.[key])
        )
      );

      if ('travelPreference' in changedFields) {
        changedFields.travelPreference = Number(changedFields.travelPreference);
      }
      if ('gameVibe' in changedFields) {
        changedFields.gameVibe = changedFields.gameVibe ? [changedFields.gameVibe] : [];
      }

      const res = await onUpdateProfile(changedFields);
      if (res.success) {
        showToast('Game preferences & schedule updated successfully!', 'success');
        setIsEditing(false);
      } else {
        showToast(res.error || 'Failed to update game preferences.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error updating game preferences.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center font-bold shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Game Preferences & Schedule</h3>
            <p className="text-xs font-medium text-slate-500">Preferred time slots, weekly availability, travel radius, and match vibe</p>
          </div>
        </div>

        <div>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit Game Preferences
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preferred Time Slots */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-2">
            Preferred Time Slots
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {timeSlots.map((time) => {
              const isSelected = formData.preferredTime.includes(time);
              return (
                <button
                  key={time}
                  type="button"
                  disabled={!isEditing}
                  onClick={() => toggleTimeSlot(time)}
                  className={`px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-center ${
                    isSelected
                      ? 'bg-lime-400 text-slate-900 shadow-2xs'
                      : isEditing
                      ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer'
                      : 'bg-slate-50 text-slate-400 opacity-80 cursor-not-allowed'
                  }`}
                >
                  {isSelected ? `✓ ${time}` : time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weekly Availability */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-2">
            Weekly Available Days
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const isSelected = formData.weeklyAvailability.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={!isEditing}
                  onClick={() => toggleDay(day)}
                  className={`py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-center ${
                    isSelected
                      ? 'bg-lime-400 text-slate-900 shadow-2xs'
                      : isEditing
                      ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer'
                      : 'bg-slate-50 text-slate-400 opacity-80 cursor-not-allowed'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Travel Distance Radius */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-2">
            Max Travel Distance
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {travelDistances.map((dist) => {
              const isSelected = String(formData.travelPreference) === dist.replace('km+', '').replace('km', '');
              return (
                <button
                  key={dist}
                  type="button"
                  disabled={!isEditing}
                  onClick={() => isEditing && setFormData({ ...formData, travelPreference: Number(dist.replace('km+', '').replace('km', '')) })}
                  className={`px-3 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-center ${
                    isSelected
                      ? 'bg-lime-400 text-slate-900 shadow-2xs'
                      : isEditing
                      ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer'
                      : 'bg-slate-50 text-slate-400 opacity-80 cursor-not-allowed'
                  }`}
                >
                  {dist}
                </button>
              );
            })}
          </div>
        </div>

        {/* Game Vibe & Fitness Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {/* Game Vibe */}
          <div>
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-2">
              Game Vibe / Atmosphere
            </label>
            <div className="grid grid-cols-2 gap-2">
              {gameVibes.map((vibe) => {
                const isSelected = formData.gameVibe === vibe;
                return (
                  <button
                    key={vibe}
                    type="button"
                    disabled={!isEditing}
                    onClick={() => isEditing && setFormData({ ...formData, gameVibe: vibe })}
                    className={`px-3 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-center ${
                      isSelected
                        ? 'bg-lime-400 text-slate-900 shadow-2xs'
                        : isEditing
                        ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer'
                        : 'bg-slate-50 text-slate-400 opacity-80 cursor-not-allowed'
                    }`}
                  >
                    {vibe}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fitness Level */}
          <div>
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-2 flex items-center justify-between">
              <span>Fitness Level</span>
              <span className="text-[11px] font-bold text-lime-800 bg-lime-100 px-2.5 py-0.5 rounded-full">
                {formData.fitnessLevel ? `Level ${formData.fitnessLevel} / 5` : 'Not set'}
              </span>
            </label>
            <div className="flex items-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  disabled={!isEditing}
                  onClick={() => isEditing && setFormData({ ...formData, fitnessLevel: lvl })}
                  className={`flex-1 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    formData.fitnessLevel >= lvl
                      ? 'bg-lime-400 text-slate-900 shadow-2xs'
                      : isEditing
                      ? 'bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer'
                      : 'bg-slate-100 text-slate-300 opacity-70 cursor-not-allowed'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        {isEditing && (
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-full bg-slate-100 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
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
                  Save Game Preferences
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
