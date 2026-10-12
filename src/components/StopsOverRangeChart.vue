<script setup lang="ts">
/**
 * The selected range's own stops-over-time trend — a different, finer-grained
 * companion to the whole-record "Stops by year" sparkline above the date
 * picker. That one never moves; this one is the picker's own output, daily
 * for a short range and monthly for a long one. See `bucketGranularity` in
 * `@/lib/stopsOverRange` for the threshold, and that file's header comment
 * for why the two charts must not be conflated.
 */
import { computed } from 'vue'

import { fromSocrataTimestamp, toDisplayString, toMonthYearString } from '@/lib/dates'
import type { DateRange } from '@/lib/stops'
import {
  bucketGranularity,
  fillBucketGaps,
  maxSeriesCount,
  type TimeSeriesPoint
} from '@/lib/stopsOverRange'
import { barHeight } from '@/lib/stopsOverTime'

const props = defineProps<{
  points: readonly TimeSeriesPoint[]
  range: DateRange
  loading?: boolean
}>()

const granularity = computed(() => bucketGranularity(props.range))

const buckets = computed(() => fillBucketGaps(props.points, props.range, granularity.value))

const maxCount = computed(() => maxSeriesCount(buckets.value))

const hasPartialBucket = computed(() => buckets.value.some((bucket) => bucket.partial))

const numberFormat = new Intl.NumberFormat('en-US')

/** Matches CHART_HEIGHT_PX in StopsOverTimeSparkline.vue, the chart this one sits beside. */
const CHART_HEIGHT_PX = 56

function totalHeightPx(count: number): number {
  return (barHeight(count, maxCount.value) / 100) * CHART_HEIGHT_PX
}

function bucketLabel(bucket: TimeSeriesPoint): string {
  const day = fromSocrataTimestamp(bucket.bucketStart)
  if (!day) return bucket.bucketStart
  return granularity.value === 'month' ? toMonthYearString(day) : toDisplayString(day)
}

function barTitle(bucket: TimeSeriesPoint): string {
  const stops = `${numberFormat.format(bucket.count)} stops`
  const partial = bucket.partial ? ' (covers only part of the month)' : ''
  return `${bucketLabel(bucket)}: ${stops}${partial}`
}
</script>

<template>
  <section
    class="border-nola-border bg-nola-surface flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border px-4 py-2 transition-opacity"
    :class="loading ? 'opacity-50' : ''"
  >
    <p class="text-nola-muted shrink-0 text-xs font-semibold tracking-wide uppercase">
      Stops in this range
    </p>

    <div class="flex h-14 flex-1 items-end gap-px">
      <div
        v-for="bucket in buckets"
        :key="bucket.bucketStart"
        class="group relative h-full flex-1"
        :title="barTitle(bucket)"
      >
        <span
          class="bg-nola-choropleth-low group-hover:bg-nola-blue absolute bottom-0 w-full rounded-t transition-colors"
          :class="bucket.partial ? 'opacity-50' : ''"
          :style="{
            height: `${totalHeightPx(bucket.count)}px`,
            minHeight: bucket.count > 0 ? '2px' : '0'
          }"
        />
      </div>
    </div>

    <p class="text-nola-muted w-full text-xs">
      How many stops were reported within the selected range,
      {{ granularity === 'month' ? 'by month' : 'by day' }}. A low count usually means sparse
      reporting, not a quiet stretch.
      <span v-if="hasPartialBucket">
        A lightly shaded bar covers less than a full month, because the selected range starts or
        ends partway through it, not because of anything that happened that month.
      </span>
    </p>
  </section>
</template>
