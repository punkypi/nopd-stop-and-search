import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { calendarDay, type CalendarDay } from '@/lib/dates'
import { DATE_RANGE_PRESETS } from '@/lib/dateRangePresets'
import type { DateRange } from '@/lib/stops'

import DateRangePresets from './DateRangePresets.vue'

// The dataset's real measured bounds as of this writing.
const LATEST = calendarDay(2025, 11, 10)
const EARLIEST = calendarDay(1991, 7, 24)

function normalisedText(wrapper: ReturnType<typeof mount>): string {
  return wrapper.text().replace(/\s+/g, ' ')
}

function mountPresets(
  range: DateRange,
  overrides: Partial<{ earliest: CalendarDay | null; latest: CalendarDay | null }> = {}
) {
  return mount(DateRangePresets, {
    props: { range, earliest: EARLIEST, latest: LATEST, ...overrides }
  })
}

describe('DateRangePresets', () => {
  it('renders every preset with its label and resolved calendar span', () => {
    const wrapper = mountPresets({ start: calendarDay(2025, 1, 1), end: LATEST })
    const text = normalisedText(wrapper)

    expect(text).toContain('Latest Month')
    expect(text).toContain('Latest 30 Days')
    expect(text).toContain('Latest 90 Days')
    expect(text).toContain('Latest 12 Months')
    expect(text).toContain('Calendar Year 2025')
    expect(text).toContain('All Time')
    // A resolved span, not a bare relative label standing alone.
    expect(text).toContain('Jul 1991 – Nov 2025')

    wrapper.unmount()
  })

  it('emits the resolved range for whichever preset is clicked', async () => {
    const wrapper = mountPresets({ start: calendarDay(2020, 1, 1), end: calendarDay(2020, 1, 31) })
    const buttons = wrapper.findAll('button')
    const allTimeButton = buttons.find((button) => button.text().includes('All Time'))
    expect(allTimeButton).toBeTruthy()

    await allTimeButton!.trigger('click')

    expect(wrapper.emitted('update:range')).toEqual([[{ start: EARLIEST, end: LATEST }]])
    wrapper.unmount()
  })

  it('marks the preset matching the current selection, and none when nothing matches', () => {
    const allTimePreset = DATE_RANGE_PRESETS.find((preset) => preset.key === 'all-time')!
    const matching = mountPresets(allTimePreset.range(LATEST, EARLIEST))
    const customRange = mountPresets({
      start: calendarDay(2015, 3, 1),
      end: calendarDay(2015, 3, 15)
    })

    const findAllTime = (wrapper: ReturnType<typeof mount>) =>
      wrapper.findAll('button').find((button) => button.text().includes('All Time'))!

    expect(findAllTime(matching).classes().join(' ')).toMatch(/primary/)
    expect(findAllTime(customRange).classes().join(' ')).not.toMatch(/primary/)

    matching.unmount()
    customRange.unmount()
  })

  it('renders nothing when the dataset bounds are not known yet', () => {
    const wrapper = mountPresets(
      { start: calendarDay(2025, 1, 1), end: calendarDay(2025, 1, 31) },
      { earliest: null, latest: null }
    )
    expect(normalisedText(wrapper)).toBe('')
    wrapper.unmount()
  })
})
