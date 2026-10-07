<script setup lang="ts">
/**
 * Stops by district — the predominant spatial view.
 *
 * Unlike precise coordinates (reliable only from 2018, confirmed live: 2017
 * sits at 0.6% located against 2018's 98.7%), `district` is populated for
 * every one of the dataset's 720,425 stops, back to 1991. That's what lets
 * this stand in front of the map rather than behind it: it's the one spatial
 * field that never has a reliability problem to disclose.
 *
 * Bars are sized with a plain linear width, not the square-root compression
 * `StopsOverTimeSparkline` needs — district counts span roughly 2x even at
 * the extremes (1,290 to 10,372 in the current default range), nothing like
 * the sparkline's 1000x spread across 34 years, so no compression earns its
 * complexity here.
 */
import { computed } from 'vue'

import type { DistrictCount } from '@/lib/stops'

const props = defineProps<{
  districtCounts: readonly DistrictCount[]
  rangeTotal: number | null
  /** Whether `StopMap` is also rendering for this range — changes which caption shows. */
  mapShown: boolean
  loading?: boolean
}>()

const numberFormat = new Intl.NumberFormat('en-US')

const sorted = computed(() => [...props.districtCounts].sort((a, b) => b.count - a.count))

const maxCount = computed(() =>
  sorted.value.reduce((highest, row) => Math.max(highest, row.count), 0)
)

function widthPercent(count: number): number {
  if (maxCount.value <= 0) return 0
  return (count / maxCount.value) * 100
}

function shareOfRange(count: number): string {
  const total = props.rangeTotal
  if (!total || total <= 0) return ''
  return `${((count / total) * 100).toFixed(1)}%`
}
</script>

<template>
  <section class="border-nola-border bg-nola-surface rounded-lg border">
    <header class="border-nola-border flex flex-wrap items-center gap-3 border-b px-4 py-3">
      <h2 class="text-nola-blue-bright mr-auto text-base font-semibold">By District</h2>
    </header>

    <div class="px-4 py-3">
      <div v-if="sorted.length === 0 && !loading" class="text-nola-muted py-4 text-center text-sm">
        No stops recorded for this range.
      </div>

      <div v-else class="space-y-2">
        <div v-for="row in sorted" :key="row.district" class="flex items-center gap-3 text-sm">
          <span class="text-nola-muted w-20 shrink-0">District {{ row.district }}</span>
          <div class="bg-nola-ink/40 h-4 flex-1 overflow-hidden rounded">
            <div
              class="bg-nola-blue-bright h-full rounded"
              :style="{ width: `${widthPercent(row.count)}%` }"
            />
          </div>
          <span class="tabular text-nola-muted w-28 shrink-0 text-right">
            {{ numberFormat.format(row.count) }} ({{ shareOfRange(row.count) }})
          </span>
        </div>
      </div>

      <p class="text-nola-muted pt-3 text-xs">
        <template v-if="mapShown">
          Every stop is assigned a district regardless of whether its exact location was recorded,
          which is a coarser but always-available companion to the map below.
        </template>
        <template v-else>
          Most of this range's stops don't have a precise recorded location, so the map isn't shown
          for it — district is recorded for every stop regardless, and is shown here instead.
        </template>
      </p>
    </div>
  </section>
</template>
