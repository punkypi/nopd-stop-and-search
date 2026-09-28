import { describe, expect, it } from 'vitest'

import {
  boundingBox,
  buildStopLocation,
  escapeHtml,
  hasUsableCoordinates,
  markerRadius,
  maxStopCount,
  MAX_MARKER_RADIUS,
  MIN_BOUNDS_SPAN,
  MIN_MARKER_RADIUS,
  popupHtml,
  stopCountLabel,
  totalPlottedStops,
  type StopLocation
} from './stopLocations'

function location(latitude: number, longitude: number, count = 1): StopLocation {
  return { latitude, longitude, count, address: '' }
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
