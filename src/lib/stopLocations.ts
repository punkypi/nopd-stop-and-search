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

/**
 * Past this many distinct locations, circles overlap into a blob with no
 * internal structure — measured at ~2,200 (a quarter) already losing
 * legibility and ~5,000+ (a year) fully merged, against ~700 (a month)
 * staying legible. Checked against whatever subset is about to be drawn as
 * circles, which in `DistrictMap` is one district's locations, not the
 * whole range — a single busy district can fail this even where the
 * city-wide total would have too.
 */
export const MAX_LEGIBLE_LOCATIONS = 1500

export function isLegibleDensity(locations: readonly StopLocation[]): boolean {
  return locations.length <= MAX_LEGIBLE_LOCATIONS
}

/** Meters between two coordinates — an equirectangular approximation, fine
 *  at parish scale, no need for great-circle precision here. */
function metersBetween(a: StopLocation, b: StopLocation): number {
  const metersPerDegreeLat = 111_320
  const metersPerDegreeLon = 111_320 * Math.cos((((a.latitude + b.latitude) / 2) * Math.PI) / 180)
  const dLat = (a.latitude - b.latitude) * metersPerDegreeLat
  const dLon = (a.longitude - b.longitude) * metersPerDegreeLon
  return Math.sqrt(dLat * dLat + dLon * dLon)
}

/**
 * Past this distance from every other coordinate recorded under the same
 * address, a location is isolated rather than just spread within a block —
 * wider than a single New Orleans block (typically 100-150m) plausibly
 * explains. Measured live on the default range: 200m isolates 3.8% of
 * located stops (1,094 of 28,829); all-time, only 1.0% (2,399 of 231,094) —
 * a real example is "053XX Canal Blvd", where 9 of its 10 recorded
 * coordinates cluster within 165m of each other and 1 sits in Lafourche
 * Parish, 65km away. There's no clean step function here the way
 * `LOCATION_COVERAGE_THRESHOLD` has one — this is a judgment call grounded
 * in block length, not a measured cliff.
 */
export const MAX_ADDRESS_COORDINATE_SPREAD_METERS = 200

/**
 * Locations isolated from every other coordinate sharing their address.
 *
 * Flagging *whole addresses* the first time this was tried threw away good
 * data along with bad: "053XX Canal Blvd"'s 9 well-clustered coordinates
 * would all have been excluded over the 1 real outlier among them. Judging
 * each location against its own siblings instead keeps the 9 and drops only
 * the 1 that actually disagrees with the rest.
 */
function computeIsolatedLocations(locations: readonly StopLocation[]): Set<StopLocation> {
  const byAddress = new Map<string, StopLocation[]>()
  for (const location of locations) {
    if (!location.address) continue
    const group = byAddress.get(location.address)
    if (group) group.push(location)
    else byAddress.set(location.address, [location])
  }

  const isolated = new Set<StopLocation>()
  for (const group of byAddress.values()) {
    if (group.length <= 1) continue
    for (const candidate of group) {
      const hasNearbySibling = group.some(
        (sibling) =>
          sibling !== candidate &&
          metersBetween(candidate, sibling) < MAX_ADDRESS_COORDINATE_SPREAD_METERS
      )
      if (!hasNearbySibling) isolated.add(candidate)
    }
  }
  return isolated
}

/**
 * `locations`, minus any isolated from every other coordinate recorded
 * under the same address — see `computeIsolatedLocations`. A location with
 * no recorded address, or whose address appears nowhere else in the batch,
 * always passes through unchanged.
 */
export function consistentLocations(locations: readonly StopLocation[]): StopLocation[] {
  const isolated = computeIsolatedLocations(locations)
  return locations.filter((location) => !isolated.has(location))
}

/** The complement of `consistentLocations` — what it excluded. */
export function inconsistentAddressLocations(locations: readonly StopLocation[]): StopLocation[] {
  const isolated = computeIsolatedLocations(locations)
  return locations.filter((location) => isolated.has(location))
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

/**
 * Share of total plotted stops the box must still contain after outliers are
 * dropped. A handful of real, far-flung locations — confirmed via `bin/soql`,
 * e.g. an I-10 ramp near the Twin Span with 357 stops of its own — otherwise
 * drag the box out far enough that the dense core, where nearly everything
 * happens, gets squeezed into a sliver. Those locations still get a circle;
 * they just don't get to decide the initial framing.
 */
export const CORE_COVERAGE_SHARE = 0.97

/** The locations nearest the stop-weighted centroid that still account for
 *  `CORE_COVERAGE_SHARE` of the total, used to frame the view without
 *  letting a distant outlier drag it. */
function coreLocations(locations: readonly StopLocation[]): readonly StopLocation[] {
  const total = totalPlottedStops(locations)
  if (total <= 0) return locations

  let weightedLat = 0
  let weightedLon = 0
  for (const location of locations) {
    weightedLat += location.latitude * location.count
    weightedLon += location.longitude * location.count
  }
  const centroidLat = weightedLat / total
  const centroidLon = weightedLon / total

  const sorted = [...locations].sort(
    (a, b) =>
      squaredDistance(a, centroidLat, centroidLon) - squaredDistance(b, centroidLat, centroidLon)
  )

  const threshold = total * CORE_COVERAGE_SHARE
  const core: StopLocation[] = []
  let running = 0
  for (const location of sorted) {
    core.push(location)
    running += location.count
    if (running >= threshold) break
  }
  return core
}

function squaredDistance(location: StopLocation, latitude: number, longitude: number): number {
  const dLat = location.latitude - latitude
  const dLon = location.longitude - longitude
  return dLat * dLat + dLon * dLon
}

export function boundingBox(locations: readonly StopLocation[]): BoundsTuple | null {
  if (locations.length === 0) return null

  let south = Infinity
  let north = -Infinity
  let west = Infinity
  let east = -Infinity

  for (const location of coreLocations(locations)) {
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
