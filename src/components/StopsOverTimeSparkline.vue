<script setup lang="ts">
/**
 * A compact, whole-record bar for every year the dataset holds — the reason a
 * date picker on this page needs a companion at all.
 *
 * NOPD's electronic field-interview system barely has anything on record
 * before 2010: fewer than 700 stops across 1991-2009 combined, against tens
 * of thousands a year afterward. Someone who free-picks a date in, say, 1995
 * and sees two stops could reasonably read that as "almost nothing happened,"
 * when the truer reading is "almost nothing was digitized yet." This chart
 * exists so that's visible before anyone picks a range, not a fact buried in
 * a caveat paragraph underneath the numbers.
 *
 * A second, later cliff lives inside each bar: the bright cap is the share of
 * that year's stops with a usable coordinate. 2010 already has 62,006 stops
 * on record but only 1 located one — coordinates don't become reliable until
 * 2018, eight years after the stop-count jump. A reader who clicks an early
 * bar and finds the map nearly empty should be able to see why beforehand,
 * not discover it as a surprise after picking.
 *
 * Deliberately simple: one bar per year, baked once from the whole dataset,
 * never re-queried as the date picker moves. A finer-grained, range-scoped
 * time series (daily buckets for a short range, monthly for a long one) is
 * still future work — see CLAUDE.md's "Next thing planned." This is not that;
 * it's a fixed, always-the-same-data companion to the picker above it.
 */
import { computed } from 'vue'

import { calendarDay, earlierOf, laterOf, type CalendarDay } from '@/lib/dates'
import type { DateRange } from '@/lib/stops'
import {
  barHeight,
  fillYearGaps,
  locatedSegmentHeight,
  maxYearlyCount,
  type YearlyStopCount
} from '@/lib/stopsOverTime'

const props = defineProps<{
  yearlyCounts: readonly YearlyStopCount[]
  range: DateRange
  earliest?: CalendarDay | null
  latest?: CalendarDay | null
}>()

const emit = defineEmits<{ 'update:range': [DateRange] }>()

const bounds = computed(() => {
  if (!props.earliest || !props.latest) return null
  return { earliest: props.earliest, latest: props.latest }
})

const years = computed(() => {
  if (!bounds.value) return []
  return fillYearGaps(props.yearlyCounts, bounds.value.earliest.year, bounds.value.latest.year)
})

const maxCount = computed(() => maxYearlyCount(years.value))

const numberFormat = new Intl.NumberFormat('en-US')

/**
 * The chart area's fixed height in pixels, matched by `h-[THIS]px` on the
 * container below.
 *
 * Bars are given an explicit pixel height here rather than a CSS percentage.
 * A percentage height only resolves against an ancestor with a *definite*
 * height, and a flex item sized by `items-end` (content-sized, not stretched)
 * never has one — every bar silently computed to 0px against it. Converting
 * `barHeight`'s 0-100 scale to pixels up front sidesteps that entirely.
 */
const CHART_HEIGHT_PX = 56

function totalHeightPx(count: number): number {
  return (barHeight(count, maxCount.value) / 100) * CHART_HEIGHT_PX
}

/** Height of the bright "has a location" cap drawn at the top of the bar. */
function locatedCapHeightPx(year: YearlyStopCount): number {
  return locatedSegmentHeight(totalHeightPx(year.count), year.count, year.locatedCount)
}

/** Where that cap's bottom edge sits, so it lands flush against the top of the full bar. */
function locatedCapBottomPx(year: YearlyStopCount): number {
  return totalHeightPx(year.count) - locatedCapHeightPx(year)
}

function barTitle(year: YearlyStopCount): string {
  const stops = `${numberFormat.format(year.count)} stops`
  if (year.count === 0) return `${year.year}: ${stops}`
  return `${year.year}: ${stops} (${numberFormat.format(year.locatedCount)} with a recorded location)`
}

/** A full calendar year, clamped to what the dataset actually covers. */
function selectYear(year: number) {
  if (!bounds.value) return
  const start = laterOf(calendarDay(year, 1, 1), bounds.value.earliest)
  const end = earlierOf(calendarDay(year, 12, 31), bounds.value.latest)
  emit('update:range', { start, end })
}

function isSelectedYear(year: number): boolean {
  return props.range.start.year === year && props.range.end.year === year
}
</script>

<template>
  <section
    v-if="bounds"
    class="border-nola-border bg-nola-surface flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border px-4 py-2"
  >
    <p class="text-nola-muted shrink-0 text-xs font-semibold tracking-wide uppercase">
      Stops by year
    </p>

    <div class="flex h-14 flex-1 items-end gap-px">
      <button
        v-for="year in years"
        :key="year.year"
        type="button"
        class="group relative h-full flex-1 cursor-pointer border-b-2"
        :class="isSelectedYear(year.year) ? 'border-nola-blue-bright' : 'border-transparent'"
        :title="barTitle(year)"
        @click="selectYear(year.year)"
      >
        <span
          class="bg-nola-border group-hover:bg-nola-blue absolute bottom-0 w-full rounded-t transition-colors"
          :style="{
            height: `${totalHeightPx(year.count)}px`,
            minHeight: year.count > 0 ? '2px' : '0'
          }"
        />
        <!-- The share of this year's stops with a usable coordinate, capping
             the top of the bar above. Flush at 0px height for most years
             before 2018 — that's the point. -->
        <span
          class="bg-nola-blue-bright absolute w-full rounded-t"
          :style="{
            height: `${locatedCapHeightPx(year)}px`,
            bottom: `${locatedCapBottomPx(year)}px`
          }"
        />
      </button>
    </div>

    <p class="text-nola-muted w-full text-xs">
      Fewer than 700 stops are on record across all of 1991–2009 combined, against tens of thousands
      most years since 2010 — that's when NOPD's electronic field-interview system started being
      populated, not a two-decade quiet spell. Locations lag even further behind: the bright cap on
      each bar is the share with a usable coordinate, and that share stays under 1% until 2018 —
      2010 alone logged 62,006 stops but just one with a location. Click a year to view it.
    </p>
  </section>
</template>
