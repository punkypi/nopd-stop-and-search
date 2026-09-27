<script setup lang="ts">
/**
 * NOLA Stop and Search data, a single page.
 *
 * The page opens on the month containing the most recent event, which is read
 * from the build-time snapshot rather than discovered with a live query the way
 * the original app did it.
 */
import { NAlert, NConfigProvider, NSpin, darkTheme, type GlobalThemeOverrides } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'

import AboutPanel from '@/components/AboutPanel.vue'
import DateRangeFilter from '@/components/DateRangeFilter.vue'
import VehicleGroupTable from '@/components/VehicleGroupTable.vue'
import ViolationTotal from '@/components/ViolationTotal.vue'
import { useViolationData } from '@/composables/useViolationData'
import { endOfMonth, startOfMonth, today } from '@/lib/dates'
import { loadSnapshot, type DataSnapshot } from '@/lib/snapshot'
import type { DateRange } from '@/lib/trafficViolations'

/** Maps the project's palette onto naive-ui's dark theme. */
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#2185d0',
    primaryColorHover: '#54c8ff',
    primaryColorPressed: '#3e46b3',
    primaryColorSuppl: '#54c8ff',
    bodyColor: '#1b1c1d',
    cardColor: '#232526',
    borderColor: '#34383a'
  }
}

const snapshot = ref<DataSnapshot | null>(null)

/**
 * Left null until the snapshot resolves. Seeding it with the current month
 * instead would fire a live query for a range nobody asked for, and that query
 * would be thrown away a moment later when the snapshot named the real default
 * range — which is the round-trip baking exists to remove.
 */
const range = ref<DateRange | null>(null)

const { count, vehicleGroups, loading, error } = useViolationData(range, snapshot)

onMounted(async () => {
  try {
    const loaded = await loadSnapshot()
    snapshot.value = loaded
    range.value = loaded.defaultRange
  } catch (cause) {
    // A missing snapshot changes nothing the viewer can see: live queries cover
    // the current month instead, so this falls back quietly and only reports the
    // reason to the console for whoever is debugging it. If the live queries
    // fail too, `error` surfaces that, which is the part a viewer can act on.
    console.warn('Falling back to live queries; the baked snapshot failed to load.', cause)
    range.value = { start: startOfMonth(today()), end: endOfMonth(today()) }
  }
})

const headerIcon = computed(() => `${import.meta.env.BASE_URL}fleur_de_lis_blue.ico`)
</script>

<template>
  <NConfigProvider :theme="darkTheme" :theme-overrides="themeOverrides">
    <div class="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-5">
      <header
        class="border-nola-border bg-nola-surface flex flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border px-4 py-3"
      >
        <h1 class="mr-auto flex items-center gap-2 text-lg font-semibold">
          <img :src="headerIcon" alt="" class="h-6 w-6" width="24" height="24" />
          NOLA Stop and Search Data
        </h1>

        <DateRangeFilter
          v-if="range"
          :range="range"
          :earliest="snapshot?.earliestEventDate ?? null"
          :latest="snapshot?.latestEventDate ?? null"
          @update:range="range = $event"
        />
      </header>

      <NAlert v-if="error" type="warning" :bordered="false" title="Could not load this range">
        {{ error }}
      </NAlert>

      <template v-if="range">
        <ViolationTotal :count="count" :range="range" :loading="loading" />

        <VehicleGroupTable :vehicle-groups="vehicleGroups" :loading="loading" />
      </template>

      <div v-else class="flex justify-center py-16">
        <NSpin size="large" />
      </div>

      <AboutPanel :snapshot="snapshot" />

      <footer class="text-nola-muted pb-2 text-center text-xs">
        Public data, presented without warranty. Counts reflect what was reported to
        <a
          href="https://data.nola.gov"
          class="underline decoration-dotted"
          rel="noreferrer"
          target="_blank"
          >Data.NOLA.gov</a
        >.
      </footer>
    </div>
  </NConfigProvider>
</template>
