import {
  Download,
  Plus,
  QrCode,
} from 'lucide-react';

function BookingPageHeader({
  filteredBookingsCount,
  onExport,
  onOpenBookingModal,
  onShowQRScanner,
}) {
  return (
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Bookings
        </h1>

        <p className="mt-1 text-sm font-medium text-slate-500">
          Manage court reservations, customers and booking statuses.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onExport}
          disabled={filteredBookingsCount === 0}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={15} />
          Export
        </button>

        <button
          type="button"
          onClick={onShowQRScanner}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-colors hover:bg-slate-100"
        >
          <QrCode size={15} />
          Scan QR
        </button>

        <button
          type="button"
          onClick={onOpenBookingModal}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-xs font-semibold text-slate-900 transition-colors hover:bg-lime-500"
        >
          <Plus size={16} />
          New Booking
        </button>
      </div>
    </div>
  );
}

export default BookingPageHeader;
