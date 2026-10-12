import { describe, expect, it } from 'vitest'

import { calendarDay } from './dates'
import type { DateRange } from './stops'
import {
  bucketGranularity,
  DAILY_BUCKET_MAX_DAYS,
  fillBucketGaps,
  isPartialMonthBucket,
  maxSeriesCount,
  type TimeSeriesPoint
} from './stopsOverRange'

describe('bucketGranularity', () => {
  it('buckets daily just under the threshold', () => {
    const range: DateRange = {
      start: calendarDay(2025, 1, 1),
      end: calendarDay(2025, 1, 1 + (DAILY_BUCKET_MAX_DAYS - 1) - 1)
    }
    expect(bucketGranularity(range)).toBe('day')
  })

  it('buckets monthly right at the threshold', () => {
    const range: DateRange = {
      start: calendarDay(2025, 1, 1),
      end: calendarDay(2025, 1, 1 + DAILY_BUCKET_MAX_DAYS - 1)
    }
    expect(bucketGranularity(range)).toBe('month')
  })

  it('matches the real default range (12 months)', () => {
    const range: DateRange = { start: calendarDay(2024, 11, 11), end: calendarDay(2025, 11, 10) }
    expect(bucketGranularity(range)).toBe('month')
  })

  it('buckets a single day as daily', () => {
    const day = calendarDay(2025, 11, 9)
    expect(bucketGranularity({ start: day, end: day })).toBe('day')
  })
})

describe('isPartialMonthBucket', () => {
  // Real default range confirmed live: starts the 11th, so November 2024's
  // bucket covers only 20 of that month's 30 days.
  const RANGE: DateRange = { start: calendarDay(2024, 11, 11), end: calendarDay(2025, 11, 10) }

  it('flags the first bucket when the range starts after the 1st', () => {
    expect(isPartialMonthBucket(calendarDay(2024, 11, 1), RANGE)).toBe(true)
  })

  it('flags the last bucket when the range ends before the month is over', () => {
    expect(isPartialMonthBucket(calendarDay(2025, 11, 1), RANGE)).toBe(true)
  })

  it('does not flag a full month strictly between the edges', () => {
    expect(isPartialMonthBucket(calendarDay(2025, 6, 1), RANGE)).toBe(false)
  })

  it('does not flag the first bucket when the range starts on the 1st', () => {
    const range: DateRange = { start: calendarDay(2025, 1, 1), end: calendarDay(2025, 3, 31) }
    expect(isPartialMonthBucket(calendarDay(2025, 1, 1), range)).toBe(false)
  })

  it('flags a bucket that is both the first and last when the whole range sits inside one cut-short month', () => {
    const range: DateRange = { start: calendarDay(2025, 6, 10), end: calendarDay(2025, 6, 20) }
    expect(isPartialMonthBucket(calendarDay(2025, 6, 1), range)).toBe(true)
  })
})

describe('fillBucketGaps', () => {
  it('passes through daily points already present, and leaves a real sparse tail alone', () => {
    // Real figures, Nov 1-10 2025: a sparse tail (5, 5, 3, 2, 1) is genuine
    // low volume, not a gap, and must survive unchanged.
    const points: TimeSeriesPoint[] = [
      { bucketStart: '2025-11-06', count: 5, partial: false },
      { bucketStart: '2025-11-07', count: 5, partial: false },
      { bucketStart: '2025-11-08', count: 3, partial: false },
      { bucketStart: '2025-11-09', count: 2, partial: false },
      { bucketStart: '2025-11-10', count: 1, partial: false }
    ]
    const range: DateRange = { start: calendarDay(2025, 11, 6), end: calendarDay(2025, 11, 10) }
    expect(fillBucketGaps(points, range, 'day')).toEqual(points)
  })

  it('synthesizes a zero for a day Socrata omitted entirely', () => {
    const points: TimeSeriesPoint[] = [
      { bucketStart: '2025-11-01', count: 10, partial: false },
      { bucketStart: '2025-11-03', count: 7, partial: false }
    ]
    const range: DateRange = { start: calendarDay(2025, 11, 1), end: calendarDay(2025, 11, 3) }
    expect(fillBucketGaps(points, range, 'day')).toEqual([
      { bucketStart: '2025-11-01', count: 10, partial: false },
      { bucketStart: '2025-11-02', count: 0, partial: false },
      { bucketStart: '2025-11-03', count: 7, partial: false }
    ])
  })

  it('synthesizes a missing month at monthly granularity, keeping real partial flags intact', () => {
    const points: TimeSeriesPoint[] = [
      { bucketStart: '2024-11-01', count: 1589, partial: true },
      { bucketStart: '2025-01-01', count: 1721, partial: false }
    ]
    const range: DateRange = { start: calendarDay(2024, 11, 11), end: calendarDay(2025, 1, 31) }
    expect(fillBucketGaps(points, range, 'month')).toEqual([
      { bucketStart: '2024-11-01', count: 1589, partial: true },
      { bucketStart: '2024-12-01', count: 0, partial: false },
      { bucketStart: '2025-01-01', count: 1721, partial: false }
    ])
  })

  it('returns a single bucket for a one-day range', () => {
    const range: DateRange = { start: calendarDay(2025, 11, 9), end: calendarDay(2025, 11, 9) }
    expect(fillBucketGaps([], range, 'day')).toEqual([
      { bucketStart: '2025-11-09', count: 0, partial: false }
    ])
  })
})

describe('maxSeriesCount', () => {
  it('finds the busiest bucket', () => {
    const points: TimeSeriesPoint[] = [
      { bucketStart: '2025-10-01', count: 2172, partial: false },
      { bucketStart: '2025-08-01', count: 4110, partial: false }
    ]
    expect(maxSeriesCount(points)).toBe(4110)
  })

  it('returns 0 for an empty series', () => {
    expect(maxSeriesCount([])).toBe(0)
  })
})
