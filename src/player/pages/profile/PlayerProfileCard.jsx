import { useState, useEffect } from 'react';
import {
  Trophy,
  Check,
  Loader2,
} from 'lucide-react';

import { useToast } from '../../../shared/components/common/toastContext';

export default function PlayerProfileCard({
  user,
  onUpdateProfile,
}) {
  const { showToast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [initialFormData, setInitialFormData] =
    useState(null);

  const buildFormData = (source) => ({
    position:
      source?.primaryPosition ||
      source?.position ||
      'Midfielder',

    skillLevel:
      source?.skillLevel ||
      'Weekend Warrior',

    playingStyle: Array.isArray(
      source?.playingStyle
    )
      ? source.playingStyle
      : ['Playmaker', 'Team Player'],

    matchType:
      source?.preferredMatchType ||
      source?.matchType ||
      '5v5',

    playFrequency:
      source?.playFrequency ||
      '2-3 times/per week',
  });

  const [formData, setFormData] = useState(() =>
    buildFormData(user)
  );

  useEffect(() => {
    if (!user) return;

    const next = buildFormData(user);

    setFormData(next);
    setInitialFormData(next);
  }, [user]);

  const positions = [
    'Goalkeeper',
    'Defender',
    'Midfielder',
    'Winger',
    'Striker',
  ];

  const skillLevels = [
    'Casual',
    'Weekend Warrior',
    'Competitive',
    'Professional',
  ];

  const playingStylesList = [
    'Playmaker',
    'Finisher',
    'Dribbler',
    'Fast Runner',
    'Long Passer',
    'Defensive',
    'Physical',
    'Team Player',
    'Aggressive Press',
    'Goal Poacher',
  ];

  const matchTypes = [
    '5v5',
    '7v7',
    'Both',
  ];

  const playFrequencies = [
    'Rarely',
    '1 time/week',
    '2-3 times/per week',
    '4-5 times/week',
    'Everyday',
  ];

  const MAX_PLAYING_STYLES = 3;

  const hasChanges =
    initialFormData &&
    JSON.stringify(formData) !==
    JSON.stringify(initialFormData);

  const togglePlayingStyle = (style) => {
    if (formData.playingStyle.includes(style)) {
      setFormData((prev) => ({
        ...prev,
        playingStyle: prev.playingStyle.filter(
          (item) => item !== style
        ),
      }));

      return;
    }

    if (
      formData.playingStyle.length <
      MAX_PLAYING_STYLES
    ) {
      setFormData((prev) => ({
        ...prev,
        playingStyle: [
          ...prev.playingStyle,
          style,
        ],
      }));

      return;
    }

    showToast(
      `You can select a maximum of ${MAX_PLAYING_STYLES} playing styles.`,
      'info'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSaving || !hasChanges) {
      return;
    }

    try {
      setIsSaving(true);

      const res = await onUpdateProfile(formData);

      if (res.success) {
        showToast(
          'Player profile & skill set updated successfully!',
          'success'
        );

        setInitialFormData({
          ...formData,
          playingStyle: [
            ...formData.playingStyle,
          ],
        });
      } else {
        showToast(
          res.error ||
          'Failed to update player profile.',
          'error'
        );
      }
    } catch (err) {
      showToast(
        err.message ||
        'Error updating player profile.',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        space-y-6
        rounded-xl
        bg-white
        p-5
        shadow-[0_4px_25px_rgba(0,0,0,0.08)]
        sm:p-6
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lime-100 text-lime-700">
            <Trophy className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
              Player Profile & Skill Set
            </h3>

            <p className="mt-0.5 text-xs font-medium leading-5 text-slate-500">
              Position, skill tier, playstyle traits,
              and format preferences.
            </p>
          </div>
        </div>

        {hasChanges && (
          <button
            type="submit"
            disabled={isSaving}
            className="
              inline-flex
              shrink-0
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
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:text-sm
            "
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                <span className="hidden sm:inline">
                  Saving...
                </span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />

                <span className="hidden sm:inline">
                  Save Changes
                </span>

                <span className="sm:hidden">
                  Save
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Primary Position */}
      <div>
        <label className="mb-2 block text-xs font-semibold text-slate-700 sm:text-[13px]">
          Primary Position
        </label>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          {positions.map((position) => {
            const isSelected =
              formData.position === position;

            return (
              <button
                key={position}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    position,
                  }))
                }
                className={`
                  rounded-lg
                  px-3
                  py-3
                  text-center
                  text-xs
                  font-bold
                  transition-all
                  sm:text-sm

                  ${isSelected
                    ? 'bg-lime-400 text-slate-900'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }
                `}
              >
                {position}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skill Level */}
      <div>
        <label className="mb-2 block text-xs font-semibold text-slate-700 sm:text-[13px]">
          Skill Level
        </label>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {skillLevels.map((level) => {
            const isSelected =
              formData.skillLevel === level;

            return (
              <button
                key={level}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    skillLevel: level,
                  }))
                }
                className={`
                  rounded-lg
                  px-3
                  py-3
                  text-center
                  text-xs
                  font-bold
                  transition-all
                  sm:text-sm

                  ${isSelected
                    ? 'bg-lime-400 text-slate-900'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }
                `}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      {/* Playing Style */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-xs font-semibold text-slate-700 sm:text-[13px]">
            Playing Style Traits
          </label>

          <span className="shrink-0 text-[11px] font-bold text-slate-400">
            {formData.playingStyle.length}/
            {MAX_PLAYING_STYLES} selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {playingStylesList.map((style) => {
            const isSelected =
              formData.playingStyle.includes(style);

            return (
              <button
                key={style}
                type="button"
                onClick={() =>
                  togglePlayingStyle(style)
                }
                className={`
                  rounded-lg
                  px-3.5
                  py-2
                  text-xs
                  font-bold
                  transition-all
                  sm:text-sm

                  ${isSelected
                    ? 'bg-lime-400 text-slate-900'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }
                `}
              >
                {isSelected
                  ? `✓ ${style}`
                  : style}
              </button>
            );
          })}
        </div>
      </div>

      {/* Match Format + Frequency */}
      <div className="grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
        {/* Match Format */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-700 sm:text-[13px]">
            Preferred Match Format
          </label>

          <div className="grid grid-cols-3 gap-2">
            {matchTypes.map((type) => {
              const isSelected =
                formData.matchType === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      matchType: type,
                    }))
                  }
                  className={`
                    rounded-lg
                    px-3
                    py-3
                    text-center
                    text-xs
                    font-bold
                    transition-all
                    sm:text-sm

                    ${isSelected
                      ? 'bg-lime-400 text-slate-900'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }
                  `}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-700 sm:text-[13px]">
            Play Frequency
          </label>

          <select
            value={formData.playFrequency}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                playFrequency: e.target.value,
              }))
            }
            className="
              w-full
              cursor-pointer
              rounded-lg
              bg-slate-50
              px-4
              py-3
              text-xs
              font-medium
              text-slate-900
              transition-all
              focus:bg-slate-100/80
              focus:outline-none
              focus:ring-2
              focus:ring-lime-200
              sm:text-sm
            "
          >
            {playFrequencies.map((frequency) => (
              <option
                key={frequency}
                value={frequency}
              >
                {frequency}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
}