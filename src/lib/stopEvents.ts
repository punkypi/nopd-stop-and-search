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

import { fromSocrataTimestamp, type CalendarDay } from './dates'

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
