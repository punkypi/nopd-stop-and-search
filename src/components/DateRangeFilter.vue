<script setup lang="ts">
/**
 * Date range selector, replacing Blueprint's `DateRangeInput`.
 *
 * naive-ui's picker works in epoch milliseconds, while the rest of the app works
 * in whole local calendar days, so this component is the only place that
 * conversion lives.
 */
import { NDatePicker } from 'naive-ui'
import { computed } from 'vue'

import { fromTimestamp, toTimestamp, type CalendarDay } from '@/lib/dates'
import type { DateRange } from '@/lib/stops'

const props = defineProps<{
  range: DateRange
  /** Oldest day present in the dataset; earlier days are not selectable. */
  earliest?: CalendarDay | null
  /** Newest day present in the dataset. */
  latest?: CalendarDay | null
}>()

const emit = defineEmits<{ 'update:range': [DateRange] }>()

const value = computed<[number, number]>(() => [
  toTimestamp(props.range.start),
  toTimestamp(props.range.end)
])

function onUpdate(next: [number, number] | null) {
  if (!next) return
  const [start, end] = next
  emit('update:range', { start: fromTimestamp(start), end: fromTimestamp(end) })
}

/**
 * Days outside the dataset's own range are disabled: selecting them can only
 * ever return zero, which reads as a broken page rather than an empty result.
 */
function isDateDisabled(timestamp: number) {
  const earliestBound = props.earliest
  const latestBound = props.latest
  if (earliestBound && timestamp < toTimestamp(earliestBound)) return true
  if (latestBound && timestamp > toTimestamp(latestBound)) return true
  return false
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
    <label class="text-nola-muted text-xs font-semibold tracking-wide uppercase">
      Date range
    </label>
    <NDatePicker
      :value="value"
      type="daterange"
      size="small"
      :is-date-disabled="isDateDisabled"
      :actions="['confirm']"
      start-placeholder="Start"
      end-placeholder="End"
      class="min-w-[17rem]"
      @update:value="onUpdate"
    />
  </div>
</template>
