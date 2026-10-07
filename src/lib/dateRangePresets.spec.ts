import { describe, expect, it } from 'vitest'

import { calendarDay } from './dates'
import {
  activePresetKey,
  DATE_RANGE_PRESETS,
  DEFAULT_PRESET_KEY,
  presetSubtitle
} from './dateRangePresets'

// The dataset's real measured bounds as of this writing (CLAUDE.md). Pinned
// here rather than fetched live: these functions are pure and the fixture
// only needs to be realistic, not current.
const LATEST = calendarDay(2025, 11, 10)
const EARLIEST = calendarDay(1991, 7, 24)

function preset(key: string) {
  const found = DATE_RANGE_PRESETS.find((candidate) => candidate.key === key)
  if (!found) throw new Error(`No preset named ${key}`)
  return found
}

describe('DATE_RANGE_PRESETS', () => {
  it('has six presets, each with a unique key', () => {
    expect(DATE_RANGE_PRESETS).toHaveLength(6)
    const keys = new Set(DATE_RANGE_PRESETS.map((p) => p.key))
    expect(keys.size).toBe(6)
  })

  it('resolves "Latest Month" to the full calendar month, same as the old single default', () => {
    expect(preset('latest-month').range(LATEST, EARLIEST)).toEqual({
      start: calendarDay(2025, 11, 1),
      end: calendarDay(2025, 11, 30)
    })
  })

  it('resolves "Latest 30 Days" to a 30-day window ending at latest', () => {
    expect(preset('latest-30-days').range(LATEST, EARLIEST)).toEqual({
      start: calendarDay(2025, 10, 12),
      end: calendarDay(2025, 11, 10)
    })
  })

  it('resolves "Latest 90 Days" to a 90-day window ending at latest', () => {
    expect(preset('latest-90-days').range(LATEST, EARLIEST)).toEqual({
      start: calendarDay(2025, 8, 13),
      end: calendarDay(2025, 11, 10)
    })
  })

  it('resolves "Latest 12 Months" to a 365-day window ending at latest — this is the default', () => {
    expect(preset('latest-12-months').range(LATEST, EARLIEST)).toEqual({
      start: calendarDay(2024, 11, 11),
      end: calendarDay(2025, 11, 10)
    })
    expect(DEFAULT_PRESET_KEY).toBe('latest-12-months')
  })

  it('resolves "Calendar Year" to January 1st of latest\'s year through latest, and names that year', () => {
    const calendarYear = preset('calendar-year')
    expect(calendarYear.label(LATEST)).toBe('Calendar Year 2025')
    expect(calendarYear.range(LATEST, EARLIEST)).toEqual({
      start: calendarDay(2025, 1, 1),
      end: calendarDay(2025, 11, 10)
    })
  })

  it('resolves "All Time" to the dataset\'s full span', () => {
    expect(preset('all-time').range(LATEST, EARLIEST)).toEqual({ start: EARLIEST, end: LATEST })
  })

  it("clamps every preset's start so it never reaches earlier than the dataset actually goes", () => {
    // A dataset with only two months of history: every trailing-window preset
    // would otherwise ask for a start before the data begins.
    const youngEarliest = calendarDay(2025, 9, 1)
    for (const candidate of DATE_RANGE_PRESETS) {
      const { start } = candidate.range(LATEST, youngEarliest)
      expect(start.year * 10000 + start.month * 100 + start.day).toBeGreaterThanOrEqual(20250901)
    }
  })
})

describe('activePresetKey', () => {
  it('matches the preset whose resolved range equals the current selection', () => {
    const current = preset('latest-30-days').range(LATEST, EARLIEST)
    expect(activePresetKey(current, LATEST, EARLIEST)).toBe('latest-30-days')
  })

  it('returns null for a custom range matching no preset', () => {
    const custom = { start: calendarDay(2015, 3, 1), end: calendarDay(2015, 3, 15) }
    expect(activePresetKey(custom, LATEST, EARLIEST)).toBeNull()
  })
})

describe('presetSubtitle', () => {
  it('renders the resolved span as a short month-year range', () => {
    expect(presetSubtitle(preset('latest-30-days'), LATEST, EARLIEST)).toBe('Oct 2025 – Nov 2025')
    expect(presetSubtitle(preset('all-time'), LATEST, EARLIEST)).toBe('Jul 1991 – Nov 2025')
  })
})
