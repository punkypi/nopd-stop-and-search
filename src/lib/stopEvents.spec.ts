import { describe, expect, it } from 'vitest'

import { calendarDay } from './dates'
import {
  buildStopEvent,
  outcomeLabel,
  parseActionStaken,
  sentenceCase,
  stopEventsHtml,
  yesNoLabel,
  type RawStopEventRow,
  type StopEvent
} from './stopEvents'

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
        actionstaken:
          'Stop Results: Verbal Warning;Search Occurred: No;Stop Results: Summons Issued'
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

describe('sentenceCase', () => {
  it('capitalizes only the first letter of a stored all-caps value', () => {
    expect(sentenceCase('TRAFFIC VIOLATION')).toBe('Traffic violation')
  })

  it('reports a blank value as Not recorded', () => {
    expect(sentenceCase('')).toBe('Not recorded')
  })
})

describe('yesNoLabel', () => {
  it('labels true and false', () => {
    expect(yesNoLabel(true)).toBe('Yes')
    expect(yesNoLabel(false)).toBe('No')
  })

  it('labels null as Not recorded, distinct from No', () => {
    expect(yesNoLabel(null)).toBe('Not recorded')
  })
})

describe('outcomeLabel', () => {
  it('joins every recorded outcome, sentence-cased', () => {
    expect(outcomeLabel(['Verbal Warning', 'Summons Issued'])).toBe(
      'Verbal warning, Summons issued'
    )
  })

  it('reports no recorded outcomes as Not recorded', () => {
    expect(outcomeLabel([])).toBe('Not recorded')
  })
})

describe('stopEventsHtml', () => {
  const EVENT: StopEvent = {
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
  }

  it('renders every field for a real event', () => {
    const html = stopEventsHtml([EVENT], false, 1)
    expect(html).toContain('June 14, 2025, Traffic violation')
    expect(html).toContain('Search: Yes')
    expect(html).toContain('Evidence seized: No')
    expect(html).toContain('Outcome: Citation issued')
    expect(html).toContain('Black, Male, age 34')
    expect(html).toContain('Photo ID: Yes')
    expect(html).toContain("Officer's unit: 3rd District")
  })

  it('discloses truncation against the real total, not just the shown count', () => {
    const html = stopEventsHtml([EVENT], true, 998)
    expect(html).toContain('Showing the 1 most recent of 998 stops recorded here')
  })

  it('says so when a location has no events to show', () => {
    expect(stopEventsHtml([], false, 0)).toContain('No stops on record for this location')
  })

  it('escapes a value rather than trusting it as markup', () => {
    // Defense in depth: every field here comes from the dataset, not from
    // this codebase, the same reasoning popupHtml already applies to address.
    const html = stopEventsHtml(
      [{ ...EVENT, officerAssignment: '<img src=x onerror=alert(1)>' }],
      false,
      1
    )
    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;img')
  })
})
