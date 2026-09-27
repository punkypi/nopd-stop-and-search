/**
 * Queries against the NOLA Stop and Search dataset, narrowed to traffic stops.
 *
 * These replace the `TrafficViolation*Request` class hierarchy. Each is a plain
 * async function: the callback-and-subclass structure existed to work around
 * `soda-js`'s event emitter, and promises express it directly.
 */

import { compare, fromSocrataTimestamp, isValid, toSoQLTimestamp, type CalendarDay } from './dates'
import { runQuery, soqlString, type SocrataOptions } from './socrata'

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
