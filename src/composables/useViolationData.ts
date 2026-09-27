/**
 * Supplies the traffic-violation figures for whichever date range is selected.
 *
 * This replaces the imperative `updateInfo()` / `componentWillReceiveProps`
 * dance in the original `TrafficViolations` component. A `watch` on the range
 * covers both the initial load and every subsequent change, and Vue's
 * reactivity means nothing has to manually mirror props into state.
 *
 * Two behaviours the original lacked:
 *  - The baked snapshot answers the default range with no network request.
 *  - An in-flight request is aborted when the range changes again, so a slow
 *    earlier response cannot land after a faster later one and show stale data.
 */

import { readonly, ref, shallowRef, watch, type Ref } from 'vue'

import { isSameRange, type DataSnapshot } from '@/lib/snapshot'
import {
  fetchVehicleGroups,
  fetchViolationCount,
  isValidRange,
  type DateRange,
  type VehicleGroup
} from '@/lib/trafficViolations'

export function useViolationData(range: Ref<DateRange | null>, snapshot: Ref<DataSnapshot | null>) {
  const count = ref<number | null>(null)
  const vehicleGroups = shallowRef<VehicleGroup[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let inFlight: AbortController | null = null

  async function load(current: DateRange) {
    inFlight?.abort()

    const baked = snapshot.value
    if (baked && isSameRange(current, baked.defaultRange)) {
      count.value = baked.defaultRangeCount
      vehicleGroups.value = baked.defaultRangeVehicleGroups
      loading.value = false
      error.value = null
      return
    }

    const controller = new AbortController()
    inFlight = controller
    loading.value = true
    error.value = null

    try {
      const [nextCount, nextGroups] = await Promise.all([
        fetchViolationCount(current, { signal: controller.signal }),
        fetchVehicleGroups(current, { signal: controller.signal })
      ])
      // A newer range superseded this one mid-flight; discard the result.
      if (controller.signal.aborted) return
      count.value = nextCount
      vehicleGroups.value = nextGroups
    } catch (cause) {
      if (controller.signal.aborted) return
      error.value = cause instanceof Error ? cause.message : 'Could not load data'
      count.value = null
      vehicleGroups.value = []
    } finally {
      if (inFlight === controller) {
        inFlight = null
        loading.value = false
      }
    }
  }

  watch(
    [range, snapshot],
    ([current]) => {
      if (!current) return
      if (!isValidRange(current)) {
        error.value = 'Choose a start date on or before the end date.'
        return
      }
      void load(current)
    },
    { immediate: true, deep: true }
  )

  return {
    count: readonly(count),
    vehicleGroups,
    loading: readonly(loading),
    error: readonly(error)
  }
}
