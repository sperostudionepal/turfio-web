import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Loader2,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';

import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import StatCards from '../../components/dashboard/StatCards';

import turfService from '../../../shared/services/turfService';

const money = (n) => `NRs. ${Math.round(Number(n || 0)).toLocaleString('en-IN')}`;
const csvCell = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;

const AVATAR_COLORS = [
  { bg: 'bg-violet-100', text: 'text-violet-600' },
  { bg: 'bg-teal-100', text: 'text-teal-600' },
  { bg: 'bg-amber-100', text: 'text-amber-600' },
  { bg: 'bg-pink-100', text: 'text-pink-600' },
  { bg: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'bg-emerald-100', text: 'text-emerald-600' },
];

const avatarColorFor = (name = '') => {
  const code = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
};

const STATUS_STYLES = {
  Active: 'bg-lime-50 text-lime-700',
  Inactive: 'bg-slate-100 text-slate-500',
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] || STATUS_STYLES.Active
        }`}
    >
      {status}
    </span>
  );
}

// TODO(BACKEND): swap for a real `status` field once the API tracks active/inactive.
const deriveStatus = (customer) =>
  customer?.status || (Number(customer?.totalBookings || 0) > 0 ? 'Active' : 'Inactive');

function Avatar({ name, src, size = 10 }) {
  const initials = (name || '?')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const color = avatarColorFor(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Customer'}
        className="shrink-0 rounded-full object-cover"
        style={{ height: size * 4, width: size * 4 }}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full text-xs font-bold ${color.bg} ${color.text}`}
      style={{ height: size * 4, width: size * 4 }}
    >
      {initials}
    </div>
  );
}

function FilterSelect({ value, onChange, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-xs font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none"
      >
        {children}
      </select>
      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

/* ============================================================
   HEADER — title/subtitle + Export & Add Customer actions
============================================================ */
function CustomersHeader({ exportCount, onExport, onAddCustomer }) {
  return (
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Customers</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">
          View and manage your venue customers. Track booking history, contact details, and activity.
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={onExport}
          disabled={exportCount === 0}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={14} />
          Export
        </button>

        <button
          type="button"
          onClick={onAddCustomer}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-xs font-bold text-slate-900 transition-colors hover:bg-lime-500"
        >
          <Plus size={14} />
          Add Customer
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   TOOLBAR — search, filters
============================================================ */
function CustomersToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search customers by name, phone, email or customer ID..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-100"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect value={statusFilter} onChange={onStatusFilterChange}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </FilterSelect>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <span>Sort by</span>
          <FilterSelect value={sortBy} onChange={onSortByChange}>
            <option value="recent">Recent</option>
            <option value="spend">Total Spent</option>
            <option value="bookings">Total Bookings</option>
          </FilterSelect>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAGINATION
============================================================ */
function Pagination({ page, totalPages, total, count, itemsPerPage, onPageChange, onItemsPerPageChange }) {
  const startIndex = total === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + count - 1, total);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 p-4 text-xs font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing {startIndex}–{endIndex} of {total} {total === 1 ? 'customer' : 'customers'}
      </span>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .slice(0, 5)
            .map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`rounded-lg px-3 py-1.5 font-bold ${pageNumber === page
                  ? 'bg-lime-400 text-slate-900'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {pageNumber}
              </button>
            ))}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ›
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <FilterSelect value={String(itemsPerPage)} onChange={(value) => onItemsPerPageChange(Number(value))}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </FilterSelect>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CUSTOMERS TABLE
============================================================ */
function CustomersTable({
  rows,
  selectedIds,
  onToggleRow,
  onToggleAll,
  onSelectCustomer,
}) {
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.has(row.key));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wide text-slate-400">
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onToggleAll(rows)}
                className="h-3.5 w-3.5 rounded border-slate-300"
              />
            </th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Total Bookings</th>
            <th className="px-4 py-3">Total Spent</th>
            <th className="px-4 py-3">Last Booking</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((customer) => {
            const status = deriveStatus(customer);
            return (
              <tr
                key={customer.key}
                onClick={() => onSelectCustomer(customer)}
                className="cursor-pointer border-b border-slate-50 hover:bg-slate-50/70"
              >
                <td className="px-4 py-3.5" onClick={(event) => event.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(customer.key)}
                    onChange={() => onToggleRow(customer.key)}
                    className="h-3.5 w-3.5 rounded border-slate-300"
                  />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={customer.name} src={customer.avatar} size={9} />
                    <div>
                      <div className="font-bold text-slate-900">{customer.name}</div>
                      <div className="text-[11px] text-slate-400">
                        #{customer.customerId || customer.key}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="text-slate-600">{customer.phone || '—'}</div>
                  <div className="text-[11px] text-slate-400">{customer.email || '—'}</div>
                </td>
                <td className="px-4 py-3.5 font-semibold text-slate-700">
                  {customer.totalBookings ?? 0} bookings
                </td>
                <td className="px-4 py-3.5 font-bold text-slate-900">{money(customer.totalSpend)}</td>
                <td className="px-4 py-3.5 text-slate-500">{customer.lastBookedAt || '—'}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={status} />
                </td>
                <td className="px-4 py-3.5" onClick={(event) => event.stopPropagation()}>
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                </td>
              </tr>
            );
          })}

          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   DETAIL MODAL — customer profile, opens on row click
============================================================ */
const DETAIL_TABS = ['Overview', 'Booking History', 'Invoices', 'Notes'];

function DetailStat({ icon: Icon, iconBg, iconColor, value, label }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-extrabold text-slate-900">{value}</p>
        <p className="text-[11px] font-medium text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function DetailField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
        <Icon size={13} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-400">{label}</p>
        <p className="truncate text-sm font-bold text-slate-700">{value || '—'}</p>
      </div>
    </div>
  );
}

function CustomerDetailModal({ customer, onClose }) {
  const [tab, setTab] = useState('Overview');

  if (!customer) return null;

  const status = deriveStatus(customer);
  const recentBookings = customer.recentBookings || [];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar name={customer.name} src={customer.avatar} size={12} />
            <div className="min-w-0">
              <h3 className="truncate text-base font-extrabold text-slate-900">{customer.name}</h3>
              <p className="text-[11px] font-semibold text-slate-400">
                #{customer.customerId || customer.key}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <StatusBadge status={status} />
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex items-center gap-1 border-b border-slate-100">
          {DETAIL_TABS.map((tabName) => (
            <button
              key={tabName}
              type="button"
              onClick={() => setTab(tabName)}
              className={`-mb-px border-b-2 px-2.5 py-2 text-xs font-bold transition-colors ${tab === tabName
                ? 'border-lime-400 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
            >
              {tabName}
            </button>
          ))}
        </div>

        {tab === 'Overview' && (
          <>
            {/* Contact Information */}
            <section className="mt-5">
              <div className="mb-1.5 flex items-center justify-between">
                <h4 className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Contact Information
                </h4>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                >
                  <Pencil size={11} />
                  Edit
                </button>
              </div>
              <DetailField icon={Users} label="Full Name" value={customer.name} />
              <DetailField icon={Phone} label="Phone Number" value={customer.phone} />
              <DetailField icon={Mail} label="Email Address" value={customer.email} />
              <DetailField
                icon={Calendar}
                label="Member Since"
                value={customer.memberSince || customer.createdAt || '—'}
              />
            </section>

            {/* Booking Statistics */}
            <section className="mt-5 border-t border-slate-100 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Booking Statistics
                </h4>
                <button type="button" className="text-[11px] font-bold text-lime-600 hover:text-lime-700">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <DetailStat
                  icon={Calendar}
                  iconBg="bg-blue-50"
                  iconColor="text-blue-500"
                  value={customer.totalBookings ?? 0}
                  label="Total Bookings"
                />
                <DetailStat
                  icon={TrendingUp}
                  iconBg="bg-lime-50"
                  iconColor="text-lime-600"
                  value={money(customer.totalSpend)}
                  label="Total Spent"
                />
                <DetailStat
                  icon={RefreshCw}
                  iconBg="bg-amber-50"
                  iconColor="text-amber-500"
                  value={customer.repeatBookings ?? customer.completedBookings ?? 0}
                  label="Repeat Bookings"
                />
                <DetailStat
                  icon={Clock}
                  iconBg="bg-violet-50"
                  iconColor="text-violet-500"
                  value={customer.lastBookedAt || '—'}
                  label="Last Booking"
                />
              </div>
            </section>

            {/* Recent Bookings */}
            <section className="mt-5 border-t border-slate-100 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Recent Bookings
                </h4>
                <button type="button" className="text-[11px] font-bold text-lime-600 hover:text-lime-700">
                  View All
                </button>
              </div>

              {recentBookings.length > 0 ? (
                <div className="space-y-2.5">
                  {recentBookings.slice(0, 3).map((booking, index) => (
                    <div key={booking.id || index} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                        <Calendar size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-700">
                          {booking.courtName || 'Court'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {booking.dateLabel || '—'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">{money(booking.amount)}</p>
                        <p className="text-[10px] font-semibold text-lime-600">
                          {booking.status || 'Confirmed'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg bg-slate-50 px-3 py-6 text-center text-[11px] text-slate-400">
                  No detailed booking records available yet.
                </p>
              )}
            </section>
          </>
        )}

        {tab === 'Booking History' && (
          <p className="mt-6 rounded-lg bg-slate-50 px-3 py-8 text-center text-xs text-slate-400">
            Full booking history isn&apos;t available yet.
          </p>
        )}

        {tab === 'Invoices' && (
          <p className="mt-6 rounded-lg bg-slate-50 px-3 py-8 text-center text-xs text-slate-400">
            No invoices linked to this customer yet.
          </p>
        )}

        {tab === 'Notes' && (
          <p className="mt-6 rounded-lg bg-slate-50 px-3 py-8 text-center text-xs text-slate-400">
            {customer.notes || 'No notes added for this customer yet.'}
          </p>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ADD CUSTOMER MODAL
============================================================ */
function AddCustomerModal({ form, setForm, formError, saving, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h3 className="text-base font-extrabold text-slate-900">Add Customer</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 p-5">
          {formError && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">{formError}</div>
          )}
          {[
            ['name', 'Full name *'],
            ['phone', 'Phone'],
            ['email', 'Email'],
          ].map(([key, label]) => (
            <label key={key} className="block text-xs font-bold text-slate-700">
              {label}
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required={key === 'name'}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-lime-400"
              />
            </label>
          ))}
          <label className="block text-xs font-bold text-slate-700">
            Notes
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows="3"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-lime-400"
            />
          </label>
          <p className="text-[11px] text-slate-500">
            Provide at least an email or phone number. Adding a customer does not create a player login.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              disabled={saving || (!form.phone.trim() && !form.email.trim())}
              className="rounded-xl bg-lime-400 px-4 py-2 text-xs font-bold text-slate-900 hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */
function CustomersPage({ activeTab, setActiveTab, initialSearch = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [data, setData] = useState({ customers: [], stats: {}, pagination: { page: 1, pages: 1, total: 0, limit: 10 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeCustomerKey, setActiveCustomerKey] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });

  const load = useCallback(
    async (page = 1, search = searchQuery, limit = itemsPerPage) => {
      setLoading(true);
      setError('');
      try {
        const result = await turfService.getOwnerCustomers({ page, limit, search: search.trim() || undefined });
        setData(result || { customers: [], stats: {}, pagination: { page: 1, pages: 1, total: 0, limit } });
      } catch (e) {
        setError(e.message || 'Unable to load customers.');
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, itemsPerPage]
  );

  useEffect(() => {
    const t = setTimeout(() => load(1, searchQuery), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    load(1, searchQuery, itemsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage]);

  const visibleCustomers = useMemo(() => {
    let rows = data.customers;
    if (statusFilter !== 'All') {
      rows = rows.filter((c) => deriveStatus(c) === statusFilter);
    }
    if (sortBy === 'spend') {
      rows = [...rows].sort((a, b) => Number(b.totalSpend || 0) - Number(a.totalSpend || 0));
    } else if (sortBy === 'bookings') {
      rows = [...rows].sort((a, b) => Number(b.totalBookings || 0) - Number(a.totalBookings || 0));
    }
    return rows;
  }, [data.customers, statusFilter, sortBy]);

  const activeCustomer = useMemo(
    () => data.customers.find((c) => c.key === activeCustomerKey) || null,
    [data.customers, activeCustomerKey]
  );

  // TODO(BACKEND): repeatCustomers%, average rating and month-over-month deltas
  // aren't returned by the API yet — shown as best-effort derived values / dashes.
  const totalCustomers = data.stats?.totalCustomers || 0;
  const returningCustomers = data.stats?.returningCustomers || 0;
  const repeatPct = totalCustomers > 0 ? Math.round((returningCustomers / totalCustomers) * 100) : 0;

  const stats = [
    {
      title: 'Total Customers',
      value: String(totalCustomers),
      subtext: 'All booking contacts',
      showTrendArrow: false,
    },
    {
      title: 'New This Month',
      value: String(data.stats?.bookedThisMonth || 0),
      subtext: 'Latest booking this month',
      showTrendArrow: false,
    },
    {
      title: 'Average Rating',
      value: data.stats?.averageRating != null ? String(data.stats.averageRating) : '—',
      subtext: 'Out of 5',
      showTrendArrow: false,
    },
    {
      title: 'Repeat Customers',
      value: `${repeatPct}%`,
      subtext: 'Book more than once',
      showTrendArrow: false,
    },
  ];

  const toggleRow = (key) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAll = (rows) => {
    setSelectedIds((prev) => {
      const allSelected = rows.length > 0 && rows.every((row) => prev.has(row.key));
      if (allSelected) return new Set();
      return new Set(rows.map((row) => row.key));
    });
  };

  const selectCustomer = (customer) => {
    setActiveCustomerKey(customer.key);
  };

  const exportCsv = () => {
    const rows = [
      ['Customer', 'Phone', 'Email', 'Bookings', 'Completed', 'Cancelled', 'Collected', 'Last booked'],
      ...visibleCustomers.map((c) => [
        c.name,
        c.phone,
        c.email,
        c.totalBookings,
        c.completedBookings,
        c.cancelledBookings,
        c.totalSpend,
        c.lastBookedAt || '',
      ]),
    ];
    const blob = new Blob([rows.map((r) => r.map(csvCell).join(',')).join('\n')], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'turfio-customers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const submitCustomer = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      await turfService.createOwnerCustomer(form);
      setIsAddModalOpen(false);
      setForm({ name: '', phone: '', email: '', notes: '' });
      await load(1, searchQuery, itemsPerPage);
    } catch (e2) {
      setFormError(e2.message || 'Unable to create customer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#fdfefe] font-sans text-slate-900 antialiased select-none">
      <TopBar />

      <div className="relative flex min-h-0 flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="scrollbar-thin flex-1 overflow-y-auto">
            <div className="mx-auto w-full space-y-6 px-5 py-6 md:px-6 md:py-7 xl:px-7">
              <CustomersHeader
                exportCount={visibleCustomers.length}
                onExport={exportCsv}
                onAddCustomer={() => setIsAddModalOpen(true)}
              />

              {/* Stat Cards */}
              {loading && !data.customers.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="h-[86px] animate-pulse rounded-xl border border-slate-100 bg-white" />
                  ))}
                </div>
              ) : (
                <StatCards stats={stats} />
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                  <button type="button" onClick={() => load()} className="ml-auto font-bold underline">
                    Retry
                  </button>
                </div>
              )}

              {/* Table */}
              <div className="min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                <CustomersToolbar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  sortBy={sortBy}
                  onSortByChange={setSortBy}
                />

                {loading ? (
                  <div className="flex items-center justify-center py-20 text-sm text-slate-500">
                    <Loader2 className="mr-2 animate-spin" size={18} />
                    Loading customers…
                  </div>
                ) : !visibleCustomers.length ? (
                  <div className="py-20 text-center">
                    <Users size={30} className="mx-auto text-slate-300" />
                    <h3 className="mt-3 text-sm font-bold text-slate-700">No customers found</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Customers appear from bookings, or you can add a contact manually.
                    </p>
                  </div>
                ) : (
                  <CustomersTable
                    rows={visibleCustomers}
                    selectedIds={selectedIds}
                    onToggleRow={toggleRow}
                    onToggleAll={toggleAll}
                    onSelectCustomer={selectCustomer}
                  />
                )}

                <Pagination
                  page={data.pagination?.page || 1}
                  totalPages={data.pagination?.pages || 1}
                  total={data.pagination?.total || 0}
                  count={visibleCustomers.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(p) => load(p, searchQuery, itemsPerPage)}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {activeCustomer && (
        <CustomerDetailModal
          customer={activeCustomer}
          onClose={() => setActiveCustomerKey(null)}
        />
      )}

      {isAddModalOpen && (
        <AddCustomerModal
          form={form}
          setForm={setForm}
          formError={formError}
          saving={saving}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={submitCustomer}
        />
      )}
    </div>
  );
}

export default CustomersPage;