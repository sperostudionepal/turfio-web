import { useCallback, useState } from 'react';
import { Search } from 'lucide-react';

import BookingFilterSelect from './BookingFilterSelect';
import BookingDateRangeCalendar from './BookingDateRangeCalendar';

function BookingFilters({
  courtFilter,
  customRange,
  dateFilter,
  onCourtFilterChange,
  onCustomRangeApply,
  onDateFilterChange,
  onPaymentFilterChange,
  onSearchChange,
  onStatusFilterChange,
  paymentFilter,
  paymentMethods,
  searchQuery,
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
      <div className="border-b border-slate-100 px-5 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative min-w-[260px] flex-1 xl:max-w-[420px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search by customer, phone, booking ID..." className="h-[44px] w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-[12px] font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-lime-400" />
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:justify-end">
            <BookingFilterSelect value={statusFilter} onChange={onStatusFilterChange} className="w-full sm:w-[155px]" options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Confirmed', label: 'Confirmed' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Cancelled', label: 'Cancelled' },
            ]} />
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
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingFilters;
