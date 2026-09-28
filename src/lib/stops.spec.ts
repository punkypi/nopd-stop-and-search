import { afterEach, describe, expect, it, vi } from 'vitest'

import { calendarDay } from './dates'
import {
  buildVehicleGroup,
  fetchLatestEventDate,
  fetchStopCount,
  fetchVehicleGroups,
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
