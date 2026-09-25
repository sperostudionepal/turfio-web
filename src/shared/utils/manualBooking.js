import { minutesToTime12 } from './dateTime';

/**
 * Helpers for the owner's "New Booking" form. Slots are hourly units:
 * { value: '02:00 PM', startMinutes: 840, endMinutes: 900, isAvailable: true }.
 */

export const MAX_DURATION_HOURS = 6;

const DEFAULT_TEAM_SIZE = { '5v5': 10, '7v7': 14, '11v11': 22 };

export const defaultTeamSize = (matchType) => DEFAULT_TEAM_SIZE[matchType] || 10;

/**
 * How many hours can be booked back-to-back starting at `startValue`:
 * the run of consecutive available hourly slots, capped. 0 when the start itself isn't available.
 */
export function getMaxDuration(slotOptions = [], startValue, cap = MAX_DURATION_HOURS) {
  const index = slotOptions.findIndex((slot) => slot.value === startValue);
  if (index < 0 || !slotOptions[index].isAvailable) return 0;

  let hours = 1;
  while (hours < cap) {
    const previous = slotOptions[index + hours - 1];
    const next = slotOptions[index + hours];
    if (!next || !next.isAvailable || next.startMinutes !== previous.endMinutes) break;
    hours += 1;
  }
  return hours;
}

/** "02:00 PM - 04:00 PM" plus exact minutes (exact minutes stay right even when the range ends at midnight). */
export function buildSlotRange(startMinutes, durationHours) {
  const endMinutes = startMinutes + Math.round(durationHours * 60);
  return {
    timeSlot: `${minutesToTime12(startMinutes)} - ${minutesToTime12(endMinutes)}`,
    startMinutes,
    endMinutes,
  };
}

/** Court hourly rate x hours, rounded to whole rupees. */
export const suggestedPrice = (hourlyRate, durationHours) => Math.round(Number(hourlyRate || 0) * durationHours);

/** Parses the price field; returns null unless it's a positive number within a sane ceiling. */
export function parsePrice(value) {
  const number = Number(String(value).replace(/,/g, '').trim());
  return Number.isFinite(number) && number > 0 && number <= 1000000 ? Math.round(number) : null;
}
