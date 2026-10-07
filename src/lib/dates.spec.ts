import { describe, expect, it } from 'vitest'

import {
  calendarDay,
  compare,
  daysInMonth,
  earlierOf,
  endOfMonth,
  fromSocrataTimestamp,
  fromTimestamp,
  isValid,
  laterOf,
  monthName,
  startOfMonth,
  startOfYear,
  subtractDays,
  toDisplayString,
  toISODate,
  toMonthYearString,
  toSoQLTimestamp,
  toTimestamp
} from './dates'

describe('isValid', () => {
  it('accepts a real day', () => {
    expect(isValid(calendarDay(2025, 11, 9))).toBe(true)
  })

  it('accepts February 29th in a leap year', () => {
    expect(isValid(calendarDay(2024, 2, 29))).toBe(true)
  })

  it('rejects February 29th in a non-leap year', () => {
    expect(isValid(calendarDay(2025, 2, 29))).toBe(false)
  })

  it('rejects an out-of-range month', () => {
    expect(isValid(calendarDay(2025, 13, 1))).toBe(false)
    expect(isValid(calendarDay(2025, 0, 1))).toBe(false)
  })

  it('rejects a day past the end of the month', () => {
    expect(isValid(calendarDay(2025, 4, 31))).toBe(false)
  })

  it('rejects non-integers and NaN', () => {
    expect(isValid(calendarDay(2025, 1, 1.5))).toBe(false)
    expect(isValid(calendarDay(Number.NaN, 1, 1))).toBe(false)
  })
})

describe('daysInMonth', () => {
  it('handles the 31-day, 30-day and February cases', () => {
    expect(daysInMonth(calendarDay(2025, 1, 1))).toBe(31)
    expect(daysInMonth(calendarDay(2025, 4, 1))).toBe(30)
    expect(daysInMonth(calendarDay(2025, 2, 1))).toBe(28)
    expect(daysInMonth(calendarDay(2024, 2, 1))).toBe(29)
  })
})

describe('month boundaries', () => {
  it('finds the first and last day', () => {
    const mid = calendarDay(2025, 11, 9)
    expect(startOfMonth(mid)).toEqual(calendarDay(2025, 11, 1))
    expect(endOfMonth(mid)).toEqual(calendarDay(2025, 11, 30))
  })

  it('ends February correctly in a leap year', () => {
    expect(endOfMonth(calendarDay(2024, 2, 10))).toEqual(calendarDay(2024, 2, 29))
  })
})

describe('startOfYear', () => {
  it('finds January 1st regardless of month or day', () => {
    expect(startOfYear(calendarDay(2025, 11, 9))).toEqual(calendarDay(2025, 1, 1))
    expect(startOfYear(calendarDay(2025, 1, 1))).toEqual(calendarDay(2025, 1, 1))
  })
})

describe('subtractDays', () => {
  it('steps back within a month', () => {
    expect(subtractDays(calendarDay(2025, 11, 9), 5)).toEqual(calendarDay(2025, 11, 4))
  })

  it('crosses a month boundary', () => {
    expect(subtractDays(calendarDay(2025, 11, 9), 10)).toEqual(calendarDay(2025, 10, 30))
  })

  it('crosses a year boundary', () => {
    expect(subtractDays(calendarDay(2025, 1, 5), 10)).toEqual(calendarDay(2024, 12, 26))
  })

  it('crosses a leap-year February correctly', () => {
    // 2024 is a leap year, so there are 366 days between these two dates.
    expect(subtractDays(calendarDay(2025, 1, 1), 366)).toEqual(calendarDay(2024, 1, 1))
  })

  it('treats a negative n as moving forward', () => {
    expect(subtractDays(calendarDay(2025, 11, 9), -1)).toEqual(calendarDay(2025, 11, 10))
  })
})

describe('laterOf', () => {
  it('picks whichever day comes later', () => {
    const early = calendarDay(2025, 1, 1)
    const late = calendarDay(2025, 11, 9)
    expect(laterOf(early, late)).toEqual(late)
    expect(laterOf(late, early)).toEqual(late)
  })

  it('returns the same day when both are equal', () => {
    const day = calendarDay(2025, 11, 9)
    expect(laterOf(day, { ...day })).toEqual(day)
  })
})

describe('earlierOf', () => {
  it('picks whichever day comes earlier', () => {
    const early = calendarDay(2025, 1, 1)
    const late = calendarDay(2025, 11, 9)
    expect(earlierOf(early, late)).toEqual(early)
    expect(earlierOf(late, early)).toEqual(early)
  })

  it('returns the same day when both are equal', () => {
    const day = calendarDay(2025, 11, 9)
    expect(earlierOf(day, { ...day })).toEqual(day)
  })
})

describe('formatting', () => {
  it('zero-pads the ISO form', () => {
    expect(toISODate(calendarDay(2025, 1, 5))).toBe('2025-01-05')
  })

  it('names the month', () => {
    expect(monthName(calendarDay(2025, 11, 9))).toBe('November')
  })

  it('renders a human-facing string', () => {
    expect(toDisplayString(calendarDay(2025, 11, 9))).toBe('November 9, 2025')
  })

  it('renders a compact month-and-year string', () => {
    expect(toMonthYearString(calendarDay(2025, 11, 9))).toBe('Nov 2025')
  })
})

describe('toSoQLTimestamp', () => {
  it('starts the day at midnight', () => {
    expect(toSoQLTimestamp(calendarDay(2025, 11, 9))).toBe('2025-11-09T00:00:00.000')
  })

  it('ends the day just before the next one, so an inclusive range covers it', () => {
    expect(toSoQLTimestamp(calendarDay(2025, 11, 9), true)).toBe('2025-11-09T23:59:59.999')
  })
})

describe('fromSocrataTimestamp', () => {
  it('keeps the calendar date of a floating timestamp', () => {
    expect(fromSocrataTimestamp('2025-11-09T20:10:00.000')).toEqual(calendarDay(2025, 11, 9))
  })

  it('does not shift a late-evening stop backwards a day', () => {
    // `new Date('2025-11-09')` would parse as UTC midnight and report Nov 8th
    // in US timezones. Parsing the fields directly avoids that.
    expect(fromSocrataTimestamp('2025-11-09')).toEqual(calendarDay(2025, 11, 9))
  })

  it('tolerates a trailing zone marker and surrounding whitespace', () => {
    expect(fromSocrataTimestamp('  2025-11-09T20:10:00.000Z ')).toEqual(calendarDay(2025, 11, 9))
  })

  it('returns null for unparseable or impossible input', () => {
    expect(fromSocrataTimestamp('')).toBeNull()
    expect(fromSocrataTimestamp('not a date')).toBeNull()
    expect(fromSocrataTimestamp('2025-02-30T00:00:00.000')).toBeNull()
  })
})

describe('timestamp round-trip', () => {
  it('survives a conversion to epoch millis and back', () => {
    const day = calendarDay(2025, 11, 9)
    expect(fromTimestamp(toTimestamp(day))).toEqual(day)
  })
})

describe('compare', () => {
  it('orders earlier days first and treats equal days as equal', () => {
    const early = calendarDay(2025, 11, 1)
    const late = calendarDay(2025, 11, 9)
    expect(compare(early, late)).toBeLessThan(0)
    expect(compare(late, early)).toBeGreaterThan(0)
    expect(compare(early, { ...early })).toBe(0)
  })
})
