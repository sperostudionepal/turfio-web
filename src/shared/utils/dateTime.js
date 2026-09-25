/**
 * Turfio Date & Time Utilities
 * Canonical timezone: Nepal Time (UTC+5:45, Asia/Kathmandu).
 */

export const NPT_OFFSET_MINUTES = 5 * 60 + 45; // 345 minutes (+05:45)

/**
 * Returns current date string in Nepal Time: 'YYYY-MM-DD'
 */
export function getTodayNepalString() {
  const now = new Date();
  const utcMillis = now.getTime() + now.getTimezoneOffset() * 60000;
  const nptDate = new Date(utcMillis + NPT_OFFSET_MINUTES * 60000);
  const year = nptDate.getFullYear();
  const month = String(nptDate.getMonth() + 1).padStart(2, '0');
  const day = String(nptDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns current Nepal date and minutes from midnight (0..1439).
 */
export function getNepalCurrentDateTime() {
  const now = new Date();
  const utcMillis = now.getTime() + now.getTimezoneOffset() * 60000;
  const npt = new Date(utcMillis + NPT_OFFSET_MINUTES * 60000);
  const minutes = npt.getHours() * 60 + npt.getMinutes();
  const year = npt.getFullYear();
  const month = String(npt.getMonth() + 1).padStart(2, '0');
  const day = String(npt.getDate()).padStart(2, '0');
  return {
    date: `${year}-${month}-${day}`,
    minutes,
    hours: npt.getHours(),
  };
}

/**
 * Parses time string like "07:00", "07:00 AM", "7:00 PM", "19:00" to minutes from midnight (0..1439).
 */
export function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const cleaned = timeStr.trim();

  // Match 12-hour format: "07:00 AM" or "7:30 PM"
  const match12 = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let hour = parseInt(match12[1], 10);
    const min = parseInt(match12[2], 10);
    const period = match12[3].toUpperCase();

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return hour * 60 + min;
  }

  // Match 24-hour format: "07:00" or "19:30"
  const match24 = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hour = parseInt(match24[1], 10);
    const min = parseInt(match24[2], 10);
    return hour * 60 + min;
  }

  return 0;
}

/**
 * Converts minutes from midnight (0..1439) to "07:00 AM" format.
 */
export function minutesToTime12(totalMinutes) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(normalized / 60);
  const min = normalized % 60;
  const period = hour24 >= 12 ? 'PM' : 'AM';
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return `${String(hour12).padStart(2, '0')}:${String(min).padStart(2, '0')} ${period}`;
}

/**
 * Checks whether a given slot is in the past for the specified date.
 * If dateStr is before today: true
 * If dateStr is after today: false
 * If dateStr is today: true if slot's start time <= current Nepal minutes
 */
export function isPastSlot(dateStr, slotStartMinutes, nowNpt = null) {
  const current = nowNpt || getNepalCurrentDateTime();
  if (dateStr < current.date) return true;
  if (dateStr > current.date) return false;
  return slotStartMinutes <= current.minutes;
}

/**
 * Formats a date string 'YYYY-MM-DD' into a user-friendly format: e.g. "Wed, Sep 9, 2026"
 */
export function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Parses timeSlot string like "08:00 AM - 09:00 AM" or "08:00 AM"
 * and returns { startTime, endTime, startMinutes, endMinutes }
 */
export function parseSlotInterval(timeSlot) {
  if (!timeSlot || typeof timeSlot !== 'string') {
    return { startTime: '06:00 AM', endTime: '07:00 AM', startMinutes: 360, endMinutes: 420 };
  }
  const parts = timeSlot.split(/\s*[-→]\s*/);
  const startStr = parts[0]?.trim() || '';
  const endStr = parts[1]?.trim() || '';
  const startMinutes = parseTimeToMinutes(startStr);
  let endMinutes = endStr ? parseTimeToMinutes(endStr) : startMinutes + 60;
  if (endMinutes <= startMinutes) {
    endMinutes = startMinutes + 60;
  }
  return {
    startTime: minutesToTime12(startMinutes),
    endTime: minutesToTime12(endMinutes),
    startMinutes,
    endMinutes,
  };
}

/**
 * Formats a timestamp as Nepal time, e.g. "19 Sep 2026, 02:30 PM". Returns '—' for missing/invalid values.
 */
export function formatNepalDateTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '—';
  // Assembled from parts so the month is always 3 letters ("Sep"); en-GB alone renders "Sept" in some engines.
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kathmandu',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value])
  );
  return `${parts.day} ${parts.month} ${parts.year}, ${parts.hour}:${parts.minute} ${parts.dayPeriod}`;
}

/**
 * Same as formatNepalDateTime but split into { date, time } so callers can stack
 * them on two lines instead of one wide "12 Jun 2026, 09:15 AM" string.
 */
export function formatNepalDateTimeParts(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return { date: '—', time: '' };
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kathmandu',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value])
  );
  return {
    date: `${parts.day} ${parts.month} ${parts.year}`,
    time: `${parts.hour}:${parts.minute} ${parts.dayPeriod}`,
  };
}

/**
 * Processes and filters slots for a given date:
 * 1. Skips / removes past slots completely when viewing today or past dates.
 * 2. For future slots, marks which are Available vs Booked / Held.
 */
export function processFutureSlots({ slots = [], openingHours = null, occupiedIntervals = [], dateStr = '' }) {
  const nowNpt = getNepalCurrentDateTime();
  const targetDate = dateStr || nowNpt.date;

  let rawList = [];

  if (Array.isArray(slots) && slots.length > 0) {
    rawList = slots.map((s) => {
      const startMin = s.startMinutes ?? parseTimeToMinutes(s.time);
      const isPast = isPastSlot(targetDate, startMin, nowNpt);
      const isBooked = !s.isAvailable || s.state === 'booked' || s.state === 'held';
      return {
        time: s.time,
        startMinutes: startMin,
        endMinutes: s.endMinutes ?? startMin + 60,
        isPast,
        isAvailable: !isPast && !isBooked,
        state: isPast ? 'past' : isBooked ? (s.state === 'held' ? 'held' : 'booked') : 'available',
      };
    });
  } else {
    // Fallback generation from opening hours
    const openMin = parseTimeToMinutes(openingHours?.start || '06:00');
    const closeMin = parseTimeToMinutes(openingHours?.end || '22:00');
    const occupied = occupiedIntervals || [];

    for (let m = openMin; m < closeMin; m += 60) {
      const slotStartMin = m;
      const slotEndMin = m + 60;
      const slotTime12 = minutesToTime12(slotStartMin);

      const overlapping = occupied.find((item) => item.startMinutes < slotEndMin && item.endMinutes > slotStartMin);
      const isPast = isPastSlot(targetDate, slotStartMin, nowNpt);
      const isBooked = Boolean(overlapping);

      rawList.push({
        time: slotTime12,
        startMinutes: slotStartMin,
        endMinutes: slotEndMin,
        isPast,
        isAvailable: !isPast && !isBooked,
        state: isPast ? 'past' : overlapping ? (overlapping.type === 'hold' ? 'held' : 'booked') : 'available',
      });
    }
  }

  // Filter: SKIP ALL PAST SLOTS completely!
  const futureSlots = rawList.filter((s) => !s.isPast);

  return futureSlots.map((s) => ({
    time: s.time,
    value: s.time,
    label: s.time,
    status: s.state, // 'available' | 'booked' | 'held'
    disabled: !s.isAvailable, // Booked/held slots cannot be clicked/selected
    isAvailable: s.isAvailable,
    startMinutes: s.startMinutes,
    endMinutes: s.endMinutes,
  }));
}
