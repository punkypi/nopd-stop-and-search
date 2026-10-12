import { afterEach, describe, expect, it, vi } from 'vitest'

import { calendarDay } from './dates'
import {
  buildDistrictCount,
  buildVehicleGroup,
  fetchDistrictCounts,
  fetchDistrictStopTypeCounts,
  fetchLatestEventDate,
  fetchStopCount,
  fetchStopEvents,
  fetchStopLocationTypeCounts,
  fetchStopLocations,
  fetchStopsOverRange,
  fetchVehicleGroups,
  groupByDistrict,
  isValidRange,
  vehicleCoverage
} from './stops'

/** Stubs `fetch`, returning `rows`, and hands back the URL that was requested. */
function stubFetch(rows: unknown) {
  // The parameters are declared even though they go unused, so that
  // `mock.calls` is typed as a non-empty tuple rather than `[]`.
  const fetchMock = vi.fn(
    async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
  )
  vi.stubGlobal('fetch', fetchMock)
  return {
    requestedUrl: () => new URL(String(fetchMock.mock.calls[0]![0])),
    fetchMock
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('isValidRange', () => {
  it('accepts an ordered range and a single day', () => {
    expect(isValidRange({ start: calendarDay(2025, 11, 1), end: calendarDay(2025, 11, 30) })).toBe(
      true
    )
    expect(isValidRange({ start: calendarDay(2025, 11, 9), end: calendarDay(2025, 11, 9) })).toBe(
      true
    )
  })

  it('rejects an inverted range', () => {
    expect(isValidRange({ start: calendarDay(2025, 11, 30), end: calendarDay(2025, 11, 1) })).toBe(
      false
    )
  })

  it('rejects a range with an impossible endpoint', () => {
    expect(isValidRange({ start: calendarDay(2025, 2, 30), end: calendarDay(2025, 11, 1) })).toBe(
      false
    )
  })
})

describe('buildVehicleGroup', () => {
  it('joins make and model', () => {
    expect(buildVehicleGroup('CHEV', 'TAHOE', 12).makeAndModel).toBe('CHEV TAHOE')
  })

  it('falls back to whichever field is present', () => {
    expect(buildVehicleGroup('CHEV', '', 12).makeAndModel).toBe('CHEV')
    expect(buildVehicleGroup('', 'TAHOE', 12).makeAndModel).toBe('TAHOE')
  })

  it('reports an unlabelled vehicle as Not Supplied', () => {
    expect(buildVehicleGroup('', '', 12).makeAndModel).toBe('Not Supplied')
  })

  it('treats whitespace-only fields as absent', () => {
    expect(buildVehicleGroup('   ', '  ', 3).makeAndModel).toBe('Not Supplied')
    expect(buildVehicleGroup(' CHEV ', '', 3).make).toBe('CHEV')
  })
})

describe('fetchLatestEventDate', () => {
  it('parses the max eventdate', async () => {
    stubFetch([{ latest: '2025-11-09T20:10:00.000' }])
    await expect(fetchLatestEventDate()).resolves.toEqual(calendarDay(2025, 11, 9))
  })

  it('returns null when the dataset holds no events', async () => {
    stubFetch([{}])
    await expect(fetchLatestEventDate()).resolves.toBeNull()
  })

  it('returns null for an empty response', async () => {
    stubFetch([])
    await expect(fetchLatestEventDate()).resolves.toBeNull()
  })
})

describe('fetchStopCount', () => {
  const range = { start: calendarDay(2025, 11, 1), end: calendarDay(2025, 11, 9) }

  it('coerces the count to a number', async () => {
    stubFetch([{ total: '4021' }])
    await expect(fetchStopCount(range)).resolves.toBe(4021)
  })

  it('asks Socrata to aggregate rather than counting client-side', async () => {
    const { requestedUrl } = stubFetch([{ total: '1' }])
    await fetchStopCount(range)
    expect(requestedUrl().searchParams.get('$select')).toBe('count(*) as total')
  })

  it('covers the whole final day of the range', async () => {
    const { requestedUrl } = stubFetch([{ total: '1' }])
    await fetchStopCount(range)
    const where = requestedUrl().searchParams.get('$where') ?? ''
    expect(where).toContain("'2025-11-01T00:00:00.000'")
    // Midnight here would silently drop every stop made on Nov 9th.
    expect(where).toContain("'2025-11-09T23:59:59.999'")
  })

  it('counts every kind of stop, not just traffic violations', async () => {
    const { requestedUrl } = stubFetch([{ total: '1' }])
    await fetchStopCount(range)
    // Narrowing here hid 280,374 of the dataset's 720,425 stops, among them the
    // pedestrian stops the dataset is named for. Stop type is reported now rather
    // than silently applied, so no query may reintroduce the filter.
    expect(requestedUrl().searchParams.get('$where')).not.toMatch(/stopdescription/i)
  })

  it('defaults a missing total to zero', async () => {
    stubFetch([])
    await expect(fetchStopCount(range)).resolves.toBe(0)
  })
})

describe('fetchStopsOverRange', () => {
  it('buckets monthly for a range at or beyond the daily threshold, matching the real default range', async () => {
    const range = { start: calendarDay(2024, 11, 11), end: calendarDay(2025, 11, 10) }
    const { requestedUrl } = stubFetch([{ bucket: '2024-11-01T00:00:00.000', total: '1589' }])
    await fetchStopsOverRange(range)
    expect(requestedUrl().searchParams.get('$select')).toBe(
      'date_trunc_ym(eventdate) as bucket, count(*) as total'
    )
  })

  it('buckets daily for a short range', async () => {
    const range = { start: calendarDay(2025, 11, 1), end: calendarDay(2025, 11, 10) }
    const { requestedUrl } = stubFetch([{ bucket: '2025-11-01T00:00:00.000', total: '48' }])
    await fetchStopsOverRange(range)
    expect(requestedUrl().searchParams.get('$select')).toBe(
      'date_trunc_ymd(eventdate) as bucket, count(*) as total'
    )
  })

  it('flags a monthly bucket cut short by the range, matching the real default range', async () => {
    const range = { start: calendarDay(2024, 11, 11), end: calendarDay(2025, 11, 10) }
    stubFetch([
      { bucket: '2024-11-01T00:00:00.000', total: '1589' },
      { bucket: '2024-12-01T00:00:00.000', total: '2174' }
    ])
    const points = await fetchStopsOverRange(range)
    expect(points[0]).toEqual({ bucketStart: '2024-11-01', count: 1589, partial: true })
    expect(points[1]).toEqual({ bucketStart: '2024-12-01', count: 2174, partial: false })
  })

  it('never flags a daily bucket as partial', async () => {
    const range = { start: calendarDay(2025, 11, 1), end: calendarDay(2025, 11, 10) }
    stubFetch([{ bucket: '2025-11-01T00:00:00.000', total: '48' }])
    const points = await fetchStopsOverRange(range)
    expect(points[0]?.partial).toBe(false)
  })

  it('drops a row with no parseable bucket instead of throwing', async () => {
    const range = { start: calendarDay(2025, 11, 1), end: calendarDay(2025, 11, 10) }
    stubFetch([{ total: '1' }])
    await expect(fetchStopsOverRange(range)).resolves.toEqual([])
  })
})

describe('fetchVehicleGroups', () => {
  const range = { start: calendarDay(2025, 11, 1), end: calendarDay(2025, 11, 9) }

  it('groups server-side and orders by frequency', async () => {
    const { requestedUrl } = stubFetch([])
    await fetchVehicleGroups(range)
    const params = requestedUrl().searchParams
    expect(params.get('$group')).toBe('vehiclemake, vehiclemodel')
    expect(params.get('$order')).toBe('total desc')
    expect(params.get('$select')).toBe('vehiclemake, vehiclemodel, count(*) as total')
  })

  it('maps rows into vehicle groups', async () => {
    stubFetch([
      { vehiclemake: 'CHEV', vehiclemodel: 'TAHOE', total: '120' },
      { vehiclemake: 'FORD', vehiclemodel: '', total: '45' }
    ])
    const groups = await fetchVehicleGroups(range)
    expect(groups).toHaveLength(2)
    expect(groups[0]).toMatchObject({ make: 'CHEV', model: 'TAHOE', count: 120 })
    expect(groups[1]?.makeAndModel).toBe('FORD')
  })

  it('handles rows where Socrata omitted both vehicle fields', async () => {
    stubFetch([{ total: '7' }])
    const groups = await fetchVehicleGroups(range)
    expect(groups[0]).toMatchObject({ make: '', model: '', count: 7 })
    expect(groups[0]?.makeAndModel).toBe('Not Supplied')
  })
})

describe('buildDistrictCount', () => {
  it('trims whitespace from the raw district value', () => {
    expect(buildDistrictCount(' 3 ', 10372)).toEqual({ district: '3', count: 10372 })
  })
})

describe('fetchDistrictCounts', () => {
  const range = { start: calendarDay(2025, 11, 1), end: calendarDay(2025, 11, 9) }

  it('groups server-side by district, busiest first', async () => {
    const { requestedUrl } = stubFetch([])
    await fetchDistrictCounts(range)
    const params = requestedUrl().searchParams
    expect(params.get('$select')).toBe('district, count(*) as total')
    expect(params.get('$group')).toBe('district')
    expect(params.get('$order')).toBe('total desc')
  })

  it('maps rows into district counts', async () => {
    // Measured live, current default range: district 3 busiest, district 4 quietest.
    stubFetch([
      { district: '3', total: '10372' },
      { district: '4', total: '1290' }
    ])
    const counts = await fetchDistrictCounts(range)
    expect(counts).toEqual([
      { district: '3', count: 10372 },
      { district: '4', count: 1290 }
    ])
  })
})

describe('fetchDistrictStopTypeCounts', () => {
  const range = { start: calendarDay(2025, 11, 1), end: calendarDay(2025, 11, 9) }

  it('groups server-side by district and stop type, busiest first within each district', async () => {
    const { requestedUrl } = stubFetch([])
    await fetchDistrictStopTypeCounts(range)
    const params = requestedUrl().searchParams
    expect(params.get('$select')).toBe('district, stopdescription, count(*) as total')
    expect(params.get('$group')).toBe('district, stopdescription')
    expect(params.get('$order')).toBe('district, total desc')
  })

  it('maps rows into district/stop-type counts', async () => {
    // Measured live, current default range: District 8's Criminal Violation
    // share (6.38%) is 4.5x-45x every other district's.
    stubFetch([
      { district: '8', stopdescription: 'TRAFFIC VIOLATION', total: '2504' },
      { district: '8', stopdescription: 'CRIMINAL VIOLATION', total: '200' }
    ])
    const counts = await fetchDistrictStopTypeCounts(range)
    expect(counts).toEqual([
      { district: '8', description: 'TRAFFIC VIOLATION', count: 2504 },
      { district: '8', description: 'CRIMINAL VIOLATION', count: 200 }
    ])
  })
})

describe('groupByDistrict', () => {
  it('nests counts by district then stop-type description', () => {
    const grouped = groupByDistrict([
      { district: '8', description: 'TRAFFIC VIOLATION', count: 2504 },
      { district: '8', description: 'CRIMINAL VIOLATION', count: 200 },
      { district: '3', description: 'TRAFFIC VIOLATION', count: 9970 }
    ])
    expect(grouped.get('8')?.get('TRAFFIC VIOLATION')).toBe(2504)
    expect(grouped.get('8')?.get('CRIMINAL VIOLATION')).toBe(200)
    expect(grouped.get('3')?.get('TRAFFIC VIOLATION')).toBe(9970)
    expect(grouped.get('3')?.get('CRIMINAL VIOLATION')).toBeUndefined()
  })

  it('handles an empty set', () => {
    expect(groupByDistrict([]).size).toBe(0)
  })
})

describe('fetchStopLocations', () => {
  const range = { start: calendarDay(2025, 11, 1), end: calendarDay(2025, 11, 9) }

  it('selects the coordinate and address, not district', async () => {
    // district deliberately isn't selected here — see the comment in
    // fetchStopLocations for why. DistrictMap determines a location's
    // district by testing its coordinate against the real boundary
    // polygons instead; see locationsInDistrict in districtBoundaries.ts.
    const { requestedUrl } = stubFetch([])
    await fetchStopLocations(range)
    expect(requestedUrl().searchParams.get('$select')).toBe(
      'latitude, longitude, count(*) as total, max(blockaddress) as address'
    )
  })

  it('excludes a location isolated from every other coordinate sharing its address', async () => {
    stubFetch([
      // Real shape: a tight cluster plus one coordinate far from the rest,
      // all under the identical recorded address.
      {
        latitude: '29.98648932',
        longitude: '-90.11049034',
        total: '5',
        address: '053XX Canal Blvd'
      },
      {
        latitude: '29.98648391',
        longitude: '-90.11048482',
        total: '4',
        address: '053XX Canal Blvd'
      },
      { latitude: '29.3904016', longitude: '-90.18598483', total: '2', address: '053XX Canal Blvd' }
    ])
    const { locations, addressInconsistentCount } = await fetchStopLocations(range)
    expect(locations).toHaveLength(2)
    expect(locations.every((location) => location.address === '053XX Canal Blvd')).toBe(true)
    expect(addressInconsistentCount).toBe(2)
  })

  it('reports no exclusions when every location is self-consistent', async () => {
    stubFetch([
      { latitude: '29.95', longitude: '-90.07', total: '4', address: 'Canal St & N Rampart St' }
    ])
    const { locations, addressInconsistentCount } = await fetchStopLocations(range)
    expect(locations).toHaveLength(1)
    expect(addressInconsistentCount).toBe(0)
  })
})

describe('fetchStopLocationTypeCounts', () => {
  const range = { start: calendarDay(2025, 11, 1), end: calendarDay(2025, 11, 9) }

  it('groups server-side by coordinate and stop type, same bounds as fetchStopLocations', async () => {
    const { requestedUrl } = stubFetch([])
    await fetchStopLocationTypeCounts(range)
    const params = requestedUrl().searchParams
    expect(params.get('$select')).toBe('latitude, longitude, stopdescription, count(*) as total')
    expect(params.get('$group')).toBe('latitude, longitude, stopdescription')
    expect(params.get('$order')).toBe('total desc')
    expect(params.get('$where')).toContain('latitude between')
  })

  it('maps rows into location/stop-type counts', async () => {
    stubFetch([
      {
        latitude: '29.95',
        longitude: '-90.07',
        stopdescription: 'TRAFFIC VIOLATION',
        total: '14'
      },
      {
        latitude: '29.95',
        longitude: '-90.07',
        stopdescription: 'CRIMINAL VIOLATION',
        total: '3'
      }
    ])
    const counts = await fetchStopLocationTypeCounts(range)
    expect(counts).toEqual([
      { latitude: 29.95, longitude: -90.07, description: 'TRAFFIC VIOLATION', count: 14 },
      { latitude: 29.95, longitude: -90.07, description: 'CRIMINAL VIOLATION', count: 3 }
    ])
  })

  it('drops a row at the 0,0 ungeocoded placeholder', async () => {
    stubFetch([
      { latitude: '0', longitude: '0', stopdescription: 'TRAFFIC VIOLATION', total: '9' },
      { latitude: '29.95', longitude: '-90.07', stopdescription: 'TRAFFIC VIOLATION', total: '14' }
    ])
    const counts = await fetchStopLocationTypeCounts(range)
    expect(counts).toHaveLength(1)
    expect(counts[0]?.latitude).toBe(29.95)
  })
})

describe('fetchStopEvents', () => {
  const range = { start: calendarDay(2025, 11, 1), end: calendarDay(2025, 11, 9) }

  it('selects an exact coordinate alongside the range, not every location', async () => {
    const { requestedUrl } = stubFetch([])
    await fetchStopEvents(29.95, -90.07, range)
    const params = requestedUrl().searchParams
    expect(params.get('$select')).toBe(
      'eventdate, stopdescription, subjectrace, subjectgender, subjectage, ' +
        'subjecthasphotoid, officerassignment, actionstaken'
    )
    expect(params.get('$where')).toContain('latitude = 29.95 AND longitude = -90.07')
    expect(params.get('$order')).toBe('eventdate desc')
  })

  it('shapes real rows into stop events, most recent first as SoQL already ordered them', async () => {
    stubFetch([
      {
        eventdate: '2025-11-05T14:00:00.000',
        stopdescription: 'TRAFFIC VIOLATION',
        subjectrace: 'BLACK',
        subjectgender: 'MALE',
        subjectage: '34',
        subjecthasphotoid: 'Yes',
        officerassignment: '3rd District',
        actionstaken: 'Stop Results: Citation Issued;Search Occurred: Yes;Evidence Seized: No'
      },
      {
        eventdate: '2025-11-02T09:00:00.000',
        stopdescription: 'CALL FOR SERVICE',
        subjectrace: 'WHITE',
        subjectgender: 'FEMALE',
        subjectage: '0',
        subjecthasphotoid: 'No',
        officerassignment: 'Traffic',
        actionstaken: 'Stop Results: Verbal Warning;Search Occurred: No;Evidence Seized: No'
      }
    ])
    const { events, truncated } = await fetchStopEvents(29.95, -90.07, range)
    expect(truncated).toBe(false)
    expect(events).toHaveLength(2)
    expect(events[0]).toMatchObject({
      stopType: 'TRAFFIC VIOLATION',
      stopResults: ['Citation Issued']
    })
    // Kept exactly as recorded, including the implausible age -- not filtered.
    expect(events[1]).toMatchObject({ subjectAge: 0, stopResults: ['Verbal Warning'] })
  })

  it('reports truncation past the cap, same pattern as fetchStopLocations', async () => {
    const row = {
      eventdate: '2025-11-05T14:00:00.000',
      stopdescription: 'TRAFFIC VIOLATION',
      subjectrace: 'BLACK',
      subjectgender: 'MALE',
      subjectage: '34',
      subjecthasphotoid: 'Yes',
      officerassignment: '3rd District',
      actionstaken: 'Stop Results: Citation Issued;Search Occurred: Yes;Evidence Seized: No'
    }
    stubFetch(Array.from({ length: 101 }, () => row))
    const { events, truncated } = await fetchStopEvents(29.95, -90.07, range)
    expect(truncated).toBe(true)
    expect(events).toHaveLength(100)
  })
})

describe('vehicleCoverage', () => {
  it('separates stops that named a vehicle from those that named none', () => {
    expect(
      vehicleCoverage([
        buildVehicleGroup('FORD', 'F150', 31),
        buildVehicleGroup('TOYT', '', 12),
        buildVehicleGroup('', 'ALTIMA', 4),
        buildVehicleGroup('', '', 99)
      ])
    ).toEqual({ withVehicle: 47, withoutVehicle: 99 })
  })

  it('counts a whitespace-only make and model as no vehicle', () => {
    expect(vehicleCoverage([buildVehicleGroup('  ', ' ', 5)])).toEqual({
      withVehicle: 0,
      withoutVehicle: 5
    })
  })

  it('reports zeroes for an empty range rather than dividing by nothing', () => {
    expect(vehicleCoverage([])).toEqual({ withVehicle: 0, withoutVehicle: 0 })
  })
})
