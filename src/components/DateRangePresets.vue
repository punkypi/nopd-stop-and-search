<script setup lang="ts">
/**
 * The clickable shortcut buttons next to the date picker — "Latest 12
 * Months," "All Time," and so on.
 *
 * Shown as always-visible buttons rather than tucked inside naive-ui's
 * `NDatePicker` `shortcuts` panel (that prop exists and would work, but these
 * are meant to be seen without opening anything first). Each button carries
 * its resolved calendar span as a subtitle, computed live, so nobody has to
 * take a relative label like "Latest 12 Months" on faith — the actual dates
 * are right there.
 */
import { NButton } from 'naive-ui'
import { computed } from 'vue'

import type { CalendarDay } from '@/lib/dates'
import {
  activePresetKey,
  DATE_RANGE_PRESETS,
  presetSubtitle,
  type DateRangePreset
} from '@/lib/dateRangePresets'
import type { DateRange } from '@/lib/stops'

const props = defineProps<{
  range: DateRange
  /** Oldest day present in the dataset. Presets cannot resolve without it. */
  earliest?: CalendarDay | null
  /** Newest day present in the dataset. Every preset is anchored to this, never the wall clock. */
  latest?: CalendarDay | null
}>()

const emit = defineEmits<{ 'update:range': [DateRange] }>()

/** Null until both bounds are known — mirrors `DateRangeFilter`'s own null-safety for the same props. */
const bounds = computed(() => {
  if (!props.earliest || !props.latest) return null
  return { earliest: props.earliest, latest: props.latest }
})

const activeKey = computed(() => {
  if (!bounds.value) return null
  return activePresetKey(props.range, bounds.value.latest, bounds.value.earliest)
})

function subtitle(preset: DateRangePreset) {
  if (!bounds.value) return ''
  return presetSubtitle(preset, bounds.value.latest, bounds.value.earliest)
}

function select(preset: DateRangePreset) {
  if (!bounds.value) return
  emit('update:range', preset.range(bounds.value.latest, bounds.value.earliest))
}
</script>

<template>
  <section
    v-if="bounds"
    class="border-nola-border bg-nola-surface flex flex-wrap items-start gap-x-3 gap-y-1 rounded-lg border px-4 py-3"
  >
    <label class="text-nola-muted pt-1.5 text-xs font-semibold tracking-wide uppercase">
      Quick ranges
    </label>
    <div class="flex flex-wrap gap-2">
      <NButton
        v-for="preset in DATE_RANGE_PRESETS"
        :key="preset.key"
        size="small"
        :type="activeKey === preset.key ? 'primary' : 'tertiary'"
        @click="select(preset)"
      >
        <span class="flex flex-col items-start leading-tight">
          <span>{{ preset.label(bounds.latest) }}</span>
          <span class="text-[0.6875rem] opacity-70">{{ subtitle(preset) }}</span>
        </span>
      </NButton>
    </div>
  </section>
</template>
