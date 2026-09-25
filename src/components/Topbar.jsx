import { useState, useRef, useEffect } from 'react';
import { X, ArrowRight, Globe, Clock, HelpCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Topbar({
  user,
  onDashboard,
  onListTurf,
  hideTopbar = false,
}) {
  const navigate = useNavigate();
  const dismissTurfBanner = useAuthStore((s) => s.dismissTurfBanner);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState({ code: 'EN', label: 'English' });
  const langRef = useRef(null);

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'NP', label: 'नेपाली' },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (hideTopbar) return null;

  // Show Turf Approval Banner for approved venue admins
  if (user && user.isTurfAdmin && !user.turfApprovalBannerSeen) {
    return (
      <div className="border-b border-lime-100/40 bg-lime-50">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3.5 lg:px-10 text-[13px] font-medium text-slate-900">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-base">🎉</span>
            <span>Congratulations! Your turf listing request has been approved and your venue is ready.</span>
            <button
              type="button"
              onClick={() => {
                if (onDashboard) onDashboard();
                else navigate('/dashboard');
              }}
              className="ml-1 inline-flex items-center gap-1 font-semibold text-lime-600 hover:text-lime-700 transition-colors cursor-pointer"
            >
              Go to Dashboard <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => dismissTurfBanner()}
            className="p-1 hover:bg-lime-100/80 rounded-full transition-colors cursor-pointer text-slate-500 hover:text-slate-800 shrink-0"
            title="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Show Marketing Topbar ONLY for logged out visitors and non-admin player accounts
  if (!user || (user.role !== 'owner' && user.role !== 'admin' && !user.isTurfAdmin)) {
    return (
      <div className="border-b border-lime-100/40 bg-lime-50">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3.5 lg:px-10">
          {/* Left — announcement */}
          <div className="flex items-center gap-2 text-[13px] font-medium text-slate-900">
            <Clock className="h-3.5 w-3.5 shrink-0 text-lime-500" />
            Book faster with our new AI Match Assistant
            <a href="#" className="ml-1 inline-flex items-center gap-1 font-semibold text-lime-600 hover:text-lime-700 transition-colors">
              Learn more <ArrowRight className="h-3 w-3" />
            </a>
          </div>

          {/* Right — links + language */}
          <div className="hidden sm:flex items-center gap-4 text-[13px] font-medium text-slate-900">
            <button onClick={onListTurf} className="font-bold text-lime-500 hover:text-lime-600 transition-colors cursor-pointer">
              List Your Turf
            </button>
            <span className="text-slate-300">|</span>
            <a href="#" className="font-bold text-slate-900 hover:text-slate-800 transition-colors flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-lime-500" />
              Help Center
            </a>
            <span className="text-slate-300">|</span>
            {/* Language dropdown */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <Globe className="h-3.5 w-3.5 text-lime-500" />
                <span className="font-semibold">{selectedLang.code}</span>
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 rounded-xl bg-white border border-slate-100 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] overflow-hidden z-[9999]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                      className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-semibold transition-colors cursor-pointer ${
                        selectedLang.code === lang.code
                          ? 'bg-lime-50 text-lime-600'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Globe className="h-3.5 w-3.5 shrink-0 text-lime-500" />
                      <span>{lang.label}</span>
                      {selectedLang.code === lang.code && (
                        <span className="ml-auto text-lime-500 font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
