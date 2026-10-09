import { flushPromises, mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { MAX_LEGIBLE_LOCATIONS, type StopLocation } from '@/lib/stopLocations'
import type { DistrictCount } from '@/lib/stops'

import DistrictMap from './DistrictMap.vue'

/** Same lesson as StopMap.spec.ts: jsdom has no 2D canvas and does no layout,
 *  so the viewport is stubbed to make radii and hit-testing observable. */
const VIEWPORT = { width: 800, height: 600 }

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => VIEWPORT.width
  })
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get: () => VIEWPORT.height
  })
})

afterAll(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth')
  Reflect.deleteProperty(HTMLElement.prototype, 'clientHeight')
})

function square(lat: number, lon: number, size = 0.01) {
  return [
    [
      [lon - size, lat - size],
      [lon + size, lat - size],
      [lon + size, lat + size],
      [lon - size, lat + size],
      [lon - size, lat - size]
    ]
  ]
}

function boundaryFeature(district: string, lat: number, lon: number) {
  return {
    type: 'Feature' as const,
    properties: { district },
    geometry: { type: 'Polygon' as const, coordinates: square(lat, lon) }
  }
}

const DISTRICTS = ['1', '2', '3', '4', '5', '6', '7', '8']
const BOUNDARIES = {
  type: 'FeatureCollection' as const,
  features: DISTRICTS.map((district, i) =>
    boundaryFeature(district, 29.8 + i * 0.1, -90.2 + i * 0.1)
  )
}

const DISTRICT_COUNTS: DistrictCount[] = [
  { district: '3', count: 10372 },
  { district: '7', count: 4095 },
  { district: '4', count: 1290 }
]

// Both fall inside district 3's fixture square (centered at 30.0, -90.0,
// half-size 0.01), so geometric filtering picks them up without needing a
// tabular district field on the fixture.
const DISTRICT_3_LOCATION: StopLocation = {
  latitude: 29.8 + 2 * 0.1,
  longitude: -90.2 + 2 * 0.1,
  count: 100,
  address: 'Canal St & N Rampart St'
}
const DISTRICT_3_LOCATION_2: StopLocation = {
  latitude: 29.8 + 2 * 0.1 + 0.001,
  longitude: -90.2 + 2 * 0.1 + 0.001,
  count: 1,
  address: 'Poydras St & S Peters St'
}

function stubBoundaryFetch() {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('nopd-districts.geojson')) {
        return new Response(JSON.stringify(BOUNDARIES), { status: 200 })
      }
      throw new Error(`Unexpected fetch in DistrictMap test: ${url}`)
    })
  )
}

function normalisedText(wrapper: ReturnType<typeof mount>): string {
  return wrapper.text().replace(/\s+/g, ' ')
}

function mountMap(props: Partial<InstanceType<typeof DistrictMap>['$props']> = {}) {
  return mount(DistrictMap, {
    attachTo: document.body,
    props: {
      districtCounts: DISTRICT_COUNTS,
      // Matches the two fixture locations' combined count (100 + 1), so this
      // range clears LOCATION_COVERAGE_THRESHOLD and drilling in is offered.
      rangeTotal: 101,
      locations: [DISTRICT_3_LOCATION, DISTRICT_3_LOCATION_2],
      ...props
    }
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('DistrictMap', () => {
  it('draws one polygon per district, colored', async () => {
    stubBoundaryFetch()
    const wrapper = mountMap()
    await flushPromises()

    for (const district of DISTRICTS) {
      expect(wrapper.find(`path.district-${district}`).exists()).toBe(true)
    }
    wrapper.unmount()
  })

  it('shows a district count on hover, not as an always-on label', async () => {
    // Always-on labels for all 8 districts overlap and become unreadable —
    // several of the city's districts are small on screen next to the ones
    // that stretch toward the lake and the marsh. Color distinguishes them
    // at a glance; hovering gets the exact count.
    stubBoundaryFetch()
    const wrapper = mountMap()
    await flushPromises()

    expect(normalisedText(wrapper)).not.toContain('10,372')
    await wrapper.find('path.district-3').trigger('mouseover')
    await flushPromises()
    expect(normalisedText(wrapper)).toContain('10,372')
    wrapper.unmount()
  })

  it('invites a click when this range has reliable coordinates', async () => {
    stubBoundaryFetch()
    const wrapper = mountMap()
    await flushPromises()
    expect(normalisedText(wrapper)).toContain('Click a district')
    wrapper.unmount()
  })

  it('drills into a district on click, showing its own circles', async () => {
    stubBoundaryFetch()
    const wrapper = mountMap()
    await flushPromises()

    await wrapper.find('path.district-3').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('path.stop-circle')).toHaveLength(2)
    const text = normalisedText(wrapper)
    expect(text).toContain('District 3')
    expect(wrapper.text()).toContain('Show all districts')
    // Two independent statements, not an "X of Y" subset claim — a located
    // stop here is one whose coordinate falls inside District 3's shape,
    // which isn't exactly "District 3's own recorded stops" (see CLAUDE.md).
    expect(text).toContain(
      "101 stops have a recorded location within District 3's mapped shape, at 2 places."
    )
    expect(text).toContain('District 3 recorded 10,372 stops here in total.')
    expect(text).not.toContain('101 of 10,372')
    wrapper.unmount()
  })

  it('omits the district-total sentence when no tabular total is known', async () => {
    stubBoundaryFetch()
    const wrapper = mountMap({ districtCounts: [] })
    await flushPromises()

    await wrapper.find('path.district-3').trigger('click')
    await flushPromises()

    const text = normalisedText(wrapper)
    expect(text).toContain(
      "101 stops have a recorded location within District 3's mapped shape, at 2 places."
    )
    expect(text).not.toContain('recorded here in total')
    wrapper.unmount()
  })

  it('excludes a location geometrically outside the selected district even if other fixtures suggest otherwise', async () => {
    // Direct test of the geometric filter: a point well outside every
    // district's fixture square never shows up, no matter which district is
    // selected.
    stubBoundaryFetch()
    const farAway: StopLocation = { latitude: 0, longitude: 0, count: 1, address: 'Nowhere' }
    const wrapper = mountMap({
      locations: [DISTRICT_3_LOCATION, farAway],
      rangeTotal: DISTRICT_3_LOCATION.count + 1
    })
    await flushPromises()

    await wrapper.find('path.district-3').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('path.stop-circle')).toHaveLength(1)
    wrapper.unmount()
  })

  it('returns to the overview when the selected district is clicked again', async () => {
    stubBoundaryFetch()
    const wrapper = mountMap()
    await flushPromises()

    await wrapper.find('path.district-3').trigger('click')
    await flushPromises()
    await wrapper.find('path.district-3').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('path.stop-circle')).toHaveLength(0)
    expect(wrapper.text()).not.toContain('Show all districts')
    wrapper.unmount()
  })

  it('stays in the overview and explains why when this range has no reliable coordinates', async () => {
    stubBoundaryFetch()
    const wrapper = mountMap({ locations: [], rangeTotal: 62006 })
    await flushPromises()

    await wrapper.find('path.district-3').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('path.stop-circle')).toHaveLength(0)
    expect(normalisedText(wrapper)).toContain("aren't recorded reliably enough")
    wrapper.unmount()
  })

  it('highlights a district but draws no circles when its own locations are too dense', async () => {
    stubBoundaryFetch()
    // A small grid, all safely inside district 3's fixture square (centered
    // at 30.0, -90.0, half-size 0.01), so every point survives the geometric
    // filter and the density gate is what's actually being tested here.
    const denseDistrict3 = Array.from({ length: MAX_LEGIBLE_LOCATIONS + 1 }, (_, i) => ({
      latitude: 30.0 - 0.009 + (i % 50) * 0.00035,
      longitude: -90.0 - 0.009 + Math.floor(i / 50) * 0.0005,
      count: 1,
      address: ''
    }))
    const wrapper = mountMap({ locations: denseDistrict3, rangeTotal: denseDistrict3.length })
    await flushPromises()

    await wrapper.find('path.district-3').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('path.stop-circle')).toHaveLength(0)
    expect(normalisedText(wrapper)).toContain('still too dense to draw')
    wrapper.unmount()
  })

  it('discloses when the busiest locations were shown in place of all of them', async () => {
    stubBoundaryFetch()
    const wrapper = mountMap({ locationsTruncated: true })
    await flushPromises()

    await wrapper.find('path.district-3').trigger('click')
    await flushPromises()

    expect(normalisedText(wrapper)).toContain('busiest locations only')
    wrapper.unmount()
  })

  it('discloses address-inconsistent exclusions regardless of whether a district is selected', async () => {
    stubBoundaryFetch()
    const wrapper = mountMap({ addressInconsistentCount: 1094 })
    await flushPromises()

    expect(normalisedText(wrapper)).toContain('1,094 located stops are left off')
    wrapper.unmount()
  })

  it('says nothing about address exclusions when there are none', async () => {
    stubBoundaryFetch()
    const wrapper = mountMap({ addressInconsistentCount: 0 })
    await flushPromises()

    expect(normalisedText(wrapper)).not.toContain('left off')
    wrapper.unmount()
  })

  it('credits the basemap, as Esri requires', async () => {
    stubBoundaryFetch()
    const wrapper = mountMap()
    await flushPromises()
    const attribution = wrapper.element.querySelector('.leaflet-control-attribution')?.innerHTML
    expect(attribution).toContain('Esri')
    wrapper.unmount()
  })

  it('keeps implementation wording off the page', async () => {
    stubBoundaryFetch()
    const wrapper = mountMap()
    await flushPromises()
    const text = normalisedText(wrapper)
    expect(text).not.toMatch(/snapshot/i)
    expect(text).not.toMatch(/\bquery|queried\b/i)
    expect(text).not.toMatch(/cache/i)
    wrapper.unmount()
  })
})
