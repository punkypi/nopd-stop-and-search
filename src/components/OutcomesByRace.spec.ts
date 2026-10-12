import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { RaceOutcomeCounts, RaceStopTypeCount } from '@/lib/outcomesByRace'

import OutcomesByRace from './OutcomesByRace.vue'

function normalisedText(wrapper: ReturnType<typeof mount>): string {
  return wrapper.text().replace(/\s+/g, ' ')
}

const COUNTS: RaceOutcomeCounts[] = [
  { race: 'BLACK', stops: 200, searched: 50, cited: 80, arrested: 20, seized: 25 },
  { race: 'WHITE', stops: 100, searched: 20, cited: 30, arrested: 5, seized: 4 },
  // searched (5) is under MIN_CELL_STOPS, so the seized-of-searches cell is suppressed
  // even though stops (40) and the search rate itself are not.
  { race: 'ASIAN', stops: 40, searched: 5, cited: 10, arrested: 1, seized: 1 }
]

const STOP_TYPE_COUNTS: RaceStopTypeCount[] = [
  { race: 'BLACK', description: 'TRAFFIC VIOLATION', count: 150 },
  { race: 'BLACK', description: 'CALL FOR SERVICE', count: 50 },
  { race: 'WHITE', description: 'TRAFFIC VIOLATION', count: 80 },
  { race: 'WHITE', description: 'CALL FOR SERVICE', count: 20 }
]

function mountPanel() {
  return mount(OutcomesByRace, {
    attachTo: document.body,
    props: { counts: COUNTS, stopTypeCounts: STOP_TYPE_COUNTS }
  })
}

describe('OutcomesByRace', () => {
  it('states that this covers the whole record, not the selected date range', () => {
    const wrapper = mountPanel()
    expect(normalisedText(wrapper)).toContain('Every stop on record, not the selected date range')
    wrapper.unmount()
  })

  it('labels itself "Whole record" at a glance, since the card below it is date-range scoped', () => {
    const wrapper = mountPanel()
    expect(normalisedText(wrapper)).toContain('Whole record')
    wrapper.unmount()
  })

  it('renders a computed rate for a cell well above the suppression floor', () => {
    const wrapper = mountPanel()
    // BLACK: 50 searched of 200 stops = 25.0%.
    expect(normalisedText(wrapper)).toContain('50 (25.0%)')
    wrapper.unmount()
  })

  it('suppresses a rate built on fewer than 30 stops or searches, but keeps the raw count', () => {
    const wrapper = mountPanel()
    // ASIAN: 1 seized of 5 searches — under MIN_CELL_STOPS.
    expect(normalisedText(wrapper)).toContain('1 (too few to rate)')
    wrapper.unmount()
  })

  it('explains the suppression and the outcome overlap', () => {
    const wrapper = mountPanel()
    const text = normalisedText(wrapper)
    expect(text).toContain("don't sum to 100%")
    expect(text).toContain('fewer than 30 stops or searches')
    wrapper.unmount()
  })

  it('discloses each leading race’s own stop-type composition', () => {
    const wrapper = mountPanel()
    const text = normalisedText(wrapper)
    expect(text).toContain('75.0% traffic violation')
    expect(text).toContain('80.0% traffic violation')
    wrapper.unmount()
  })

  it('keeps implementation wording off the page', () => {
    const wrapper = mountPanel()
    const text = wrapper.text()
    expect(text).not.toMatch(/snapshot/i)
    expect(text).not.toMatch(/\bquery|queried\b/i)
    expect(text).not.toMatch(/cache/i)
    wrapper.unmount()
  })
})
