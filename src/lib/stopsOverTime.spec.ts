import { describe, expect, it } from 'vitest'

import {
  barHeight,
  fillYearGaps,
  maxYearlyCount,
  MIN_BAR_HEIGHT,
  type YearlyStopCount
} from './stopsOverTime'

describe('fillYearGaps', () => {
  it('passes through years that are already present', () => {
    const rows: YearlyStopCount[] = [
      { year: 2024, count: 27168 },
      { year: 2025, count: 26629 }
    ]
    expect(fillYearGaps(rows, 2024, 2025)).toEqual(rows)
  })

  it('synthesizes a zero count for every year missing from the real data', () => {
    // Measured live: 1992-1998 and 2006 have zero rows — Socrata's GROUP BY
    // omits them entirely rather than returning a zero.
    const sparse: YearlyStopCount[] = [
      { year: 1991, count: 2 },
      { year: 1999, count: 4 },
      { year: 2000, count: 2 },
      { year: 2005, count: 1 },
      { year: 2007, count: 51 }
    ]
    const filled = fillYearGaps(sparse, 1991, 2007)
    const missingYears = filled.filter((row) => row.count === 0).map((row) => row.year)
    expect(missingYears).toEqual([
      1992, 1993, 1994, 1995, 1996, 1997, 1998, 2001, 2002, 2003, 2004, 2006
    ])
    // A continuous run, not a compressed timeline: every year in range appears exactly once.
    expect(filled.map((row) => row.year)).toEqual([
      1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005,
      2006, 2007
    ])
  })

  it('returns an empty array when the range is inverted', () => {
    expect(fillYearGaps([], 2025, 1991)).toEqual([])
  })
})

describe('barHeight', () => {
  it('draws a true zero-stop year with no bar at all', () => {
    expect(barHeight(0, 87630)).toBe(0)
  })

  it('floors any nonzero count at the minimum, even a handful of stops against tens of thousands', () => {
    // 2008 (252 stops) against 2011 (86,630) is close to the real spread.
    expect(barHeight(252, 86630)).toBeGreaterThanOrEqual(MIN_BAR_HEIGHT)
  })

  it('draws the busiest year at the maximum', () => {
    expect(barHeight(86630, 86630)).toBe(100)
  })

  it('scales on the square root, so a quarter of the busiest year is about half its height', () => {
    const max = 10000
    const quarter = barHeight(2500, max)
    const full = barHeight(max, max)
    expect(quarter / full).toBeCloseTo(0.5, 5)
  })

  it('treats a non-finite or non-positive maxCount as nothing to scale against', () => {
    expect(barHeight(5, 0)).toBe(0)
    expect(barHeight(5, Number.NaN)).toBe(0)
  })
})

describe('maxYearlyCount', () => {
  it('finds the busiest year', () => {
    expect(
      maxYearlyCount([
        { year: 2022, count: 14659 },
        { year: 2011, count: 86630 },
        { year: 2023, count: 14340 }
      ])
    ).toBe(86630)
  })

  it('returns 0 for an empty set', () => {
    expect(maxYearlyCount([])).toBe(0)
  })
})
