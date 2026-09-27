import { useCallback, useState } from 'react';
import { Search } from 'lucide-react';

import BookingFilterSelect from './BookingFilterSelect';
import BookingDateRangeCalendar from './BookingDateRangeCalendar';

const bookingTabs = ['All', 'Confirmed', 'Completed', 'Cancelled'];

function BookingFilters({
  courtFilter,
  customRange,
  dateFilter,
  hasActiveFilters,
  onClearFilters,
  onCourtFilterChange,
  onCustomRangeApply,
  onDateFilterChange,
  onPaymentFilterChange,
  onSearchChange,
  onStatusFilterChange,
  paymentFilter,
  paymentMethods,
  searchQuery,
  statusCounts,
  statusFilter,
  uniqueCourts,
}) {
  const [rangeOpen, setRangeOpen] = useState(false);
  const closeRange = useCallback(() => setRangeOpen(false), []);

  const changeDateFilter = (value) => {
    onDateFilterChange(value);
    setRangeOpen(value === 'custom');
  };

  return (
    <>
      <div className="border-b border-slate-100 px-5 pt-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {bookingTabs.map((tab) => {
            const active = statusFilter === tab;
            const label = tab === 'All' ? 'All Bookings' : tab;
            return (
              <button type="button" key={tab} onClick={() => onStatusFilterChange(tab)} className={`relative flex h-[48px] shrink-0 items-center gap-2 px-4 text-[12px] font-bold transition-colors ${active ? 'text-lime-700' : 'text-slate-500 hover:text-slate-800'}`}>
                {label}
                {tab !== 'All' && (
                  <span className={`flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${active ? 'bg-lime-100 text-lime-700' : 'bg-slate-100 text-slate-500'}`}>
                    {statusCounts[tab] || 0}
                  </span>
                )}
                {active && <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-lime-400" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-b border-slate-100 px-5 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative min-w-[260px] flex-1 xl:max-w-[420px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search by customer, phone, booking ID..." className="h-[44px] w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-[12px] font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-lime-400" />
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:justify-end">
            <div className="relative w-full sm:w-[190px]">
              <BookingFilterSelect value={dateFilter} onChange={changeDateFilter} options={[
                { value: 'all', label: 'All Dates' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'custom', label: 'Custom Range' },
              ]} />
              {rangeOpen && dateFilter === 'custom' && (
                <BookingDateRangeCalendar value={customRange} onApply={onCustomRangeApply} onClose={closeRange} />
              )}
            </div>

            <BookingFilterSelect value={courtFilter} onChange={onCourtFilterChange} className="w-full sm:w-[140px]" options={[
              { value: 'All', label: 'All Courts' },
              ...uniqueCourts.map((court) => ({ value: court, label: court })),
            ]} />

            <BookingFilterSelect value={paymentFilter} onChange={onPaymentFilterChange} className="w-full sm:w-[180px]" options={[
              { value: 'All', label: 'All Payment Methods' },
              ...paymentMethods.map((method) => ({ value: method, label: method })),
            ]} />

            {hasActiveFilters && (
              <button type="button" onClick={onClearFilters} className="h-[44px] shrink-0 px-2 text-[11px] font-bold text-slate-500 hover:text-slate-900">Clear filters</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingFilters;
