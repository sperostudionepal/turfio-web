import { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Ticket,
  Search,
  Plus,
  X,
  Pencil,
  Trash2,
  Power,
  Tag,
  Percent,
  Globe2,
  Loader2,
  AlertCircle,
  Ban,
} from 'lucide-react';
import promoService from '../../../shared/services/promoService';
import turfService from '../../../shared/services/turfService';
import { formatNepalDateTime } from '../../../shared/utils/dateTime';

const NPT = 'Asia/Kathmandu';
const money = (n) => `NRs. ${Math.round(Number(n) || 0).toLocaleString('en-IN')}`;

// Nepal has no DST, so the +05:45 offset is constant and the owner's input maps to one instant.
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

const discountLabel = (promo) =>
  promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `${money(promo.discountValue)} OFF`;

const STATUS_STYLES = {
  Active: 'bg-emerald-50 text-emerald-700',
  Scheduled: 'bg-blue-50 text-blue-700',
  Expired: 'bg-slate-100 text-slate-500',
  Depleted: 'bg-amber-50 text-amber-700',
  Disabled: 'bg-rose-50 text-rose-600',
};

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Expired', value: 'expired' },
  { label: 'Disabled', value: 'disabled' },
];

const EMPTY_FORM = {
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: '',
  maxDiscountAmount: '',
  minBookingAmount: '',
  turf: '',
  startsAt: '',
  expiresAt: '',
  usageLimit: '',
  perUserLimit: '1',
  isActive: true,
};

function PromoCodesPage({ activeTab, setActiveTab, venue }) {
  const [venues, setVenues] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editing, setEditing] = useState(null); // null = closed, 'new' = create, object = edit
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async (searchValue = search, status = statusFilter) => {
    setLoading(true);
    setError('');
    try {
      const result = await promoService.listForOwner({
        search: searchValue.trim() || undefined,
        status: status || undefined,
      });
      setPromoCodes(result.promoCodes);
      setStats(result.stats);
    } catch (e) {
      setError(e.message || 'Unable to load promo codes.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => load(search, statusFilter), 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    turfService
      .getOwnerTurfs()
      .then((items) => setVenues(items.filter(Boolean)))
      .catch(() => setVenues([]));
  }, []);

  const openCreate = () => {
    setFormError('');
    setForm({ ...EMPTY_FORM, turf: venue?.id || venues[0]?.id || '' });
    setEditing('new');
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
      turf: promo.turf?._id || promo.turf || '',
      startsAt: toDateTimeInput(promo.startsAt),
      expiresAt: toDateTimeInput(promo.expiresAt),
      usageLimit: promo.usageLimit ? String(promo.usageLimit) : '',
      perUserLimit: String(promo.perUserLimit ?? 1),
      isActive: Boolean(promo.isActive),
    });
    setEditing(promo);
  };

  const numberOr = (value, fallback) => {
    if (value === '' || value === null || value === undefined) return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    const isCreate = editing === 'new';
    const expiresAt = toIso(form.expiresAt);
    if (!expiresAt) {
      setFormError('An expiry date is required.');
      setSaving(false);
      return;
    }
    if (isCreate && !form.turf) {
      setFormError('Choose the venue this code applies to.');
      setSaving(false);
      return;
    }

    // The create/update schemas are strict, so omitted optional fields must be absent, not null.
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
      if (isCreate) {
        await promoService.createForOwner({ ...shared, code: form.code.trim().toUpperCase(), scope: 'turf', turf: form.turf });
      } else {
        // code, scope and turf are fixed after creation; the server rejects them on update.
        await promoService.updateForOwner(editing._id, shared);
      }
      setEditing(null);
      await load(search, statusFilter);
    } catch (err) {
      setFormError(err.message || 'Unable to save the promo code.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (promo) => {
    try {
      await promoService.updateForOwner(promo._id, { isActive: !promo.isActive });
      await load(search, statusFilter);
    } catch (e) {
      setError(e.message || 'Unable to update the promo code.');
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await promoService.deleteForOwner(pendingDelete._id);
      setPendingDelete(null);
      await load(search, statusFilter);
    } catch (e) {
      setPendingDelete(null);
      setError(e.message || 'Unable to delete the promo code.');
    } finally {
      setDeleting(false);
    }
  };

  const statCards = useMemo(
    () => [
      { title: 'Active Codes', value: stats.active ?? 0, caption: 'Redeemable right now', icon: Ticket, iconBg: 'bg-emerald-50 text-emerald-600' },
      { title: 'Total Redemptions', value: stats.totalRedemptions ?? 0, caption: 'Bookings discounted', icon: Tag, iconBg: 'bg-blue-50 text-blue-600' },
      { title: 'Discount Given', value: money(stats.totalDiscountGiven), caption: 'Total player savings', icon: Percent, iconBg: 'bg-purple-50 text-purple-600' },
      { title: 'Expired', value: stats.expired ?? 0, caption: `of ${stats.total ?? 0} venue codes`, icon: Ban, iconBg: 'bg-amber-50 text-amber-600' },
    ],
    [stats]
  );

  const venueName = (promo) => {
    if (promo.scope === 'global') return 'All venues';
    return promo.turf?.name || venues.find((v) => v.id === (promo.turf?._id || promo.turf))?.name || '—';
  };

  const isReadOnly = (promo) => promo.scope === 'global';

  return (
    <div className="flex flex-col h-screen bg-[#f3f5fc] text-slate-900 font-sans antialiased overflow-hidden select-none relative">
      <TopBar />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight">Promo Codes</h1>
              <p className="text-sm text-slate-500 mt-1">
                Discount codes players can redeem when booking your venue. Every code applies to all courts.
              </p>
            </div>
            <button
              onClick={openCreate}
              disabled={!venues.length}
              title={venues.length ? '' : 'Add a venue before creating promo codes'}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={16} /> Create Promo Code
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">{stat.title}</p>
                      <p className="text-xl font-black mt-1">{stat.value}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4">{stat.caption}</p>
                </div>
              );
            })}
          </div>

          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative w-full md:max-w-xs">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by code..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter.label}
                    onClick={() => setStatusFilter(filter.value)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      statusFilter === filter.value
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex justify-center items-center text-slate-500 text-sm">
                <Loader2 className="animate-spin mr-2" size={18} /> Loading promo codes…
              </div>
            ) : error ? (
              <div className="m-5 p-4 rounded-xl bg-red-50 text-red-700 flex items-center gap-2">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
                <button onClick={() => load()} className="ml-auto font-bold text-sm">Retry</button>
              </div>
            ) : !promoCodes.length ? (
              <div className="py-20 text-center">
                <Ticket size={30} className="mx-auto text-slate-300" />
                <h3 className="font-bold mt-3">No promo codes yet</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Create a code with a discount and a validity window. Players apply it at checkout and the
                  discount is deducted from the booking total.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      {['Code', 'Discount', 'Venue', 'Validity', 'Usage', 'Status', ''].map((heading) => (
                        <th key={heading} className="text-left px-5 py-3 font-bold">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {promoCodes.map((promo) => (
                      <tr key={promo._id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <div className="font-black text-emerald-700 tracking-wider">{promo.code}</div>
                          {promo.description && <div className="text-xs text-slate-400 mt-0.5 max-w-[220px] truncate">{promo.description}</div>}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="font-bold">{discountLabel(promo)}</div>
                          {promo.discountType === 'percentage' && promo.maxDiscountAmount > 0 && (
                            <div className="text-xs text-slate-400">capped at {money(promo.maxDiscountAmount)}</div>
                          )}
                          {promo.minBookingAmount > 0 && (
                            <div className="text-xs text-slate-400">min. booking {money(promo.minBookingAmount)}</div>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {promo.scope === 'global' ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                              <Globe2 size={12} /> Platform-wide
                            </span>
                          ) : (
                            <span className="text-slate-600">{venueName(promo)}</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                          <div>From {formatNepalDateTime(promo.startsAt)}</div>
                          <div className="mt-0.5">Until {formatNepalDateTime(promo.expiresAt)}</div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap font-semibold">
                          {promo.usedCount} / {promo.usageLimit > 0 ? promo.usageLimit : '∞'}
                          <div className="text-xs text-slate-400 font-medium">max {promo.perUserLimit} per player</div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[promo.status] || 'bg-slate-100 text-slate-500'}`}>
                            {promo.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {isReadOnly(promo) ? (
                            <span className="text-xs text-slate-400 font-medium" title="Platform-wide codes are managed by the super admin">
                              Read only
                            </span>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEdit(promo)}
                                title="Edit"
                                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => toggleActive(promo)}
                                title={promo.isActive ? 'Disable' : 'Enable'}
                                className={`p-2 rounded-lg border transition-all ${
                                  promo.isActive
                                    ? 'border-slate-200 text-slate-600 hover:bg-amber-500 hover:text-white hover:border-amber-500'
                                    : 'border-slate-200 text-slate-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                                }`}
                              >
                                <Power size={14} />
                              </button>
                              <button
                                onClick={() => setPendingDelete(promo)}
                                title={promo.usedCount > 0 ? 'Disable (already redeemed)' : 'Delete'}
                                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg">{editing === 'new' ? 'Create Promo Code' : `Edit ${editing.code}`}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editing === 'new'
                    ? 'The code applies to every court at the selected venue.'
                    : 'The code itself and its venue cannot be changed after creation.'}
                </p>
              </div>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
            </div>

            <form onSubmit={submit} className="p-5 space-y-4">
              {formError && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-medium">{formError}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-sm font-bold">
                  Code *
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    disabled={editing !== 'new'}
                    required={editing === 'new'}
                    minLength={3}
                    maxLength={32}
                    pattern="[A-Za-z0-9_-]+"
                    placeholder="WEEKEND20"
                    className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 uppercase tracking-wider disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </label>

                <label className="block text-sm font-bold">
                  Venue *
                  {editing === 'new' ? (
                    <select
                      value={form.turf}
                      onChange={(e) => setForm({ ...form, turf: e.target.value })}
                      required
                      className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500"
                    >
                      <option value="">Select a venue</option>
                      {venues.map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={venueName(editing)}
                      disabled
                      className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400"
                    />
                  )}
                </label>
              </div>

              <label className="block text-sm font-bold">
                Description
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  maxLength={200}
                  placeholder="Optional note shown to players"
                  className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 font-medium"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="block text-sm font-bold">
                  Discount type *
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </label>

                <label className="block text-sm font-bold">
                  {form.discountType === 'percentage' ? 'Percent off *' : 'Amount off (NRs.) *'}
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    required
                    min={0.01}
                    max={form.discountType === 'percentage' ? 100 : undefined}
                    step="any"
                    className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </label>

                {form.discountType === 'percentage' && (
                  <label className="block text-sm font-bold">
                    Max discount (NRs.)
                    <input
                      type="number"
                      value={form.maxDiscountAmount}
                      onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                      min={0}
                      step="any"
                      placeholder="0 = no cap"
                      className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-sm font-bold">
                  Starts at
                  <input
                    type="datetime-local"
                    value={form.startsAt}
                    onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                    className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                  <span className="block text-xs font-medium text-slate-400 mt-1">Leave blank to start immediately.</span>
                </label>

                <label className="block text-sm font-bold">
                  Expires at *
                  <input
                    type="datetime-local"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    required
                    className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                  <span className="block text-xs font-medium text-slate-400 mt-1">After this the code gives no discount.</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="block text-sm font-bold">
                  Total usage limit
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    min={0}
                    step={1}
                    placeholder="0 = unlimited"
                    className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-sm font-bold">
                  Per player limit
                  <input
                    type="number"
                    value={form.perUserLimit}
                    onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })}
                    min={1}
                    step={1}
                    className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block text-sm font-bold">
                  Minimum booking (NRs.)
                  <input
                    type="number"
                    value={form.minBookingAmount}
                    onChange={(e) => setForm({ ...form, minBookingAmount: e.target.value })}
                    min={0}
                    step="any"
                    placeholder="0 = none"
                    className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </label>
              </div>

              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600"
                />
                <span className="text-sm font-bold">Active</span>
                <span className="text-xs text-slate-500 font-medium">Players can redeem this code while it is active and within its validity window.</span>
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50">
                  Cancel
                </button>
                <button disabled={saving} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm disabled:opacity-50">
                  {saving ? 'Saving…' : editing === 'new' ? 'Create Code' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="font-black text-lg">Delete {pendingDelete.code}?</h3>
            <p className="text-sm text-slate-500 mt-2">
              {pendingDelete.usedCount > 0
                ? `This code has been redeemed ${pendingDelete.usedCount} time${pendingDelete.usedCount === 1 ? '' : 's'}, so it will be disabled instead of deleted to keep past bookings accurate.`
                : 'Players will no longer be able to redeem this code.'}
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setPendingDelete(null)} className="px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50">
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm disabled:opacity-50"
              >
                {deleting ? 'Working…' : pendingDelete.usedCount > 0 ? 'Disable Code' : 'Delete Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PromoCodesPage;
