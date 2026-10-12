/**
 * Whole-record counts of search/citation/arrest/evidence-seized outcomes,
 * broken out by `subjectrace`, plus each race's own breakdown by kind of
 * stop.
 *
 * Baked once from the whole dataset, like `stopTypes` and `yearlyStopCounts`
 * in `snapshot.ts` — not re-queried when the date picker moves. A narrow
 * range could shrink a race's own cell below `MIN_CELL_STOPS` and lose the
 * comparison this panel exists to show; the whole record never will.
 *
 * `actionstaken` is not categorical — see `parseActionStaken` in
 * `stopEvents.ts` — so the four outcomes below are each their own
 * `like '%Key: Value%'` filter, summed server-side in `bake-data.mjs` rather
 * than parsed here. They can overlap on one stop (a citation and a verbal
 * warning both land on the same row), so their shares do not sum to 100%.
 */

export interface RaceOutcomeCounts {
  race: string
  stops: number
  searched: number
  cited: number
  arrested: number
  seized: number
}

export interface RaceStopTypeCount {
  race: string
  /** The kind of stop as the record names it, e.g. `TRAFFIC VIOLATION`. */
  description: string
  count: number
}

export interface OutcomeDescriptor {
  key: 'searched' | 'cited' | 'arrested' | 'seized'
  numerator: keyof Omit<RaceOutcomeCounts, 'race'>
  denominator: keyof Omit<RaceOutcomeCounts, 'race'>
  label: string
}

/**
 * `seized` is denominated on `searched`, not `stops`. It answers "of the
 * searches that happened, how many turned up evidence" — a question a stop
 * with no search can't speak to. Every other outcome here is a share of
 * every stop in the row. Get this backwards (`seized / stops`) and it still
 * compiles, still looks like a plausible percentage, and isn't a hit rate
 * any more.
 */
export const OUTCOMES: readonly OutcomeDescriptor[] = [
  { key: 'searched', numerator: 'searched', denominator: 'stops', label: 'Search occurred' },
  { key: 'cited', numerator: 'cited', denominator: 'stops', label: 'Citation issued' },
  { key: 'arrested', numerator: 'arrested', denominator: 'stops', label: 'Physical arrest' },
  {
    key: 'seized',
    numerator: 'seized',
    denominator: 'searched',
    label: 'Evidence seized, of searches'
  }
]

/**
 * Below this many stops, a rate anywhere near 10-20% is built on too thin a
 * base to show as a precise percentage. Measured live: Native Hawaiian or
 * Other Pacific Islander subjects have 9 searches dataset-wide, under this
 * floor for the evidence-seized rate even though the race's own `stops`
 * total (530) clears it comfortably. The row still shows its raw counts —
 * nothing here hides a cell for being small — only the derived rate is
 * withheld.
 */
export const MIN_CELL_STOPS = 30

/** `null` below `MIN_CELL_STOPS`, so a suppressed cell can never divide into a number. */
export function rate(numerator: number, denominator: number): number | null {
  if (denominator < MIN_CELL_STOPS) return null
  return numerator / denominator
}

/**
 * Socrata omits `subjectrace` from a row entirely when it's blank, rather
 * than returning an empty string — confirmed live, ~15,468 rows dataset-wide.
 * Distinct from NOPD's own explicit `UNKNOWN` value, which is recorded, not
 * missing.
 */
export const NOT_RECORDED_RACE = 'Not recorded'

export function normalizeRace(raw: string | undefined): string {
  const trimmed = (raw ?? '').trim()
  return trimmed === '' ? NOT_RECORDED_RACE : trimmed
}

/**
 * One race's own stops by kind, as a share of that race's own total,
 * busiest first. Backs the composition disclosure a pooled cross-tab needs:
 * the outcome rates above pool every kind of stop together, and a reader
 * can't judge what that pooling might be hiding without seeing what each
 * race's stops are actually made of.
 */
export function stopTypeSharesForRace(
  rows: readonly RaceStopTypeCount[],
  race: string
): { description: string; share: number }[] {
  const matching = rows.filter((row) => row.race === race)
  const total = matching.reduce((sum, row) => sum + row.count, 0)
  if (total <= 0) return []
  return matching
    .map((row) => ({ description: row.description, share: row.count / total }))
    .sort((a, b) => b.share - a.share)
}
