import { describe, expect, it } from 'vitest'

import {
  barHeight,
  fillYearGaps,
  locatedSegmentHeight,
  maxYearlyCount,
  MIN_BAR_HEIGHT,
  type YearlyStopCount
} from './stopsOverTime'

describe('fillYearGaps', () => {
  it('passes through years that are already present', () => {
    const rows: YearlyStopCount[] = [
      { year: 2024, count: 27168, locatedCount: 26229 },
      { year: 2025, count: 26629, locatedCount: 25288 }
    ]
    expect(fillYearGaps(rows, 2024, 2025)).toEqual(rows)
  })

  it('synthesizes a zero count and a zero located count for every year missing from the real data', () => {
    // Measured live: 1992-1998 and 2006 have zero rows — Socrata's GROUP BY
    // omits them entirely rather than returning a zero.
    const sparse: YearlyStopCount[] = [
      { year: 1991, count: 2, locatedCount: 0 },
      { year: 1999, count: 4, locatedCount: 0 },
      { year: 2000, count: 2, locatedCount: 0 },
      { year: 2005, count: 1, locatedCount: 0 },
      { year: 2007, count: 51, locatedCount: 0 }
    ]
    const filled = fillYearGaps(sparse, 1991, 2007)
    const missingYears = filled.filter((row) => row.count === 0).map((row) => row.year)
    expect(missingYears).toEqual([
      1992, 1993, 1994, 1995, 1996, 1997, 1998, 2001, 2002, 2003, 2004, 2006
    ])
    expect(filled.find((row) => row.year === 1994)).toEqual({
      year: 1994,
      count: 0,
      locatedCount: 0
    })
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
        { year: 2022, count: 14659, locatedCount: 11075 },
        { year: 2011, count: 86630, locatedCount: 2 },
        { year: 2023, count: 14340, locatedCount: 10827 }
      ])
    ).toBe(86630)
  })

  it('returns 0 for an empty set', () => {
    expect(maxYearlyCount([])).toBe(0)
  })
})

describe('locatedSegmentHeight', () => {
  it('is nearly the whole bar once coordinates became reliable', () => {
    // Measured live: 2018 had 60,957 stops, 60,181 located — 98.7%.
    const barPx = 56
    const segment = locatedSegmentHeight(barPx, 60957, 60181)
    expect(segment / barPx).toBeCloseTo(0.987, 2)
  })

  it('is a sliver next to nothing for a year before coordinates were reliable', () => {
    // Measured live: 2010 had 62,006 stops, exactly 1 located.
    const barPx = 56
    const segment = locatedSegmentHeight(barPx, 62006, 1)
    expect(segment).toBeGreaterThan(0)
    expect(segment).toBeLessThan(0.01)
  })

  it('is zero when nothing in that year is located, even if the year has stops', () => {
    expect(locatedSegmentHeight(56, 252, 0)).toBe(0)
  })

  it('is zero for a year with no stops at all', () => {
    expect(locatedSegmentHeight(56, 0, 0)).toBe(0)
  })

  it('never exceeds the bar it is drawn inside, even if locatedCount were somehow miscounted above count', () => {
    expect(locatedSegmentHeight(56, 10, 15)).toBe(56)
  })
})
