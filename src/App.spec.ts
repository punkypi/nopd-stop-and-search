import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from './App.vue'
import { calendarDay } from './lib/dates'
import type { DataSnapshot } from './lib/snapshot'

const SNAPSHOT: DataSnapshot = {
  bakedAt: '2026-09-26T23:50:14.661Z',
  domain: 'data.nola.gov',
  dataset: 'nfft-hjwi',
  earliestEventDate: calendarDay(1991, 7, 24),
  latestEventDate: calendarDay(2025, 11, 9),
  totalStops: 720425,
  stopTypes: [
    { description: 'TRAFFIC VIOLATION', count: 440051 },
    { description: 'CALL FOR SERVICE', count: 98277 },
    { description: 'SUSPECT PERSON', count: 76540 }
  ],
  // A year-wide window ending at latestEventDate, matching what
  // DATE_RANGE_PRESETS['latest-12-months'] actually resolves to.
  defaultRange: { start: calendarDay(2024, 11, 10), end: calendarDay(2025, 11, 9) },
  defaultRangeCount: 30392,
  defaultRangeVehicleGroups: [
    { make: 'NISSAN', model: 'ALTIMA', count: 21, makeAndModel: 'NISSAN ALTIMA' },
    { make: 'CHEVROLET', model: 'OTHER', count: 14, makeAndModel: 'CHEVROLET OTHER' },
    { make: '', model: '', count: 3, makeAndModel: 'Not Supplied' }
  ],
  // Summing close to the real default range's 28,828 of 30,392 located (94.9%)
  // — comfortably above LOCATION_COVERAGE_THRESHOLD, so the map renders here
  // the same way it does for the real default range.
  defaultRangeStopLocations: [
    { latitude: 29.9511, longitude: -90.0715, count: 18000, address: 'Canal St & N Rampart St' },
    { latitude: 30.0046, longitude: -90.1082, count: 10828, address: 'Canal Blvd & Harrison Av' }
  ],
  defaultRangeLocationsTruncated: false,
  defaultRangeAddressInconsistentCount: 0,
  defaultRangeDistrictCounts: [
    { district: '3', count: 10372 },
    { district: '7', count: 4095 },
    { district: '1', count: 3355 },
    { district: '6', count: 3250 },
    { district: '8', count: 3135 },
    { district: '2', count: 2782 },
    { district: '5', count: 2113 },
    { district: '4', count: 1290 }
  ],
  // Sparse, as the real baked data is — 1992-1998 absent rather than zero.
  // locatedCount mirrors the real pattern too: coordinates aren't reliable
  // until 2018, so 2010's count is real but its located share is a sliver.
  yearlyStopCounts: [
    { year: 1991, count: 2, locatedCount: 0 },
    { year: 1999, count: 4, locatedCount: 0 },
    { year: 2010, count: 62006, locatedCount: 1 },
    { year: 2024, count: 27168, locatedCount: 26229 },
    { year: 2025, count: 26629, locatedCount: 25288 }
  ]
}

/** A single feature is enough: these tests only check that DistrictMap renders
 *  its surrounding copy, not the real boundary shapes. */
const DISTRICT_BOUNDARIES_FIXTURE = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { district: '3' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-90.08, 29.94],
            [-90.06, 29.94],
            [-90.06, 29.96],
            [-90.08, 29.96],
            [-90.08, 29.94]
          ]
        ]
      }
    }
  ]
}

/**
 * Serves the baked snapshot and the district boundaries `DistrictMap` loads
 * independently of it; any other request fails the test loudly.
 */
function stubSnapshotFetch(snapshot: DataSnapshot | null) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input)
    if (url.includes('data/snapshot.json')) {
      if (!snapshot) return new Response('missing', { status: 404 })
      return new Response(JSON.stringify(snapshot), { status: 200 })
    }
    if (url.includes('nopd-districts.geojson')) {
      return new Response(JSON.stringify(DISTRICT_BOUNDARIES_FIXTURE), { status: 200 })
    }
    throw new Error(`Unexpected request while the snapshot covers this range: ${url}`)
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('App', () => {
  it('renders the baked total and vehicle rows with no API request', async () => {
    const fetchMock = stubSnapshotFetch(SNAPSHOT)
    vi.stubGlobal('fetch', fetchMock)

    const wrapper = mount(App, { attachTo: document.body })
    await flushPromises()
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain('NOLA Stop and Search Data')
    expect(text).toContain('30,392')
    expect(text).toContain('November 10, 2024')
    expect(text).toContain('November 9, 2025')
    // The table rendered real rows through naive-ui.
    expect(text).toContain('NISSAN')
    expect(text).toContain('ALTIMA')

    // Only the snapshot and the static district shapes were fetched; Socrata
    // was never contacted. Anything more would mean the page queried a range
    // before knowing the real default.
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const requested = fetchMock.mock.calls.map((call) => String(call[0]))
    expect(requested.some((url) => url.includes('data/snapshot.json'))).toBe(true)
    expect(requested.some((url) => url.includes('nopd-districts.geojson'))).toBe(true)

    // How the figures were obtained is not the viewer's concern, so no wording
    // about snapshots or caching belongs on the page.
    expect(text).not.toMatch(/snapshot/i)
    expect(text).not.toMatch(/build-time/i)
    expect(text).not.toMatch(/API request/i)

    wrapper.unmount()
  })

  it('shows dataset provenance drawn from the snapshot rather than hard-coded prose', async () => {
    vi.stubGlobal('fetch', stubSnapshotFetch(SNAPSHOT))

    const wrapper = mount(App, { attachTo: document.body })
    await flushPromises()
    await flushPromises()

    // 1991 is the real first event; the old copy claimed 1999.
    expect(wrapper.text()).toContain('July 24, 1991')
    expect(wrapper.text()).toContain('November 9, 2025')
    expect(wrapper.text()).toContain('720,425')

    wrapper.unmount()
  })

  it('falls back to live queries silently when the snapshot is missing', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('data/snapshot.json')) return new Response('missing', { status: 404 })
      const isCount = new URL(url).searchParams.get('$select')?.startsWith('count(*)')
      return new Response(JSON.stringify(isCount ? [{ total: '5' }] : []), { status: 200 })
    })
    vi.stubGlobal('fetch', fetchMock)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const wrapper = mount(App, { attachTo: document.body })
    await flushPromises()
    await flushPromises()

    // The page works, showing the live figures for the current month.
    const text = wrapper.text()
    expect(text).toContain('NOLA Stop and Search Data')
    expect(text).toContain('5')

    // Nothing about the internal fallback reaches the page; a viewer has no use
    // for it and nothing they could do about it. It goes to the console instead.
    expect(text).not.toMatch(/snapshot/i)
    expect(text).not.toMatch(/live data/i)
    expect(warn).toHaveBeenCalled()

    wrapper.unmount()
  })

  it('shows the district breakdown and invites drilling into the map for a well-located range', async () => {
    vi.stubGlobal('fetch', stubSnapshotFetch(SNAPSHOT))

    const wrapper = mount(App, { attachTo: document.body })
    await flushPromises()
    await flushPromises()

    const text = wrapper.text()
    // DistrictBreakdown, always shown.
    expect(text).toContain('By District')
    expect(text).toContain('District 3')
    // DistrictMap, always shown too — the fixture's default range is
    // well-located (28,828 of 30,392), so it invites drilling in.
    expect(text).toContain('Where Stops Happened')
    expect(text).toContain('Click a district')

    wrapper.unmount()
  })

  it('shows the district breakdown and explains why drilling in is unavailable when a live range has little location data', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input))
      if (url.pathname.includes('snapshot.json')) {
        return new Response('missing', { status: 404 })
      }
      const select = url.searchParams.get('$select') ?? ''
      // Mirrors 2010 live: 62,006 stops, 1 located, a real district spread.
      if (select.startsWith('count(*)')) return new Response(JSON.stringify([{ total: '62006' }]))
      if (select.startsWith('latitude')) {
        return new Response(
          JSON.stringify([{ latitude: '29.95', longitude: '-90.07', total: '1', address: '' }])
        )
      }
      if (select.startsWith('district')) {
        return new Response(JSON.stringify([{ district: '8', total: '16685' }]))
      }
      return new Response(JSON.stringify([]))
    })
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    const wrapper = mount(App, { attachTo: document.body })
    await flushPromises()
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain('By District')
    expect(text).toContain('District 8')
    // The map still renders, choropleth-only, with the reason drilling in isn't offered.
    expect(text).toContain('Where Stops Happened')
    expect(text).toContain("aren't recorded reliably enough")

    wrapper.unmount()
  })
})
