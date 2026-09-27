import { flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { calendarDay } from '@/lib/dates'
import type { DataSnapshot } from '@/lib/snapshot'
import type { DateRange, VehicleGroup } from '@/lib/trafficViolations'

import { useViolationData } from './useViolationData'

const DEFAULT_RANGE: DateRange = {
  start: calendarDay(2025, 11, 1),
  end: calendarDay(2025, 11, 30)
}

const BAKED_GROUPS: VehicleGroup[] = [
  { make: 'NISSAN', model: 'ALTIMA', count: 12, makeAndModel: 'NISSAN ALTIMA' }
]

function snapshotFixture(): DataSnapshot {
  return {
    bakedAt: '2026-09-26T23:50:14.661Z',
    domain: 'data.nola.gov',
    dataset: 'nfft-hjwi',
    earliestEventDate: calendarDay(1991, 7, 24),
    latestEventDate: calendarDay(2025, 11, 9),
    totalViolations: 440051,
    defaultRange: DEFAULT_RANGE,
    defaultRangeCount: 366,
    defaultRangeVehicleGroups: BAKED_GROUPS
  }
}

/** Responds to the count query and the group query with fixed values. */
function stubFetch() {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input))
    const select = url.searchParams.get('$select') ?? ''
    const body = select.startsWith('count(*)')
      ? [{ total: '99' }]
      : [{ vehiclemake: 'FORD', vehiclemodel: 'F150', total: '7' }]
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('useViolationData', () => {
  it('answers the default range from the snapshot without any network request', async () => {
    const fetchMock = stubFetch()
    const range = ref<DateRange>({ ...DEFAULT_RANGE })
    const snapshot = ref<DataSnapshot | null>(snapshotFixture())

    const { count, vehicleGroups, loading } = useViolationData(range, snapshot)
    await flushPromises()

    expect(fetchMock).not.toHaveBeenCalled()
    expect(count.value).toBe(366)
    expect(vehicleGroups.value).toEqual(BAKED_GROUPS)
    expect(loading.value).toBe(false)
  })

  it('queries live for a range the snapshot does not cover', async () => {
    const fetchMock = stubFetch()
    const range = ref<DateRange>({ ...DEFAULT_RANGE })
    const snapshot = ref<DataSnapshot | null>(snapshotFixture())

    const { count, vehicleGroups } = useViolationData(range, snapshot)
    await flushPromises()

    range.value = { start: calendarDay(2025, 10, 1), end: calendarDay(2025, 10, 31) }
    await flushPromises()

    expect(fetchMock).toHaveBeenCalled()
    expect(count.value).toBe(99)
    expect(vehicleGroups.value[0]?.makeAndModel).toBe('FORD F150')
  })

  it('queries live when no snapshot is available at all', async () => {
    const fetchMock = stubFetch()
    const range = ref<DateRange>({ ...DEFAULT_RANGE })
    const snapshot = ref<DataSnapshot | null>(null)

    const { count } = useViolationData(range, snapshot)
    await flushPromises()

    expect(fetchMock).toHaveBeenCalled()
    expect(count.value).toBe(99)
  })

  it('reports an inverted range instead of querying for it', async () => {
    const fetchMock = stubFetch()
    const range = ref<DateRange>({ ...DEFAULT_RANGE })
    const snapshot = ref<DataSnapshot | null>(snapshotFixture())

    const { error } = useViolationData(range, snapshot)
    await flushPromises()
    fetchMock.mockClear()

    range.value = { start: calendarDay(2025, 10, 31), end: calendarDay(2025, 10, 1) }
    await flushPromises()

    expect(error.value).toMatch(/on or before/)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('surfaces a failed query as an error and clears stale figures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('nope', { status: 503, statusText: 'Service Unavailable' }))
    )
    const range = ref<DateRange>({
      start: calendarDay(2025, 10, 1),
      end: calendarDay(2025, 10, 31)
    })
    const snapshot = ref<DataSnapshot | null>(snapshotFixture())

    const { count, error, vehicleGroups } = useViolationData(range, snapshot)
    await flushPromises()

    expect(error.value).toBeTruthy()
    expect(count.value).toBeNull()
    expect(vehicleGroups.value).toEqual([])
  })

  it('discards a superseded response so the newest range wins', async () => {
    // The first live range resolves slowly, the second quickly. Without the
    // abort, the slow response would land last and overwrite the newer figures.
    let callIndex = 0
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = new URL(String(input))
        const isCount = (url.searchParams.get('$select') ?? '').startsWith('count(*)')
        const mine = callIndex++ < 2
        if (mine) {
          await new Promise((resolve) => setTimeout(resolve, 40))
          if (init?.signal?.aborted) throw new DOMException('aborted', 'AbortError')
        }
        const total = mine ? '111' : '222'
        const body = isCount ? [{ total }] : [{ vehiclemake: 'X', vehiclemodel: 'Y', total }]
        return new Response(JSON.stringify(body), { status: 200 })
      })
    )

    const range = ref<DateRange>({ start: calendarDay(2025, 9, 1), end: calendarDay(2025, 9, 30) })
    const snapshot = ref<DataSnapshot | null>(null)
    const { count } = useViolationData(range, snapshot)

    range.value = { start: calendarDay(2025, 8, 1), end: calendarDay(2025, 8, 31) }
    await flushPromises()
    await new Promise((resolve) => setTimeout(resolve, 80))
    await flushPromises()

    expect(count.value).toBe(222)
  })
})
