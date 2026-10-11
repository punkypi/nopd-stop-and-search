import { describe, expect, it } from 'vitest'

import { calendarDay } from './dates'
import { buildStopEvent, parseActionStaken, type RawStopEventRow } from './stopEvents'

describe('parseActionStaken', () => {
  it('splits a real verbal-warning bag into single-valued keys', () => {
    const parsed = parseActionStaken(
      'Stop Results: Verbal Warning;Subject Type: Driver;Search Occurred: No;' +
        'Evidence Seized: No;Consent To Search: No;Exit Vehicle: No'
    )
    expect(parsed.get('Stop Results')).toEqual(['Verbal Warning'])
    expect(parsed.get('Search Occurred')).toEqual(['No'])
    expect(parsed.get('Evidence Seized')).toEqual(['No'])
  })

  it('keeps every value under a key that repeats, not just the last', () => {
    // Real shape: a stop can carry more than one legal basis for a search.
    const parsed = parseActionStaken(
      'Stop Results: Citation Issued;Search Occurred: Yes;' +
        'Legal Basises: Warrant;Legal Basises: Incident to arrest'
    )
    expect(parsed.get('Legal Basises')).toEqual(['Warrant', 'Incident to arrest'])
  })

  it('returns an empty map for an absent or blank bag', () => {
    expect(parseActionStaken(undefined).size).toBe(0)
    expect(parseActionStaken('').size).toBe(0)
  })

  it('ignores a segment with no colon rather than throwing', () => {
    expect(parseActionStaken('garbage;Stop Results: Citation Issued').get('Stop Results')).toEqual([
      'Citation Issued'
    ])
  })
})

describe('buildStopEvent', () => {
  function row(overrides: Partial<RawStopEventRow> = {}): RawStopEventRow {
    return {
      eventdate: '2025-06-14T10:00:00.000',
      stopdescription: 'TRAFFIC VIOLATION',
      subjectrace: 'BLACK',
      subjectgender: 'MALE',
      subjectage: '34',
      subjecthasphotoid: 'Yes',
      officerassignment: '3rd District',
      actionstaken:
        'Stop Results: Citation Issued;Subject Type: Driver;Search Occurred: Yes;' +
        'Evidence Seized: No;Consent To Search: No',
      ...overrides
    }
  }

  it('shapes a real citation-issued row', () => {
    const event = buildStopEvent(row())
    expect(event).toEqual({
      eventDate: calendarDay(2025, 6, 14),
      stopType: 'TRAFFIC VIOLATION',
      subjectRace: 'BLACK',
      subjectGender: 'MALE',
      subjectAge: 34,
      hasPhotoId: 'Yes',
      officerAssignment: '3rd District',
      stopResults: ['Citation Issued'],
      searchOccurred: true,
      evidenceSeized: false
    })
  })

  it('keeps every recorded outcome when Stop Results repeats on one stop', () => {
    // Checked live against the real API: one stop carried both "Verbal
    // Warning" and "Summons Issued" under the same Stop Results key.
    const event = buildStopEvent(
      row({
        actionstaken: 'Stop Results: Verbal Warning;Search Occurred: No;Stop Results: Summons Issued'
      })
    )
    expect(event.stopResults).toEqual(['Verbal Warning', 'Summons Issued'])
  })

  it('reports an empty stopResults array, not null, when the key is absent', () => {
    const event = buildStopEvent(row({ actionstaken: 'Search Occurred: No' }))
    expect(event.stopResults).toEqual([])
  })

  it('keeps an implausible recorded age rather than dropping or clamping it', () => {
    // Real data: a cluster of stops record subjectage as 0 or 120+, almost
    // certainly a data-entry placeholder -- reported as-is, not filtered.
    expect(buildStopEvent(row({ subjectage: '0' })).subjectAge).toBe(0)
    expect(buildStopEvent(row({ subjectage: '125' })).subjectAge).toBe(125)
  })

  it('reports a missing age as null rather than 0 or NaN', () => {
    expect(buildStopEvent(row({ subjectage: undefined })).subjectAge).toBeNull()
  })

  it('reports null search/evidence fields when actionstaken has no vehicle to exit', () => {
    // Real shape: a stop of someone on foot carries no Exit Vehicle key at
    // all, not a "No" value -- the parser must not invent one.
    const event = buildStopEvent(
      row({
        actionstaken: 'Stop Results: Field Interview Only;Subject Type: Pedestrian'
      })
    )
    expect(event.searchOccurred).toBeNull()
    expect(event.evidenceSeized).toBeNull()
  })

  it('reports a missing event date as null rather than an invalid day', () => {
    expect(buildStopEvent(row({ eventdate: undefined })).eventDate).toBeNull()
  })
})
