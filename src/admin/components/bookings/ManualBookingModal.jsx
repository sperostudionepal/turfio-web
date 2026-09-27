import { X } from 'lucide-react';

import CustomDatePicker from '../../../shared/components/common/CustomDatePicker';
import CustomDropdown from '../../../shared/components/common/CustomDropdown';

import {
  getTodayNepalString,
} from '../../../shared/utils/dateTime';

import {
  MAX_DURATION_HOURS,
} from '../../../shared/utils/manualBooking';

function ManualBookingModal({
  autoPrice,
  duration,
  formError,
  hourlyRate,
  isOpen,
  manualForm,
  matchType,
  matchTypes,
  maxDuration,
  onClose,
  onSubmit,
  ownerTurf,
  priceValue,
  saving,
  selectedSlot,
  setManualForm,
  slotOptions,
  slotRange,
  teamSizeValue,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-[16px] font-bold text-slate-900">
              Create New Booking
            </h3>

            <p className="mt-1 text-[11px] font-medium text-slate-400">
              Add a walk-in or phone reservation.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={17} />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 p-5"
        >
          <div>
            <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
              Customer Name
            </label>

            <input
              type="text"
              value={manualForm.name}
              onChange={(event) =>
                setManualForm({
                  ...manualForm,
                  name: event.target.value,
                })
              }
              placeholder="e.g. Rohan Shrestha"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-800 outline-none focus:border-lime-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                Phone
              </label>

              <input
                type="text"
                value={manualForm.phone}
                onChange={(event) =>
                  setManualForm({
                    ...manualForm,
                    phone: event.target.value,
                  })
                }
                placeholder="+977 98..."
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[12px] font-medium outline-none focus:border-lime-400"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                Payment Status
              </label>

              <select
                value={manualForm.paymentStatus}
                onChange={(event) =>
                  setManualForm({
                    ...manualForm,
                    paymentStatus: event.target.value,
                  })
                }
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[12px] font-semibold outline-none"
              >
                <option value="Pending">Pending / unpaid</option>
                <option value="Paid">Paid at venue</option>
              </select>
            </div>
          </div>

          {ownerTurf?.courts?.length > 1 && (
            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                Court
              </label>

              <CustomDropdown
                options={ownerTurf.courts.map((court) => ({
                  value: court._id || court.id,
                  label: court.name || 'Court',
                }))}
                value={manualForm.courtId}
                onChange={(courtId) =>
                  setManualForm({
                    ...manualForm,
                    courtId,
                  })
                }
                buttonClassName="h-10 text-xs bg-white border-slate-200"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
              Booking Date
            </label>

            <CustomDatePicker
              value={manualForm.date}
              onChange={(date) =>
                setManualForm({
                  ...manualForm,
                  date,
                })
              }
              minDate={getTodayNepalString()}
              buttonClassName="h-10 text-xs bg-white border-slate-200"
              label="Booking Date"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                Start Time
              </label>

              <CustomDropdown
                options={slotOptions}
                value={manualForm.timeSlot}
                onChange={(timeSlot) =>
                  setManualForm({
                    ...manualForm,
                    timeSlot,
                  })
                }
                placeholder={
                  slotOptions.length === 0
                    ? 'No slots available'
                    : 'Select time'
                }
                buttonClassName="h-10 text-xs bg-white border-slate-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                Duration
              </label>

              <select
                value={duration}
                disabled={!selectedSlot}
                onChange={(event) =>
                  setManualForm({
                    ...manualForm,
                    durationHours: Number(event.target.value),
                  })
                }
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[12px] font-semibold outline-none disabled:opacity-50"
              >
                {Array.from(
                  {
                    length: Math.max(1, maxDuration),
                  },
                  (_, index) => index + 1
                ).map((hours) => (
                  <option
                    key={hours}
                    value={hours}
                  >
                    {hours === 1 ? '1 hour' : `${hours} hours`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {slotRange && (
            <p className="text-[10px] font-medium text-slate-400">
              Booking {slotRange.timeSlot}
              {maxDuration > 0 && maxDuration < MAX_DURATION_HOURS
                ? ` · ${maxDuration} ${maxDuration === 1 ? 'hour' : 'hours'
                } available from this start`
                : ''}
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                Match Type
              </label>

              <select
                value={matchType}
                onChange={(event) =>
                  setManualForm({
                    ...manualForm,
                    matchType: event.target.value,
                    teamSize: '',
                  })
                }
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[12px] font-semibold outline-none"
              >
                {matchTypes.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                Players
              </label>

              <input
                type="number"
                min="1"
                max="60"
                value={teamSizeValue}
                onChange={(event) =>
                  setManualForm({
                    ...manualForm,
                    teamSize: event.target.value,
                  })
                }
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[12px] font-semibold outline-none focus:border-lime-400"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-600">
                Total Price (NRs.)
              </label>

              {manualForm.priceTouched && (
                <button
                  type="button"
                  onClick={() =>
                    setManualForm({
                      ...manualForm,
                      priceTouched: false,
                      price: '',
                    })
                  }
                  className="text-[10px] font-bold text-lime-600"
                >
                  Reset
                </button>
              )}
            </div>

            <input
              type="number"
              min="1"
              value={priceValue}
              onChange={(event) =>
                setManualForm({
                  ...manualForm,
                  price: event.target.value,
                  priceTouched: true,
                })
              }
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[12px] font-semibold outline-none focus:border-lime-400"
            />

            <p className="mt-1.5 text-[10px] font-medium text-slate-400">
              NRs. {hourlyRate.toLocaleString('en-NP')}/hr × {duration}{' '}
              {duration === 1 ? 'hour' : 'hours'} = NRs.{' '}
              {autoPrice.toLocaleString('en-NP')}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
              Customer Email
            </label>

            <input
              type="email"
              value={manualForm.email}
              onChange={(event) =>
                setManualForm({
                  ...manualForm,
                  email: event.target.value,
                })
              }
              placeholder="customer@example.com"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[12px] font-medium outline-none focus:border-lime-400"
            />
          </div>

          {formError && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-[11px] font-bold text-rose-600">
              {formError}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-slate-200 px-4 text-[12px] font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="h-10 rounded-lg bg-lime-400 px-4 text-[12px] font-bold text-white hover:bg-lime-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManualBookingModal;
