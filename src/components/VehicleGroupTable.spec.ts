import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { buildVehicleGroup, type VehicleGroup } from '@/lib/stops'

import VehicleGroupTable from './VehicleGroupTable.vue'

function normalisedText(wrapper: ReturnType<typeof mount>): string {
  return wrapper.text().replace(/\s+/g, ' ')
}

function mountTable(vehicleGroups: VehicleGroup[]) {
  return mount(VehicleGroupTable, { attachTo: document.body, props: { vehicleGroups } })
}

/** A range where four of every five stops named a vehicle. */
const MIXED: VehicleGroup[] = [
  buildVehicleGroup('FORD', 'F150', 60),
  buildVehicleGroup('NISSAN', 'ALTIMA', 20),
  buildVehicleGroup('', '', 20)
]

describe('VehicleGroupTable', () => {
  it('states how much of the range recorded a vehicle at all', () => {
    const wrapper = mountTable(MIXED)

    // Without this the make/model totals read as a count of every stop, which
    // stopped being true once stops of people on foot were included.
    expect(normalisedText(wrapper)).toContain('80 of 100 stops in this range recorded a vehicle')

    wrapper.unmount()
  })

  it('explains that the shortfall is stops with no vehicle to record', () => {
    const wrapper = mountTable(MIXED)
    expect(normalisedText(wrapper)).toContain('on foot')
    wrapper.unmount()
  })

  it('omits the disclosure when every stop in the range named a vehicle', () => {
    const wrapper = mountTable([buildVehicleGroup('FORD', 'F150', 60)])
    expect(normalisedText(wrapper)).not.toContain('recorded a vehicle')
    wrapper.unmount()
  })

  it('renders the rows themselves through the data table', () => {
    const wrapper = mountTable(MIXED)
    const text = normalisedText(wrapper)
    expect(text).toContain('FORD')
    expect(text).toContain('ALTIMA')
    wrapper.unmount()
  })

  it('keeps implementation wording off the page', () => {
    const wrapper = mountTable(MIXED)
    const text = wrapper.text()
    expect(text).not.toMatch(/snapshot/i)
    expect(text).not.toMatch(/\bquery|queried\b/i)
    expect(text).not.toMatch(/cache/i)
    wrapper.unmount()
  })
})
