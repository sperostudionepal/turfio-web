import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Ban,
  Globe2,
  Megaphone,
  Pencil,
  Percent,
  Power,
  Search,
  Tag,
  Ticket,
  Trash2,
} from 'lucide-react';

import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import BookingFilterSelect from '../../components/bookings/BookingFilterSelect';
import BookingPagination from '../../components/bookings/BookingPagination';
import { ErrorNotice } from '../../components/dashboard/DashboardNotices';

import promoService from '../../../shared/services/promoService';
import turfService from '../../../shared/services/turfService';
import { formatNepalDateTime } from '../../../shared/utils/dateTime';

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const NPT = 'Asia/Kathmandu';

const money = (n) =>
  `NRs. ${Math.round(Number(n) || 0).toLocaleString('en-IN')}`;

// Nepal has no DST, so the +05:45 offset is constant and the input maps to one instant.
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

const numberOr = (value, fallback) => {
  if (value === '' || value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const STATUS_STYLES = {
  Active: 'bg-lime-50 text-lime-700',
  Scheduled: 'bg-blue-50 text-blue-700',
  Expired: 'bg-rose-50 text-rose-600',
  Depleted: 'bg-amber-50 text-amber-700',
  Disabled: 'bg-slate-100 text-slate-600',
};

const TYPE_STYLES = {
  percentage: { label: 'Percentage', className: 'bg-blue-50 text-blue-700' },
  fixed: { label: 'Fixed Amount', className: 'bg-amber-50 text-amber-700' },
};

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'expired', label: 'Expired' },
  { value: 'disabled', label: 'Disabled' },
];

const TYPE_OPTIONS = [
  { value: 'All', label: 'All Types' },
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed', label: 'Fixed Amount' },
];

const HEADER_CLASS =
  'px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wide text-slate-400';

const INPUT_CLASS =
  'h-[44px] w-full rounded-lg border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-lime-400 disabled:bg-slate-50 disabled:text-slate-400';

const LABEL_CLASS = 'mb-1.5 block text-[12px] font-bold text-slate-700';

const EMPTY_FORM = {
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: '',
  startsAt: '',
  expiresAt: '',
  usageLimit: '',
  turf: '',
};

/* -------------------------------------------------------------------------- */
/* Stat card (same markup and sizing as the dashboard StatCards)              */
/* -------------------------------------------------------------------------- */

function PromoStatCard({ icon: Icon, iconWrapper, iconColor, title, value, subtext, loading }) {
  return (
    <div className="flex items-center rounded-xl border border-slate-100 bg-white px-4 py-4 shadow-[0_3px_18px_rgba(15,23,42,0.025)]">
      <div
        className={`mr-4 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl ${iconWrapper}`}
      >
        <Icon size={23} strokeWidth={2} className={iconColor} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-2 text-[13px] font-medium leading-tight text-slate-500">
          {title}
        </p>

        <h3 className="truncate text-[20px] font-extrabold leading-none tracking-[-0.025em] text-slate-950">
          {loading ? (
            <span className="inline-block h-5 w-16 animate-pulse rounded-md bg-slate-100 align-middle" />
          ) : (
            value
          )}
        </h3>

        <p className="mt-2 truncate text-[12px] font-medium leading-tight text-slate-400">
          {subtext}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

function PromoCodesPage({ activeTab, setActiveTab, venue }) {
  const [venues, setVenues] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [editing, setEditing] = useState(null); // null = create mode, object = edit mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(
    async (searchValue = search, status = statusFilter) => {
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
    },
    [search, statusFilter]
  );

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

  const retryLoad = async () => {
    setIsRetrying(true);
    await load();
    setIsRetrying(false);
  };

  /* ---------------------------------------------------------------------- */
  /* Form                                                                   */
  /* ---------------------------------------------------------------------- */

  const setField = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const resetForm = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const openEdit = (promo) => {
    setFormError('');
    setForm({
      code: promo.code,
      description: promo.description || '',
      discountType: promo.discountType,
      discountValue: String(promo.discountValue ?? ''),
      startsAt: toDateTimeInput(promo.startsAt),
      expiresAt: toDateTimeInput(promo.expiresAt),
      usageLimit: promo.usageLimit ? String(promo.usageLimit) : '',
      turf: promo.turf?._id || promo.turf || '',
    });
    setEditing(promo);
  };

  // With a single venue the picker is hidden and that venue is used automatically.
  const effectiveTurf = form.turf || venue?.id || venues[0]?.id || '';

  const submit = async (event) => {
    event.preventDefault();
    setFormError('');

    const expiresAt = toIso(form.expiresAt);
    if (!expiresAt) {
      setFormError('An end date is required.');
      return;
    }
    if (!editing && !effectiveTurf) {
      setFormError('Choose the venue this code applies to.');
      return;
    }

    // Schemas are strict, so optional fields must be absent rather than null.
    const shared = {
      description: form.description.trim() || undefined,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      startsAt: toIso(form.startsAt),
      expiresAt,
      usageLimit: numberOr(form.usageLimit, 0),
    };

    setSaving(true);
    try {
      if (editing) {
        // Code, scope and venue are fixed after creation.
        await promoService.updateForOwner(editing._id, shared);
      } else {
        await promoService.createForOwner({
          ...shared,
          code: form.code.trim().toUpperCase(),
          scope: 'turf',
          turf: effectiveTurf,
          // Fields removed from the form for now, sent with safe defaults.
          maxDiscountAmount: 0,
          minBookingAmount: 0,
          perUserLimit: 1,
          isActive: true,
        });
      }
      resetForm();
      await load(search, statusFilter);
    } catch (err) {
      setFormError(err.message || 'Unable to save the promo code.');
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Row actions                                                            */
  /* ---------------------------------------------------------------------- */

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
      if (editing?._id === pendingDelete._id) resetForm();
      setPendingDelete(null);
      await load(search, statusFilter);
    } catch (e) {
      setPendingDelete(null);
      setError(e.message || 'Unable to delete the promo code.');
    } finally {
      setDeleting(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Derived data                                                           */
  /* ---------------------------------------------------------------------- */

  const venueName = (promo) => {
    if (promo.scope === 'global') return 'All venues';
    return (
      promo.turf?.name ||
      venues.find((v) => v.id === (promo.turf?._id || promo.turf))?.name ||
      '—'
    );
  };

  const filteredCodes = useMemo(
    () =>
      typeFilter === 'All'
        ? promoCodes
        : promoCodes.filter((promo) => promo.discountType === typeFilter),
    [promoCodes, typeFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filteredCodes.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedCodes = filteredCodes.slice(startIndex, startIndex + itemsPerPage);

  const hasActiveFilters =
    Boolean(search.trim()) || Boolean(statusFilter) || typeFilter !== 'All';

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('All');
    setCurrentPage(1);
  };

  const previewLabel =
    form.discountType === 'percentage'
      ? `${form.discountValue || 0}% OFF`
      : `${money(form.discountValue)} OFF`;

  const previewExpiry = toIso(form.expiresAt);

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      <div className="relative flex h-screen flex-col overflow-hidden bg-white font-sans text-slate-900 antialiased select-none">
        <TopBar />

        <div className="relative flex min-h-0 flex-1">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="scrollbar-thin flex-1 overflow-y-auto">
              <div className="mx-auto w-full space-y-6 px-5 py-6 md:px-6 md:py-7 xl:px-7">
                {/* Header */}
                <div className="min-w-0">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    Promotions
                  </h1>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Create and manage promo codes to attract more players and
                    boost your bookings.
                  </p>
                </div>

                <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1fr_380px]">
                  {/* Left: stats + table */}
                  <div className="min-w-0 space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                      <PromoStatCard
                        icon={Ticket}
                        iconWrapper="bg-lime-100"
                        iconColor="text-green-600"
                        title="Active Codes"
                        value={stats.active ?? 0}
                        subtext="Redeemable right now"
                        loading={loading && !promoCodes.length}
                      />
                      <PromoStatCard
                        icon={Tag}
                        iconWrapper="bg-blue-50"
                        iconColor="text-blue-600"
                        title="Total Redemptions"
                        value={stats.totalRedemptions ?? 0}
                        subtext="Bookings discounted"
                        loading={loading && !promoCodes.length}
                      />
                      <PromoStatCard
                        icon={Percent}
                        iconWrapper="bg-purple-50"
                        iconColor="text-purple-600"
                        title="Discount Given"
                        value={money(stats.totalDiscountGiven)}
                        subtext="Total player savings"
                        loading={loading && !promoCodes.length}
                      />
                      <PromoStatCard
                        icon={Ban}
                        iconWrapper="bg-amber-50"
                        iconColor="text-amber-500"
                        title="Expired"
                        value={stats.expired ?? 0}
                        subtext={`of ${stats.total ?? 0} venue codes`}
                        loading={loading && !promoCodes.length}
                      />
                    </div>

                    <div className="overflow-visible rounded-xl border border-slate-100 bg-white shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
                      {/* Filters */}
                      <div className="border-b border-slate-100 px-5 py-3">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div className="relative min-w-[220px] flex-1 lg:max-w-[340px]">
                            <Search
                              size={16}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                              type="text"
                              value={search}
                              onChange={(event) => {
                                setSearch(event.target.value);
                                setCurrentPage(1);
                              }}
                              placeholder="Search by code..."
                              className="h-[44px] w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-[12px] font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-lime-400"
                            />
                          </div>

                          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:justify-end">
                            <BookingFilterSelect
                              value={statusFilter}
                              onChange={(value) => {
                                setStatusFilter(value);
                                setCurrentPage(1);
                              }}
                              className="w-full sm:w-[150px]"
                              options={STATUS_OPTIONS}
                            />

                            <BookingFilterSelect
                              value={typeFilter}
                              onChange={(value) => {
                                setTypeFilter(value);
                                setCurrentPage(1);
                              }}
                              className="w-full sm:w-[150px]"
                              options={TYPE_OPTIONS}
                            />

                            {hasActiveFilters && (
                              <button
                                type="button"
                                onClick={clearFilters}
                                className="h-[44px] shrink-0 px-2 text-[12px] font-bold text-slate-500 hover:text-slate-900"
                              >
                                Clear filters
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div className="px-5 pt-4">
                          <ErrorNotice
                            message={error}
                            onRetry={retryLoad}
                            busy={isRetrying}
                          />
                        </div>
                      )}

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px] border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100">
                              <th className={HEADER_CLASS}>Promotion</th>
                              <th className={HEADER_CLASS}>Type</th>
                              <th className={HEADER_CLASS}>Discount</th>
                              <th className={HEADER_CLASS}>Validity</th>
                              <th className={HEADER_CLASS}>Usage</th>
                              <th className={HEADER_CLASS}>Status</th>
                              <th className={`${HEADER_CLASS} text-right`}>Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {loading ? (
                              Array.from({ length: 6 }, (_, index) => (
                                <tr key={index} className="border-b border-slate-100">
                                  <td colSpan={7} className="px-5 py-3">
                                    <div className="h-11 animate-pulse rounded-lg bg-slate-50" />
                                  </td>
                                </tr>
                              ))
                            ) : paginatedCodes.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="py-16 text-center">
                                  <p className="text-[14px] font-bold text-slate-800">
                                    {promoCodes.length === 0 && !hasActiveFilters
                                      ? 'No promo codes yet'
                                      : 'No promo codes match your filters'}
                                  </p>

                                  <p className="mx-auto mt-1 max-w-sm text-[12px] font-medium text-slate-400">
                                    {promoCodes.length === 0 && !hasActiveFilters
                                      ? 'Create a code with a discount and a validity window. Players apply it at checkout.'
                                      : 'Try changing or clearing your filters.'}
                                  </p>

                                  {hasActiveFilters && (
                                    <button
                                      type="button"
                                      onClick={clearFilters}
                                      className="mt-3 text-[12px] font-bold text-lime-600"
                                    >
                                      Clear filters
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ) : (
                              paginatedCodes.map((promo) => {
                                const type =
                                  TYPE_STYLES[promo.discountType] || TYPE_STYLES.fixed;
                                const limit = promo.usageLimit > 0 ? promo.usageLimit : 0;
                                const usedPercent = limit
                                  ? Math.min(100, Math.round((promo.usedCount / limit) * 100))
                                  : 0;
                                const readOnly = promo.scope === 'global';

                                return (
                                  <tr
                                    key={promo._id}
                                    className="h-[58px] border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/70"
                                  >
                                    {/* Promotion */}
                                    <td className="px-4 py-3">
                                      <div className="flex min-w-[220px] items-center gap-2.5">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lime-100 text-lime-700">
                                          <Ticket size={16} />
                                        </div>

                                        <div className="min-w-0">
                                          <p className="truncate text-[13px] font-bold tracking-wide text-slate-900">
                                            {promo.code}
                                          </p>

                                          <p className="mt-0.5 max-w-[200px] truncate text-[11px] font-medium text-slate-400">
                                            {promo.description || venueName(promo)}
                                          </p>
                                        </div>
                                      </div>
                                    </td>

                                    {/* Type */}
                                    <td className="px-4 py-3">
                                      {readOnly ? (
                                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-indigo-50 px-2.5 py-1.5 text-[11px] font-bold leading-none text-indigo-700">
                                          <Globe2 size={11} /> Platform-wide
                                        </span>
                                      ) : (
                                        <span
                                          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-bold leading-none ${type.className}`}
                                        >
                                          {type.label}
                                        </span>
                                      )}
                                    </td>

                                    {/* Discount */}
                                    <td className="px-4 py-3">
                                      <p className="whitespace-nowrap text-[13px] font-semibold text-slate-700">
                                        {promo.discountType === 'percentage'
                                          ? `${promo.discountValue}%`
                                          : money(promo.discountValue)}
                                      </p>

                                      <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                                        {promo.discountType === 'percentage' ? 'discount' : 'off'}
                                      </p>
                                    </td>

                                    {/* Validity */}
                                    <td className="px-4 py-3">
                                      <p className="whitespace-nowrap text-[13px] font-medium text-slate-600">
                                        {formatNepalDateTime(promo.startsAt)}
                                      </p>

                                      <p className="mt-0.5 whitespace-nowrap text-[11px] font-medium text-slate-400">
                                        to {formatNepalDateTime(promo.expiresAt)}
                                      </p>
                                    </td>

                                    {/* Usage */}
                                    <td className="px-4 py-3">
                                      <p className="whitespace-nowrap text-[13px] font-semibold text-slate-700">
                                        {promo.usedCount} / {limit || '∞'}
                                      </p>

                                      {limit > 0 && (
                                        <div className="mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                                          <div
                                            className={`h-full rounded-full ${usedPercent >= 100 ? 'bg-rose-500' : 'bg-lime-500'
                                              }`}
                                            style={{ width: `${usedPercent}%` }}
                                          />
                                        </div>
                                      )}
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3">
                                      <span
                                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-bold leading-none ${STATUS_STYLES[promo.status] || 'bg-slate-100 text-slate-600'
                                          }`}
                                      >
                                        {promo.status}
                                      </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                      {readOnly ? (
                                        <p
                                          className="text-right text-[11px] font-medium text-slate-400"
                                          title="Platform-wide codes are managed by the super admin"
                                        >
                                          Read only
                                        </p>
                                      ) : (
                                        <div className="flex items-center justify-end gap-1.5">
                                          <button
                                            type="button"
                                            onClick={() => openEdit(promo)}
                                            title="Edit"
                                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                                          >
                                            <Pencil size={14} />
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => toggleActive(promo)}
                                            title={promo.isActive ? 'Disable' : 'Enable'}
                                            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:text-white ${promo.isActive
                                              ? 'hover:border-amber-500 hover:bg-amber-500'
                                              : 'hover:border-lime-500 hover:bg-lime-500'
                                              }`}
                                          >
                                            <Power size={14} />
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => setPendingDelete(promo)}
                                            title={
                                              promo.usedCount > 0
                                                ? 'Disable (already redeemed)'
                                                : 'Delete'
                                            }
                                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-rose-600 hover:bg-rose-600 hover:text-white"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>

                      <BookingPagination
                        filteredBookingsCount={filteredCodes.length}
                        itemsPerPage={itemsPerPage}
                        label="promotions"
                        onItemsPerPageChange={(value) => {
                          setItemsPerPage(Number(value));
                          setCurrentPage(1);
                        }}
                        onPageChange={setCurrentPage}
                        page={page}
                        startIndex={startIndex}
                        totalPages={totalPages}
                      />
                    </div>
                  </div>

                  {/* Right: create / edit form + preview */}
                  <div className="min-w-0 space-y-5">
                    <form
                      onSubmit={submit}
                      className="rounded-xl border border-slate-100 bg-white p-5 shadow-[0_3px_18px_rgba(15,23,42,0.02)]"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-green-600">
                          <Megaphone size={19} />
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate text-[16px] font-bold text-slate-900">
                            {editing ? `Edit ${editing.code}` : 'Create New Promotion'}
                          </h2>

                          <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                            {editing
                              ? 'The code and venue cannot be changed.'
                              : 'Applies to every court at your venue.'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {formError && (
                          <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-[12px] font-bold text-rose-600">
                            {formError}
                          </p>
                        )}

                        <div>
                          <label className={LABEL_CLASS}>
                            Promotion Code <span className="text-rose-500">*</span>
                          </label>
                          <input
                            value={form.code}
                            onChange={(event) =>
                              setForm({ ...form, code: event.target.value.toUpperCase() })
                            }
                            disabled={Boolean(editing)}
                            required={!editing}
                            minLength={3}
                            maxLength={32}
                            pattern="[A-Za-z0-9_-]+"
                            placeholder="e.g. WKND20"
                            className={`${INPUT_CLASS} uppercase tracking-wider`}
                          />
                        </div>

                        <div>
                          <label className={LABEL_CLASS}>Description</label>
                          <textarea
                            value={form.description}
                            onChange={setField('description')}
                            maxLength={200}
                            rows={3}
                            placeholder="Brief description shown to players"
                            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13px] font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-lime-400"
                          />
                        </div>

                        {!editing && venues.length > 1 && (
                          <div>
                            <label className={LABEL_CLASS}>
                              Venue <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={effectiveTurf}
                              onChange={setField('turf')}
                              required
                              className={INPUT_CLASS}
                            >
                              <option value="">Select a venue</option>
                              {venues.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div>
                          <label className={LABEL_CLASS}>Discount Type</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'percentage', label: 'Percentage (%)' },
                              { value: 'fixed', label: 'Fixed (NRs.)' },
                            ].map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setForm({ ...form, discountType: option.value })}
                                className={`h-[44px] cursor-pointer rounded-lg border text-[12px] font-bold transition-colors ${form.discountType === option.value
                                  ? 'border-lime-400 bg-lime-50 text-slate-900'
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                  }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className={LABEL_CLASS}>
                            Discount Value <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={form.discountValue}
                              onChange={setField('discountValue')}
                              required
                              min={0.01}
                              max={form.discountType === 'percentage' ? 100 : undefined}
                              step="any"
                              placeholder={form.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 500'}
                              className={`${INPUT_CLASS} pr-14`}
                            />
                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-slate-400">
                              {form.discountType === 'percentage' ? '%' : 'NRs.'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className={LABEL_CLASS}>
                            Validity Period <span className="text-rose-500">*</span>
                          </label>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                            <input
                              type="datetime-local"
                              value={form.startsAt}
                              onChange={setField('startsAt')}
                              aria-label="Start date"
                              className={`${INPUT_CLASS} px-3`}
                            />
                            <input
                              type="datetime-local"
                              value={form.expiresAt}
                              onChange={setField('expiresAt')}
                              required
                              aria-label="End date"
                              className={`${INPUT_CLASS} px-3`}
                            />
                          </div>
                          <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                            Leave the start blank to begin immediately.
                          </p>
                        </div>

                        <div>
                          <label className={LABEL_CLASS}>
                            Usage Limit{' '}
                            <span className="font-medium text-slate-400">(Optional)</span>
                          </label>
                          <input
                            type="number"
                            value={form.usageLimit}
                            onChange={setField('usageLimit')}
                            min={0}
                            step={1}
                            placeholder="e.g. 100 (leave empty for unlimited)"
                            className={INPUT_CLASS}
                          />
                        </div>

                        <div className="flex gap-2 pt-1">
                          {editing && (
                            <button
                              type="button"
                              onClick={resetForm}
                              className="cursor-pointer rounded-full bg-slate-100 px-5 py-3 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-200"
                            >
                              Cancel
                            </button>
                          )}

                          <button
                            type="submit"
                            disabled={saving || (!editing && !venues.length)}
                            title={!editing && !venues.length ? 'Add a venue before creating promo codes' : ''}
                            className="flex-1 cursor-pointer rounded-full bg-lime-400 px-5 py-3 text-xs font-bold text-slate-900 transition-colors hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Promotion'}
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* Preview */}
                    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-[0_3px_18px_rgba(15,23,42,0.02)]">
                      <h3 className="mb-3 text-[14px] font-bold text-slate-900">Preview</h3>

                      <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white">
                        <span className="inline-flex rounded-full bg-lime-400 px-2.5 py-1.5 text-[11px] font-extrabold leading-none text-slate-900">
                          {previewLabel}
                        </span>

                        <p className="mt-4 text-[22px] font-extrabold leading-tight tracking-wide">
                          {form.code || 'YOURCODE'}
                        </p>

                        <p className="mt-1.5 text-[12px] font-medium text-slate-300">
                          {form.description || 'Your description appears here.'}
                        </p>

                        <p className="mt-4 text-[11px] font-medium text-slate-400">
                          {previewExpiry
                            ? `Valid until ${formatNepalDateTime(previewExpiry)}`
                            : 'Set an end date to finish the preview.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Delete / disable confirmation */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <h3 className="text-[16px] font-extrabold text-slate-900">
              {pendingDelete.usedCount > 0 ? 'Disable' : 'Delete'} {pendingDelete.code}?
            </h3>

            <p className="mt-2 text-[13px] font-medium leading-relaxed text-slate-500">
              {pendingDelete.usedCount > 0
                ? `This code has been redeemed ${pendingDelete.usedCount} time${pendingDelete.usedCount === 1 ? '' : 's'}, so it will be disabled instead of deleted to keep past bookings accurate.`
                : 'Players will no longer be able to redeem this code.'}
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="cursor-pointer rounded-full bg-slate-100 px-5 py-3 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="cursor-pointer rounded-full bg-rose-600 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? 'Working…'
                  : pendingDelete.usedCount > 0
                    ? 'Disable Code'
                    : 'Delete Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PromoCodesPage;