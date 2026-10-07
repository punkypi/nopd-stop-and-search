/**
 * The clickable date-range shortcuts shown next to the picker, and the math
 * behind them.
 *
 * Every preset resolves against the dataset's own `latestEventDate`, never
 * the wall clock. That matters here specifically: this environment's real
 * "today" is already about eleven months past the dataset's newest event, and
 * the gap only grows between re-bakes. A preset computed against `today()`
 * would be empty or nearly empty almost all the time.
 *
 * Labeled "Latest," not "Last," for the same reason. "Last 12 Months" reads as
 * a claim about right now; "Latest 12 Months" reads as a claim about what the
 * record has, which is the one that's actually true.
 */

import {
  endOfMonth,
  laterOf,
  startOfMonth,
  startOfYear,
  subtractDays,
  toMonthYearString,
  type CalendarDay
} from './dates'
import { isSameRange } from './snapshot'
import type { DateRange } from './stops'

export interface DateRangePreset {
  key: string
  label(latest: CalendarDay): string
  range(latest: CalendarDay, earliest: CalendarDay): DateRange
}

/** A day-count window ending at `latest`, with its start clamped to `earliest`. */
function trailingDays(days: number): DateRangePreset['range'] {
  return (latest, earliest) => ({
    start: laterOf(subtractDays(latest, days - 1), earliest),
    end: latest
  })
}

/**
 * Six presets, in the order they're shown. "Latest Month" uses full
 * calendar-month bounds — the same convention the old single default used —
 * so it reads the same way it always has; every other relative preset is a
 * plain day-count window ending at `latest`, which sidesteps month-length and
 * leap-year edge cases for no real loss of meaning.
 */
export const DATE_RANGE_PRESETS: readonly DateRangePreset[] = [
  {
    key: 'latest-month',
    label: () => 'Latest Month',
    range: (latest, earliest) => ({
      start: laterOf(startOfMonth(latest), earliest),
      end: endOfMonth(latest)
    })
  },
  {
    key: 'latest-30-days',
    label: () => 'Latest 30 Days',
    range: trailingDays(30)
  },
  {
    key: 'latest-90-days',
    label: () => 'Latest 90 Days',
    range: trailingDays(90)
  },
  {
    key: 'latest-12-months',
    label: () => 'Latest 12 Months',
    range: trailingDays(365)
  },
  {
    key: 'calendar-year',
    label: (latest) => `Calendar Year ${latest.year}`,
    range: (latest, earliest) => ({
      start: laterOf(startOfYear(latest), earliest),
      end: latest
    })
  },
  {
    key: 'all-time',
    label: () => 'All Time',
    range: (latest, earliest) => ({ start: earliest, end: latest })
  }
]

/** The preset that becomes the baked default — see `scripts/bake-data.mjs`. */
export const DEFAULT_PRESET_KEY = 'latest-12-months'

/**
 * Which preset, if any, matches the currently selected range exactly — so the
 * UI can highlight it. `null` when the viewer has picked a custom range that
 * doesn't line up with any shortcut.
 */
export function activePresetKey(
  current: DateRange,
  latest: CalendarDay,
  earliest: CalendarDay
): string | null {
  const match = DATE_RANGE_PRESETS.find((preset) =>
    isSameRange(preset.range(latest, earliest), current)
  )
  return match?.key ?? null
}

/** A preset's resolved span as a short string, e.g. `Dec 2024 – Nov 2025`. */
export function presetSubtitle(
  preset: DateRangePreset,
  latest: CalendarDay,
  earliest: CalendarDay
): string {
  const { start, end } = preset.range(latest, earliest)
  return `${toMonthYearString(start)} – ${toMonthYearString(end)}`
}
