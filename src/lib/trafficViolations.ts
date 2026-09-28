/**
 * Queries against the NOLA Stop and Search dataset, narrowed to traffic stops.
 *
 * These replace the `TrafficViolation*Request` class hierarchy. Each is a plain
 * async function: the callback-and-subclass structure existed to work around
 * `soda-js`'s event emitter, and promises express it directly.
 */

import { compare, fromSocrataTimestamp, isValid, toSoQLTimestamp, type CalendarDay } from './dates'
import { runQuery, soqlString, type SocrataOptions } from './socrata'
import { buildStopLocation, NOLA_BOUNDS, type StopLocation } from './stopLocations'

/** The `stopdescription` value that marks a traffic stop. */
const TRAFFIC_VIOLATION = 'TRAFFIC VIOLATION'

const BASE_WHERE = `stopdescription = ${soqlString(TRAFFIC_VIOLATION)}`

/**
 * Upper bound on distinct make/model pairs returned in one page. The original
 * app sent `$limit=1000000000`; Socrata caps a single response well below that,
 * so the huge number only obscured where the real ceiling was. 50,000 comfortably
 * exceeds the ~10,000 distinct pairs the dataset actually contains.
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
  return `${BASE_WHERE} AND eventdate between '${start}' and '${end}'`
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

/** The most recent `eventdate` in the dataset, or null when it holds no traffic stops. */
export async function fetchLatestEventDate(
  options: SocrataOptions = {}
): Promise<CalendarDay | null> {
  const rows = await runQuery<{ latest?: string }>(
    { select: 'max(eventdate) as latest', where: BASE_WHERE },
    options
  )
  const latest = rows[0]?.latest
  if (!latest) return null
  return fromSocrataTimestamp(latest)
}

/** How many traffic stops fall inside the range. */
export async function fetchViolationCount(
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
 * Traffic stops in the range grouped by vehicle make and model, most frequent
 * first. Aggregation happens server-side, so the response is one row per
 * distinct pair rather than one per stop.
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

/**
 * Upper bound on distinct coordinates returned for the map. All-time holds
 * ~20,700, and a single year ~5,600, so no range a viewer can pick should reach
 * this. It exists so a dataset that grows or a filter that regresses degrades
 * into a partial map rather than an unbounded download, and `truncated` makes
 * that visible rather than silent.
 */
const MAX_LOCATIONS = 25_000

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
 * majority: filtering server-side is the difference between grouping 165,000
 * rows and grouping 440,000, and it keeps the placeholder coordinates off the
 * wire entirely. See `NOLA_BOUNDS`.
 */
function coordinateWhere(): string {
  return (
    `latitude between ${NOLA_BOUNDS.minLatitude} and ${NOLA_BOUNDS.maxLatitude} ` +
    `AND longitude between ${NOLA_BOUNDS.minLongitude} and ${NOLA_BOUNDS.maxLongitude}`
  )
}

/**
 * Located traffic stops in the range, one row per distinct coordinate.
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
