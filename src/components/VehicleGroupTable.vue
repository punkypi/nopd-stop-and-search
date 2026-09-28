<script setup lang="ts">
/**
 * Sortable, searchable breakdown of stops by vehicle make and model.
 *
 * This replaces the 281-line `VehicleGroupStatistics` component along with its
 * hand-written comparator, its search-term state, and the `Hideable`/`Mix`
 * mixin pair used to collapse it. naive-ui's data table owns sorting and
 * pagination; the search box is a `computed` filter; and collapsing is one
 * `ref<boolean>`.
 */
import { NButton, NDataTable, NEmpty, NInput, type DataTableColumns } from 'naive-ui'
import { computed, h, ref } from 'vue'

import { vehicleCoverage, type VehicleGroup } from '@/lib/stops'

const props = defineProps<{
  vehicleGroups: readonly VehicleGroup[]
  loading?: boolean
}>()

const searchTerm = ref('')
const collapsed = ref(false)

const filtered = computed<VehicleGroup[]>(() => {
  const term = searchTerm.value.trim().toLowerCase()
  const groups = props.vehicleGroups
  if (!term) return [...groups]
  return groups.filter(
    (group) => group.makeAndModel.toLowerCase().includes(term) || String(group.count).includes(term)
  )
})

const totalInFilter = computed(() =>
  filtered.value.reduce((runningTotal, group) => runningTotal + group.count, 0)
)

/**
 * Computed over every group rather than the filtered ones: this states what the
 * table can cover at all, which the search box does not change.
 */
const coverage = computed(() => vehicleCoverage(props.vehicleGroups))

const rangeStops = computed(() => coverage.value.withVehicle + coverage.value.withoutVehicle)

const numberFormat = new Intl.NumberFormat('en-US')

/**
 * Make and model together identify a row, since that is the pair the query
 * grouped by.
 *
 * JSON-encoded rather than joined with a separator: any separator that could
 * also occur inside a field would let `("A B", "C")` and `("A", "B C")`
 * collide, and a control character chosen to avoid that gets rewritten into a
 * raw byte by the formatter, which is a parse error in an SFC.
 */
function rowKey(row: VehicleGroup): string {
  return JSON.stringify([row.make, row.model])
}

const columns = computed<DataTableColumns<VehicleGroup>>(() => [
  {
    title: 'Make',
    key: 'make',
    sorter: 'default',
    ellipsis: { tooltip: true },
    render: (row) => row.make || h('span', { class: 'text-nola-muted italic' }, 'Not supplied')
  },
  {
    title: 'Model',
    key: 'model',
    sorter: 'default',
    ellipsis: { tooltip: true },
    render: (row) => row.model || h('span', { class: 'text-nola-muted italic' }, 'Not supplied')
  },
  {
    title: 'Stops',
    key: 'count',
    sorter: 'default',
    // Opens on most-frequent-first, which is the question this table answers.
    defaultSortOrder: 'descend',
    align: 'right',
    width: 110,
    className: 'tabular',
    render: (row) => numberFormat.format(row.count)
  }
])
</script>

<template>
  <section class="border-nola-border bg-nola-surface rounded-lg border">
    <header class="border-nola-border flex flex-wrap items-center gap-3 border-b px-4 py-3">
      <h2 class="text-nola-blue-bright mr-auto text-base font-semibold">By Vehicle</h2>

      <NInput
        v-model:value="searchTerm"
        placeholder="Search make or model"
        size="small"
        clearable
        class="max-w-[15rem]"
      />
      <NButton size="small" quaternary @click="collapsed = !collapsed">
        {{ collapsed ? 'Show' : 'Hide' }}
      </NButton>
    </header>

    <div v-if="!collapsed" class="px-2 py-2">
      <p class="text-nola-muted px-2 pb-2 text-xs">
        {{ numberFormat.format(filtered.length) }}
        make/model {{ filtered.length === 1 ? 'pair' : 'pairs' }},
        {{ numberFormat.format(totalInFilter) }} stops
        <span v-if="searchTerm.trim()">matching “{{ searchTerm.trim() }}”</span>
      </p>

      <!-- Once stops of every kind are counted, most of this panel's shortfall is
           stops that never involved a car. Saying so is what keeps the make/model
           totals from reading as a count of all stops. -->
      <p v-if="coverage.withoutVehicle > 0" class="text-nola-muted px-2 pb-2 text-xs">
        {{ numberFormat.format(coverage.withVehicle) }} of
        {{ numberFormat.format(rangeStops) }} stops in this range recorded a vehicle. The rest,
        including every stop of someone on foot, are counted in the total above but cannot appear
        here.
      </p>

      <NDataTable
        :columns="columns"
        :data="filtered"
        :loading="loading"
        :pagination="{ pageSize: 25, showSizePicker: true, pageSizes: [25, 50, 100] }"
        :row-key="rowKey"
        size="small"
        striped
      >
        <template #empty>
          <NEmpty description="No vehicles recorded for this range." />
        </template>
      </NDataTable>
    </div>
  </section>
</template>
