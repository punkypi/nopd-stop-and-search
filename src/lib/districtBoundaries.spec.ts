import { afterEach, describe, expect, it, vi } from 'vitest'

import type { StopLocation } from './stopLocations'
import {
  districtFillColor,
  featureContainsPoint,
  loadDistrictBoundaries,
  locationsInDistrict,
  type DistrictBoundaryFeature
} from './districtBoundaries'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('loadDistrictBoundaries', () => {
  it('fetches and parses the baked boundary file', async () => {
    const featureCollection = { type: 'FeatureCollection', features: [] }
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify(featureCollection), { status: 200 }))
    )
    await expect(loadDistrictBoundaries()).resolves.toEqual(featureCollection)
  })

  it('throws when the file is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('not found', { status: 404 }))
    )
    await expect(loadDistrictBoundaries()).rejects.toThrow(/404/)
  })
})

function location(latitude: number, longitude: number): StopLocation {
  return { latitude, longitude, count: 1, address: '' }
}

/** A plain square ring, wound counter-clockwise. */
function squareRing(
  minLon: number,
  minLat: number,
  maxLon: number,
  maxLat: number
): GeoJSON.Position[] {
  return [
    [minLon, minLat],
    [maxLon, minLat],
    [maxLon, maxLat],
    [minLon, maxLat],
    [minLon, minLat]
  ]
}

function squareFeature(
  district: string,
  minLon: number,
  minLat: number,
  maxLon: number,
  maxLat: number
): DistrictBoundaryFeature {
  return {
    type: 'Feature',
    properties: { district },
    geometry: { type: 'Polygon', coordinates: [squareRing(minLon, minLat, maxLon, maxLat)] }
  }
}

describe('featureContainsPoint', () => {
  it('is true for a point well inside a Polygon', () => {
    const square = squareFeature('1', -90.1, 29.9, -90.0, 30.0)
    expect(featureContainsPoint(square, -90.05, 29.95)).toBe(true)
  })

  it('is false for a point well outside a Polygon', () => {
    const square = squareFeature('1', -90.1, 29.9, -90.0, 30.0)
    expect(featureContainsPoint(square, -89.5, 29.95)).toBe(false)
  })

  it('excludes a point that falls inside a hole', () => {
    const withHole: DistrictBoundaryFeature = {
      type: 'Feature',
      properties: { district: '1' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          squareRing(-90.1, 29.9, -90.0, 30.0),
          // A hole punched in the middle of the square above.
          squareRing(-90.07, 29.94, -90.03, 29.96)
        ]
      }
    }
    expect(featureContainsPoint(withHole, -90.05, 29.95)).toBe(false) // in the hole
    expect(featureContainsPoint(withHole, -90.09, 29.91)).toBe(true) // elsewhere in the ring
  })

  it('is true for a point inside either shape of a MultiPolygon', () => {
    const multi: DistrictBoundaryFeature = {
      type: 'Feature',
      properties: { district: '1' },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [squareRing(-90.1, 29.9, -90.0, 30.0)],
          [squareRing(-89.8, 29.9, -89.7, 30.0)]
        ]
      }
    }
    expect(featureContainsPoint(multi, -90.05, 29.95)).toBe(true)
    expect(featureContainsPoint(multi, -89.75, 29.95)).toBe(true)
    expect(featureContainsPoint(multi, -89.9, 29.95)).toBe(false) // the gap between them
  })
})

describe('locationsInDistrict', () => {
  it('keeps only locations whose coordinate falls inside the feature', () => {
    const square = squareFeature('1', -90.1, 29.9, -90.0, 30.0)
    const inside = location(29.95, -90.05)
    const outside = location(29.95, -89.5)
    expect(locationsInDistrict([inside, outside], square)).toEqual([inside])
  })
})

describe('districtFillColor', () => {
  it('draws the quietest district at the low swatch and the busiest at the high one', () => {
    expect(districtFillColor(0, 100)).toBe('#2185d0')
    expect(districtFillColor(100, 100)).toBe('#54c8ff')
  })

  it('grows monotonically with count', () => {
    const colors = [0, 25, 50, 75, 100].map((count) => districtFillColor(count, 100))
    expect(new Set(colors).size).toBe(colors.length)
  })

  it('falls back to the low swatch when every district is empty', () => {
    expect(districtFillColor(0, 0)).toBe('#2185d0')
  })

  it('draws every district at the high swatch when all are tied', () => {
    expect(districtFillColor(50, 50)).toBe('#54c8ff')
  })
})
