import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { calendarDay } from '@/lib/dates'
import type { DateRange } from '@/lib/stops'
import type { TimeSeriesPoint } from '@/lib/stopsOverRange'

import StopsOverRangeChart from './StopsOverRangeChart.vue'

function normalisedText(wrapper: ReturnType<typeof mount>): string {
  return wrapper.text().replace(/\s+/g, ' ')
}

// The real default range: starts the 11th, so November 2024 only covers 20
// of that month's 30 days, and ends the 10th, so November 2025 is cut short
// at the other end too.
const MONTHLY_RANGE: DateRange = {
  start: calendarDay(2024, 11, 11),
  end: calendarDay(2025, 11, 10)
}
const MONTHLY_POINTS: TimeSeriesPoint[] = [
  { bucketStart: '2024-11-01', count: 1589, partial: true },
  { bucketStart: '2025-06-01', count: 2326, partial: false },
  { bucketStart: '2025-11-01', count: 404, partial: true }
]

const DAILY_RANGE: DateRange = { start: calendarDay(2025, 11, 1), end: calendarDay(2025, 11, 10) }
const DAILY_POINTS: TimeSeriesPoint[] = [
  { bucketStart: '2025-11-01', count: 48, partial: false },
  { bucketStart: '2025-11-10', count: 1, partial: false }
]

function mountChart(points: TimeSeriesPoint[], range: DateRange) {
  return mount(StopsOverRangeChart, { props: { points, range } })
}

describe('StopsOverRangeChart', () => {
  it('draws one bar per month, filling any month absent from the real data', () => {
    const wrapper = mountChart(MONTHLY_POINTS, MONTHLY_RANGE)
    // November 2024 through November 2025 inclusive.
    expect(wrapper.findAll('div[title]')).toHaveLength(13)
    wrapper.unmount()
  })

  it('draws one bar per day for a short range', () => {
    const wrapper = mountChart(DAILY_POINTS, DAILY_RANGE)
    expect(wrapper.findAll('div[title]')).toHaveLength(10)
    wrapper.unmount()
  })

  it("names a partial bucket's tooltip, not just its count", () => {
    const wrapper = mountChart(MONTHLY_POINTS, MONTHLY_RANGE)
    const bars = wrapper.findAll('div[title]')
    const novemberFirst = bars.find((bar) => bar.attributes('title')?.startsWith('Nov 2024'))!
    expect(novemberFirst.attributes('title')).toBe(
      'Nov 2024: 1,589 stops (covers only part of the month)'
    )
    wrapper.unmount()
  })

  it('discloses the partial-bucket caveat when a bucket is cut short', () => {
    const wrapper = mountChart(MONTHLY_POINTS, MONTHLY_RANGE)
    expect(normalisedText(wrapper)).toContain('starts or ends partway through it')
    wrapper.unmount()
  })

  it('omits the partial-bucket caveat when every bucket is a full period', () => {
    const fullRange: DateRange = { start: calendarDay(2025, 1, 1), end: calendarDay(2025, 3, 31) }
    const points: TimeSeriesPoint[] = [{ bucketStart: '2025-02-01', count: 1721, partial: false }]
    const wrapper = mountChart(points, fullRange)
    expect(normalisedText(wrapper)).not.toContain('starts or ends partway through it')
    wrapper.unmount()
  })

  it('dims a partial bar so it reads differently from a real low-volume bucket', () => {
    const wrapper = mountChart(MONTHLY_POINTS, MONTHLY_RANGE)
    const bars = wrapper.findAll('div[title]')
    const partial = bars.find((bar) => bar.attributes('title')?.startsWith('Nov 2024'))!
    const full = bars.find((bar) => bar.attributes('title')?.startsWith('Jun 2025'))!
    expect(partial.find('span').classes()).toContain('opacity-50')
    expect(full.find('span').classes()).not.toContain('opacity-50')
    wrapper.unmount()
  })

  it('gives the busiest bucket a real, nonzero pixel height', () => {
    const wrapper = mountChart(MONTHLY_POINTS, MONTHLY_RANGE)
    const bars = wrapper.findAll('div[title]')
    const busiest = bars.find((bar) => bar.attributes('title')?.startsWith('Jun 2025'))!
    const heightPx = Number(
      busiest
        .find('span')
        .attributes('style')
        ?.match(/height:\s*([\d.]+)px/)?.[1]
    )
    expect(heightPx).toBeGreaterThan(10)
    wrapper.unmount()
  })

  it('renders a genuinely empty bucket with no visible bar', () => {
    const wrapper = mountChart(MONTHLY_POINTS, MONTHLY_RANGE)
    const bars = wrapper.findAll('div[title]')
    // January 2025 is absent from MONTHLY_POINTS, so fillBucketGaps supplies a zero.
    const empty = bars.find((bar) => bar.attributes('title')?.startsWith('Jan 2025'))!
    expect(empty.attributes('title')).toContain('0 stops')
    expect(empty.find('span').attributes('style') ?? '').toMatch(/height:\s*0px/)
    wrapper.unmount()
  })

  it('formats a daily bucket by its full date, not a month', () => {
    const wrapper = mountChart(DAILY_POINTS, DAILY_RANGE)
    const bars = wrapper.findAll('div[title]')
    const first = bars.find((bar) => bar.attributes('title')?.startsWith('November 1, 2025'))!
    expect(first.attributes('title')).toBe('November 1, 2025: 48 stops')
    wrapper.unmount()
  })
})
