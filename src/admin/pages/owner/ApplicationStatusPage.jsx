import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  X,
  Check,
  MessageSquare,
} from 'lucide-react';
import ownerApplicationService from '../../../shared/services/ownerApplicationService';

const STATUS_METADATA = {
  pending: {
    label: 'Under Review',
    badgeBg: 'bg-amber-100/90 text-amber-800',
    Icon: Clock,
    title: 'Verification In Progress',
    description:
      'Our team is reviewing your facility details and legal documentation. This typically completes within 24 hours.',
  },
  in_review: {
    label: 'In Review',
    badgeBg: 'bg-amber-100/90 text-amber-800',
    Icon: Clock,
    title: 'Currently Under Review',
    description:
      'A verification specialist is actively assessing your documents and court configuration.',
  },
  needs_changes: {
    label: 'Changes Requested',
    badgeBg: 'bg-amber-100/90 text-amber-800',
    Icon: AlertCircle,
    title: 'Additional Details Needed',
    description:
      'The verification team has requested additional information or clarification on your documents.',
  },
  approved: {
    label: 'Application Approved',
    badgeBg: 'bg-lime-400 text-slate-900',
    Icon: CheckCircle2,
    title: 'Your Facility is Approved',
    description:
      'Your application has been approved. A single-use setup link has been sent to your email to configure your password and access your dashboard.',
  },
  completed: {
    label: 'Dashboard Active',
    badgeBg: 'bg-lime-400 text-slate-900',
    Icon: CheckCircle2,
    title: 'Account Setup Complete',
    description:
      'Your facility is active and owner dashboard credentials have been configured. You can log in anytime.',
  },
  rejected: {
    label: 'Not Approved',
    badgeBg: 'bg-rose-100 text-rose-800',
    Icon: XCircle,
    title: 'Application Not Approved',
    description:
      'After reviewing the submitted information, our team was unable to approve this listing request at this time.',
  },
};

export default function ApplicationStatusPage({ onHome: onHomeProp }) {
  const navigate = useNavigate();
  const handleHome = onHomeProp || (() => navigate('/'));
  const [token, setToken] = useState('');
  const [inputToken, setInputToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  // Smooth YouTube-style progress simulation
  useEffect(() => {
    let interval;
    if (loading || refreshing) {
      setProgress(25);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          const increment = Math.max(2, (92 - prev) * 0.2);
          return Math.min(prev + increment, 90);
        });
      }, 100);
    } else if (progress > 0) {
      setProgress(100);
      const timer = setTimeout(() => {
        setProgress(0);
      }, 500);
      return () => clearTimeout(timer);
    }
    return () => clearInterval(interval);
  }, [loading, refreshing]);

  const fetchStatus = async (trackingToken, isSilentRefresh = false) => {
    if (!trackingToken?.trim()) return;
    if (isSilentRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await ownerApplicationService.track(trackingToken.trim());
      setStatusData(response.data);
    } catch (err) {
      setError(err.message || 'Unable to retrieve application status. Please check your tracking link.');
      if (!isSilentRefresh) setStatusData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Extract token from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
      setInputToken(urlToken);
      fetchStatus(urlToken);
    }
  }, []);

  const handleManualLookup = (e) => {
    e.preventDefault();
    if (inputToken.trim()) {
      setToken(inputToken.trim());
      fetchStatus(inputToken.trim());
    }
  };

  const meta = statusData?.status
    ? STATUS_METADATA[statusData.status] || STATUS_METADATA.pending
    : STATUS_METADATA.pending;

  const StatusIcon = meta.Icon;

  const steps = [
    {
      step: '1',
      title: 'Application Received',
      desc: 'Facility details and documents logged securely in our queue.',
      status: 'completed',
    },
    {
      step: '2',
      title: 'Document & Facility Review',
      desc: 'Our onboarding team verifies court specs, pricing, and operating schedule.',
      status: ['approved', 'completed'].includes(statusData?.status)
        ? 'completed'
        : statusData?.status === 'rejected'
        ? 'rejected'
        : 'active',
    },
    {
      step: '3',
      title: 'Dashboard Access & Launch',
      desc: 'Receive your setup link by email to set your password and launch your arena.',
      status: statusData?.status === 'completed' ? 'completed' : 'upcoming',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col justify-between selection:bg-lime-300 selection:text-slate-900 relative">
      {/* YouTube-style Top Progress Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-300 ${
          progress > 0 && progress < 100 ? 'opacity-100' : progress === 100 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="h-[3px] bg-lime-400 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Page Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-12 md:pb-16">
        {/* Top Header Badge & Title */}
        <div className="text-center max-w-xl mx-auto mb-8 md:mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3.5 py-1.5 text-xs font-bold text-slate-800 mb-3">
            <CheckCircle2 className="h-4 w-4 text-lime-600" />
            Live Status Tracker
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Application Status
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1 leading-relaxed">
            Track the real-time review and onboarding progress for{' '}
            <span className="font-extrabold text-slate-900">{statusData?.arenaName || 'your facility'}</span>.
          </p>
        </div>

        {/* Manual Token Lookup if no token present */}
        {!token && (
          <div className="max-w-md mx-auto mb-12">
            <form onSubmit={handleManualLookup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide mb-2">
                  Enter Your Tracking Token
                </label>
                <input
                  type="text"
                  placeholder="Paste 64-character token from email"
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 text-slate-900 text-xs font-mono border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <span>Check Status</span>}
              </button>
            </form>
          </div>
        )}

        {/* Initial Loading Spinner (only for first full load if no data yet) */}
        {loading && !statusData && (
          <div className="text-center py-16 text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-lime-500" />
            <p className="text-sm font-bold text-slate-700">Checking application status…</p>
          </div>
        )}

        {/* Error Notice */}
        {error && !loading && !statusData && (
          <div className="max-w-md mx-auto rounded-3xl bg-rose-50/80 p-6 text-center space-y-3 mb-10">
            <XCircle className="h-8 w-8 text-rose-600 mx-auto" />
            <div>
              <h3 className="text-sm font-extrabold text-rose-900">Application Lookup Failed</h3>
              <p className="text-xs font-medium text-rose-700 leading-relaxed mt-1">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setToken('');
              }}
              className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
            >
              Try Another Token
            </button>
          </div>
        )}

        {/* Status Content Hub (2-Column) */}
        {statusData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column: Status Card & Primary Actions */}
            <div className="lg:col-span-6 space-y-6 max-w-md">


              {/* Status Notice Block */}
              <div className="flex flex-col items-center text-center space-y-3 py-2">
                <div className="w-12 h-12 rounded-full bg-lime-400 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <StatusIcon size={22} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900">{meta.title}</h3>
                  <p className="text-[13.5px] text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
                    {meta.description}
                  </p>
                </div>
              </div>

              {/* Reviewer Note if available */}
              {statusData.reviewNote && (
                <div className="rounded-2xl bg-amber-50/80 p-4 space-y-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block">
                    Reviewer Note
                  </span>
                  <p className="text-xs font-medium text-amber-800 leading-relaxed">
                    {statusData.reviewNote}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  disabled={loading || refreshing}
                  onClick={() => fetchStatus(token, true)}
                  className="w-full py-4 px-6 rounded-full bg-lime-400 hover:bg-lime-500 active:scale-[0.99] text-slate-900 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
                >
                  <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                  <span>{refreshing ? 'Refreshing…' : 'Refresh Status'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleHome}
                  className="w-full py-3.5 px-6 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-slate-800 font-bold text-sm transition-all cursor-pointer text-center"
                >
                  Return to Home
                </button>
              </div>

              <p className="text-[11.5px] font-medium text-slate-400 text-center leading-relaxed">
                Review updates will be emailed automatically to your contact email address.
              </p>
            </div>

            {/* Right Column: Timeline Journey */}
            <div className="lg:col-span-6 space-y-8 lg:pl-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">
                  What Happens Next?
                </h2>

                <div className="space-y-3">
                  {steps.map((st, idx) => (
                    <div key={st.step} className="flex items-start gap-4 relative pb-7 last:pb-0">
                      {idx !== steps.length - 1 && (
                        <div className="absolute left-5 top-10 bottom-0 w-[2px] bg-slate-100 -translate-x-1/2" />
                      )}
                      <div
                        className={`w-10 h-10 rounded-full font-extrabold flex items-center justify-center text-sm shrink-0 relative z-10 ${
                          st.status === 'completed'
                            ? 'bg-lime-400 text-slate-900'
                            : st.status === 'active'
                            ? 'bg-slate-900 text-white'
                            : st.status === 'rejected'
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {st.status === 'completed' ? (
                          <Check size={16} className="stroke-[3]" />
                        ) : st.status === 'rejected' ? (
                          <X size={16} className="stroke-[3]" />
                        ) : (
                          st.step
                        )}
                      </div>
                      <div className="pt-1.5 min-w-0">
                        <h4
                          className={`text-sm font-extrabold leading-snug ${
                            st.status === 'upcoming' ? 'text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {st.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Support Icon at Bottom Right */}
      <a
        href="https://wa.me/9779800000000?text=Hi%20Turfio%20Team%2C%20I%20have%20an%20inquiry%20regarding%20my%20turf%20listing%20application."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-13 h-13 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xl shadow-slate-950/25 hover:scale-105 active:scale-95 transition-all group"
        title="Contact Support"
        aria-label="Contact Support"
      >
        <MessageSquare size={22} className="stroke-[2.2] text-white" />
      </a>
    </div>
  );
}
