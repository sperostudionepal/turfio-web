import { useEffect, useRef, useState } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';
import useAccessibilityStore, {
  FONT_OPTIONS,
  FONT_SIZES,
} from '../../store/useAccessibilityStore';

export default function AccessibilityModal() {
  const {
    isOpen,
    setIsOpen,
    fontTheme: activeFontTheme,
    fontSize: activeFontSize,
    applySettings,
    resetDefaults,
  } = useAccessibilityStore();

  // Local draft state for user selections before applying
  const [draftFontTheme, setDraftFontTheme] = useState(activeFontTheme);
  const [draftFontSize, setDraftFontSize] = useState(activeFontSize);

  // Sync draft state with store whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setDraftFontTheme(activeFontTheme);
      setDraftFontSize(activeFontSize);
    }
  }, [isOpen, activeFontTheme, activeFontSize]);

  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    applySettings(draftFontTheme, draftFontSize);
    setIsOpen(false);
  };

  const handleReset = () => {
    setDraftFontTheme('manrope');
    setDraftFontSize('default');
    resetDefaults();
  };

  const hasChanges = draftFontTheme !== activeFontTheme || draftFontSize !== activeFontSize;

  const previewFont = FONT_OPTIONS.find((f) => f.id === draftFontTheme) || FONT_OPTIONS[0];
  const previewSize = FONT_SIZES.find((s) => s.id === draftFontSize) || FONT_SIZES[1];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div
        className="absolute inset-0"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Display Preferences"
        className="relative w-full max-w-[460px] bg-white rounded-[28px] p-6 sm:p-7 shadow-2xl border border-slate-100/90 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Display & Text
            </h2>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Adjust typography and font size for this device.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer -mr-1"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 1. Font Family Options */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-500">
              Font Family
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              {FONT_OPTIONS.map((f) => {
                const isSelected = draftFontTheme === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setDraftFontTheme(f.id)}
                    style={{ fontFamily: f.fontFamily }}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-lime-500 bg-lime-50/60 text-slate-950'
                        : 'border-slate-200/80 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="min-w-0 pr-1">
                      <p className={`text-sm font-extrabold tracking-tight truncate ${isSelected ? 'text-slate-950' : 'text-slate-800'}`}>
                        {f.name}
                      </p>
                      <p className={`text-[11px] font-medium truncate mt-0.5 ${isSelected ? 'text-lime-700 font-semibold' : 'text-slate-400'}`}>
                        {f.category}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-400 text-slate-950 shrink-0">
                        <Check className="h-3 w-3 stroke-[3.5]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Font Size Scaling Segmented Stepper */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-500">
                Text Scaling
              </label>
              <span className="text-xs font-bold text-slate-600">
                {FONT_SIZES.find((s) => s.id === draftFontSize)?.label} ({FONT_SIZES.find((s) => s.id === draftFontSize)?.scale})
              </span>
            </div>

            {/* Clean Segmented Bar */}
            <div className="p-1 rounded-2xl bg-slate-100 flex items-center gap-1">
              {FONT_SIZES.map((s, idx) => {
                const isSelected = draftFontSize === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setDraftFontSize(s.id)}
                    className={`flex-1 py-2 rounded-xl text-center font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-slate-950 shadow-xs scale-[1.02]'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span
                      className="block font-black leading-none"
                      style={{ fontSize: `calc(11px + ${idx * 2}px)` }}
                    >
                      A
                    </span>
                    <span className="block text-[9px] mt-1 font-semibold leading-none opacity-70">
                      {s.scale}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Live Preview Pill using selected draft font and size */}
          <div className="px-4 py-3 rounded-2xl bg-slate-50 text-center">
            <p
              className="font-semibold text-slate-800 leading-snug transition-all"
              style={{
                fontFamily: previewFont.fontFamily,
                fontSize: previewSize.fontSize,
              }}
            >
              Book better games. Play without the hassle.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer py-2 px-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95 bg-lime-400 hover:bg-lime-500 text-slate-950"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
}
