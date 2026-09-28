<script setup lang="ts">
/**
 * Provenance for the data on the page.
 *
 * Every figure here is read from the snapshot rather than written into the copy.
 * The previous version hard-coded its date ranges in prose and had drifted out
 * of date — it claimed the data began in 1999 when the earliest event is
 * actually from 1991.
 */
import { NCollapse, NCollapseItem } from 'naive-ui'
import { computed } from 'vue'

import { toDisplayString } from '@/lib/dates'
import type { DataSnapshot } from '@/lib/snapshot'

const props = defineProps<{ snapshot: DataSnapshot | null }>()

const numberFormat = new Intl.NumberFormat('en-US')

/**
 * The stop types worth naming individually, largest first.
 *
 * Read defensively: a snapshot baked before stop types existed still answers
 * every other figure here, and this section simply goes quiet rather than
 * breaking the panel.
 */
const stopTypes = computed(() => props.snapshot?.stopTypes ?? [])

/** Sentence case, so the panel reads as prose rather than as stored values. */
function stopTypeLabel(description: string): string {
  if (!description) return 'Not recorded'
  return description.charAt(0) + description.slice(1).toLowerCase()
}

function shareOfAll(count: number): string {
  const total = props.snapshot?.totalStops ?? 0
  if (!total) return ''
  return `${((count / total) * 100).toFixed(1)}%`
}

const datasetUrl = computed(() =>
  props.snapshot
    ? `https://${props.snapshot.domain}/d/${props.snapshot.dataset}`
    : 'https://data.nola.gov'
)

const bakedAtLabel = computed(() => {
  if (!props.snapshot) return null
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(new Date(props.snapshot.bakedAt))
})
</script>

<template>
  <!-- Expanded by default: in the original app this provenance text was a
       plain always-visible block, and knowing the shape of the dataset is
       part of reading the numbers honestly rather than an optional extra. -->
  <NCollapse
    class="border-nola-border bg-nola-surface rounded-lg border px-4"
    :default-expanded-names="['about']"
  >
    <NCollapseItem title="About this data" name="about">
      <div class="space-y-3 pb-2 text-sm leading-relaxed">
        <p>
          Backed by
          <a
            :href="datasetUrl"
            class="text-nola-blue-bright underline decoration-dotted"
            rel="noreferrer"
            target="_blank"
            >Stop and Search (Field Interviews)</a
          >
          from
          <a
            href="https://data.nola.gov"
            class="text-nola-blue-bright underline decoration-dotted"
            rel="noreferrer"
            target="_blank"
            >Data.NOLA.gov</a
          >, covering every kind of stop the record holds — traffic stops, stops of people on foot,
          and calls officers were dispatched to alike.
        </p>

        <dl v-if="snapshot" class="grid gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr]">
          <dt class="text-nola-muted">Events span</dt>
          <dd class="tabular">
            {{ toDisplayString(snapshot.earliestEventDate) }} to
            {{ toDisplayString(snapshot.latestEventDate) }}
          </dd>

          <dt class="text-nola-muted">Stops on record</dt>
          <dd class="tabular">{{ numberFormat.format(snapshot.totalStops) }}</dd>

          <dt class="text-nola-muted">Figures last checked</dt>
          <dd class="tabular">{{ bakedAtLabel }}</dd>
        </dl>

        <!-- The composition is listed rather than summarised because the kinds of
             stop are not comparable, and a reader cannot judge a pooled figure
             without knowing what went into it. -->
        <div v-if="stopTypes.length">
          <p class="text-nola-muted pb-1">Kinds of stop on record</p>
          <dl class="grid gap-x-6 gap-y-1 sm:grid-cols-[1fr_auto_auto]">
            <template v-for="stopType in stopTypes" :key="stopType.description">
              <dt>{{ stopTypeLabel(stopType.description) }}</dt>
              <dd class="tabular text-right">{{ numberFormat.format(stopType.count) }}</dd>
              <dd class="text-nola-muted tabular text-right">{{ shareOfAll(stopType.count) }}</dd>
            </template>
          </dl>
        </div>

        <p class="text-nola-muted">
          These kinds are not interchangeable. A stop officers were dispatched to is not the same
          act as one an officer chose to make, and what follows a stop — a search, a citation, an
          arrest — varies widely between them. A figure pooled across all of them blends different
          things, so read any total here alongside the mix above.
        </p>

        <p class="text-nola-muted">
          Event density is uneven — some months and years hold far fewer records than others, and no
          new events have been published since
          <span v-if="snapshot">{{ toDisplayString(snapshot.latestEventDate) }}</span
          ><span v-else>late 2025</span>, though the dataset itself still receives updates. A range
          with a low count usually means sparse reporting rather than a quiet month.
        </p>

        <p class="text-nola-muted">
          Locations are recorded at the nearest intersection or block rather than an exact address,
          and only from 2018 onward — earlier stops carry no coordinates at all. The map therefore
          covers a subset of any range that reaches back before then, and says how large a subset it
          is.
        </p>

        <p>
          To query it yourself, see
          <a
            href="https://dev.socrata.com/foundry/data.nola.gov/nfft-hjwi"
            class="text-nola-blue-bright underline decoration-dotted"
            rel="noreferrer"
            target="_blank"
            >the Socrata API docs for this dataset</a
          >.
        </p>
      </div>
    </NCollapseItem>
  </NCollapse>
</template>
