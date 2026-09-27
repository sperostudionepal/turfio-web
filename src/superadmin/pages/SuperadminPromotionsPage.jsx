import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Tag,
  Megaphone,
  Plus,
  Trash2,
  X,
  Send,
  Pencil,
  Power,
  Loader2,
  AlertCircle,
  Globe2,
} from 'lucide-react';
import promoService from '../../shared/services/promoService';
import { formatNepalDateTime } from '../../shared/utils/dateTime';
import { useToast } from '../../shared/components/common/toastContext';

const NPT = 'Asia/Kathmandu';
const money = (n) => `NRs. ${Math.round(Number(n) || 0).toLocaleString('en-IN')}`;

// Nepal has no DST, so +05:45 is constant and the input maps to exactly one instant.
const toDateTimeInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: NPT,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value])
  );
  const hour = parts.hour === '24' ? '00' : parts.hour;
  return `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}`;
};

const toIso = (inputValue) => {
  if (!inputValue) return undefined;
  const date = new Date(`${inputValue}:00+05:45`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const discountLabel = (promo) => {
  const base = promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `${money(promo.discountValue)} OFF`;
  return promo.discountType === 'percentage' && promo.maxDiscountAmount > 0
    ? `${base} (up to ${money(promo.maxDiscountAmount)})`
    : base;
};

const STATUS_STYLES = {
  Active: 'bg-emerald-100 text-emerald-800',
  Scheduled: 'bg-blue-100 text-blue-700',
  Expired: 'bg-slate-100 text-slate-500',
  Depleted: 'bg-amber-100 text-amber-800',
  Disabled: 'bg-rose-100 text-rose-700',
};

const EMPTY_FORM = {
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: '',
  maxDiscountAmount: '',
  minBookingAmount: '',
  startsAt: '',
  expiresAt: '',
  usageLimit: '',
  perUserLimit: '1',
  isActive: true,
};

function SuperadminPromotionsPage() {
  const { showToast } = useToast();
  const reqIdRef = useRef(0);

  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [announcementText, setAnnouncementText] = useState(
    '⚽ Monsoon Futsal League 2026: Arena registration is now open with 0% platform fee for tournament fixtures!'
  );
  const [isBannerActive, setIsBannerActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    const ticket = ++reqIdRef.current;
    setLoading(true);
    setError('');
    try {
      // Platform-wide codes only; venue owners manage their own codes from the owner dashboard.
      const result = await promoService.listForOwner({ scope: 'global', search: debouncedSearch || undefined });
      if (ticket !== reqIdRef.current) return;
      setPromotions(result.promoCodes);
    } catch (err) {
      if (ticket !== reqIdRef.current) return;
      setError(err.message || 'Failed to load platform vouchers.');
      setPromotions([]);
    } finally {
      if (ticket === reqIdRef.current) setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const openCreate = () => {
    setFormError('');
    setForm(EMPTY_FORM);
    setEditing(null);
    setIsAddModalOpen(true);
  };

  const openEdit = (promo) => {
    setFormError('');
    setForm({
      code: promo.code,
      description: promo.description || '',
      discountType: promo.discountType,
      discountValue: String(promo.discountValue ?? ''),
      maxDiscountAmount: promo.maxDiscountAmount ? String(promo.maxDiscountAmount) : '',
      minBookingAmount: promo.minBookingAmount ? String(promo.minBookingAmount) : '',
      startsAt: toDateTimeInput(promo.startsAt),
      expiresAt: toDateTimeInput(promo.expiresAt),
      usageLimit: promo.usageLimit ? String(promo.usageLimit) : '',
      perUserLimit: String(promo.perUserLimit ?? 1),
      isActive: Boolean(promo.isActive),
    });
    setEditing(promo);
    setIsAddModalOpen(true);
  };

  const numberOr = (value, fallback) => {
    if (value === '' || value === null || value === undefined) return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const submit = async (e) => {
    e.preventDefault();
    const expiresAt = toIso(form.expiresAt);
    if (!expiresAt) {
      setFormError('An expiry date is required.');
      return;
    }

    setSaving(true);
    setFormError('');

    const shared = {
      description: form.description.trim() || undefined,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      maxDiscountAmount: form.discountType === 'percentage' ? numberOr(form.maxDiscountAmount, 0) : 0,
      minBookingAmount: numberOr(form.minBookingAmount, 0),
      startsAt: toIso(form.startsAt),
      expiresAt,
      usageLimit: numberOr(form.usageLimit, 0),
      perUserLimit: numberOr(form.perUserLimit, 1),
      isActive: form.isActive,
    };

    try {
      if (editing) {
        // The server rejects code/scope on update: a shared code must stay redeemable as printed.
        await promoService.updateForOwner(editing._id, shared);
        showToast(`${editing.code} updated.`, 'success');
      } else {
        await promoService.createForOwner({ ...shared, code: form.code.trim().toUpperCase(), scope: 'global' });
        showToast('Platform voucher created.', 'success');
      }
      setIsAddModalOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      setFormError(err.message || 'Unable to save the voucher.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (promo) => {
    try {
      await promoService.updateForOwner(promo._id, { isActive: !promo.isActive });
      showToast(promo.isActive ? `${promo.code} disabled.` : `${promo.code} enabled.`, 'success');
      load();
    } catch (err) {
      showToast(err.message || 'Action failed. Please try again.', 'error');
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await promoService.deleteForOwner(pendingDelete._id);
      showToast(
        res?.isActive === false ? `${pendingDelete.code} disabled (already redeemed).` : `${pendingDelete.code} deleted.`,
        'success'
      );
      setPendingDelete(null);
      load();
    } catch (err) {
      showToast(err.message || 'Unable to delete the voucher.', 'error');
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="text-lime-600" /> Platform Promotions & Global Campaigns
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Create system-wide discount coupons, sponsored campaigns, and broadcast ticker banners.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 text-xs font-extrabold transition-all cursor-pointer shadow-xs"
        >
          <Plus size={14} />
          <span>Create Platform Voucher</span>
        </button>
      </div>

      {/* Global Broadcast Ticker Editor */}
      <div className="bg-white rounded-xl overflow-hidden p-6 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Megaphone size={16} />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                Global Header Broadcast Announcement
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Displayed at the top of player mobile apps and web booking portal
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBannerActive(!isBannerActive)}
            className={`px-3 py-1 rounded-full text-xs font-black transition-colors ${
              isBannerActive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {isBannerActive ? '● Broadcast Active' : '○ Disabled'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
          />
          <button className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <Send size={13} /> Update Ticker
          </button>
        </div>
      </div>

      {/* Promotions List */}
      <div className="bg-white rounded-xl overflow-hidden p-6 shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-black text-base text-slate-900">Platform Voucher Campaigns</h3>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center items-center gap-2 text-slate-500 text-xs font-bold">
            <Loader2 className="animate-spin" size={16} /> Loading vouchers…
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-xs font-bold">{error}</span>
            <button onClick={load} className="ml-auto font-black text-xs">Retry</button>
          </div>
        ) : !promotions.length ? (
          <div className="py-16 text-center">
            <Globe2 size={28} className="mx-auto text-slate-300" />
            <h4 className="font-black text-sm mt-3">No platform vouchers yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
              A platform voucher can be redeemed at any arena on Turfio, on top of the codes each venue owner creates.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="text-[11px] font-extrabold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                  <th className="pb-3 pr-3">Voucher Code</th>
                  <th className="pb-3 pr-3">Discount Value</th>
                  <th className="pb-3 pr-3">Target Scope</th>
                  <th className="pb-3 pr-3 text-center">Redemptions</th>
                  <th className="pb-3 pr-3">Valid Until</th>
                  <th className="pb-3 pr-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-semibold">
                {promotions.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-3">
                      <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {p.code}
                      </span>
                      {p.description && (
                        <span className="text-[11px] text-slate-400 font-medium block mt-1 max-w-[220px] truncate">
                          {p.description}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 pr-3 font-extrabold text-slate-900">
                      {discountLabel(p)}
                      {p.minBookingAmount > 0 && (
                        <span className="block text-[11px] text-slate-400 font-medium">min. booking {money(p.minBookingAmount)}</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-3 font-medium text-slate-700">Global - All Arenas</td>
                    <td className="py-3.5 pr-3 text-center font-bold text-slate-900">
                      {p.usedCount} / {p.usageLimit > 0 ? p.usageLimit : '∞'}
                    </td>
                    <td className="py-3.5 pr-3 font-medium text-slate-600">{formatNepalDateTime(p.expiresAt)}</td>
                    <td className="py-3.5 pr-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${STATUS_STYLES[p.status] || 'bg-slate-100 text-slate-500'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors cursor-pointer"
                          title="Edit voucher"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => toggleActive(p)}
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-colors cursor-pointer"
                          title={p.isActive ? 'Disable' : 'Enable'}
                        >
                          <Power size={14} />
                        </button>
                        <button
                          onClick={() => setPendingDelete(p)}
                          className="p-1.5 rounded-xl border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title={p.usedCount > 0 ? 'Disable (already redeemed)' : 'Delete'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Voucher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editing ? `Edit ${editing.code}` : 'Create Platform Voucher'}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Redeemable at every arena on Turfio.
                </p>
              </div>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditing(null); }}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-3 text-xs">
              {formError && <div className="p-3 bg-red-50 text-red-700 rounded-xl font-bold">{formError}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. MONSOON25"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    disabled={Boolean(editing)}
                    required={!editing}
                    minLength={3}
                    maxLength={32}
                    pattern="[A-Za-z0-9_-]+"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-extrabold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-lime-300 disabled:text-slate-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount type *</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-lime-300"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Shown to players at checkout"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  maxLength={200}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-lime-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {form.discountType === 'percentage' ? 'Percent off *' : 'Amount off *'}
                  </label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    required
                    min={0.01}
                    max={form.discountType === 'percentage' ? 100 : undefined}
                    step="any"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-lime-300"
                  />
                </div>
                {form.discountType === 'percentage' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Max discount</label>
                    <input
                      type="number"
                      value={form.maxDiscountAmount}
                      onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                      min={0}
                      step="any"
                      placeholder="0 = no cap"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-lime-300"
                    />
                  </div>
                )}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min booking</label>
                  <input
                    type="number"
                    value={form.minBookingAmount}
                    onChange={(e) => setForm({ ...form, minBookingAmount: e.target.value })}
                    min={0}
                    step="any"
                    placeholder="0 = none"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-lime-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Starts at</label>
                  <input
                    type="datetime-local"
                    value={form.startsAt}
                    onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-lime-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expires at *</label>
                  <input
                    type="datetime-local"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-lime-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total usage limit</label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    min={0}
                    step={1}
                    placeholder="0 = unlimited"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-lime-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Per player limit</label>
                  <input
                    type="number"
                    value={form.perUserLimit}
                    onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })}
                    min={1}
                    step={1}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-lime-300"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 accent-lime-500"
                />
                <span className="font-bold text-slate-700">Active</span>
                <span className="text-[11px] text-slate-400 font-medium">Players can redeem while active and within the validity window.</span>
              </label>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditing(null); }}
                  className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 font-black transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-sm shadow-2xl p-6">
            <h3 className="text-base font-black text-slate-900">Delete {pendingDelete.code}?</h3>
            <p className="text-xs text-slate-500 font-medium mt-2">
              {pendingDelete.usedCount > 0
                ? `Redeemed ${pendingDelete.usedCount} time${pendingDelete.usedCount === 1 ? '' : 's'}, so it will be disabled instead of deleted to keep past bookings accurate.`
                : 'Players will no longer be able to redeem this voucher at any arena.'}
            </p>
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setPendingDelete(null)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs disabled:opacity-50"
              >
                {deleting ? 'Working…' : pendingDelete.usedCount > 0 ? 'Disable' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperadminPromotionsPage;
