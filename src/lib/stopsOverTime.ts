/**
 * The whole-record, year-by-year stop counts behind the reporting-volume
 * sparkline next to the date picker.
 *
 * This is deliberately simpler than a real time-series panel: one bar per
 * year, baked once from the whole dataset, never re-queried when the date
 * picker moves. Its only job is to make the record's own reporting history
 * visible at a glance — specifically, the 2010 jump from a handful of stops a
 * year to tens of thousands. That jump isn't nineteen quiet years; it's when
 * NOPD's electronic field-interview system started being populated, and a
 * reader picking a date range should be able to see that before they pick one
 * that lands in the empty stretch.
 */

export interface YearlyStopCount {
  year: number
  count: number
  /**
   * How many of that year's stops have a usable coordinate. A separate, later
   * cliff from `count` itself: 2010 already has 62,006 stops on record but
   * only 1 located one, and coordinates don't become reliable until 2018 —
   * eight years after the stop-count jump. See `locatedSegmentHeight`.
   */
  locatedCount: number
}

/**
 * Fills in every year between `earliestYear` and `latestYear` that `rows`
 * doesn't cover, as `{ count: 0, locatedCount: 0 }`.
 *
 * Needed because Socrata's `GROUP BY` simply omits a year with no rows rather
 * than returning it with a zero — 1992 through 1998 and 2006 are missing
 * entirely from a live query, not present with a count of zero. Left as-is,
 * the chart would silently compress those years out of the timeline instead
 * of showing a continuous stretch of nothing, which is the whole point of
 * drawing it.
 */
export function fillYearGaps(
  rows: readonly YearlyStopCount[],
  earliestYear: number,
  latestYear: number
): YearlyStopCount[] {
  const byYear = new Map(rows.map((row) => [row.year, row]))
  const filled: YearlyStopCount[] = []
  for (let year = earliestYear; year <= latestYear; year++) {
    const row = byYear.get(year)
    filled.push({ year, count: row?.count ?? 0, locatedCount: row?.locatedCount ?? 0 })
  }
  return filled
}

/** Bar height as a 0-100 percentage, and the floor a nonzero year is never drawn below. */
export const MIN_BAR_HEIGHT = 3
export const MAX_BAR_HEIGHT = 100

/**
 * Height for a year holding `count` stops, where `maxCount` is the busiest
 * year in the chart.
 *
 * Scaled on the square root, same reasoning as `markerRadius` in
 * `stopLocations.ts`: a year with a hundred times the stops of another would
 * otherwise look like a hundred times the bar, not ten, and the whole point
 * of this chart is an honest sense of scale.
 *
 * A true zero draws as a true zero — no bar at all — but any year with even
 * one recorded stop is floored at `MIN_BAR_HEIGHT` rather than rounding away
 * to nothing next to a year with tens of thousands. That distinction matters
 * here: a handful of digitized stops in, say, 2008 is a different fact than a
 * year the system recorded literally nothing, and the chart should not draw
 * them the same way.
 */
export function barHeight(count: number, maxCount: number): number {
  if (!Number.isFinite(count) || count <= 0) return 0
  if (!Number.isFinite(maxCount) || maxCount <= 0) return 0
  const span = Math.sqrt(maxCount)
  if (span <= 0) return 0
  const position = Math.min(Math.sqrt(count) / span, 1)
  return Math.max(MIN_BAR_HEIGHT, position * MAX_BAR_HEIGHT)
}

/** The busiest year's count, or 0 when `rows` is empty. */
export function maxYearlyCount(rows: readonly YearlyStopCount[]): number {
  return rows.reduce((highest, row) => Math.max(highest, row.count), 0)
}

/**
 * How much of a bar's own height, in pixels, represents stops that actually
 * have a location — drawn as a brighter cap at the top of the bar rather than
 * stated only in a caption underneath it.
 *
 * This is a plain proportion of `barHeightPx` (the bar's total height, as
 * computed by the caller from `barHeight`), not a second independent scale:
 * a year with half its stops located gets a cap covering half the bar,
 * whatever that bar's own height happens to be. `locatedCount` is clamped to
 * `count` defensively — the two numbers come from the same baked row and
 * should never disagree, but a cap taller than its own bar would be a
 * stranger bug to debug than a clamp here.
 */
export function locatedSegmentHeight(
  barHeightPx: number,
  count: number,
  locatedCount: number
): number {
  if (!Number.isFinite(barHeightPx) || barHeightPx <= 0) return 0
  if (!Number.isFinite(count) || count <= 0) return 0
  if (!Number.isFinite(locatedCount) || locatedCount <= 0) return 0
  const share = Math.min(locatedCount / count, 1)
  return barHeightPx * share
}
