import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Building2,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Phone,
  Mail,
  FileText,
  X,
  Ban,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import ownerApplicationService from '../../../services/ownerApplicationService';
import { useToast } from '../../../components/common/toastContext';

const STATUS_TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'needs_changes', label: 'Needs changes' },
  { key: 'all', label: 'All' },
];

const DOC_KIND_LABEL = {
  registration: 'Company/Firm Registration',
  pan: 'PAN / VAT Certificate',
  lease: 'Lease / Ownership Deed',
  citizenship: 'Citizenship',
  other: 'Supporting Document',
};

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

function StatusBadge({ status }) {
  const map = {
    pending: { cls: 'bg-amber-50 text-amber-700 border-amber-200/60', Icon: Clock, text: 'Pending review' },
    needs_changes: { cls: 'bg-amber-50 text-amber-700 border-amber-200/60', Icon: Clock, text: 'Needs changes' },
    approved: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', Icon: CheckCircle2, text: 'Approved' },
    completed: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', Icon: CheckCircle2, text: 'Approved' },
    rejected: { cls: 'bg-rose-50 text-rose-700 border-rose-200/60', Icon: Ban, text: 'Rejected' },
    withdrawn: { cls: 'bg-slate-50 text-slate-600 border-slate-200/60', Icon: Ban, text: 'Withdrawn' },
  };
  const { cls, Icon, text } = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black border ${cls}`}>
      <Icon size={12} /> {text}
    </span>
  );
}

function SuperadminVenuesPage() {
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedId, setSelectedId] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [actionBusy, setActionBusy] = useState(false);

  const reqIdRef = useRef(0);

  // Derive the open request from the latest list data so the modal always
  // reflects a fresh decision without a syncing effect.
  const selected = selectedId && Array.isArray(rows) ? rows.find((r) => r._id === selectedId) || null : null;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const load = useCallback(async () => {
    const ticket = ++reqIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await ownerApplicationService.list({
        status: statusFilter,
        q: debouncedQuery,
        limit: 50,
      });
      if (ticket !== reqIdRef.current) return; // stale response

      const listData = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      const totalCount = res?.data?.total ?? res?.total ?? listData.length;

      setRows(listData);
      setTotal(totalCount);
    } catch (err) {
      if (ticket !== reqIdRef.current) return;
      setError(err.message || 'Failed to load requests');
      setRows([]);
      setTotal(0);
    } finally {
      if (ticket === reqIdRef.current) setLoading(false);
    }
  }, [statusFilter, debouncedQuery]);

  useEffect(() => {
    // Fetch on filter / search change (external-system sync).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const decide = async (decision) => {
    if (!selected) return;
    if (decision === 'reject' && rejectNote.trim().length < 3) {
      showToast('Add a short note explaining the rejection.', 'error');
      return;
    }
    setActionBusy(true);
    try {
      await ownerApplicationService.decide(
        selected._id,
        decision,
        decision === 'reject' ? rejectNote.trim() : undefined,
      );
      showToast(
        decision === 'approve' ? 'Arena approved and published.' : 'Request rejected.',
        'success',
      );
      setSelectedId(null);
      setRejectNote('');
      load();
    } catch (err) {
      showToast(err.message || 'Action failed. Please try again.', 'error');
    } finally {
      setActionBusy(false);
    }
  };

  const resendSetup = async () => {
    if (!selected) return;
    setActionBusy(true);
    try {
      await ownerApplicationService.resendSetup(selected._id);
      showToast('A fresh dashboard setup link was sent.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not resend the setup link.', 'error');
    } finally {
      setActionBusy(false);
    }
  };

  const pendingCount = useMemo(
    () => (Array.isArray(rows) ? rows : []).filter((r) => r.status === 'pending' || r.status === 'needs_changes').length,
    [rows],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="text-lime-600" /> Verifications &amp; KYC
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Review turf listing requests and their submitted documents. Approve to publish the
            arena and grant the applicant owner access, or reject with a reason.
          </p>
        </div>
        {statusFilter === 'pending' && !loading && (
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200/70 px-3.5 py-1.5 text-xs font-black text-amber-700">
            <Clock size={13} /> {pendingCount} awaiting review
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl overflow-hidden p-5 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by arena, owner, email, PAN, or city…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.key
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[160px]">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2 text-sm font-bold">
              <Loader2 size={16} className="animate-spin" /> Loading requests…
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <p className="text-sm font-bold text-rose-600">{error}</p>
              <button
                onClick={load}
                className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-slate-800"
              >
                Retry
              </button>
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <FileText size={28} className="mb-2" />
              <p className="text-sm font-bold">No requests match this view.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="text-[11px] font-extrabold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                  <th className="pb-3 pr-3">Arena &amp; Applicant</th>
                  <th className="pb-3 pr-3">Business / PAN</th>
                  <th className="pb-3 pr-3">Location &amp; Courts</th>
                  <th className="pb-3 pr-3">Submitted</th>
                  <th className="pb-3 pr-3 text-center">Status</th>
                  <th className="pb-3 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-semibold">
                {rows.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-3">
                      <span className="font-extrabold text-slate-900 text-xs block">{r.arena?.name}</span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {r.contact?.ownerName} · {r.contact?.email}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3">
                      <div className="text-slate-800 font-bold">{r.business?.legalName}</div>
                      <div className="text-[11px] text-slate-400 font-medium">PAN {r.business?.panNumber}</div>
                    </td>
                    <td className="py-3.5 pr-3">
                      <div className="text-slate-800 font-bold">
                        {[r.arena?.address?.area, r.arena?.address?.city].filter(Boolean).join(', ')}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">{r.arena?.courts || 1} court(s)</div>
                    </td>
                    <td className="py-3.5 pr-3 text-slate-500">{formatDate(r.createdAt)}</td>
                    <td className="py-3.5 pr-3 text-center">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        title="Inspect & decide"
                        onClick={() => {
                          setSelectedId(r._id);
                          setRejectNote('');
                        }}
                        className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && !error && rows.length > 0 && (
          <p className="text-[11px] font-semibold text-slate-400">
            Showing {rows.length} of {total}
          </p>
        )}
      </div>

      {/* Inspect & decide modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{selected.arena?.name}</h3>
                  <StatusBadge status={selected.status} />
                </div>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  PAN {selected.business?.panNumber} · Submitted {formatDate(selected.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Legal Entity</span>
                  <p className="font-extrabold text-slate-900">{selected.business?.legalName}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
                  <p className="font-extrabold text-slate-900">
                    {[selected.arena?.address?.area, selected.arena?.address?.city].filter(Boolean).join(', ')}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Courts</span>
                  <p className="font-extrabold text-slate-900">{selected.arena?.courts || 1}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price / hour</span>
                  <p className="font-extrabold text-slate-900">
                    Rs. {selected.arena?.pricePerHour} <span className="text-slate-400 font-medium">({selected.arena?.priceRangeLabel})</span>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-lime-50/60 border border-lime-100 space-y-2 text-xs">
                <span className="text-[11px] font-black text-lime-900 uppercase tracking-wider block">Applicant Contact</span>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-slate-800 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} className="text-lime-700" /> {selected.contact?.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone size={13} className="text-lime-700" /> {selected.contact?.phone}
                  </span>
                </div>
              </div>


              <div className="space-y-2">
                <span className="text-xs font-black text-slate-900 block">Submitted Documents</span>
                <div className="space-y-2">
                  {(selected.documents || []).map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs hover:border-lime-300 hover:bg-lime-50/40 transition-all"
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-700 min-w-0">
                        <FileText size={15} className="text-slate-400 shrink-0" />
                        <span className="truncate">{doc.originalName}</span>
                      </div>
                      <span className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {DOC_KIND_LABEL[doc.kind] || doc.kind}
                        </span>
                        <ExternalLink size={13} className="text-slate-400" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {['rejected', 'needs_changes'].includes(selected.status) && selected.review?.note && (
                <div className="rounded-2xl bg-rose-50/70 border border-rose-100 p-3.5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-rose-800">Previous decision note</p>
                  <p className="mt-1 text-xs font-medium text-slate-700">{selected.review.note}</p>
                </div>
              )}

              {(selected.status === 'pending' || selected.status === 'needs_changes') && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <textarea
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    rows={2}
                    placeholder="Reason (required to reject, optional when approving)…"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-lime-300 outline-none transition-all"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      disabled={actionBusy}
                      onClick={() => decide('reject')}
                      className="flex-1 py-3 rounded-full border border-rose-200 text-rose-700 font-black text-xs transition-all hover:bg-rose-50 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {actionBusy ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />} Reject
                    </button>
                    <button
                      disabled={actionBusy}
                      onClick={() => decide('approve')}
                      className="flex-1 py-3 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 font-black text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {actionBusy ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={15} />} Approve &amp; Publish
                    </button>
                  </div>
                </div>
              )}

              {['approved', 'completed'].includes(selected.status) && (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Approved — turf published and applicant granted owner access.
                  </div>
                  <button
                    type="button"
                    disabled={actionBusy}
                    onClick={resendSetup}
                    className="w-full py-2.5 rounded-full border border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {actionBusy ? 'Sending…' : 'Resend dashboard setup link'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperadminVenuesPage;
