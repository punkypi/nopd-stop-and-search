/**
 * A single recorded stop at one location, for the drill-down's per-event
 * detail: what actually happened there, not just how many times.
 *
 * Every other query in this codebase aggregates server-side and never
 * fetches individual rows — `fetchStopLocations`'s own comment explains why
 * for counting. This is a different case: a viewer clicked one exact
 * coordinate and asked what happened there, so the rows themselves are the
 * answer, not an input to a count. The fetch (`fetchStopEvents` in
 * `./stops.ts`) stays scoped to that one coordinate and the current date
 * range, never more.
 */

import { fromSocrataTimestamp, toDisplayString, type CalendarDay } from './dates'
import { escapeHtml } from './stopLocations'

export interface StopEvent {
  eventDate: CalendarDay | null
  stopType: string
  subjectRace: string
  subjectGender: string
  /** Exactly as recorded, including implausible values (a cluster of
   *  stops carry `0` or 120+, almost certainly data-entry placeholders) —
   *  not bucketed or filtered. This project reports the record as kept,
   *  not a cleaned-up version of it. */
  subjectAge: number | null
  hasPhotoId: string
  /** The officer's assigned unit, e.g. `3rd District`, `Traffic` — unit
   *  level, not per-officer. See CLAUDE.md. */
  officerAssignment: string
  /** Every value recorded under `actionstaken`'s `Stop Results` key, not
   *  just the first — checked live, a stop can carry more than one (a
   *  verbal warning and a summons issued on the same stop, for instance).
   *  Empty when the key is absent. */
  stopResults: string[]
  /** From `actionstaken`'s `Search Occurred` key. Null when absent. */
  searchOccurred: boolean | null
  /** From `actionstaken`'s `Evidence Seized` key. Null when absent. */
  evidenceSeized: boolean | null
}

/**
 * Splits `actionstaken`'s semicolon-delimited `Key: Value` bag into a map
 * of key to every value recorded under it, so a repeating key (`Legal
 * Basises` can appear more than once on a single stop) keeps all of them
 * instead of just the last. Every other place this field is read treats it
 * as a `like` filter for counting; this is the first place that parses the
 * actual value out of it.
 */
export function parseActionStaken(raw: string | undefined): Map<string, string[]> {
  const parsed = new Map<string, string[]>()
  if (!raw) return parsed
  for (const segment of raw.split(';')) {
    const colonIndex = segment.indexOf(':')
    if (colonIndex === -1) continue
    const key = segment.slice(0, colonIndex).trim()
    const value = segment.slice(colonIndex + 1).trim()
    if (!key || !value) continue
    const existing = parsed.get(key)
    if (existing) existing.push(value)
    else parsed.set(key, [value])
  }
  return parsed
}

function firstValue(parsed: Map<string, string[]>, key: string): string | null {
  return parsed.get(key)?.[0] ?? null
}

function yesNoToBoolean(value: string | null): boolean | null {
  if (value === 'Yes') return true
  if (value === 'No') return false
  return null
}

/** Raw Socrata strings for one row of the `fetchStopEvents` query. */
export interface RawStopEventRow {
  eventdate?: string
  stopdescription?: string
  subjectrace?: string
  subjectgender?: string
  subjectage?: string
  subjecthasphotoid?: string
  officerassignment?: string
  actionstaken?: string
}

export function buildStopEvent(row: RawStopEventRow): StopEvent {
  const actions = parseActionStaken(row.actionstaken)
  const age = Number(row.subjectage)
  return {
    eventDate: row.eventdate ? fromSocrataTimestamp(row.eventdate) : null,
    stopType: (row.stopdescription ?? '').trim(),
    subjectRace: (row.subjectrace ?? '').trim(),
    subjectGender: (row.subjectgender ?? '').trim(),
    subjectAge: row.subjectage && Number.isFinite(age) ? age : null,
    hasPhotoId: (row.subjecthasphotoid ?? '').trim(),
    officerAssignment: (row.officerassignment ?? '').trim(),
    stopResults: actions.get('Stop Results') ?? [],
    searchOccurred: yesNoToBoolean(firstValue(actions, 'Search Occurred')),
    evidenceSeized: yesNoToBoolean(firstValue(actions, 'Evidence Seized'))
  }
}

// --- Rendering, for the circle's own map popup -----------------------

/** Sentence case, so a stored all-caps value reads as prose instead. */
export function sentenceCase(value: string): string {
  if (!value) return 'Not recorded'
  return value.charAt(0) + value.slice(1).toLowerCase()
}

/** For a `Yes`/`No`-recorded field, or `null` when the stop's own record
 *  carried no value for it at all (not the same as "No"). */
export function yesNoLabel(value: boolean | null): string {
  if (value === true) return 'Yes'
  if (value === false) return 'No'
  return 'Not recorded'
}

/** Joins every recorded outcome. A stop can carry more than one Stop
 *  Results value (see `buildStopEvent`'s comment); showing only the first
 *  would quietly drop the rest. */
export function outcomeLabel(results: readonly string[]): string {
  if (results.length === 0) return 'Not recorded'
  return results.map(sentenceCase).join(', ')
}

function eventHtml(event: StopEvent): string {
  const date = event.eventDate ? toDisplayString(event.eventDate) : 'Date not recorded'
  const age = event.subjectAge === null ? 'not recorded' : String(event.subjectAge)
  return (
    `<p><strong>${escapeHtml(date)}, ${escapeHtml(sentenceCase(event.stopType))}</strong></p>` +
    `<p>Search: ${escapeHtml(yesNoLabel(event.searchOccurred))} &middot; ` +
    `Evidence seized: ${escapeHtml(yesNoLabel(event.evidenceSeized))}</p>` +
    `<p>Outcome: ${escapeHtml(outcomeLabel(event.stopResults))}</p>` +
    `<p>${escapeHtml(sentenceCase(event.subjectRace))}, ${escapeHtml(sentenceCase(event.subjectGender))}, ` +
    `age ${escapeHtml(age)}</p>` +
    `<p>Photo ID: ${escapeHtml(event.hasPhotoId || 'Not recorded')} &middot; ` +
    `Officer's unit: ${escapeHtml(event.officerAssignment || 'Not recorded')}</p>`
  )
}

/**
 * Every event at one location, rendered for the circle's own Leaflet
 * popup — the detail lives where the location and count already do,
 * rather than in a separate panel.
 */
export function stopEventsHtml(
  events: readonly StopEvent[],
  truncated: boolean,
  totalCount: number
): string {
  if (events.length === 0) return '<p>No stops on record for this location.</p>'
  const cards = events.map(eventHtml).join('<hr />')
  const truncationNote = truncated
    ? `<p>Showing the ${events.length} most recent of ${totalCount} stops recorded here.</p>`
    : ''
  return `${cards}${truncationNote}`
}
