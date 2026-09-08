import { Sliders } from 'lucide-react';
import useAccessibilityStore from '../../store/useAccessibilityStore';

export default function AccessibilityTrigger() {
  const { toggleOpen } = useAccessibilityStore();

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex items-center flex-row-reverse group select-none">
      <button
        type="button"
        onClick={toggleOpen}
        aria-label="Open Display Options"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400 hover:bg-lime-500 text-slate-950 shadow-[0_8px_25px_rgba(132,204,22,0.35)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer relative overflow-hidden"
      >
        <Sliders className="h-5 w-5 relative z-10 stroke-[2.4] transition-transform group-hover:rotate-45 text-slate-950" />
      </button>

      {/* Hover tooltip */}
      <div className="pointer-events-none absolute right-14 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 hidden sm:flex items-center">
        <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap border border-slate-100">
          Typography & Font Size
        </span>
      </div>
    </div>
  );
}
