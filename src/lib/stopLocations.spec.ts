import { describe, expect, it } from 'vitest'

import {
  boundingBox,
  buildStopLocation,
  consistentLocations,
  escapeHtml,
  hasUsableCoordinates,
  inconsistentAddressLocations,
  isLegibleDensity,
  isLocationCoverageReliable,
  locatedShare,
  markerRadius,
  maxStopCount,
  MAX_ADDRESS_COORDINATE_SPREAD_METERS,
  MAX_LEGIBLE_LOCATIONS,
  MAX_MARKER_RADIUS,
  MIN_BOUNDS_SPAN,
  MIN_MARKER_RADIUS,
  popupHtml,
  stopCountLabel,
  totalPlottedStops,
  type StopLocation
} from './stopLocations'

function location(latitude: number, longitude: number, count = 1, address = ''): StopLocation {
  return { latitude, longitude, count, address }
}

describe('hasUsableCoordinates', () => {
  it('accepts a coordinate in New Orleans', () => {
    expect(hasUsableCoordinates(29.9511, -90.0715)).toBe(true)
  })

  it('rejects the 0,0 placeholder the dataset uses for ungeocoded stops', () => {
    // 63% of traffic-violation rows carry exactly this, and plotting it would
    // drop a pile of markers in the Gulf of Guinea.
    expect(hasUsableCoordinates(0, 0)).toBe(false)
  })

  it('rejects coordinates outside the parish and non-finite values', () => {
    expect(hasUsableCoordinates(40.7128, -74.006)).toBe(false)
    expect(hasUsableCoordinates(29.95, 0)).toBe(false)
    expect(hasUsableCoordinates(Number.NaN, -90.07)).toBe(false)
    expect(hasUsableCoordinates(29.95, Number.POSITIVE_INFINITY)).toBe(false)
  })
})

describe('buildStopLocation', () => {
  it('coerces the strings Socrata returns', () => {
    expect(buildStopLocation('29.95', '-90.07', '12', ' Canal St & N Rampart St ')).toEqual({
      latitude: 29.95,
      longitude: -90.07,
      count: 12,
      address: 'Canal St & N Rampart St'
    })
  })

  it('defaults a missing address to empty rather than undefined', () => {
    expect(buildStopLocation('29.95', '-90.07', '1', undefined)?.address).toBe('')
  })

  it('returns null for rows that cannot be placed or counted', () => {
    expect(buildStopLocation('0', '0', '5', '')).toBeNull()
    expect(buildStopLocation('29.95', '-90.07', '0', '')).toBeNull()
    expect(buildStopLocation('29.95', '-90.07', 'not a number', '')).toBeNull()
    expect(buildStopLocation('', '', '5', '')).toBeNull()
  })
})

describe('markerRadius', () => {
  it('draws the quietest location at the minimum and the busiest at the maximum', () => {
    expect(markerRadius(1, 100)).toBe(MIN_MARKER_RADIUS)
    expect(markerRadius(100, 100)).toBe(MAX_MARKER_RADIUS)
  })

  it('scales on the square root so circle area tracks the count', () => {
    // Area is pi*r^2, so a count four times larger should add twice as much
    // radius above the minimum. Linear scaling here is the classic bubble-map
    // exaggeration and this is the assertion that catches it.
    const maxCount = 100
    const atFour = markerRadius(4, maxCount) - MIN_MARKER_RADIUS
    const atSixteen = markerRadius(16, maxCount) - MIN_MARKER_RADIUS
    expect(atSixteen / atFour).toBeCloseTo(3, 5)
  })

  it('grows monotonically with the count', () => {
    const radii = [1, 2, 5, 10, 25, 50, 100].map((count) => markerRadius(count, 100))
    const sorted = [...radii].sort((a, b) => a - b)
    expect(radii).toEqual(sorted)
  })

  it('falls back to the minimum when every location holds one stop', () => {
    // With no spread to show, sizing by count would be noise. Guards against a
    // divide-by-zero that would otherwise produce NaN radii.
    expect(markerRadius(1, 1)).toBe(MIN_MARKER_RADIUS)
    expect(markerRadius(1, 0)).toBe(MIN_MARKER_RADIUS)
  })

  it('never exceeds the maximum, even for a count above maxCount', () => {
    expect(markerRadius(500, 100)).toBe(MAX_MARKER_RADIUS)
  })
})

describe('maxStopCount and totalPlottedStops', () => {
  it('summarise a set of locations', () => {
    const locations = [location(29.95, -90.07, 3), location(29.96, -90.08, 11)]
    expect(maxStopCount(locations)).toBe(11)
    expect(totalPlottedStops(locations)).toBe(14)
  })

  it('handle an empty set', () => {
    expect(maxStopCount([])).toBe(0)
    expect(totalPlottedStops([])).toBe(0)
  })
})

describe('locatedShare and isLocationCoverageReliable', () => {
  // Measured live against the real dataset — the actual numbers behind this
  // feature, not invented ones. The transition is a near step function:
  // 2017 at 0.6% located, 2018 at 98.7%.
  const year2017 = [location(29.95, -90.07, 332)] // of 56,392 stops total
  const year2018 = [location(29.95, -90.07, 60181)] // of 60,957 stops total
  const defaultRange = [location(29.95, -90.07, 28828)] // of 30,392 stops total

  it('computes the real share for a year before coordinates were reliable', () => {
    expect(locatedShare(56392, year2017)).toBeCloseTo(0.0059, 3)
    expect(isLocationCoverageReliable(56392, year2017)).toBe(false)
  })

  it('computes the real share for a year after coordinates became reliable', () => {
    expect(locatedShare(60957, year2018)).toBeCloseTo(0.987, 3)
    expect(isLocationCoverageReliable(60957, year2018)).toBe(true)
  })

  it('is reliable for the current default range', () => {
    expect(locatedShare(30392, defaultRange)).toBeCloseTo(0.949, 3)
    expect(isLocationCoverageReliable(30392, defaultRange)).toBe(true)
  })

  it('treats an unknown or zero range total as nothing to take a share of', () => {
    expect(locatedShare(null, year2018)).toBeNull()
    expect(locatedShare(0, year2018)).toBeNull()
    expect(isLocationCoverageReliable(null, year2018)).toBe(false)
    expect(isLocationCoverageReliable(0, year2018)).toBe(false)
  })

  it('treats no located stops at all as unreliable, not an error', () => {
    expect(locatedShare(1000, [])).toBe(0)
    expect(isLocationCoverageReliable(1000, [])).toBe(false)
  })
})

describe('isLegibleDensity', () => {
  it('passes at and below the cap, fails above it', () => {
    const atCap = Array.from({ length: MAX_LEGIBLE_LOCATIONS }, (_, i) => location(29.9 + i, -90.1))
    const overCap = [...atCap, location(30.5, -89.6)]
    expect(isLegibleDensity(atCap)).toBe(true)
    expect(isLegibleDensity(overCap)).toBe(false)
  })

  it('passes an empty set', () => {
    expect(isLegibleDensity([])).toBe(true)
  })
})

describe('consistentLocations and inconsistentAddressLocations', () => {
  it('uses a 200m spread as the isolation threshold', () => {
    expect(MAX_ADDRESS_COORDINATE_SPREAD_METERS).toBe(200)
  })

  // Real measured example: "053XX Canal Blvd" has 9 coordinates clustered
  // within ~165m of each other (snapping variance within the real block) and
  // one at (29.390, -90.186) — in Lafourche Parish, nowhere near Canal
  // Blvd — about 65km from the rest. Only the outlier is isolated from every
  // one of its own address-siblings; the cluster stays, because each of
  // those locations has at least one sibling within the threshold.
  const canalBlvdNear1 = location(29.98648932, -90.11049034, 5, '053XX Canal Blvd')
  const canalBlvdNear2 = location(29.98648391, -90.11048482, 4, '053XX Canal Blvd')
  const canalBlvdNear3 = location(29.98774731, -90.1095948, 1, '053XX Canal Blvd')
  const canalBlvdOutlier = location(29.39040158, -90.18598483, 2, '053XX Canal Blvd')

  it('keeps every location in a tight real cluster', () => {
    const cluster = [canalBlvdNear1, canalBlvdNear2, canalBlvdNear3]
    expect(consistentLocations(cluster)).toEqual(cluster)
    expect(inconsistentAddressLocations(cluster)).toEqual([])
  })

  it('excludes only the one real location isolated from all its own siblings', () => {
    const all = [canalBlvdNear1, canalBlvdNear2, canalBlvdNear3, canalBlvdOutlier]
    expect(consistentLocations(all)).toEqual([canalBlvdNear1, canalBlvdNear2, canalBlvdNear3])
    expect(inconsistentAddressLocations(all)).toEqual([canalBlvdOutlier])
  })

  it('keeps a same-block pair under the threshold', () => {
    // ~80m apart, well inside a single New Orleans block.
    const a = location(29.95, -90.07, 3, 'Canal St & N Rampart St')
    const b = location(29.9507, -90.07, 2, 'Canal St & N Rampart St')
    expect(consistentLocations([a, b])).toEqual([a, b])
  })

  it('flags a pair comfortably past the threshold', () => {
    const a = location(29.95, -90.07, 1, 'Test St & Example Ave')
    // ~250m north of `a`, safely past MAX_ADDRESS_COORDINATE_SPREAD_METERS.
    const b = location(29.95 + 250 / 111_320, -90.07, 1, 'Test St & Example Ave')
    expect(inconsistentAddressLocations([a, b])).toEqual([a, b])
  })

  it('never flags a location whose address appears only once', () => {
    const lone = location(29.95, -90.07, 1, 'Only Here St & Nowhere Else Ave')
    expect(consistentLocations([lone])).toEqual([lone])
  })

  it('never flags a location with no recorded address, and never cross-checks it against anything', () => {
    const noAddress1 = location(29.95, -90.07, 1, '')
    const noAddress2 = location(40.0, -100.0, 1, '') // wildly far, but address is blank
    expect(consistentLocations([noAddress1, noAddress2])).toEqual([noAddress1, noAddress2])
  })
})

describe('boundingBox', () => {
  it('returns null when there is nothing to frame', () => {
    expect(boundingBox([])).toBeNull()
  })

  it('frames the corners of a spread-out set', () => {
    expect(
      boundingBox([location(29.9, -90.1), location(30.0, -90.0), location(29.95, -90.05)])
    ).toEqual([
      [29.9, -90.1],
      [30.0, -90.0]
    ])
  })

  it('widens a single point so the view keeps some context', () => {
    // fitBounds on a zero-width box zooms to Leaflet's maximum, which shows a
    // few rooftops and no indication of where in the city they are.
    const bounds = boundingBox([location(29.95, -90.07)])
    expect(bounds).not.toBeNull()
    const [[south, west], [north, east]] = bounds!
    expect(north - south).toBeCloseTo(MIN_BOUNDS_SPAN, 10)
    expect(east - west).toBeCloseTo(MIN_BOUNDS_SPAN, 10)
    // Still centred on the point it was given.
    expect((south + north) / 2).toBeCloseTo(29.95, 10)
    expect((west + east) / 2).toBeCloseTo(-90.07, 10)
  })

  it('widens only the axis that is too narrow', () => {
    const bounds = boundingBox([location(29.9, -90.07), location(30.0, -90.07)])
    const [[south, west], [north, east]] = bounds!
    expect(south).toBe(29.9)
    expect(north).toBe(30.0)
    expect(east - west).toBeCloseTo(MIN_BOUNDS_SPAN, 10)
  })

  it('excludes a real but distant outlier from the default framing', () => {
    // Measured live: downtown core stops vastly outweigh a real I-10 ramp
    // near the Twin Span, which still gets a circle but shouldn't set the zoom.
    const core = [
      location(29.95, -90.07, 9000),
      location(29.97, -90.06, 5000),
      location(29.93, -90.08, 4000)
    ]
    const outlier = location(30.3, -89.6, 357) // near the Twin Span, miles from downtown
    const trimmed = boundingBox(core)!
    const withOutlier = boundingBox([...core, outlier])!
    expect(withOutlier).toEqual(trimmed)
  })

  it('includes an outlier once it is large enough to break the coverage share', () => {
    const core = [location(29.95, -90.07, 100)]
    const bigOutlier = location(30.3, -89.6, 900) // alone is over 1 - CORE_COVERAGE_SHARE of the total
    const [, [, east]] = boundingBox([...core, bigOutlier])!
    expect(east).toBeCloseTo(-89.6, 5)
  })
})

describe('stopCountLabel', () => {
  it('agrees with itself about number', () => {
    expect(stopCountLabel(1)).toBe('1 stop')
    expect(stopCountLabel(32)).toBe('32 stops')
  })

  it('groups thousands', () => {
    expect(stopCountLabel(1234)).toBe('1,234 stops')
  })
})

describe('popupHtml', () => {
  it('names the block and the count', () => {
    expect(popupHtml({ latitude: 29.95, longitude: -90.07, count: 32, address: 'Canal St' })).toBe(
      '<strong>Canal St</strong><br />32 stops'
    )
  })

  it('says so when the dataset recorded no address', () => {
    expect(popupHtml({ latitude: 29.95, longitude: -90.07, count: 1, address: '' })).toContain(
      'Location not named'
    )
  })

  it('escapes an address rather than trusting it as markup', () => {
    // Leaflet's bindPopup takes an HTML string and the address is third-party
    // data, so this is the boundary where it has to be neutralised.
    const html = popupHtml({
      latitude: 29.95,
      longitude: -90.07,
      count: 2,
      address: '<img src=x onerror="alert(1)"> & Main St'
    })
    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;img')
    expect(html).toContain('&amp; Main St')
  })
})

describe('escapeHtml', () => {
  it('escapes the characters that would break out of an attribute or element', () => {
    expect(escapeHtml('a & b < c > d "e"')).toBe('a &amp; b &lt; c &gt; d &quot;e&quot;')
  })
})
