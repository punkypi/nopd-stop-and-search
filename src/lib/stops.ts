/**
 * Queries against the NOLA Stop and Search dataset, across every kind of stop.
 *
 * These replace the `TrafficViolation*Request` class hierarchy. Each is a plain
 * async function: the callback-and-subclass structure existed to work around
 * `soda-js`'s event emitter, and promises express it directly.
 *
 * Nothing here narrows by stop type any more. It used to restrict every query to
 * TRAFFIC VIOLATION, which hid 280,374 of the dataset's 720,425 stops — among
 * them the pedestrian stops the phrase "stop and search" most describes. The
 * types are not interchangeable, though: search rates differ about two to one
 * between them, so pooling them compresses the very differences the page exists
 * to show. Stop type is therefore something the page reports rather than
 * something it silently applies.
 */

import { compare, fromSocrataTimestamp, isValid, toSoQLTimestamp, type CalendarDay } from './dates'
import { runQuery, type SocrataOptions } from './socrata'
import { buildStopLocation, NOLA_BOUNDS, type StopLocation } from './stopLocations'

/**
 * Upper bound on distinct make/model pairs returned in one page. The original
 * app sent `$limit=1000000000`; Socrata caps a single response well below that,
 * so the huge number only obscured where the real ceiling was. The whole dataset
 * holds 672 distinct pairs — NOPD writes makes as short codes rather than free
 * text, so the cardinality is far lower than it looks like it should be — which
 * leaves this orders of magnitude of headroom.
 */
const MAX_GROUPS = 50_000

export interface VehicleGroup {
  make: string
  model: string
  count: number
  /** `make model`, or `Not Supplied` when the stop recorded neither. */
  makeAndModel: string
}

export interface DateRange {
  start: CalendarDay
  end: CalendarDay
}

/** True when both ends are real days and the range is not inverted. */
export function isValidRange(range: DateRange): boolean {
  if (!isValid(range.start) || !isValid(range.end)) return false
  return compare(range.start, range.end) <= 0
}

/**
 * SoQL `between` is inclusive on both ends, but only if the upper bound carries
 * an end-of-day time. See `toSoQLTimestamp`.
 */
function rangeWhere(range: DateRange): string {
  const start = toSoQLTimestamp(range.start)
  const end = toSoQLTimestamp(range.end, true)
  return `eventdate between '${start}' and '${end}'`
}

export function buildVehicleGroup(make: string, model: string, count: number): VehicleGroup {
  const trimmedMake = make.trim()
  const trimmedModel = model.trim()
  let makeAndModel: string
  if (!trimmedMake && !trimmedModel) makeAndModel = 'Not Supplied'
  else if (!trimmedMake) makeAndModel = trimmedModel
  else if (!trimmedModel) makeAndModel = trimmedMake
  else makeAndModel = `${trimmedMake} ${trimmedModel}`
  return { make: trimmedMake, model: trimmedModel, count, makeAndModel }
}

export interface VehicleCoverage {
  /** Stops whose row named a make, a model, or both. */
  withVehicle: number
  /** Stops that named neither, which a pedestrian stop never can. */
  withoutVehicle: number
}

/**
 * How much of a range the vehicle breakdown actually accounts for.
 *
 * Only 433,578 of the dataset's 720,425 stops record a vehicle at all, and the
 * grouped query returns the rest as a single unlabelled row rather than omitting
 * them. Without this the table's own totals read as though every stop involved a
 * car, which stopped being true the moment the traffic-only filter came off.
 */
export function vehicleCoverage(groups: readonly VehicleGroup[]): VehicleCoverage {
  let withVehicle = 0
  let withoutVehicle = 0
  for (const group of groups) {
    if (group.make || group.model) withVehicle += group.count
    else withoutVehicle += group.count
  }
  return { withVehicle, withoutVehicle }
}

/** The most recent `eventdate` in the dataset, or null when it holds no events. */
export async function fetchLatestEventDate(
  options: SocrataOptions = {}
): Promise<CalendarDay | null> {
  const rows = await runQuery<{ latest?: string }>({ select: 'max(eventdate) as latest' }, options)
  const latest = rows[0]?.latest
  if (!latest) return null
  return fromSocrataTimestamp(latest)
}

/** How many stops fall inside the range. */
export async function fetchStopCount(
  range: DateRange,
  options: SocrataOptions = {}
): Promise<number> {
  const rows = await runQuery<{ total?: string }>(
    { select: 'count(*) as total', where: rangeWhere(range) },
    options
  )
  return Number(rows[0]?.total ?? 0)
}

/**
 * Stops in the range grouped by vehicle make and model, most frequent first.
 * Aggregation happens server-side, so the response is one row per distinct pair
 * rather than one per stop.
 */
export async function fetchVehicleGroups(
  range: DateRange,
  options: SocrataOptions = {}
): Promise<VehicleGroup[]> {
  const rows = await runQuery<{
    vehiclemake?: string
    vehiclemodel?: string
    total?: string
  }>(
    {
      select: 'vehiclemake, vehiclemodel, count(*) as total',
      where: rangeWhere(range),
      group: 'vehiclemake, vehiclemodel',
      order: 'total desc',
      limit: MAX_GROUPS
    },
    options
  )

  return rows.map((row) =>
    buildVehicleGroup(row.vehiclemake ?? '', row.vehiclemodel ?? '', Number(row.total ?? 0))
  )
}

export interface DistrictCount {
  /** `"1"` through `"8"` as recorded. Unlike `vehiclemake`/`stopdescription`, this field has no nulls. */
  district: string
  count: number
}

export function buildDistrictCount(district: string, count: number): DistrictCount {
  return { district: district.trim(), count }
}

/**
 * Stops in the range grouped by district, busiest first.
 *
 * Unlike location coordinates (reliable only from 2018 on) or vehicle fields
 * (only present for a stop with a car), `district` is populated for every one
 * of the dataset's 720,425 stops, confirmed live, all the way back to 1991 —
 * which is what lets this stand in for a map where coordinates can't.
 */
export async function fetchDistrictCounts(
  range: DateRange,
  options: SocrataOptions = {}
): Promise<DistrictCount[]> {
  const rows = await runQuery<{ district?: string; total?: string }>(
    {
      select: 'district, count(*) as total',
      where: rangeWhere(range),
      group: 'district',
      order: 'total desc'
    },
    options
  )

  return rows.map((row) => buildDistrictCount(row.district ?? '', Number(row.total ?? 0)))
}

export interface StopTypeCount {
  /** The kind of stop as the record names it, e.g. `TRAFFIC VIOLATION`. */
  description: string
  count: number
}

/**
 * Upper bound on distinct coordinates returned for the map.
 *
 * Measured against the live API: all of time holds 37,773 distinct in-bounds
 * coordinates, so this sits above that with room to grow while staying under
 * Socrata's 50,000-row page ceiling. The previous cap of 25,000 was chosen while
 * queries were still narrowed to traffic stops and all-time held ~20,700; left
 * alone, removing that filter would have quietly truncated the map for any range
 * covering the whole dataset. It exists so a dataset that outgrows it degrades
 * into a partial map rather than an unbounded download, and `truncated` makes
 * that visible rather than silent.
 */
const MAX_LOCATIONS = 45_000

export interface StopLocationsResult {
  /** Busiest coordinate first. */
  locations: StopLocation[]
  /** True when `MAX_LOCATIONS` was reached and the quietest coordinates were dropped. */
  truncated: boolean
}

/**
 * Restricts a query to rows that can actually be placed on a map.
 *
 * Applied in SoQL rather than after the fact because the ungeocoded rows are the
 * majority: filtering server-side is the difference between grouping 231,000
 * rows and grouping 720,000, and it keeps the placeholder coordinates off the
 * wire entirely. See `NOLA_BOUNDS`.
 */
function coordinateWhere(): string {
  return (
    `latitude between ${NOLA_BOUNDS.minLatitude} and ${NOLA_BOUNDS.maxLatitude} ` +
    `AND longitude between ${NOLA_BOUNDS.minLongitude} and ${NOLA_BOUNDS.maxLongitude}`
  )
}

/**
 * Located stops in the range, one row per distinct coordinate.
 *
 * Grouped server-side like the vehicle breakdown, so a month comes back as ~170
 * rows instead of ~350. `max(blockaddress)` supplies the popup label: a coordinate
 * occasionally carries two spellings of the same corner, and `max` picks one of
 * them deterministically instead of splitting the point into two circles.
 */
export async function fetchStopLocations(
  range: DateRange,
  options: SocrataOptions = {}
): Promise<StopLocationsResult> {
  const rows = await runQuery<{
    latitude?: string
    longitude?: string
    total?: string
    address?: string
  }>(
    {
      select: 'latitude, longitude, count(*) as total, max(blockaddress) as address',
      where: `${rangeWhere(range)} AND ${coordinateWhere()}`,
      group: 'latitude, longitude',
      order: 'total desc',
      // One past the cap, so hitting it is detectable without a second query.
      limit: MAX_LOCATIONS + 1
    },
    options
  )

  const truncated = rows.length > MAX_LOCATIONS
  const kept = truncated ? rows.slice(0, MAX_LOCATIONS) : rows

  const locations = kept
    .map((row) =>
      buildStopLocation(row.latitude ?? '', row.longitude ?? '', row.total ?? '', row.address)
    )
    .filter((location): location is StopLocation => location !== null)

  return { locations, truncated }
}
