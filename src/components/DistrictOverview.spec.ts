import { flushPromises, mount } from '@vue/test-utils'
import { NSelect } from 'naive-ui'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { calendarDay } from '@/lib/dates'
import {
  MAX_LEGIBLE_LOCATIONS,
  type StopLocation,
  type StopLocationTypeCount
} from '@/lib/stopLocations'
import type { DistrictCount, DistrictStopTypeCount } from '@/lib/stops'

import DistrictOverview from './DistrictOverview.vue'

/** jsdom has no 2D canvas and does no layout, so the viewport is stubbed to
 *  make radii and hit-testing observable — same lesson as the old StopMap. */
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

// Measured live, default range: District 8's Criminal Violation share
// (6.38%) is 4.5x-45x every other district's. District 8 isn't in
// DISTRICT_COUNTS above, but the stop-type composition computations key off
// districtCounts for their denominators, so this fixture alone wouldn't move
// District 8 — the composition-mode tests build their own prop override.
const DISTRICT_STOP_TYPE_COUNTS: DistrictStopTypeCount[] = [
  { district: '3', description: 'TRAFFIC VIOLATION', count: 9970 },
  { district: '7', description: 'TRAFFIC VIOLATION', count: 3683 },
  { district: '4', description: 'TRAFFIC VIOLATION', count: 1075 },
  { district: '3', description: 'CRIMINAL VIOLATION', count: 15 },
  { district: '7', description: 'CRIMINAL VIOLATION', count: 22 },
  { district: '4', description: 'CRIMINAL VIOLATION', count: 3 }
]

// District 8 isn't in DISTRICT_COUNTS/DISTRICT_STOP_TYPE_COUNTS above — those
// predate this feature and other tests already key off them. Added here only
// for the tests that need the real outlier finding (6.38% vs <=1.42%
// everywhere else), matching the live numbers in App.spec.ts's SNAPSHOT.
const DISTRICT_COUNTS_WITH_8: DistrictCount[] = [...DISTRICT_COUNTS, { district: '8', count: 3135 }]
const DISTRICT_STOP_TYPE_COUNTS_WITH_8: DistrictStopTypeCount[] = [
  ...DISTRICT_STOP_TYPE_COUNTS,
  { district: '8', description: 'TRAFFIC VIOLATION', count: 2504 },
  { district: '8', description: 'CRIMINAL VIOLATION', count: 200 }
]

const RANGE = { start: calendarDay(2024, 11, 11), end: calendarDay(2025, 11, 10) }

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

// DISTRICT_3_LOCATION carries both types (90 + 10 = its total of 100);
// DISTRICT_3_LOCATION_2 carries only traffic violation (matching its total
// of 1) — so selecting criminal violation mutes exactly one of the two.
const LOCATION_TYPE_COUNTS: StopLocationTypeCount[] = [
  {
    latitude: DISTRICT_3_LOCATION.latitude,
    longitude: DISTRICT_3_LOCATION.longitude,
    description: 'TRAFFIC VIOLATION',
    count: 90
  },
  {
    latitude: DISTRICT_3_LOCATION.latitude,
    longitude: DISTRICT_3_LOCATION.longitude,
    description: 'CRIMINAL VIOLATION',
    count: 10
  },
  {
    latitude: DISTRICT_3_LOCATION_2.latitude,
    longitude: DISTRICT_3_LOCATION_2.longitude,
    description: 'TRAFFIC VIOLATION',
    count: 1
  }
]

function stubBoundaryFetch(eventRows: unknown[] = []) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('nopd-districts.geojson')) {
        return new Response(JSON.stringify(BOUNDARIES), { status: 200 })
      }
      if (url.includes('eventdate')) {
        return new Response(JSON.stringify(eventRows), { status: 200 })
      }
      throw new Error(`Unexpected fetch in DistrictOverview test: ${url}`)
    })
  )
}

function normalisedText(wrapper: ReturnType<typeof mount>): string {
  return wrapper.text().replace(/\s+/g, ' ')
}

function mountOverview(props: Partial<InstanceType<typeof DistrictOverview>['$props']> = {}) {
  return mount(DistrictOverview, {
    attachTo: document.body,
    props: {
      districtCounts: DISTRICT_COUNTS,
      districtStopTypeCounts: DISTRICT_STOP_TYPE_COUNTS,
      locationTypeCounts: LOCATION_TYPE_COUNTS,
      // Matches the two fixture locations' combined count (100 + 1), so this
      // range clears LOCATION_COVERAGE_THRESHOLD and drilling in is offered.
      rangeTotal: 101,
      range: RANGE,
      locations: [DISTRICT_3_LOCATION, DISTRICT_3_LOCATION_2],
      ...props
    }
  })
}

async function switchToComposition(wrapper: ReturnType<typeof mount>) {
  const button = wrapper.findAll('button').find((b) => b.text() === 'By Stop Type')
  await button!.trigger('click')
  await flushPromises()
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('DistrictOverview', () => {
  it('shows the headline count and date range', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview()
    await flushPromises()

    const text = normalisedText(wrapper)
    expect(text).toContain('101')
    expect(text).toContain('November 11, 2024')
    expect(text).toContain('November 10, 2025')
    wrapper.unmount()
  })

  it('shows a dash for the count while it is unknown', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview({ rangeTotal: null })
    await flushPromises()
    expect(wrapper.text()).toContain('—')
    wrapper.unmount()
  })

  it('lists every district in the floating panel, busiest first, with its share of the range', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview({ rangeTotal: 30392 })
    await flushPromises()

    const text = normalisedText(wrapper)
    expect(text).toContain('District 3')
    expect(text).toContain('10,372 (34.1%)')
    expect(text).toContain('District 4')
    expect(text).toContain('1,290 (4.2%)')
    expect(text.indexOf('District 3')).toBeLessThan(text.indexOf('District 4'))
    wrapper.unmount()
  })

  it('draws one polygon per district, colored', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview()
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
    const wrapper = mountOverview()
    await flushPromises()

    await wrapper.find('path.district-3').trigger('mouseover')
    await flushPromises()
    // Both the hover tooltip and the floating panel's bar list now show this
    // number, so just confirm it renders at least once rather than counting.
    expect(normalisedText(wrapper)).toContain('10,372')
    wrapper.unmount()
  })

  it('invites a click when this range has reliable coordinates', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview()
    await flushPromises()
    expect(normalisedText(wrapper)).toContain('Click a district')
    wrapper.unmount()
  })

  it('drills into a district on click, showing its own circles', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview()
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

  it('drills into a district when its bar in the floating panel is clicked, not just its shape on the map', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview()
    await flushPromises()

    const districtButtons = wrapper.findAll('button').filter((b) => b.text().includes('District 3'))
    expect(districtButtons).toHaveLength(1)
    await districtButtons[0]!.trigger('click')
    await flushPromises()

    expect(wrapper.findAll('path.stop-circle')).toHaveLength(2)
    wrapper.unmount()
  })

  it("highlights the active district's own row and dims the rest in the bar list", async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview()
    await flushPromises()

    function buttonFor(label: string) {
      return wrapper.findAll('button').find((b) => b.text().includes(label))!
    }

    // No district selected yet: neither highlighted nor dimmed.
    expect(buttonFor('District 3').classes()).toContain('border-transparent')
    expect(buttonFor('District 3').classes()).not.toContain('opacity-60')

    await buttonFor('District 3').trigger('click')
    await flushPromises()

    expect(buttonFor('District 3').classes()).toContain('border-nola-blue-bright')
    expect(buttonFor('District 3').classes()).not.toContain('opacity-60')
    // A district not clicked fades back, so the active one is unmistakable.
    expect(buttonFor('District 7').classes()).toContain('opacity-60')
    expect(buttonFor('District 7').classes()).not.toContain('border-nola-blue-bright')
    wrapper.unmount()
  })

  it('omits the district-total sentence when no tabular total is known', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview({ districtCounts: [] })
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
    const wrapper = mountOverview({
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
    const wrapper = mountOverview()
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
    const wrapper = mountOverview({ locations: [], rangeTotal: 62006 })
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
    const wrapper = mountOverview({ locations: denseDistrict3, rangeTotal: denseDistrict3.length })
    await flushPromises()

    await wrapper.find('path.district-3').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('path.stop-circle')).toHaveLength(0)
    expect(normalisedText(wrapper)).toContain('still too dense to draw')
    wrapper.unmount()
  })

  it('discloses when the busiest locations were shown in place of all of them', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview({ locationsTruncated: true })
    await flushPromises()

    await wrapper.find('path.district-3').trigger('click')
    await flushPromises()

    expect(normalisedText(wrapper)).toContain('busiest locations only')
    wrapper.unmount()
  })

  it('discloses address-inconsistent exclusions regardless of whether a district is selected', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview({ addressInconsistentCount: 1094 })
    await flushPromises()

    expect(normalisedText(wrapper)).toContain('1,094 located stops are left off')
    wrapper.unmount()
  })

  it('says nothing about address exclusions when there are none', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview({ addressInconsistentCount: 0 })
    await flushPromises()

    expect(normalisedText(wrapper)).not.toContain('left off')
    wrapper.unmount()
  })

  it('credits the basemap, as Esri requires', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview()
    await flushPromises()
    const attribution = wrapper.element.querySelector('.leaflet-control-attribution')?.innerHTML
    expect(attribution).toContain('Esri')
    wrapper.unmount()
  })

  it('defaults the stop-type dropdown to the busiest category once switched to composition mode', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview()
    await flushPromises()
    await switchToComposition(wrapper)

    // Traffic violation outnumbers criminal violation across these fixtures
    // (14,728 vs 40 total), so it's the sensible thing to show first.
    expect(normalisedText(wrapper)).toContain('Traffic violation')
    wrapper.unmount()
  })

  it('re-ranks the bar list by share and labels it with a percentage in composition mode', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview({
      districtCounts: DISTRICT_COUNTS_WITH_8,
      districtStopTypeCounts: DISTRICT_STOP_TYPE_COUNTS_WITH_8
    })
    await flushPromises()
    await switchToComposition(wrapper)

    const text = normalisedText(wrapper)
    // Traffic violation's share of each district's own stops: District 3 is
    // highest (96.1%), District 8 lowest (79.9%) — the opposite order from
    // the raw count ranking, where District 3 also leads but District 7
    // outranks District 4 by volume rather than by share.
    expect(text).toContain('96.1% (9,970 stops)')
    expect(text.indexOf('District 3')).toBeLessThan(text.indexOf('District 8'))
    wrapper.unmount()
  })

  it('anchors the map color to the range actually in view, not to 0, in composition mode', async () => {
    // Traffic violation's real range is clustered (79.9%-96.1%), nowhere
    // near 0. Scaled against 0 the whole map would read as a near-flat
    // tint — scaled against the observed minimum, the busiest and quietest
    // districts land squarely on the two swatch endpoints, same as they
    // would for a count-mode range spanning the full scale.
    stubBoundaryFetch()
    const wrapper = mountOverview({
      districtCounts: DISTRICT_COUNTS_WITH_8,
      districtStopTypeCounts: DISTRICT_STOP_TYPE_COUNTS_WITH_8
    })
    await flushPromises()
    await switchToComposition(wrapper)

    expect(wrapper.find('path.district-3').attributes('fill')).toBe('#9fe0ff')
    expect(wrapper.find('path.district-8').attributes('fill')).toBe('#123a5c')
    wrapper.unmount()
  })

  it('surfaces the criminal-violation outlier when the stop type is switched', async () => {
    // The real finding that motivated this feature: District 8's criminal
    // violation share (6.38%) dwarfs every other district's (<=1.42%). This
    // is invisible in count mode and invisible with traffic violation
    // selected — it only shows up once a viewer picks this specific category.
    stubBoundaryFetch()
    const wrapper = mountOverview({
      districtCounts: DISTRICT_COUNTS_WITH_8,
      districtStopTypeCounts: DISTRICT_STOP_TYPE_COUNTS_WITH_8
    })
    await flushPromises()
    await switchToComposition(wrapper)

    await wrapper.findComponent(NSelect).vm.$emit('update:value', 'CRIMINAL VIOLATION')
    await flushPromises()

    const text = normalisedText(wrapper)
    expect(text).toContain('6.4% (200 stops)')
    expect(text.indexOf('District 8')).toBeLessThan(text.indexOf('District 3'))
    expect(text.indexOf('District 8')).toBeLessThan(text.indexOf('District 4'))
    wrapper.unmount()
  })

  it('shows a share on hover, not a count, once in composition mode', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview()
    await flushPromises()
    await switchToComposition(wrapper)

    await wrapper.find('path.district-3').trigger('mouseover')
    await flushPromises()
    expect(normalisedText(wrapper)).toContain('96.1%')
    wrapper.unmount()
  })

  it('mutes a circle with none of the selected type, instead of hiding it', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview()
    await flushPromises()
    await switchToComposition(wrapper)

    await wrapper.find('path.district-3').trigger('click')
    await flushPromises()

    // Traffic violation (the default selection): both fixture locations
    // carry some, so both circles are present and neither is muted.
    expect(wrapper.findAll('path.stop-circle')).toHaveLength(2)
    expect(wrapper.findAll('path.stop-circle-muted')).toHaveLength(0)

    await wrapper.findComponent(NSelect).vm.$emit('update:value', 'CRIMINAL VIOLATION')
    await flushPromises()

    // DISTRICT_3_LOCATION_2 has no criminal violation stops in the fixture —
    // it stays on screen, dimmed, rather than disappearing.
    expect(wrapper.findAll('path.stop-circle')).toHaveLength(2)
    expect(wrapper.findAll('path.stop-circle-muted')).toHaveLength(1)
    wrapper.unmount()
  })

  it('drops the muting when switching back to count mode', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview()
    await flushPromises()
    await switchToComposition(wrapper)
    await wrapper.find('path.district-3').trigger('click')
    await flushPromises()
    await wrapper.findComponent(NSelect).vm.$emit('update:value', 'CRIMINAL VIOLATION')
    await flushPromises()
    expect(wrapper.findAll('path.stop-circle-muted')).toHaveLength(1)

    const countButton = wrapper.findAll('button').find((b) => b.text() === 'By Count')
    await countButton!.trigger('click')
    await flushPromises()

    expect(wrapper.findAll('path.stop-circle-muted')).toHaveLength(0)
    expect(wrapper.findAll('path.stop-circle')).toHaveLength(2)
    wrapper.unmount()
  })

  it('names the selected type in the caption, as an independent fact alongside the existing ones', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview()
    await flushPromises()
    await switchToComposition(wrapper)
    await wrapper.find('path.district-3').trigger('click')
    await flushPromises()

    const text = normalisedText(wrapper)
    // The original "N stops have a recorded location..." sentence is
    // untouched; this is an addition, not a rewrite.
    expect(text).toContain(
      "101 stops have a recorded location within District 3's mapped shape, at 2 places."
    )
    expect(text).toContain('District 3 recorded 9,970 Traffic violation stops in total')
    wrapper.unmount()
  })

  it('says a district recorded none of the selected type when its own tabular total is zero', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview({
      districtStopTypeCounts: [
        { district: '3', description: 'TRAFFIC VIOLATION', count: 9970 },
        // Only present for a different district, so it's an available
        // dropdown option but district 3's own total for it is 0.
        { district: '7', description: 'CRIMINAL VIOLATION', count: 22 }
      ]
    })
    await flushPromises()
    await switchToComposition(wrapper)
    await wrapper.find('path.district-3').trigger('click')
    await flushPromises()
    await wrapper.findComponent(NSelect).vm.$emit('update:value', 'CRIMINAL VIOLATION')
    await flushPromises()

    expect(normalisedText(wrapper)).toContain('District 3 recorded no Criminal violation stops.')
    wrapper.unmount()
  })

  describe("per-event location detail, in the circle's own popup", () => {
    const EVENT_ROWS = [
      {
        eventdate: '2025-06-14T10:00:00.000',
        stopdescription: 'TRAFFIC VIOLATION',
        subjectrace: 'BLACK',
        subjectgender: 'MALE',
        subjectage: '34',
        subjecthasphotoid: 'Yes',
        officerassignment: '3rd District',
        actionstaken: 'Stop Results: Citation Issued;Search Occurred: Yes;Evidence Seized: No'
      },
      {
        eventdate: '2025-05-02T09:00:00.000',
        stopdescription: 'CALL FOR SERVICE',
        subjectrace: 'WHITE',
        subjectgender: 'FEMALE',
        subjectage: '0',
        subjecthasphotoid: 'No',
        officerassignment: 'Traffic',
        actionstaken: 'Stop Results: Verbal Warning;Search Occurred: No;Evidence Seized: No'
      }
    ]

    function popupText(wrapper: ReturnType<typeof mountOverview>): string {
      return (
        wrapper.element
          .querySelector('.leaflet-popup-content')
          ?.textContent?.replace(/\s+/g, ' ') ?? ''
      )
    }

    it("shows a location's own per-event detail in its popup when the circle is clicked", async () => {
      stubBoundaryFetch(EVENT_ROWS)
      const wrapper = mountOverview()
      await flushPromises()

      await wrapper.find('path.district-3').trigger('click')
      await flushPromises()
      // DISTRICT_3_LOCATION (count 100) is the first of the two fixture circles.
      await wrapper.findAll('path.stop-circle')[0]!.trigger('click')
      await flushPromises()

      const text = popupText(wrapper)
      expect(text).toContain('June 14, 2025, Traffic violation')
      expect(text).toContain('Search: Yes')
      expect(text).toContain('Evidence seized: No')
      expect(text).toContain('Outcome: Citation issued')
      expect(text).toContain('Black, Male, age 34')
      expect(text).toContain('Photo ID: Yes')
      expect(text).toContain("Officer's unit: 3rd District")
      // The second event, from a different kind of stop entirely.
      expect(text).toContain('May 2, 2025, Call for service')
      expect(text).toContain('White, Female, age 0')
      // The tooltip (hover) and the usual bar list/caption are unaffected --
      // the detail lives in the popup only, not a separate view.
      expect(normalisedText(wrapper)).toContain('mapped shape')
      wrapper.unmount()
    })

    it('discloses truncation once a location has more events than the cap', async () => {
      const row = EVENT_ROWS[0]!
      stubBoundaryFetch(Array.from({ length: 101 }, () => row))
      const wrapper = mountOverview()
      await flushPromises()

      await wrapper.find('path.district-3').trigger('click')
      await flushPromises()
      await wrapper.findAll('path.stop-circle')[0]!.trigger('click')
      await flushPromises()

      expect(popupText(wrapper)).toContain('Showing the 100 most recent of 100 stops recorded here')
      wrapper.unmount()
    })

    it('shows a loading placeholder before the fetch resolves', async () => {
      stubBoundaryFetch(EVENT_ROWS)
      const wrapper = mountOverview()
      await flushPromises()

      await wrapper.find('path.district-3').trigger('click')
      await flushPromises()
      await wrapper.findAll('path.stop-circle')[0]!.trigger('click')
      // Before awaiting the fetch: the popup already shows something, not
      // empty or stale content from a previous click.
      expect(popupText(wrapper)).toContain("Loading this location's stops")
      await flushPromises()
      wrapper.unmount()
    })
  })

  it('keeps implementation wording off the page', async () => {
    stubBoundaryFetch()
    const wrapper = mountOverview()
    await flushPromises()
    const text = normalisedText(wrapper)
    expect(text).not.toMatch(/snapshot/i)
    expect(text).not.toMatch(/\bquery|queried\b/i)
    expect(text).not.toMatch(/cache/i)
    wrapper.unmount()
  })
})
