import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Copy,
  Download,
  FileText,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';

import PayoutSummaryCard from '../../components/payments/PayoutSummaryCard';
import PaymentRevenueOverview from '../../components/payments/PaymentRevenueOverview';
import StatCards from '../../components/dashboard/StatCards';
import SharedAvatar from '../../components/common/Avatar';
import PaymentsPageSkeleton from '../../components/payments/PaymentsPageSkeleton';

import turfService from '../../../shared/services/turfService';
import { formatNepalDateStr, getTodayNepalString } from '../../../shared/utils/dateTime';
import {
  getPeriodRange,
  inRange,
} from '../../../shared/utils/dashboardStats';
import { buildPaymentsCsv, downloadCsv } from '../../../shared/utils/reportExport';
import { formatNpr, isVenuePayment } from '../../components/payments/paymentUtils';
import StatusBadge from '../../components/common/StatusBadge';
import PaymentMethodBadge from '../../components/payments/PaymentMethodBadge';



const sumAmount = (list) => list.reduce((total, item) => total + Number(item.amount || 0), 0);

function Avatar({ name, src, size = 9 }) {
  return <SharedAvatar name={name} src={src} className="" style={{ height: size * 4, width: size * 4 }} />;
}

function CopyableText({ value }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {value}
      <Copy
        size={12}
        className="cursor-pointer text-slate-300 hover:text-slate-500"
        onClick={() => value && navigator.clipboard?.writeText(value)}
      />
    </span>
  );
}

const TABS = ['Transactions', 'Invoices', 'Receipts'];

function TabBar({ active, onChange }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1">
      {TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${isActive ? 'bg-lime-400 text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   HEADER — title/subtitle + date range, payment method filter,
   export button, exactly matching reference layout
============================================================ */
function PaymentsHeader({ currentTab, onTabChange, exportCount, onExport, dateLabel, methodFilter, onMethodFilterChange, methods }) {
  return (
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Payments</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Track revenue, transactions, invoices and receipts.
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3">
        <button type="button" className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600"><Calendar size={14} />{dateLabel}</button>
        <div className="flex items-center gap-1.5">
          {methodFilter !== 'All' && <PaymentMethodBadge method={methodFilter} compact />}
          <FilterSelect value={methodFilter} onChange={onMethodFilterChange}>
            <option value="All">All Payment Methods</option>
            {methods.map((method) => <option key={method} value={method}>{method}</option>)}
          </FilterSelect>
        </div>
        <TabBar active={currentTab} onChange={onTabChange} />

        <button
          type="button"
          onClick={onExport}
          disabled={exportCount === 0}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-xs font-bold text-slate-900 transition-colors hover:bg-lime-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={14} />
          <span>Export Report</span>
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   TABLE TOOLBAR
============================================================ */
function TableToolbar({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  methodFilter,
  onMethodFilterChange,
  methods,
  hasActiveFilters,
  onClearFilters,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by customer, phone, payment ID, booking ID..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-100"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect value={dateFilter} onChange={onDateFilterChange}>
          <option value="all">All Dates</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </FilterSelect>

        {statusOptions && (
          <FilterSelect value={statusFilter} onChange={onStatusFilterChange}>
            <option value="All">All Statuses</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </FilterSelect>
        )}

        {methods && (
          <div className="flex items-center gap-1.5">
            {methodFilter !== 'All' && <PaymentMethodBadge method={methodFilter} compact />}
            <FilterSelect value={methodFilter} onChange={onMethodFilterChange}>
              <option value="All">All Payment Methods</option>
              {methods.map((method) => <option key={method} value={method}>{method}</option>)}
            </FilterSelect>
          </div>
        )}

        <button
          type="button"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          title="Clear filters"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SlidersHorizontal size={14} />
        </button>
      </div>
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

function Pagination({ page, totalPages, onPageChange, startIndex, count, total, itemsPerPage, onItemsPerPageChange }) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 p-4 text-xs font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing {total === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + count, total)} of {total}{' '}
        {total === 1 ? 'transaction' : 'transactions'}
      </span>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
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
            disabled={page === totalPages}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ›
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <FilterSelect value={String(itemsPerPage)} onChange={(value) => onItemsPerPageChange(Number(value))}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </FilterSelect>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TRANSACTIONS TABLE
============================================================ */
function TransactionsTable({ rows, page, totalPages, startIndex, total, onPageChange, onSelect, toolbarProps, paginationProps }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <TableToolbar {...toolbarProps} />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300" />
              </th>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Booking ID</th>
              <th className="px-4 py-3">Invoice ID</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date &amp; Time</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.transactionId} className="border-b border-slate-50 hover:bg-slate-50/70">
                <td className="px-4 py-3.5">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300" />
                </td>
                <td className="px-4 py-3.5 font-bold text-slate-700">{row.transactionId}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={row.customer?.name} src={row.customer?.avatar} />
                    <div>
                      <div className="font-semibold text-slate-700">{row.customer?.name}</div>
                      <div className="text-[11px] text-slate-400">{row.customer?.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-500">{row.bookingId}</td>
                <td className="px-4 py-3.5 text-slate-500">{row.invoiceId}</td>
                <td className="px-4 py-3.5 font-bold text-slate-700">{formatNpr(row.amount)}</td>
                <td className="px-4 py-3.5"><PaymentMethodBadge method={row.method} /></td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3.5 text-slate-500">{row.dateLabel}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelect(row)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      View details
                    </button>
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                    >
                      <MoreHorizontal size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-slate-400">
                  No transactions match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} startIndex={startIndex} count={rows.length} total={total} {...paginationProps} />
    </div>
  );
}

/* ============================================================
   INVOICES TABLE
============================================================ */
function InvoicesTable({ rows, page, totalPages, startIndex, total, onPageChange, onSelect, toolbarProps, paginationProps }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <TableToolbar {...toolbarProps} />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300" />
              </th>
              <th className="px-4 py-3">Invoice ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Booking ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment Method</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.invoiceId} className="border-b border-slate-50 hover:bg-slate-50/70">
                <td className="px-4 py-3.5">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300" />
                </td>
                <td className="px-4 py-3.5 font-bold text-slate-700">{row.invoiceId}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={row.customer?.name} src={row.customer?.avatar} />
                    <div>
                      <div className="font-semibold text-slate-700">{row.customer?.name}</div>
                      <div className="text-[11px] text-slate-400">{row.customer?.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-500">{row.bookingId}</td>
                <td className="px-4 py-3.5 text-slate-500">{row.dateLabel}</td>
                <td className="px-4 py-3.5 font-bold text-slate-700">{formatNpr(row.total)}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3.5"><PaymentMethodBadge method={row.method} /></td>
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => onSelect(row)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    View details
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                  No invoices match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} startIndex={startIndex} count={rows.length} total={total} {...paginationProps} />
    </div>
  );
}

/* ============================================================
   RECEIPTS TABLE
============================================================ */
function ReceiptsTable({ rows, page, totalPages, startIndex, total, onPageChange, onSelect, toolbarProps, paginationProps }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <TableToolbar {...toolbarProps} />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300" />
              </th>
              <th className="px-4 py-3">Receipt ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Invoice ID</th>
              <th className="px-4 py-3">Booking ID</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date &amp; Time</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.receiptId} className="border-b border-slate-50 hover:bg-slate-50/70">
                <td className="px-4 py-3.5">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300" />
                </td>
                <td className="px-4 py-3.5 font-bold text-slate-700">{row.receiptId}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={row.customer?.name} src={row.customer?.avatar} />
                    <span className="font-semibold text-slate-700">{row.customer?.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-500">{row.transactionId}</td>
                <td className="px-4 py-3.5 text-slate-500">{row.invoiceId}</td>
                <td className="px-4 py-3.5 text-slate-500">{row.bookingId}</td>
                <td className="px-4 py-3.5 font-bold text-slate-700">{formatNpr(row.amount)}</td>
                <td className="px-4 py-3.5 text-slate-500">{row.dateLabel}</td>
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => onSelect(row)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    View details
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                  No receipts match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} startIndex={startIndex} count={rows.length} total={total} {...paginationProps} />
    </div>
  );
}

/* ============================================================
   RIGHT-SIDE DETAILS DRAWER — fixed-width slide-over panel,
   pixel-matched to the reference "Transaction Details" panel
============================================================ */
function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-1.5 text-xs">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-slate-700">{value}</span>
    </div>
  );
}

function RelatedRow({ label, value, actionLabel }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between border-b border-slate-50 py-2.5 last:border-none">
      <div>
        <div className="text-[11px] font-medium text-slate-400">{label}</div>
        <div className="mt-0.5 text-xs font-bold text-slate-700">
          <CopyableText value={value} />
        </div>
      </div>
      <button
        type="button"
        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function TimelineRow({ label, timestamp, isLast }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex flex-col items-center">
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
          ✓
        </div>
        {!isLast && <div className="h-6 w-px bg-slate-200" />}
      </div>
      <div className="flex flex-1 items-center justify-between pb-2 text-xs">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="text-[11px] text-slate-400">{timestamp}</span>
      </div>
    </div>
  );
}

function DetailsDrawer({ record, kind, onClose }) {
  const open = Boolean(record);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/20 transition-opacity duration-200 ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[340px] max-w-full transform overflow-y-auto border-l border-slate-100 bg-white shadow-2xl transition-transform duration-200 ${open ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {record && (
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                {kind === 'transaction' && 'Transaction Details'}
                {kind === 'invoice' && 'Invoice Details'}
                {kind === 'receipt' && 'Receipt Details'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <StatusBadge status={record.status} />
              <span className="text-[11px] text-slate-400">{record.dateLabel}</span>
            </div>

            <p className="mt-3 text-3xl font-extrabold text-slate-900">
              {formatNpr(record.amount ?? record.total)}
            </p>

            <div className="mt-1 text-xs font-semibold text-slate-400">
              <CopyableText value={record.transactionId || record.invoiceId || record.receiptId} />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => kind === 'invoice' ? window.print() : undefined} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-lime-400 py-2.5 text-xs font-bold text-slate-900 hover:bg-lime-500">
                <FileText size={13} />
                {kind === 'invoice' ? 'Print Invoice' : kind === 'receipt' ? 'View Receipt' : 'View Receipt'}
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                <Download size={13} />
                Download
              </button>
            </div>

            <section className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Payment Information
              </h3>
              <DetailRow label="Transaction ID" value={record.transactionId} />
              <DetailRow label="Status" value={<StatusBadge status={record.status} />} />
              <DetailRow label="Amount" value={formatNpr(record.amount ?? record.total)} />
              <DetailRow label="Payment Method" value={<PaymentMethodBadge method={record.method} />} />
              <DetailRow label="Transaction Reference" value={record.reference} />
              <DetailRow label="Paid At" value={record.dateLabel} />
            </section>

            <section className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Related Records
              </h3>
              <RelatedRow label="Booking ID" value={record.bookingId} actionLabel="View Booking" />
              <RelatedRow label="Invoice ID" value={record.invoiceId} actionLabel="View Invoice" />
              <RelatedRow label="Receipt ID" value={record.receiptId} actionLabel="View Receipt" />
            </section>

            <section className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Customer
              </h3>
              <div className="flex items-center gap-3">
                <Avatar name={record.customer?.name} src={record.customer?.avatar} size={10} />
                <div>
                  <div className="text-sm font-bold text-slate-700">{record.customer?.name}</div>
                  <div className="text-xs text-slate-400">{record.customer?.phone}</div>
                </div>
              </div>
            </section>

            <section className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Venue &amp; Booking
              </h3>
              <DetailRow label="Venue" value={record.venueName} />
              <DetailRow label="Court" value={record.court} />
              <DetailRow label="Date & Time" value={record.bookingDateTime} />
              <DetailRow label="Duration" value={record.duration} />
            </section>

            <section className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Timeline
              </h3>
              <TimelineRow label="Payment initiated" timestamp={record.dateLabel} />
              <TimelineRow label="Payment successful" timestamp={record.dateLabel} />
              <TimelineRow label="Receipt generated" timestamp={record.dateLabel} isLast />
            </section>
          </div>
        )}
      </aside>
    </>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */
function PaymentsPage({ activeTab, setActiveTab, initialSearch = '', initialTab = 'Transactions' }) {
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [financeSummary, setFinanceSummary] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  const [currentTab, setCurrentTab] = useState(initialTab);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [headerMethodFilter, setHeaderMethodFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedKind, setSelectedKind] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const loadAll = async () => {
      try {
        const [txRows, invoiceRows, receiptRows, , summary] = await Promise.all([
          turfService.getOwnerTransactions(),
          turfService.getOwnerInvoices(),
          turfService.getOwnerReceipts(),
          turfService.getOwnerFinancialPayments(),
          turfService.getOwnerFinanceSummary(),
        ]);
        if (cancelled) return;
        const txs = (txRows || []).map((tx) => ({
          ...tx, transactionId: tx.transactionId, bookingId: tx.booking?.bookingId, invoiceId: tx.invoice?.invoiceId,
          customer: { ...(tx.booking?.customerSnapshot || {}), name: tx.booking?.customerSnapshot?.name || [tx.booking?.user?.firstName, tx.booking?.user?.lastName].filter(Boolean).join(' ') || 'Customer', avatar: tx.booking?.user?.profilePicture || null }, amount: Number(tx.amount || 0),
          method: tx.method === 'CASH' ? 'Pay at Venue' : tx.method === 'ESEWA' ? 'eSewa' : tx.method,
          status: tx.status === 'SUCCESS' ? 'Completed' : tx.status === 'FAILED' ? 'Failed' : 'Pending', paidAt: tx.completedAt || tx.createdAt,
        }));
        setTransactions(txs);
        setInvoices((invoiceRows || []).map((inv) => ({ ...inv, invoiceId: inv.invoiceId, bookingId: inv.booking?.bookingId || inv.bookingId, customer: { ...(inv.billingSnapshot?.customer || inv.booking?.customerSnapshot || {}), name: inv.billingSnapshot?.customer?.name || inv.booking?.customerSnapshot?.name || [inv.booking?.user?.firstName, inv.booking?.user?.lastName].filter(Boolean).join(' ') || 'Customer', avatar: inv.booking?.user?.profilePicture || null }, total: Number(inv.totalAmount || 0), paid: Number(inv.amountPaid || 0), balance: Number(inv.amountDue || 0), status: inv.status === 'PAID' ? 'Paid' : Number(inv.amountPaid || 0) > 0 ? 'Partially Paid' : 'Unpaid', method: inv.booking?.paymentMethod || '—', paidAt: inv.issuedAt })));
        setReceipts((receiptRows || []).map((r) => ({ ...r, receiptId: r.receiptId, transactionId: r.transaction?.transactionId, invoiceId: r.invoice?.invoiceId, bookingId: r.booking?.bookingId, customer: { ...(r.payerSnapshot || r.booking?.customerSnapshot || {}), name: r.payerSnapshot?.name || r.booking?.customerSnapshot?.name || [r.booking?.user?.firstName, r.booking?.user?.lastName].filter(Boolean).join(' ') || 'Customer', avatar: r.booking?.user?.profilePicture || null }, amount: Number(r.amount || 0), method: r.method === 'CASH' ? 'Pay at Venue' : r.method === 'ESEWA' ? 'eSewa' : r.method, status: 'Completed', paidAt: r.paidAt })));
        setFinanceSummary(summary);
        setStatus('ready');
      } catch { if (!cancelled) setStatus('error'); }
    };
    loadAll();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
    setStatusFilter('All');
  }, [currentTab]);

  const transactionsWithDates = useMemo(
    () =>
      transactions.map((txn) => ({
        ...txn,
        nepalDate: formatNepalDateStr(txn.paidAt),
        dateLabel: txn.paidAt
          ? new Date(txn.paidAt).toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })
          : '—',
      })),
    [transactions]
  );

  const completedTransactions = useMemo(
    () => transactionsWithDates.filter((txn) => txn.status === 'Completed'),
    [transactionsWithDates]
  );

  const monthRange = useMemo(() => getPeriodRange('month'), []);

  const totalCollected = useMemo(() => sumAmount(completedTransactions), [completedTransactions]);
  const venueTotal = useMemo(
    () => sumAmount(completedTransactions.filter(isVenuePayment)),
    [completedTransactions]
  );
  const onlineTotal = totalCollected - venueTotal;

  const txSummary = financeSummary?.transactions;
  const invSummary = financeSummary?.invoices;
  const recSummary = financeSummary?.receipts;
  const transactionStats = [
    { title:'Total Revenue', value: txSummary ? formatNpr(txSummary.totalRevenue) : '—', change: txSummary?.revenueChange == null ? null : `${txSummary.revenueChange}%`, subtext: txSummary ? `vs. last month (${formatNpr(txSummary.previousMonthRevenue)})` : 'Loading' },
    { title:'Paid Online', value: txSummary ? formatNpr(txSummary.onlineTotal) : '—', change: txSummary ? `${txSummary.onlineShare}%` : null, subtext: txSummary ? `${txSummary.onlineShare}% of total revenue` : 'Loading', showTrendArrow:false },
    { title:'Pay at Venue', value: txSummary ? formatNpr(txSummary.venueTotal) : '—', change: txSummary ? `${100-txSummary.onlineShare}%` : null, subtext: txSummary ? `${100-txSummary.onlineShare}% of total revenue` : 'Loading', showTrendArrow:false },
    { title:'Pending Payments', value: txSummary ? formatNpr(txSummary.pendingAmount) : '—', change: txSummary?.pendingCount ? String(txSummary.pendingCount) : null, subtext: txSummary ? `${txSummary.pendingCount} bookings awaiting payment` : 'Loading', showTrendArrow:false },
  ];
  const invoiceStats = [
    { title:'Total Invoices', value: invSummary ? String(invSummary.total) : '—', change: invSummary?.countChange == null ? null : `${invSummary.countChange}%`, subtext: invSummary ? `vs. last month (${invSummary.lastMonth})` : 'Loading' },
    { title:'Total Amount', value: invSummary ? formatNpr(invSummary.totalAmount) : '—', subtext:'Across all invoices', showTrendArrow:false },
    { title:'Paid Invoices Total Amount', value: invSummary ? formatNpr(invSummary.paidAmount) : '—', subtext:'Paid invoices only', showTrendArrow:false },
    { title:'Pending Invoices', value: invSummary ? String(invSummary.pendingCount) : '—', subtext: invSummary ? `${formatNpr(invSummary.pendingAmount)} outstanding` : 'Loading', showTrendArrow:false },
  ];
  const receiptStats = [
    { title:'Total Receipts Issued', value: recSummary ? String(recSummary.total) : '—', subtext:'Successful payments receipted', showTrendArrow:false },
    { title:'Total Amount Receipted', value: recSummary ? formatNpr(recSummary.totalAmount) : '—', subtext:'Across all receipts', showTrendArrow:false },
    { title:'Receipts This Month', value: recSummary ? String(recSummary.thisMonth) : '—', subtext: recSummary ? formatNpr(recSummary.thisMonthAmount) : 'Loading', showTrendArrow:false },
    { title:'Average Receipt', value: recSummary ? formatNpr(recSummary.average) : '—', subtext:'Average successful payment', showTrendArrow:false },
  ];
  const stats = currentTab === 'Invoices' ? invoiceStats : currentTab === 'Receipts' ? receiptStats : transactionStats;

  const chartData = useMemo(() => {
    const days = monthRange.days;
    const bucketCount = Math.ceil(days / 2);
    const monthPrefix = monthRange.start.slice(0, 8);
    const monthShort = new Date(2000, Number(monthRange.start.slice(5, 7)) - 1, 1).toLocaleDateString('en-US', {
      month: 'short',
    });

    const buckets = Array.from({ length: bucketCount }, (_, index) => {
      const startDay = index * 2 + 1;
      const endDay = Math.min(startDay + 1, days);
      return {
        start: `${monthPrefix}${String(startDay).padStart(2, '0')}`,
        end: `${monthPrefix}${String(endDay).padStart(2, '0')}`,
        day: `${monthShort} ${startDay}`,
        online: 0,
        venue: 0,
      };
    });

    completedTransactions.forEach((txn) => {
      if (txn.nepalDate < monthRange.start || txn.nepalDate > monthRange.end) return;
      const bucket = buckets[Math.floor((Number(txn.nepalDate.slice(-2)) - 1) / 2)];
      if (!bucket) return;
      const amount = Number(txn.amount || 0);
      if (isVenuePayment(txn)) bucket.venue += amount;
      else bucket.online += amount;
    });

    const today = getTodayNepalString();
    return buckets.map((bucket) => ({
      day: bucket.day,
      date: '',
      online: Math.round(bucket.online),
      venue: Math.round(bucket.venue),
      pending: 0,
      isToday: today >= bucket.start && today <= bucket.end,
    }));
  }, [completedTransactions, monthRange]);

  const chartMax = useMemo(() => {
    const rawMax = Math.max(1000, ...chartData.map((item) => item.online + item.venue));
    const step = Math.max(500, Math.ceil(rawMax / 4 / 500) * 500);
    return step * 4;
  }, [chartData]);

  const uniqueMethods = useMemo(
    () => [...new Set(transactions.map((txn) => txn.method).filter(Boolean))],
    [transactions]
  );

  const invoiceRows = useMemo(() => invoices.map((invoice) => ({
    ...invoice,
    nepalDate: formatNepalDateStr(invoice.paidAt),
    dateLabel: invoice.paidAt ? new Date(invoice.paidAt).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
  })), [invoices]);

  const receiptRows = useMemo(() => receipts.map((receipt) => ({
    ...receipt,
    nepalDate: formatNepalDateStr(receipt.paidAt),
    dateLabel: receipt.paidAt ? new Date(receipt.paidAt).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—',
  })), [receipts]);

  /* -------- Filtering per active tab -------- */
  const filteredTransactions = useMemo(() => {
    const range = dateFilter === 'all' ? null : getPeriodRange(dateFilter);
    const query = searchQuery.trim().toLowerCase();
    const activeMethod = methodFilter !== 'All' ? methodFilter : headerMethodFilter;

    return transactionsWithDates.filter((txn) => {
      if (!inRange(txn.nepalDate, range)) return false;
      if (statusFilter !== 'All' && txn.status !== statusFilter) return false;
      if (activeMethod !== 'All' && txn.method !== activeMethod) return false;
      if (query) {
        const haystack = [
          txn.transactionId,
          txn.bookingId,
          txn.invoiceId,
          txn.customer?.name,
          txn.customer?.phone,
          txn.customer?.email,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [transactionsWithDates, dateFilter, statusFilter, methodFilter, headerMethodFilter, searchQuery]);

  const filteredInvoices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return invoiceRows.filter((invoice) => {
      if (statusFilter !== 'All' && invoice.status !== statusFilter) return false;
      if (query) {
        const haystack = [invoice.invoiceId, invoice.bookingId, invoice.customer?.name]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [invoiceRows, statusFilter, searchQuery]);

  const filteredReceipts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return receiptRows.filter((receipt) => {
      if (query) {
        const haystack = [receipt.receiptId, receipt.transactionId, receipt.invoiceId, receipt.bookingId, receipt.customer?.name]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [receiptRows, searchQuery]);

  const activeRows =
    currentTab === 'Transactions' ? filteredTransactions : currentTab === 'Invoices' ? filteredInvoices : filteredReceipts;

  const totalPages = Math.max(1, Math.ceil(activeRows.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedRows = activeRows.slice(startIndex, startIndex + itemsPerPage);

  const hasActiveFilters = searchQuery !== '' || dateFilter !== 'all' || statusFilter !== 'All' || methodFilter !== 'All';

  const resetFilters = () => {
    setSearchInput('');
    setDateFilter('all');
    setStatusFilter('All');
    setMethodFilter('All');
    setPage(1);
  };

  const handleExport = () => {
    if (filteredTransactions.length === 0) return;
    downloadCsv(`turfio-transactions-${getTodayNepalString()}.csv`, buildPaymentsCsv(filteredTransactions));
  };

  const monthChipLabel = useMemo(() => {
    const format = (dateStr) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };
    return `${format(monthRange.start)} – ${format(monthRange.end)}`;
  }, [monthRange]);

  const openDetails = (record) => {
    setSelectedRecord(record);
    setSelectedKind(currentTab === 'Transactions' ? 'transaction' : currentTab === 'Invoices' ? 'invoice' : 'receipt');
  };

  const closeDetails = () => {
    setSelectedRecord(null);
    setSelectedKind(null);
  };

  const toolbarProps = {
    searchQuery: searchInput,
    onSearchChange: setSearchInput,
    dateFilter,
    onDateFilterChange: (value) => {
      setDateFilter(value);
      setPage(1);
    },
    statusFilter,
    onStatusFilterChange: (value) => {
      setStatusFilter(value);
      setPage(1);
    },
    statusOptions:
      currentTab === 'Transactions' ? ['Completed', 'Pending', 'Failed'] : currentTab === 'Invoices' ? ['Paid', 'Partially Paid', 'Unpaid'] : null,
    methodFilter,
    onMethodFilterChange: (value) => {
      setMethodFilter(value);
      setPage(1);
    },
    methods: currentTab === 'Transactions' ? uniqueMethods : null,
    hasActiveFilters,
    onClearFilters: resetFilters,
  };

  const paginationProps = {
    itemsPerPage,
    onItemsPerPageChange: (value) => {
      setItemsPerPage(value);
      setPage(1);
    },
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#fdfefe] font-sans text-slate-900 antialiased select-none">
      <TopBar />

      <div className="relative flex min-h-0 flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="scrollbar-thin flex-1 overflow-y-auto">
            <div className="mx-auto w-full space-y-6 px-5 py-6 md:px-6 md:py-7 xl:px-7">
              <PaymentsHeader
                currentTab={currentTab}
                onTabChange={setCurrentTab}
                exportCount={filteredTransactions.length}
                onExport={handleExport}
                dateLabel={monthChipLabel}
                methodFilter={headerMethodFilter}
                onMethodFilterChange={setHeaderMethodFilter}
                methods={uniqueMethods}
              />

              {status === 'error' && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                  Couldn&apos;t load payments right now. Try refreshing the page.
                </div>
              )}

              {status === 'loading' ? (
                <PaymentsPageSkeleton tab={currentTab} />
              ) : (
                <>
                  <StatCards stats={stats} />
                  <section className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <div className="min-w-0"><PaymentRevenueOverview data={chartData} maxValue={chartMax} /></div>
                    <div className="min-w-0"><PayoutSummaryCard availableBalance={onlineTotal} /></div>
                  </section>

              {currentTab === 'Transactions' && (
                <TransactionsTable
                  rows={paginatedRows}
                  page={page}
                  totalPages={totalPages}
                  startIndex={startIndex}
                  total={activeRows.length}
                  onPageChange={setPage}
                  onSelect={openDetails}
                  toolbarProps={toolbarProps}
                  paginationProps={paginationProps}
                />
              )}

              {currentTab === 'Invoices' && (
                <InvoicesTable
                  rows={paginatedRows}
                  page={page}
                  totalPages={totalPages}
                  startIndex={startIndex}
                  total={activeRows.length}
                  onPageChange={setPage}
                  onSelect={openDetails}
                  toolbarProps={toolbarProps}
                  paginationProps={paginationProps}
                />
              )}

              {currentTab === 'Receipts' && (
                <ReceiptsTable
                  rows={paginatedRows}
                  page={page}
                  totalPages={totalPages}
                  startIndex={startIndex}
                  total={activeRows.length}
                  onPageChange={setPage}
                  onSelect={openDetails}
                  toolbarProps={toolbarProps}
                  paginationProps={paginationProps}
                />
              )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      <DetailsDrawer record={selectedRecord} kind={selectedKind} onClose={closeDetails} />
    </div>
  );
}

export default PaymentsPage;