import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { getPageItems } from '../../../shared/utils/pagination';

import BookingFilterSelect from './BookingFilterSelect';

function BookingPagination({
  filteredBookingsCount,
  itemsPerPage,
  label = 'bookings',
  onItemsPerPageChange,
  onPageChange,
  page,
  startIndex,
  totalPages,
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[11px] font-medium text-slate-500">
        Showing {filteredBookingsCount === 0 ? 0 : startIndex + 1}{' '}–{' '}
        {Math.min(startIndex + itemsPerPage, filteredBookingsCount)} of{' '}
        {filteredBookingsCount} {label}
      </p>

      <div className="flex items-center gap-3">
        <BookingFilterSelect
          value={String(itemsPerPage)}
          onChange={onItemsPerPageChange}
          className="w-[125px]"
          options={[
            {
              value: '5',
              label: '5 per page',
            },
            {
              value: '10',
              label: '10 per page',
            },
            {
              value: '20',
              label: '20 per page',
            },
          ]}
        />

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={15} />
          </button>

          {getPageItems(page, totalPages).map((item) =>
            typeof item === 'number' ? (
              <button
                type="button"
                key={item}
                onClick={() => onPageChange(item)}
                className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-[11px] font-bold transition-colors ${page === item
                  ? 'border-lime-400 bg-lime-400 text-slate-950'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {item}
              </button>
            ) : (
              <span
                key={item.key}
                className="px-1 text-[11px] font-bold text-slate-400"
              >
                ...
              </span>
            )
          )}

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingPagination;
