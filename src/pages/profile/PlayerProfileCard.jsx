import { useState, useEffect } from 'react';
import { Trophy, Check, Edit2, Loader2 } from 'lucide-react';
import { useToast } from '../../components/common/toastContext';

export default function PlayerProfileCard({ user, onUpdateProfile }) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    position: user?.primaryPosition || user?.position || 'Midfielder',
    skillLevel: user?.skillLevel || 'Weekend Warrior',
    playingStyle: user?.playingStyle || ['Playmaker', 'Team Player'],
    matchType: user?.preferredMatchType || user?.matchType || '5v5',
    playFrequency: user?.playFrequency || '2-3 times/per week',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        position: user.primaryPosition || user.position || 'Midfielder',
        skillLevel: user.skillLevel || 'Weekend Warrior',
        playingStyle: Array.isArray(user.playingStyle) ? user.playingStyle : ['Playmaker', 'Team Player'],
        matchType: user.preferredMatchType || user.matchType || '5v5',
        playFrequency: user.playFrequency || '2-3 times/per week',
      });
    }
  }, [user]);

  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Winger', 'Striker'];
  const skillLevels = ['Casual', 'Weekend Warrior', 'Competitive', 'Professional'];
  const playingStylesList = [
    'Playmaker', 'Finisher', 'Dribbler', 'Fast Runner',
    'Long Passer', 'Defensive', 'Physical', 'Team Player',
    'Aggressive Press', 'Goal Poacher'
  ];
  const matchTypes = ['5v5', '7v7', 'Both'];
  const playFrequencies = ['Rarely', '1 time/week', '2-3 times/per week', '4-5 times/week', 'Everyday'];
  const MAX_PLAYING_STYLES = 3;

  const togglePlayingStyle = (style) => {
    if (!isEditing) return;
    if (formData.playingStyle.includes(style)) {
      setFormData((prev) => ({
        ...prev,
        playingStyle: prev.playingStyle.filter((s) => s !== style),
      }));
    } else if (formData.playingStyle.length < MAX_PLAYING_STYLES) {
      setFormData((prev) => ({
        ...prev,
        playingStyle: [...prev.playingStyle, style],
      }));
    } else {
      showToast(`You can select a maximum of ${MAX_PLAYING_STYLES} playing styles.`, 'info');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);
      const res = await onUpdateProfile(formData);
      if (res.success) {
        showToast('Player profile & skill set updated successfully!', 'success');
        setIsEditing(false);
      } else {
        showToast(res.error || 'Failed to update player profile.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error updating player profile.', 'error');
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
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Player Profile & Skill Set</h3>
            <p className="text-xs font-medium text-slate-500">Position, skill tier, playstyle traits, and format preferences</p>
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
              Edit Player Profile
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
        {/* Primary Position */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-2">
            Primary Position
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {positions.map((pos) => {
              const isSelected = formData.position === pos;
              return (
                <button
                  key={pos}
                  type="button"
                  disabled={!isEditing}
                  onClick={() => isEditing && setFormData({ ...formData, position: pos })}
                  className={`px-3 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-center ${
                    isSelected
                      ? 'bg-lime-400 text-slate-900 shadow-2xs'
                      : isEditing
                      ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer'
                      : 'bg-slate-50 text-slate-400 opacity-80 cursor-not-allowed'
                  }`}
                >
                  {pos}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skill Level */}
        <div>
          <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-2">
            Skill Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {skillLevels.map((lvl) => {
              const isSelected = formData.skillLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  disabled={!isEditing}
                  onClick={() => isEditing && setFormData({ ...formData, skillLevel: lvl })}
                  className={`px-3 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-center ${
                    isSelected
                      ? 'bg-lime-400 text-slate-900 shadow-2xs'
                      : isEditing
                      ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer'
                      : 'bg-slate-50 text-slate-400 opacity-80 cursor-not-allowed'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Playing Style Tags (Max 3) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-700">
              Playing Style Traits (Select up to 3)
            </label>
            <span className="text-[11px] font-bold text-slate-400">
              {formData.playingStyle.length}/{MAX_PLAYING_STYLES} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {playingStylesList.map((style) => {
              const isSelected = formData.playingStyle.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  disabled={!isEditing}
                  onClick={() => togglePlayingStyle(style)}
                  className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    isSelected
                      ? 'bg-lime-400 text-slate-900 shadow-2xs'
                      : isEditing
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 opacity-70 cursor-not-allowed'
                  }`}
                >
                  {isSelected ? `✓ ${style}` : style}
                </button>
              );
            })}
          </div>
        </div>

        {/* Match Type & Play Frequency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {/* Preferred Match Type */}
          <div>
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-2">
              Preferred Match Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {matchTypes.map((type) => {
                const isSelected = formData.matchType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    disabled={!isEditing}
                    onClick={() => isEditing && setFormData({ ...formData, matchType: type })}
                    className={`px-3 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-center ${
                      isSelected
                        ? 'bg-lime-400 text-slate-900 shadow-2xs'
                        : isEditing
                        ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer'
                        : 'bg-slate-50 text-slate-400 opacity-80 cursor-not-allowed'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Play Frequency */}
          <div>
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-2">Play Frequency</label>
            <select
              disabled={!isEditing}
              value={formData.playFrequency}
              onChange={(e) => setFormData({ ...formData, playFrequency: e.target.value })}
              className={`w-full rounded-2xl bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 transition-all ${
                !isEditing ? 'opacity-80 cursor-not-allowed' : 'focus:outline-none focus:bg-slate-100/80 cursor-pointer'
              }`}
            >
              {playFrequencies.map((freq) => (
                <option key={freq} value={freq}>{freq}</option>
              ))}
            </select>
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
                  Save Player Profile
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
