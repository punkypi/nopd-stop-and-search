/**
 * Access to the data snapshot that `scripts/bake-data.mjs` writes at build time.
 *
 * Loading this instead of querying Socrata is what lets the page show real
 * numbers on first paint. It is fetched rather than imported so it stays out of
 * the JavaScript bundle and can be re-baked without a rebuild of the app code.
 */

import { withBase } from './basePath'
import type { CalendarDay } from './dates'
import type { DateRange, VehicleGroup } from './trafficViolations'

export interface DataSnapshot {
  /** ISO instant the snapshot was produced. */
  bakedAt: string
  domain: string
  dataset: string
  earliestEventDate: CalendarDay
  latestEventDate: CalendarDay
  /** Traffic stops across the whole dataset, not just the default range. */
  totalViolations: number
  /** The month containing the newest event — what the app opens on. */
  defaultRange: DateRange
  defaultRangeCount: number
  defaultRangeVehicleGroups: VehicleGroup[]
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
