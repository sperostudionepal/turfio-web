const STATUS_TOKENS = {
  cancelled: 'bg-red-50 text-red-700', failed: 'bg-red-50 text-red-700',
  completed: 'bg-emerald-50 text-emerald-700', paid: 'bg-emerald-50 text-emerald-700',
  confirmed: 'bg-blue-50 text-blue-700', 'in progress': 'bg-blue-50 text-blue-700', upcoming: 'bg-blue-50 text-blue-700',
  pending: 'bg-amber-50 text-amber-700', 'partially paid': 'bg-amber-50 text-amber-700', partial: 'bg-amber-50 text-amber-700',
  'pay at venue': 'bg-orange-50 text-orange-700',
  unpaid: 'bg-slate-100 text-slate-600', draft: 'bg-slate-100 text-slate-600',
};
const statusToken = (value) => STATUS_TOKENS[String(value || '').trim().toLowerCase()] || 'bg-slate-100 text-slate-600';
export default function StatusBadge({ status, label, className = '' }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold leading-none ${statusToken(status)} ${className}`}>{label || status || '—'}</span>;
}
