/**
 * NOPD's 8 police district boundaries, and the color scale the choropleth
 * shades them with.
 *
 * The polygons don't change with the selected range, or with real time the
 * way stop data does, so they're baked once at build time
 * (`scripts/bake-data.mjs`, from `data.nola.gov`'s NOPD Districts dataset,
 * resource `e2he-xim8`) into `public/data/nopd-districts.geojson` and never
 * re-queried — the same precedent `src/lib/stopsOverTime.ts` set for the
 * yearly sparkline.
 */

import { withBase } from './basePath'
import type { StopLocation } from './stopLocations'

/** Only `district` is read off the real properties Socrata returns; the rest
 *  of the GeoJSON passes straight through to Leaflet untouched. */
export interface DistrictBoundaryFeature extends GeoJSON.Feature {
  properties: { district: string } & GeoJSON.GeoJsonProperties
}

export interface DistrictBoundaries extends GeoJSON.FeatureCollection {
  features: DistrictBoundaryFeature[]
}

export function districtBoundariesUrl(): string {
  return withBase('data/nopd-districts.geojson')
}

export async function loadDistrictBoundaries(signal?: AbortSignal): Promise<DistrictBoundaries> {
  const response = await fetch(districtBoundariesUrl(), { signal })
  if (!response.ok) {
    throw new Error(`Could not load district boundaries (${response.status})`)
  }
  return (await response.json()) as DistrictBoundaries
}

// The choropleth's low and high swatches. Widened from the original two
// blues (#2185d0/#54c8ff, ~23 points of simple lightness apart) so a real
// gradient reads as one rather than a near-flat tint. Keep these in sync
// with --color-nola-choropleth-low/-high in src/assets/main.css, which the
// legend swatch reads directly.
const LOW_COLOR: readonly [number, number, number] = [18, 58, 92] // #123a5c
const HIGH_COLOR: readonly [number, number, number] = [159, 224, 255] // #9fe0ff

function toHex(channel: number): string {
  return Math.round(channel).toString(16).padStart(2, '0')
}

function lerp(low: number, high: number, position: number): number {
  return low + (high - low) * position
}

/**
 * Fill color for a district holding `count`, scaled against `maxCount` and
 * `minCount`. Linear interpolation, not square-root — district counts span
 * roughly a 2x range even at the extremes (see `DistrictOverview.vue`),
 * nothing like the sparkline's 1000x spread that square-root compression
 * exists to tame.
 *
 * `minCount` defaults to 0, which is what count mode wants — "0 stops" is a
 * real, meaningful floor. Composition mode passes the *observed* minimum
 * share instead: scaling a tightly clustered range like traffic violation's
 * 79.9%-96.1% against 0 wastes most of the gradient on values no district
 * actually has. Measured live, widening the swatch colors alone wasn't
 * enough to fix that case — the map still read as a near-flat tint.
 * Anchoring to the range actually in view stretches it across the full
 * gradient instead.
 */
export function districtFillColor(count: number, maxCount: number, minCount = 0): string {
  const span = maxCount - minCount
  const position =
    !Number.isFinite(span) || span <= 0 ? 0 : Math.min(Math.max((count - minCount) / span, 0), 1)
  const r = lerp(LOW_COLOR[0], HIGH_COLOR[0], position)
  const g = lerp(LOW_COLOR[1], HIGH_COLOR[1], position)
  const b = lerp(LOW_COLOR[2], HIGH_COLOR[2], position)
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Ray-casting point-in-ring test (even-odd rule): counts how many times a
 * ray cast east from the point crosses the ring's edges, odd means inside.
 */
function pointInRing(
  longitude: number,
  latitude: number,
  ring: readonly GeoJSON.Position[]
): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i]![0]!
    const yi = ring[i]![1]!
    const xj = ring[j]![0]!
    const yj = ring[j]![1]!
    const crosses = yi > latitude !== yj > latitude
    if (crosses && longitude < ((xj - xi) * (latitude - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

/** A ring set as GeoJSON orders them: index 0 is the exterior, the rest are holes. */
function pointInPolygonRings(
  longitude: number,
  latitude: number,
  rings: readonly GeoJSON.Position[][]
): boolean {
  if (!pointInRing(longitude, latitude, rings[0]!)) return false
  return !rings.slice(1).some((hole) => pointInRing(longitude, latitude, hole))
}

/**
 * True when a coordinate falls inside a district's mapped shape.
 *
 * Determines `DistrictMap`'s drill-down membership instead of the dataset's
 * own `district` field, which `fetchStopLocations` deliberately doesn't
 * select — see the comment there. A `max()`-based aggregation of that field
 * once mis-attributed an entire 8-stop intersection (`N Broad St & Lafitte
 * St`, 7 stops recorded as District 1, 1 as District 7) to the busier-
 * looking wrong district. Testing the actual coordinate against the actual
 * polygon can't make that mistake.
 */
export function featureContainsPoint(
  feature: DistrictBoundaryFeature,
  longitude: number,
  latitude: number
): boolean {
  const { geometry } = feature
  if (geometry.type === 'Polygon') {
    return pointInPolygonRings(longitude, latitude, geometry.coordinates)
  }
  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.some((polygon) => pointInPolygonRings(longitude, latitude, polygon))
  }
  return false
}

/** Locations whose coordinate geometrically falls inside `feature`. */
export function locationsInDistrict(
  locations: readonly StopLocation[],
  feature: DistrictBoundaryFeature
): StopLocation[] {
  return locations.filter((location) =>
    featureContainsPoint(feature, location.longitude, location.latitude)
  )
}
