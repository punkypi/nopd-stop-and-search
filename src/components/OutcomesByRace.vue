<script setup lang="ts">
/**
 * Search, citation, arrest and evidence-seized outcomes by subjectrace,
 * whole record.
 *
 * Unlike every other panel on the page, this one doesn't move with the date
 * picker — see the header comment in `src/lib/outcomesByRace.ts` for why,
 * and the caption below says so plainly, since every other panel here does
 * respond to the selected range.
 */
import { NDataTable, type DataTableColumns } from 'naive-ui'
import { computed } from 'vue'

import {
  OUTCOMES,
  rate,
  stopTypeSharesForRace,
  type OutcomeDescriptor,
  type RaceOutcomeCounts,
  type RaceStopTypeCount
} from '@/lib/outcomesByRace'

const props = defineProps<{
  counts: readonly RaceOutcomeCounts[]
  stopTypeCounts: readonly RaceStopTypeCount[]
}>()

const numberFormat = new Intl.NumberFormat('en-US')
const percentFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
})

function rowKey(row: RaceOutcomeCounts): string {
  return row.race
}

const rows = computed(() => [...props.counts])

function cellText(row: RaceOutcomeCounts, outcome: OutcomeDescriptor): string {
  const numerator = row[outcome.numerator]
  const denominator = row[outcome.denominator]
  const share = rate(numerator, denominator)
  if (share === null) return `${numberFormat.format(numerator)} (too few to rate)`
  return `${numberFormat.format(numerator)} (${percentFormat.format(share * 100)}%)`
}

const columns = computed<DataTableColumns<RaceOutcomeCounts>>(() => [
  {
    title: 'Race',
    key: 'race',
    sorter: 'default',
    ellipsis: { tooltip: true }
  },
  {
    title: 'Stops',
    key: 'stops',
    sorter: 'default',
    defaultSortOrder: 'descend',
    align: 'right',
    className: 'tabular',
    render: (row) => numberFormat.format(row.stops)
  },
  ...OUTCOMES.map((outcome) => ({
    title: outcome.label,
    key: outcome.key,
    align: 'right' as const,
    className: 'tabular',
    render: (row: RaceOutcomeCounts) => cellText(row, outcome)
  }))
])

/** Sentence case, so the composition sentence reads as prose, not stored values. */
function stopTypeLabel(description: string): string {
  if (!description) return 'not recorded'
  return description.charAt(0).toLowerCase() + description.slice(1).toLowerCase()
}

/**
 * The composition disclosure CLAUDE.md requires for any cross-tab that pools
 * every kind of stop: the table above pools all twelve, and a reader can't
 * judge what that pooling might be hiding without seeing what each race's
 * own stops are actually made of. Limited to the two largest race groups —
 * the ones the table itself leads with.
 */
function compositionSentence(race: string): string | null {
  const shares = stopTypeSharesForRace(props.stopTypeCounts, race).slice(0, 2)
  if (shares.length === 0) return null
  const parts = shares.map(
    (share) => `${percentFormat.format(share.share * 100)}% ${stopTypeLabel(share.description)}`
  )
  return `${race} subjects' stops: ${parts.join(', ')}.`
}

const compositionSentences = computed(() =>
  ['BLACK', 'WHITE']
    .map((race) => compositionSentence(race))
    .filter((sentence): sentence is string => sentence !== null)
)
</script>

<template>
  <section class="border-nola-border bg-nola-surface rounded-lg border">
    <header class="border-nola-border flex flex-wrap items-center gap-3 border-b px-4 py-3">
      <h2 class="text-nola-blue-bright mr-auto text-base font-semibold">Outcomes by Race</h2>
      <span class="text-nola-muted text-xs tracking-wide uppercase">Whole record</span>
    </header>

    <div class="px-2 py-2">
      <p class="text-nola-muted px-2 pb-2 text-xs">
        Every stop on record, not the selected date range above. Figures below don't move when the
        date picker does.
      </p>

      <NDataTable :columns="columns" :data="rows" :row-key="rowKey" size="small" striped />

      <p class="text-nola-muted px-2 pt-2 text-xs">
        A stop can carry more than one of these outcomes, so a race's shares don't sum to 100%. A
        rate reading "too few to rate" comes from a cell with fewer than 30 stops or searches behind
        it; its raw count still appears.
      </p>

      <p
        v-for="sentence in compositionSentences"
        :key="sentence"
        class="text-nola-muted px-2 pt-1 text-xs"
      >
        {{ sentence }}
      </p>
    </div>
  </section>
</template>
