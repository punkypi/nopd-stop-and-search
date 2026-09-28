<script setup lang="ts">
/** The headline count of stops in the selected range, of every kind. */
import { NSpin } from 'naive-ui'
import { computed } from 'vue'

import { toDisplayString } from '@/lib/dates'
import type { DateRange } from '@/lib/stops'

const props = defineProps<{
  count: number | null
  range: DateRange
  loading?: boolean
}>()

const numberFormat = new Intl.NumberFormat('en-US')

const formattedCount = computed(() =>
  props.count === null ? '—' : numberFormat.format(props.count)
)

const rangeLabel = computed(
  () => `${toDisplayString(props.range.start)} – ${toDisplayString(props.range.end)}`
)
</script>

<template>
  <section
    class="border-nola-border bg-nola-surface flex flex-col items-center gap-1 rounded-lg border px-4 py-6 text-center"
  >
    <h2 class="text-nola-muted text-xs font-semibold tracking-wide uppercase">Recorded Stops</h2>

    <p class="tabular text-nola-blue-bright flex items-center gap-3 text-5xl font-light">
      <NSpin v-if="loading" size="small" />
      <span>{{ formattedCount }}</span>
    </p>

    <p class="text-nola-muted text-sm">{{ rangeLabel }}</p>
  </section>
</template>
