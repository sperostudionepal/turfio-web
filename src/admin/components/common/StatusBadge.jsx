export const STATUS_TOKENS = {
  cancelled: 'bg-red-50 text-red-700 border-red-100', failed: 'bg-red-50 text-red-700 border-red-100',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100', paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
  pending: 'bg-amber-50 text-amber-700 border-amber-100', 'partially paid': 'bg-amber-50 text-amber-700 border-amber-100', partial: 'bg-amber-50 text-amber-700 border-amber-100',
  'pay at venue': 'bg-orange-50 text-orange-700 border-orange-200 ring-1 ring-inset ring-orange-100',
  unpaid: 'bg-slate-100 text-slate-600 border-slate-200', draft: 'bg-slate-100 text-slate-600 border-slate-200',
};
export const statusToken = (value) => STATUS_TOKENS[String(value || '').trim().toLowerCase()] || 'bg-slate-100 text-slate-600 border-slate-200';
export default function StatusBadge({ status, label, className = '' }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold leading-none ${statusToken(status)} ${className}`}>{label || status || '—'}</span>;
}
