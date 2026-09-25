import { useCallback, useEffect, useState } from 'react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  LogOut,
  ArrowRight,
  Loader2,
  Ban,
  Trash2,
} from 'lucide-react';
import ownerRequestService from '../../../shared/services/ownerRequestService';
import { useToast } from '../../../shared/components/common/toastContext';

const STEPS = [
  { title: 'Application received', desc: 'Your arena details and documents are in our queue.' },
  { title: 'Document verification', desc: 'Our team checks your registration and PAN certificates. Usually within 24 hours.' },
  { title: 'Go live', desc: 'Once approved, your arena is published and your owner dashboard unlocks.' },
];

const STATE = {
  none: {
    tone: 'amber',
    Icon: FileText,
    title: 'No application on file yet',
    blurb: 'Your owner account is ready. Submit your arena details and documents to start the review.',
  },
  pending: {
    tone: 'amber',
    Icon: Clock,
    title: 'Your application is under review',
    blurb: 'A reviewer is verifying your documents. This usually takes less than 24 hours — you will get an email as soon as there is a decision.',
  },
  needs_changes: {
    tone: 'amber',
    Icon: FileText,
    title: 'We need a few changes',
    blurb: 'The reviewer needs updated information before your arena can be approved.',
  },
  rejected: {
    tone: 'rose',
    Icon: XCircle,
    title: 'Your application was not approved',
    blurb: 'See the reviewer’s note below. You can submit a new application addressing the points raised.',
  },
  withdrawn: {
    tone: 'slate',
    Icon: Ban,
    title: 'Application withdrawn',
    blurb: 'You cancelled this application. You can start a fresh one whenever you’re ready.',
  },
  approved: {
    tone: 'lime',
    Icon: CheckCircle2,
    title: 'You’re approved!',
    blurb: 'Your arena is live on Turfio and your owner dashboard is ready.',
  },
};

const TONE = {
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  lime: 'bg-lime-50 text-lime-700 border-lime-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  slate: 'bg-slate-50 text-slate-600 border-slate-200',
};

export default function OwnerApplicationPendingPage({ user, onLogout, onNewRequest, onDeleteAccount }) {
  const { showToast } = useToast();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await ownerRequestService.mine();
      setRequest((res.data || [])[0] || null);
    } catch {
      /* keep last known */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch on mount + poll for the reviewer's decision (external-system sync).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const id = setInterval(load, 20000);
    return () => clearInterval(id);
  }, [load]);

  const status = request?.status || 'none';
  const meta = STATE[status] || STATE.none;
  const { Icon } = meta;
  const canWithdraw = ['pending', 'needs_changes'].includes(status);
  const canReapply = ['none', 'rejected', 'needs_changes', 'withdrawn'].includes(status);

  const handleWithdraw = async () => {
    if (!request || busy) return;
    if (!window.confirm('Withdraw this application? You can submit a new one later.')) return;
    setBusy(true);
    try {
      await ownerRequestService.withdraw(request._id);
      showToast('Application withdrawn.', 'success');
      await load();
    } catch (err) {
      showToast(err.message || 'Could not withdraw the application.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (busy) return;
    if (!window.confirm('Delete your account permanently? This removes your application and uploaded documents and cannot be undone.')) return;
    setBusy(true);
    try {
      const res = await onDeleteAccount?.();
      if (res && res.success === false) {
        showToast(res.error || 'Could not delete your account.', 'error');
      }
      // On success the app unmounts this page (user is now signed out).
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <header className="border-b border-slate-100">
        <div className="mx-auto max-w-3xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black tracking-tight">
            <ShieldCheck className="h-5 w-5 text-lime-600" />
            Turfio Partners
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-sm font-medium text-slate-500">Hi {user?.firstName || 'there'},</p>

        <div className="mt-4 flex items-start gap-4">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${TONE[meta.tone]}`}>
            {loading && status === 'none' ? <Loader2 className="h-6 w-6 animate-spin" /> : <Icon className="h-6 w-6" />}
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{meta.title}</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 max-w-xl">{meta.blurb}</p>
          </div>
        </div>

        {request?.arena?.name && (
          <p className="mt-4 text-xs font-semibold text-slate-400">
            Arena: <span className="text-slate-700">{request.arena.name}</span>
            {request.createdAt && ` · submitted ${new Date(request.createdAt).toLocaleDateString()}`}
          </p>
        )}

        {['rejected', 'needs_changes'].includes(status) && request?.review?.note && (
          <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
            <p className="text-[11px] font-black uppercase tracking-wider text-rose-800">Reviewer note</p>
            <p className="mt-1 text-sm font-medium text-slate-700">{request.review.note}</p>
          </div>
        )}

        {/* Timeline */}
        {['pending', 'needs_changes', 'none'].includes(status) && (
          <div className="mt-10">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">What happens next</h2>
            <ol className="space-y-4">
              {STEPS.map((s, i) => {
                const reached = i === 0 || (i === 1 && ['pending', 'needs_changes'].includes(status));
                return (
                  <li key={s.title} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                        reached ? 'bg-lime-400 text-slate-900' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{s.title}</p>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* Primary actions */}
        <div className="mt-10 flex flex-wrap gap-3">
          {status === 'approved' && (
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-6 py-3 text-xs font-bold text-slate-900 hover:bg-lime-500 transition-all active:scale-[0.99] cursor-pointer"
            >
              Open owner dashboard <ArrowRight className="h-4 w-4" />
            </button>
          )}
          {canReapply && !loading && (
            <button
              onClick={onNewRequest}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
              disabled={busy}
            >
              {status === 'none' ? 'Submit your application' : 'Submit a new application'}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
          {canWithdraw && (
            <button
              onClick={handleWithdraw}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
              Withdraw application
            </button>
          )}
        </div>

        {/* Danger zone */}
        <div className="mt-12 border-t border-slate-100 pt-6">
          <button
            onClick={handleDelete}
            disabled={busy}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" /> Delete my account
          </button>
          <p className="mt-1.5 text-[11px] font-medium text-slate-400 max-w-md">
            Permanently removes your account, this application, and every document you uploaded.
          </p>
        </div>

        <p className="mt-10 text-[11px] font-medium text-slate-400">
          This page updates automatically. Questions? Email partners@turfio.com.
        </p>
      </main>
    </div>
  );
}
