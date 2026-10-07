/**
 * Access to the data snapshot that `scripts/bake-data.mjs` writes at build time.
 *
 * Loading this instead of querying Socrata is what lets the page show real
 * numbers on first paint. It is fetched rather than imported so it stays out of
 * the JavaScript bundle and can be re-baked without a rebuild of the app code.
 */

import { withBase } from './basePath'
import type { CalendarDay } from './dates'
import type { StopLocation } from './stopLocations'
import type { DateRange, DistrictCount, StopTypeCount, VehicleGroup } from './stops'
import type { YearlyStopCount } from './stopsOverTime'

export interface DataSnapshot {
  /** ISO instant the snapshot was produced. */
  bakedAt: string
  domain: string
  dataset: string
  earliestEventDate: CalendarDay
  latestEventDate: CalendarDay
  /** Stops of every kind across the whole dataset, not just the default range. */
  totalStops: number
  /**
   * How the whole dataset divides by kind of stop, most frequent first.
   *
   * Baked because the About panel has to name the composition rather than assert
   * it in prose: the previous copy hard-coded a date range and had drifted three
   * decades out of date. Pooling these types is also what the panel warns
   * against, so the figures behind that warning cannot be hand-written.
   */
  stopTypes: StopTypeCount[]
  /**
   * The latest 12 months the record has, anchored to `latestEventDate` — not
   * the wall clock, which may be long past it by the time this is read. This
   * is what the app opens on.
   */
  defaultRange: DateRange
  defaultRangeCount: number
  defaultRangeVehicleGroups: VehicleGroup[]
  /** Distinct coordinates in the default range, busiest first. */
  defaultRangeStopLocations: StopLocation[]
  /** True when the default range hit the location cap. Not expected at 12 months' width. */
  defaultRangeLocationsTruncated: boolean
  /**
   * Stops in the default range by district, busiest first — the primary
   * spatial view. Unlike `defaultRangeStopLocations`, this needs no coverage
   * disclosure: `district` is populated for every stop in the dataset.
   */
  defaultRangeDistrictCounts: DistrictCount[]
  /**
   * Stops per year, whole record, sparse — a year with zero stops is simply
   * absent rather than present with a zero. Backs the reporting-volume
   * sparkline; see `fillYearGaps` in `src/lib/stopsOverTime.ts` for why the
   * gaps are filled there and not here.
   */
  yearlyStopCounts: YearlyStopCount[]
}

/**
 * Resolved against the app's base URL so it works both from the repository
 * subpath on GitHub Pages and from the root in development.
 */
export function snapshotUrl(): string {
  return withBase('data/snapshot.json')
}

export async function loadSnapshot(signal?: AbortSignal): Promise<DataSnapshot> {
  const response = await fetch(snapshotUrl(), { signal })
  if (!response.ok) {
    throw new Error(`Could not load the baked snapshot (${response.status})`)
  }
  return (await response.json()) as DataSnapshot
}

/** True when two ranges name the same days, so baked data can be reused. */
export function isSameRange(a: DateRange, b: DateRange): boolean {
  return (
    a.start.year === b.start.year &&
    a.start.month === b.start.month &&
    a.start.day === b.start.day &&
    a.end.year === b.end.year &&
    a.end.month === b.end.month &&
    a.end.day === b.end.day
  )
}
