import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { calendarDay, type CalendarDay } from '@/lib/dates'
import type { DateRange } from '@/lib/stops'
import type { YearlyStopCount } from '@/lib/stopsOverTime'

import StopsOverTimeSparkline from './StopsOverTimeSparkline.vue'

// The dataset's real measured bounds and a realistic sparse yearly spread,
// including the real located-count pattern: 2010 has 62,006 stops but just 1
// located, since coordinates don't become reliable until 2018.
const LATEST = calendarDay(2025, 11, 10)
const EARLIEST = calendarDay(1991, 7, 24)
const YEARLY_COUNTS: YearlyStopCount[] = [
  { year: 1991, count: 2, locatedCount: 0 },
  { year: 1999, count: 4, locatedCount: 0 },
  { year: 2010, count: 62006, locatedCount: 1 },
  { year: 2018, count: 60957, locatedCount: 60181 },
  { year: 2024, count: 27168, locatedCount: 26229 },
  { year: 2025, count: 26629, locatedCount: 25288 }
]

function normalisedText(wrapper: ReturnType<typeof mount>): string {
  return wrapper.text().replace(/\s+/g, ' ')
}

function mountSparkline(
  range: DateRange,
  overrides: Partial<{ earliest: CalendarDay | null; latest: CalendarDay | null }> = {}
) {
  return mount(StopsOverTimeSparkline, {
    props: { yearlyCounts: YEARLY_COUNTS, range, earliest: EARLIEST, latest: LATEST, ...overrides }
  })
}

describe('StopsOverTimeSparkline', () => {
  it('states the pre-2010 digitization gap plainly, with real numbers', () => {
    const wrapper = mountSparkline({ start: calendarDay(2025, 1, 1), end: LATEST })
    expect(normalisedText(wrapper)).toContain('Fewer than 700 stops')
    expect(normalisedText(wrapper)).toContain('2010')
    wrapper.unmount()
  })

  it('states the separate, later location-coverage gap plainly, with real numbers', () => {
    const wrapper = mountSparkline({ start: calendarDay(2025, 1, 1), end: LATEST })
    const text = normalisedText(wrapper)
    expect(text).toContain('under 1% until 2018')
    expect(text).toContain('62,006 stops but just one with a location')
    wrapper.unmount()
  })

  it("names each year's located count in its tooltip, not just its total", () => {
    const wrapper = mountSparkline({ start: calendarDay(2025, 1, 1), end: LATEST })
    const bars = wrapper.findAll('button[title]')
    const year2010 = bars.find((bar) => bar.attributes('title')?.startsWith('2010:'))!
    expect(year2010.attributes('title')).toBe('2010: 62,006 stops (1 with a recorded location)')
    wrapper.unmount()
  })

  it('draws one bar for every year in range, including years with no rows at all', () => {
    const wrapper = mountSparkline({ start: calendarDay(2025, 1, 1), end: LATEST })
    // 1991 through 2025 inclusive, filling the gaps fillYearGaps would supply.
    expect(wrapper.findAll('button[title]')).toHaveLength(35)
    wrapper.unmount()
  })

  it('emits a clamped calendar year when a bar is clicked', async () => {
    const wrapper = mountSparkline({ start: calendarDay(2025, 1, 1), end: LATEST })

    const bars = wrapper.findAll('button[title]')
    const year2015 = bars.find((bar) => bar.attributes('title')?.startsWith('2015:'))!
    await year2015.trigger('click')
    expect(wrapper.emitted('update:range')?.at(-1)).toEqual([
      { start: calendarDay(2015, 1, 1), end: calendarDay(2015, 12, 31) }
    ])

    // The earliest year clamps its start to earliestEventDate, not January 1st.
    const year1991 = bars.find((bar) => bar.attributes('title')?.startsWith('1991:'))!
    await year1991.trigger('click')
    expect(wrapper.emitted('update:range')?.at(-1)).toEqual([
      { start: EARLIEST, end: calendarDay(1991, 12, 31) }
    ])

    // The latest year clamps its end to latestEventDate, not December 31st.
    const year2025 = bars.find((bar) => bar.attributes('title')?.startsWith('2025:'))!
    await year2025.trigger('click')
    expect(wrapper.emitted('update:range')?.at(-1)).toEqual([
      { start: calendarDay(2025, 1, 1), end: LATEST }
    ])

    wrapper.unmount()
  })

  it('gives the busiest year a real, nonzero pixel height — not a CSS percentage with nothing to resolve against', () => {
    // A `height: X%` bar needs its ancestor to have a *definite* height, which
    // an `items-end` flex item sized by its own content never has — every bar
    // silently rendered at 0px in production until this asserted the real
    // pixel value.
    const wrapper = mountSparkline({ start: calendarDay(2025, 1, 1), end: LATEST })
    const bars = wrapper.findAll('button[title]')
    const busiest = bars.find((bar) => bar.attributes('title')?.startsWith('2010:'))!
    const heightPx = Number(
      busiest
        .find('span')
        .attributes('style')
        ?.match(/height:\s*([\d.]+)px/)?.[1]
    )
    expect(heightPx).toBeGreaterThan(10)
    wrapper.unmount()
  })

  it('caps a bar with a tall located-share indicator once coordinates are reliable, and a sliver before', () => {
    const wrapper = mountSparkline({ start: calendarDay(2025, 1, 1), end: LATEST })
    const bars = wrapper.findAll('button[title]')
    const capHeight = (bar: (typeof bars)[number]) => {
      const spans = bar.findAll('span')
      const style = spans[1]?.attributes('style') ?? ''
      return Number(style.match(/height:\s*([\d.]+)px/)?.[1] ?? 0)
    }

    // 2018: 60,181 of 60,957 located — the cap should be nearly the whole bar.
    const year2018 = bars.find((bar) => bar.attributes('title')?.startsWith('2018:'))!
    // 2010: 1 of 62,006 located — the cap should be a sliver, not nothing and not large.
    const year2010 = bars.find((bar) => bar.attributes('title')?.startsWith('2010:'))!

    expect(capHeight(year2018)).toBeGreaterThan(40)
    expect(capHeight(year2010)).toBeGreaterThan(0)
    expect(capHeight(year2010)).toBeLessThan(1)
    wrapper.unmount()
  })

  it('renders a true zero-stop year with no visible bar', () => {
    const wrapper = mountSparkline({ start: calendarDay(2025, 1, 1), end: LATEST })
    const bars = wrapper.findAll('button[title]')
    const emptyYear = bars.find((bar) => bar.attributes('title')?.startsWith('1993:'))!
    expect(emptyYear.attributes('title')).toContain('0 stops')
    const style = emptyYear.find('span').attributes('style') ?? ''
    expect(style).toMatch(/height:\s*0px/)
    wrapper.unmount()
  })

  it('renders nothing when the dataset bounds are not known yet', () => {
    const wrapper = mountSparkline(
      { start: calendarDay(2025, 1, 1), end: calendarDay(2025, 1, 31) },
      { earliest: null, latest: null }
    )
    expect(normalisedText(wrapper)).toBe('')
    wrapper.unmount()
  })
})
