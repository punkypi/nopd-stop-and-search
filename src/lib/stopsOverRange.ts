/**
 * The selected date range's own stops-over-time trend, daily or monthly
 * depending on how wide the range is.
 *
 * This is a different thing from the whole-record yearly sparkline in
 * `stopsOverTime.ts`: that one is baked once and never re-queried, exists
 * purely to make the record's uneven reporting history visible before
 * anyone picks a date, and never changes with the date picker. This one
 * *is* the date picker's own output — it moves every time the range does,
 * live-queried for a custom range and baked only for the default one. Don't
 * conflate the two.
 *
 * Bucket size is derived from the range's own length rather than fixed:
 * daily under `DAILY_BUCKET_MAX_DAYS`, monthly beyond it. A year-wide
 * default range drawn as 365 daily bars would be unreadable; a 2-week range
 * drawn as one monthly bar would be useless.
 */

import {
  compare,
  daysBetween,
  daysInMonth,
  nextMonth,
  startOfMonth,
  subtractDays,
  toISODate,
  type CalendarDay
} from './dates'
import type { DateRange } from './stops'

export type BucketGranularity = 'day' | 'month'

/**
 * Below this many days in the range, bucket daily; at or above it, monthly.
 * Matches CLAUDE.md's "daily under ~90 days, monthly beyond" roadmap note.
 */
export const DAILY_BUCKET_MAX_DAYS = 90

/** Which bucket size a range's own length calls for. */
export function bucketGranularity(range: DateRange): BucketGranularity {
  const spanDays = daysBetween(range.start, range.end) + 1
  return spanDays < DAILY_BUCKET_MAX_DAYS ? 'day' : 'month'
}

export interface TimeSeriesPoint {
  /** ISO date identifying the bucket, e.g. `2025-11-01`. */
  bucketStart: string
  count: number
  /**
   * True only for a monthly bucket whose natural calendar month isn't fully
   * covered by the selected range — the range starts after that month's 1st,
   * or ends before that month's last day. Only the first or last bucket can
   * ever be partial; every bucket between them is, by construction, a full
   * month the range entirely contains. A daily bucket is never partial: a
   * day has no smaller natural unit for the range to cut short.
   */
  partial: boolean
}

/**
 * Whether the monthly bucket starting on `bucketStart` is cut short by
 * `range`'s own edges, rather than a sign of anything about enforcement.
 * Confirmed against the live default range (2024-11-11 .. 2025-11-10): its
 * first bucket, November 2024, covers only 20 of that month's 30 days.
 */
export function isPartialMonthBucket(bucketStart: CalendarDay, range: DateRange): boolean {
  const isFirstBucket =
    bucketStart.year === range.start.year && bucketStart.month === range.start.month
  if (isFirstBucket && range.start.day > 1) return true

  const isLastBucket = bucketStart.year === range.end.year && bucketStart.month === range.end.month
  if (isLastBucket && range.end.day < daysInMonth(range.end)) return true

  return false
}

/**
 * Fills in every bucket `range` spans that `points` doesn't cover, as
 * `{ count: 0, partial: false }` — Socrata's `GROUP BY` omits an empty
 * bucket entirely rather than returning one with a zero, the same gap
 * `fillYearGaps` in `stopsOverTime.ts` fills for whole years. A real sparse
 * tail (a handful of stops a day near the end of the record) is not a gap
 * and must not be zeroed out here; only a bucket genuinely absent from
 * `points` is.
 */
export function fillBucketGaps(
  points: readonly TimeSeriesPoint[],
  range: DateRange,
  granularity: BucketGranularity
): TimeSeriesPoint[] {
  const byBucket = new Map(points.map((point) => [point.bucketStart, point]))
  const filled: TimeSeriesPoint[] = []

  if (granularity === 'day') {
    let cursor = range.start
    while (compare(cursor, range.end) <= 0) {
      const key = toISODate(cursor)
      filled.push(byBucket.get(key) ?? { bucketStart: key, count: 0, partial: false })
      cursor = subtractDays(cursor, -1)
    }
    return filled
  }

  let cursor = startOfMonth(range.start)
  while (compare(cursor, range.end) <= 0) {
    const key = toISODate(cursor)
    filled.push(byBucket.get(key) ?? { bucketStart: key, count: 0, partial: false })
    cursor = nextMonth(cursor)
  }
  return filled
}

/** The busiest bucket's count, or 0 when `points` is empty. */
export function maxSeriesCount(points: readonly TimeSeriesPoint[]): number {
  return points.reduce((highest, point) => Math.max(highest, point.count), 0)
}
