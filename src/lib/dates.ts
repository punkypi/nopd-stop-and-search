/**
 * Calendar-day helpers, replacing the Moment-backed `Date` class from the
 * original app.
 *
 * Everything here works in **local time on whole days**. The Socrata dataset
 * stores `eventdate` as a floating timestamp with no zone, so treating a day as
 * a local calendar day is what matches the published data. Using UTC instants
 * instead would shift every event by the viewer's offset and silently move
 * late-evening stops into the next day.
 *
 * A `CalendarDay` is a plain object rather than a class so it can round-trip
 * through JSON (the baked data files) and through Vue's reactivity without
 * losing its prototype.
 */

export interface CalendarDay {
  /** Full year, e.g. 2025. */
  readonly year: number
  /** 1-12, unlike the 0-11 that native `Date` uses. */
  readonly month: number
  /** 1-31. */
  readonly day: number
}

/** Long month names, index 0 = January. Sourced from `Intl` so it stays i18n-ready. */
const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'long' })

export function calendarDay(year: number, month: number, day: number): CalendarDay {
  return { year, month, day }
}

/** Converts to a native `Date` at local midnight. */
export function toNativeDate(date: CalendarDay): Date {
  return new Date(date.year, date.month - 1, date.day)
}

export function fromNativeDate(date: Date): CalendarDay {
  return calendarDay(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

/** Milliseconds since the epoch at local midnight — the form naive-ui's date picker wants. */
export function toTimestamp(date: CalendarDay): number {
  return toNativeDate(date).getTime()
}

export function fromTimestamp(timestamp: number): CalendarDay {
  return fromNativeDate(new Date(timestamp))
}

export function today(): CalendarDay {
  return fromNativeDate(new Date())
}

/**
 * A `CalendarDay` is valid when the native `Date` it maps to reports the same
 * fields back. That rejects both nonsense numbers and overflow like month 13 or
 * February 30th, which native `Date` would otherwise roll forward silently.
 */
export function isValid(date: CalendarDay): boolean {
  if (
    !Number.isInteger(date.year) ||
    !Number.isInteger(date.month) ||
    !Number.isInteger(date.day)
  ) {
    return false
  }
  const native = toNativeDate(date)
  if (Number.isNaN(native.getTime())) return false
  return (
    native.getFullYear() === date.year &&
    native.getMonth() === date.month - 1 &&
    native.getDate() === date.day
  )
}

/** Day count in the given day's month, accounting for leap years. */
export function daysInMonth(date: CalendarDay): number {
  // Day 0 of the following month is the last day of this one.
  return new Date(date.year, date.month, 0).getDate()
}

export function startOfMonth(date: CalendarDay): CalendarDay {
  return calendarDay(date.year, date.month, 1)
}

export function endOfMonth(date: CalendarDay): CalendarDay {
  return calendarDay(date.year, date.month, daysInMonth(date))
}

export function startOfYear(date: CalendarDay): CalendarDay {
  return calendarDay(date.year, 1, 1)
}

export function monthName(date: CalendarDay): string {
  return MONTH_FORMATTER.format(toNativeDate(date))
}

/** `Nov 2025` — short month and year, for a date-range preset's subtitle. */
const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })
export function toMonthYearString(date: CalendarDay): string {
  return MONTH_YEAR_FORMATTER.format(toNativeDate(date))
}

/** Negative when `a` is earlier than `b`, positive when later, 0 when the same day. */
export function compare(a: CalendarDay, b: CalendarDay): number {
  return toTimestamp(a) - toTimestamp(b)
}

/** `n` days before `date`. Negative `n` moves forward instead. */
export function subtractDays(date: CalendarDay, n: number): CalendarDay {
  const native = toNativeDate(date)
  native.setDate(native.getDate() - n)
  return fromNativeDate(native)
}

/**
 * The later of two days. Used to clamp a date-range preset's computed start so
 * it never reaches earlier than the dataset actually goes — a preset like
 * "Latest 12 Months" would otherwise ask for a start before `earliestEventDate`
 * on a dataset that doesn't have a year of history yet.
 */
export function laterOf(a: CalendarDay, b: CalendarDay): CalendarDay {
  return compare(a, b) >= 0 ? a : b
}

/**
 * The earlier of two days. `laterOf`'s counterpart, for clamping the *end* of
 * a computed range — e.g. a sparkline year bar's December 31st needs clamping
 * to `latestEventDate` for the current year, which doesn't have a full year of
 * data yet.
 */
export function earlierOf(a: CalendarDay, b: CalendarDay): CalendarDay {
  return compare(a, b) <= 0 ? a : b
}

/** ISO-8601 calendar date, e.g. `2025-11-09`. Zero-padded. */
export function toISODate(date: CalendarDay): string {
  const month = String(date.month).padStart(2, '0')
  const day = String(date.day).padStart(2, '0')
  return `${date.year}-${month}-${day}`
}

/**
 * The floating-timestamp form Socrata expects in a SoQL `where` clause, e.g.
 * `2025-11-09T00:00:00.000`.
 *
 * `endOfDay` pushes the time to 23:59:59.999 so an inclusive date range
 * actually covers the final day. The original app compared against midnight and
 * so dropped every event after 00:00:00 on the range's last day.
 */
export function toSoQLTimestamp(date: CalendarDay, endOfDay = false): string {
  const time = endOfDay ? '23:59:59.999' : '00:00:00.000'
  return `${toISODate(date)}T${time}`
}

/**
 * Parses the timestamps Socrata returns (`2025-11-09T20:10:00.000`, sometimes
 * with a trailing `Z`). Only the calendar date is kept.
 *
 * Parsed by hand rather than via `new Date(string)` because that constructor
 * treats a bare `YYYY-MM-DD` as UTC midnight, which lands on the previous day
 * for anyone west of Greenwich — including New Orleans.
 */
export function fromSocrataTimestamp(value: string): CalendarDay | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim())
  if (!match) return null
  const [, year, month, day] = match
  const parsed = calendarDay(Number(year), Number(month), Number(day))
  return isValid(parsed) ? parsed : null
}

/** Human-facing form, e.g. `November 9, 2025`. */
export function toDisplayString(date: CalendarDay): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(toNativeDate(date))
}
