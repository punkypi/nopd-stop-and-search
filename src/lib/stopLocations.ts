/**
 * Stop locations as map points, and the pure geometry that places them.
 *
 * The dataset records `latitude`/`longitude` snapped to an intersection or block
 * face rather than to each individual stop, so many stops share one coordinate —
 * one corner carried 32 stops in a single month. That makes an *aggregated* map
 * the honest rendering: one circle per location, sized by how many stops it
 * holds. Plotting a pin per row would imply per-stop precision the data does not
 * have, and would stack identical pins on top of each other besides.
 *
 * Nothing here touches Leaflet or the DOM. The map component is a thin shell
 * around these functions so the arithmetic that decides what a viewer sees can
 * be unit-tested without a browser.
 */

export interface StopLocation {
  latitude: number
  longitude: number
  /** Stops recorded at this coordinate within the selected range. */
  count: number
  /** Block or intersection label, e.g. `Canal Blvd & Harrison Av`. Empty when unrecorded. */
  address: string
}

/**
 * Coordinates outside this box are discarded.
 *
 * Roughly 63% of traffic-violation rows carry `latitude` and `longitude` of
 * exactly `0` rather than null — a placeholder for "not geocoded", which plots
 * in the Gulf of Guinea if taken at face value. A bounding box around Orleans
 * Parish rejects those along with any other stray coordinate, and does so in the
 * SoQL `where` clause so the rows never cross the network.
 */
export const NOLA_BOUNDS = {
  minLatitude: 28.8,
  maxLatitude: 30.4,
  minLongitude: -90.6,
  maxLongitude: -89.5
} as const

/** Where the map opens when a range holds no located stops at all. */
export const NOLA_CENTER: readonly [number, number] = [29.9511, -90.0715]

export function hasUsableCoordinates(latitude: number, longitude: number): boolean {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false
  return (
    latitude >= NOLA_BOUNDS.minLatitude &&
    latitude <= NOLA_BOUNDS.maxLatitude &&
    longitude >= NOLA_BOUNDS.minLongitude &&
    longitude <= NOLA_BOUNDS.maxLongitude
  )
}

/**
 * Builds a location from raw Socrata strings, or null when the row cannot be
 * placed on a map. Socrata types every JSON value as a string, so coercion
 * happens here rather than being repeated at each call site.
 */
export function buildStopLocation(
  latitude: string | number,
  longitude: string | number,
  count: string | number,
  address: string | undefined
): StopLocation | null {
  const lat = Number(latitude)
  const lon = Number(longitude)
  if (!hasUsableCoordinates(lat, lon)) return null
  const stops = Number(count)
  if (!Number.isFinite(stops) || stops <= 0) return null
  return { latitude: lat, longitude: lon, count: stops, address: (address ?? '').trim() }
}

/** Pixel radii the smallest and largest circles are drawn at. */
export const MIN_MARKER_RADIUS = 4
export const MAX_MARKER_RADIUS = 22

/**
 * Radius in pixels for a circle holding `count` stops, where `maxCount` is the
 * busiest location currently plotted.
 *
 * Scaled on the square root so that the circle's *area* tracks the count.
 * Scaling the radius linearly instead would make a location with ten times the
 * stops look a hundred times heavier, which is the standard way a bubble map
 * misleads.
 *
 * The quietest location is drawn at the minimum radius and the busiest at the
 * maximum, so the size range is spent on the spread that is actually present
 * rather than on the gap between zero and the smallest real value.
 */
export function markerRadius(count: number, maxCount: number): number {
  if (!Number.isFinite(count) || count <= 1) return MIN_MARKER_RADIUS
  if (!Number.isFinite(maxCount) || maxCount <= 1) return MIN_MARKER_RADIUS
  const span = Math.sqrt(maxCount) - 1
  if (span <= 0) return MIN_MARKER_RADIUS
  const position = Math.min((Math.sqrt(count) - 1) / span, 1)
  return MIN_MARKER_RADIUS + position * (MAX_MARKER_RADIUS - MIN_MARKER_RADIUS)
}

export function maxStopCount(locations: readonly StopLocation[]): number {
  return locations.reduce((highest, location) => Math.max(highest, location.count), 0)
}

/** Stops across every plotted location — not the range's total, which includes ungeocoded stops. */
export function totalPlottedStops(locations: readonly StopLocation[]): number {
  return locations.reduce((running, location) => running + location.count, 0)
}

/**
 * Below this share of a range's stops carrying a usable coordinate, the
 * intersection map is not shown at all — see `isLocationCoverageReliable`.
 *
 * The real transition is close to a step function, not a ramp: 2017 sits at
 * 0.6% located (332 of 56,392), 2018 at 98.7% (60,181 of 60,957). A threshold
 * anywhere in that wide gap produces the same practical behavior, so 50% is
 * chosen for being an unambiguous "most of this range" bar rather than for
 * precision the data doesn't need.
 */
export const LOCATION_COVERAGE_THRESHOLD = 0.5

/**
 * Share of `rangeTotal` that `locations` accounts for, or `null` when
 * `rangeTotal` is unknown or zero — there's nothing to take a share of.
 */
export function locatedShare(
  rangeTotal: number | null,
  locations: readonly StopLocation[]
): number | null {
  if (rangeTotal === null || rangeTotal <= 0) return null
  return totalPlottedStops(locations) / rangeTotal
}

/**
 * True once `locatedShare` clears `LOCATION_COVERAGE_THRESHOLD`. This is what
 * decides whether `StopMap` renders at all for the current range — below it,
 * `district` (reliable for the whole dataset, unlike coordinates) carries the
 * "where" question instead. See `DistrictBreakdown.vue`.
 */
export function isLocationCoverageReliable(
  rangeTotal: number | null,
  locations: readonly StopLocation[]
): boolean {
  const share = locatedShare(rangeTotal, locations)
  return share !== null && share >= LOCATION_COVERAGE_THRESHOLD
}

/** Leaflet's `fitBounds` corner form: `[[south, west], [north, east]]`. */
export type BoundsTuple = [[number, number], [number, number]]

/**
 * Smallest box containing every location, or null when there are none.
 *
 * A box is widened to `MIN_BOUNDS_SPAN` when it would otherwise be narrower.
 * A single location, or a cluster on one block, produces a degenerate box that
 * `fitBounds` answers by zooming to Leaflet's maximum — a view of four rooftops
 * with no context for where in the city they sit.
 */
export const MIN_BOUNDS_SPAN = 0.02

export function boundingBox(locations: readonly StopLocation[]): BoundsTuple | null {
  if (locations.length === 0) return null

  let south = Infinity
  let north = -Infinity
  let west = Infinity
  let east = -Infinity

  for (const location of locations) {
    south = Math.min(south, location.latitude)
    north = Math.max(north, location.latitude)
    west = Math.min(west, location.longitude)
    east = Math.max(east, location.longitude)
  }

  const [paddedSouth, paddedNorth] = widen(south, north)
  const [paddedWest, paddedEast] = widen(west, east)
  return [
    [paddedSouth, paddedWest],
    [paddedNorth, paddedEast]
  ]
}

/** Grows an interval around its midpoint until it spans at least `MIN_BOUNDS_SPAN`. */
function widen(low: number, high: number): [number, number] {
  const span = high - low
  if (span >= MIN_BOUNDS_SPAN) return [low, high]
  const midpoint = (low + high) / 2
  const half = MIN_BOUNDS_SPAN / 2
  return [midpoint - half, midpoint + half]
}

/** Human-facing label for a point's popup, e.g. `32 stops`. */
export function stopCountLabel(count: number): string {
  const formatted = new Intl.NumberFormat('en-US').format(count)
  return `${formatted} ${count === 1 ? 'stop' : 'stops'}`
}

/**
 * Escapes text for interpolation into an HTML string.
 *
 * Needed because Leaflet's `bindPopup` takes markup rather than a text node, and
 * the address it renders comes from the dataset rather than from this codebase.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Popup markup for a point: the block or intersection, then the count. */
export function popupHtml(location: StopLocation): string {
  const heading = location.address || 'Location not named'
  return `<strong>${escapeHtml(heading)}</strong><br />${escapeHtml(stopCountLabel(location.count))}`
}
