import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { DistrictCount } from '@/lib/stops'

import DistrictBreakdown from './DistrictBreakdown.vue'

// Measured live, the current default range.
const DISTRICTS: DistrictCount[] = [
  { district: '3', count: 10372 },
  { district: '7', count: 4095 },
  { district: '4', count: 1290 }
]

function normalisedText(wrapper: ReturnType<typeof mount>): string {
  return wrapper.text().replace(/\s+/g, ' ')
}

function mountBreakdown(props: Partial<InstanceType<typeof DistrictBreakdown>['$props']> = {}) {
  return mount(DistrictBreakdown, {
    props: { districtCounts: DISTRICTS, rangeTotal: 30392, ...props }
  })
}

describe('DistrictBreakdown', () => {
  it('lists every district, busiest first, with count and share of range', () => {
    const wrapper = mountBreakdown()
    const text = normalisedText(wrapper)
    expect(text).toContain('District 3')
    expect(text).toContain('10,372 (34.1%)')
    expect(text).toContain('District 7')
    expect(text).toContain('4,095 (13.5%)')
    expect(text).toContain('District 4')
    expect(text).toContain('1,290 (4.2%)')
    // District 3 (busiest) appears before District 4 (quietest) in source order.
    expect(text.indexOf('District 3')).toBeLessThan(text.indexOf('District 4'))
    wrapper.unmount()
  })

  it('gives the busiest district a real, nonzero pixel width — not an untested CSS percentage', () => {
    // Same lesson as the sparkline bug: assert the actual rendered style, not
    // just that the markup looks plausible.
    const wrapper = mountBreakdown()
    const bars = wrapper.findAll('.bg-nola-blue-bright')
    const busiest = bars[0]
    expect(busiest?.attributes('style')).toMatch(/width:\s*100%/)
    const quietest = bars[bars.length - 1]
    expect(quietest?.attributes('style')).toMatch(/width:\s*12\.\d+%/) // 1290/10372
    wrapper.unmount()
  })

  it('points to the map below for shape and intersection-level detail', () => {
    const wrapper = mountBreakdown()
    expect(normalisedText(wrapper)).toContain('map below')
    wrapper.unmount()
  })

  it('handles a range with no stops at all without crashing', () => {
    const wrapper = mountBreakdown({ districtCounts: [], rangeTotal: 0 })
    expect(normalisedText(wrapper)).toContain('No stops recorded for this range')
    wrapper.unmount()
  })

  it('keeps implementation wording off the page', () => {
    const wrapper = mountBreakdown()
    const text = normalisedText(wrapper)
    expect(text).not.toMatch(/snapshot/i)
    expect(text).not.toMatch(/\bquery|queried\b/i)
    expect(text).not.toMatch(/cache/i)
    wrapper.unmount()
  })
})
