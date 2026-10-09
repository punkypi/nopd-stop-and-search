<script setup lang="ts">
/**
 * The headline stop count, the district breakdown, and the district map,
 * merged into one full-bleed view — previously three separate cards
 * (`StopTotal`, `DistrictBreakdown`, `DistrictMap`) squeezed into the same
 * narrow column as the rest of the page. The map is the one thing here that
 * benefits from real size, so it fills the full viewport width and the
 * count/breakdown float over it as a panel instead of competing with it for
 * horizontal space.
 *
 * The default view is a choropleth of NOPD's 8 police districts, colored and
 * labeled (on hover) by stop count — reliable for any range, since `district`
 * carries no coordinate problem. Clicking a district, either its shape on the
 * map or its bar in the floating panel, drills into its own
 * intersection-level circles, when this range's coordinates are trustworthy
 * enough to show them at all and that district's own locations aren't too
 * dense to stay legible.
 */
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { NButton, NSelect, NSpin } from 'naive-ui'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue'

import { MAX_NATIVE_ZOOM, TILE_ATTRIBUTION, TILE_URL } from '@/lib/basemap'
import { toDisplayString } from '@/lib/dates'
import {
  districtFillColor,
  loadDistrictBoundaries,
  locationsInDistrict,
  type DistrictBoundaries,
  type DistrictBoundaryFeature
} from '@/lib/districtBoundaries'
import {
  boundingBox,
  isLegibleDensity,
  isLocationCoverageReliable,
  markerRadius,
  maxStopCount,
  popupHtml,
  totalPlottedStops,
  type StopLocation
} from '@/lib/stopLocations'
import {
  groupByDistrict,
  type DateRange,
  type DistrictCount,
  type DistrictStopTypeCount
} from '@/lib/stops'

const props = defineProps<{
  districtCounts: readonly DistrictCount[]
  /** Each district's own enforcement mix, not just its volume — backs the
   *  map's composition coloring mode. */
  districtStopTypeCounts: readonly DistrictStopTypeCount[]
  /** Stops in the range overall, including those with no recorded location. */
  rangeTotal: number | null
  range: DateRange
  locations: readonly StopLocation[]
  /** True when the location cap was reached and the quietest places were dropped. */
  locationsTruncated?: boolean
  /** Stops excluded because their own recorded address disagreed with itself
   *  about where it is — see `consistentLocations` in `@/lib/stopLocations`. */
  addressInconsistentCount?: number
  loading?: boolean
}>()

const container = useTemplateRef<HTMLDivElement>('container')
const selectedDistrict = ref<string | null>(null)
/** `null` until a viewer picks one — `effectiveStopType` falls back to the
 *  largest category so there's always something sensible to show. */
const chosenStopType = ref<string | null>(null)
const mode = ref<'count' | 'composition'>('count')
// shallowRef, not ref: the fetched GeoJSON is immutable and never mutated in
// place, but a deep ref() would recursively proxy every nested coordinate —
// thousands of them across the 8 district polygons — and the point-in-polygon
// hot loop in locationsInDistrict pays Vue's reactivity-tracking overhead on
// every single array access. Measured: that turned a sub-100ms geometry
// check into 2.9-7.3 seconds of visible lag on every district click.
const boundaries = shallowRef<DistrictBoundaries | null>(null)
const boundaryError = ref<string | null>(null)

let map: L.Map | null = null
let districtLayer: L.GeoJSON | null = null
let circleLayer: L.LayerGroup | null = null
let cityBounds: L.LatLngBounds | null = null
const districtLayers = new Map<string, L.Layer>()

/** See the original StopMap's comment: jsdom has no 2D canvas context, so this
 *  falls back to Leaflet's SVG renderer rather than assuming one exists. Only
 *  the circle overlay needs it — 8 polygons are cheap in SVG regardless. */
let canvasSupport: boolean | null = null
function canvasAvailable(): boolean {
  if (canvasSupport === null) {
    try {
      canvasSupport = document.createElement('canvas').getContext('2d') !== null
    } catch {
      canvasSupport = false
    }
  }
  return canvasSupport
}

const numberFormat = new Intl.NumberFormat('en-US')

const formattedCount = computed(() =>
  props.rangeTotal === null ? '—' : numberFormat.format(props.rangeTotal)
)
const rangeLabel = computed(
  () => `${toDisplayString(props.range.start)} – ${toDisplayString(props.range.end)}`
)

const reliable = computed(() => isLocationCoverageReliable(props.rangeTotal, props.locations))

const districtCountByDistrict = computed(() => {
  const map = new Map<string, number>()
  for (const row of props.districtCounts) map.set(row.district, row.count)
  return map
})

const maxDistrictCount = computed(() =>
  props.districtCounts.reduce((highest, row) => Math.max(highest, row.count), 0)
)

function shareOfRange(count: number): string {
  const total = props.rangeTotal
  if (!total || total <= 0) return ''
  return `${((count / total) * 100).toFixed(1)}%`
}

const districtStopTypeMap = computed(() => groupByDistrict(props.districtStopTypeCounts))

/** Distinct stop types present, ordered by total volume across all districts
 *  descending, so the dropdown lists the biggest categories first. */
const availableStopTypes = computed(() => {
  const totals = new Map<string, number>()
  for (const row of props.districtStopTypeCounts) {
    totals.set(row.description, (totals.get(row.description) ?? 0) + row.count)
  }
  return [...totals.entries()].sort((a, b) => b[1] - a[1]).map(([description]) => description)
})

const effectiveStopType = computed(
  () => chosenStopType.value ?? availableStopTypes.value[0] ?? null
)

/** Sentence case, so the dropdown reads as prose rather than stored values —
 *  matches `AboutPanel`'s treatment of the same field. */
function stopTypeLabel(description: string): string {
  if (!description) return 'Not recorded'
  return description.charAt(0) + description.slice(1).toLowerCase()
}
const stopTypeOptions = computed(() =>
  availableStopTypes.value.map((description) => ({
    label: stopTypeLabel(description),
    value: description
  }))
)

/** Share of `district`'s own stops that are `effectiveStopType`, or 0 when
 *  either is unknown — there's nothing to divide. */
function shareFor(district: string): number {
  const type = effectiveStopType.value
  if (!type) return 0
  const districtTotal = districtCountByDistrict.value.get(district) ?? 0
  if (districtTotal <= 0) return 0
  const typeCount = districtStopTypeMap.value.get(district)?.get(type) ?? 0
  return typeCount / districtTotal
}

const maxShare = computed(() =>
  props.districtCounts.reduce((highest, row) => Math.max(highest, shareFor(row.district)), 0)
)

/** The value and ceiling `districtStyle`/the tooltip/the bar list all key
 *  off, so switching modes is a matter of swapping these two, not rewriting
 *  the rendering logic underneath them. */
function valueFor(district: string): number {
  return mode.value === 'count'
    ? (districtCountByDistrict.value.get(district) ?? 0)
    : shareFor(district)
}
const maxValue = computed(() => (mode.value === 'count' ? maxDistrictCount.value : maxShare.value))

function tooltipLabelFor(district: string): string {
  return mode.value === 'count'
    ? numberFormat.format(districtCountByDistrict.value.get(district) ?? 0)
    : `${(shareFor(district) * 100).toFixed(1)}%`
}

/** One row per district, ranked and labeled for whichever mode is active. */
const rankedDistrictRows = computed(() => {
  const rows = props.districtCounts.map((row) => ({
    district: row.district,
    value: valueFor(row.district)
  }))
  rows.sort((a, b) => b.value - a.value)
  return rows.map((row) => {
    const barFraction = maxValue.value > 0 ? (row.value / maxValue.value) * 100 : 0
    const trailingLabel =
      mode.value === 'count'
        ? `${numberFormat.format(row.value)} (${shareOfRange(row.value)})`
        : `${(row.value * 100).toFixed(1)}% (${numberFormat.format(districtStopTypeMap.value.get(row.district)?.get(effectiveStopType.value ?? '') ?? 0)} stops)`
    return { district: row.district, barFraction, trailingLabel }
  })
})

const districtFeatureByDistrict = computed(() => {
  const map = new Map<string, DistrictBoundaryFeature>()
  for (const feature of boundaries.value?.features ?? []) {
    map.set(feature.properties.district, feature)
  }
  return map
})

/**
 * Filtered by actual point-in-polygon geometry against the loaded boundary
 * shapes, not by the dataset's own `district` field — `fetchStopLocations`
 * deliberately doesn't select it. See the comment there for why.
 */
const detailLocations = computed(() => {
  if (!selectedDistrict.value) return []
  const feature = districtFeatureByDistrict.value.get(selectedDistrict.value)
  if (!feature) return []
  return locationsInDistrict(props.locations, feature)
})

const detailLegible = computed(() => isLegibleDensity(detailLocations.value))

const showCircles = computed(
  () => selectedDistrict.value !== null && reliable.value && detailLegible.value
)

const caption = computed(() => {
  if (!selectedDistrict.value) {
    return reliable.value
      ? 'Click a district to see its own intersection-level locations, when this range has enough of them recorded.'
      : "This range's coordinates aren't recorded reliably enough to show intersections for any district. District is the most precise location this range has."
  }
  if (!detailLegible.value) {
    return (
      `District ${selectedDistrict.value}'s own locations are still too dense to draw ` +
      `individually (${numberFormat.format(detailLocations.value.length)} distinct places). ` +
      'A shorter date range may stay legible.'
    )
  }
  const places = detailLocations.value.length
  const placeNoun = places === 1 ? 'place' : 'places'
  const plotted = totalPlottedStops(detailLocations.value)
  const districtTotal = districtCountByDistrict.value.get(selectedDistrict.value) ?? 0
  // Not phrased as "X of Y" — a located stop here is one whose coordinate
  // falls inside this district's mapped shape, which isn't exactly the same
  // set as "this district's own recorded stops": a few percent of stops
  // recorded under one district geocode into a neighboring one instead (see
  // CLAUDE.md). Both figures are real; neither is a subset of the other.
  const base = `${numberFormat.format(plotted)} stops have a recorded location within District ${selectedDistrict.value}'s mapped shape, at ${numberFormat.format(places)} ${placeNoun}.`
  const districtContext =
    districtTotal > 0
      ? ` District ${selectedDistrict.value} recorded ${numberFormat.format(districtTotal)} stops here in total.`
      : ''
  return props.locationsTruncated
    ? `${base}${districtContext} Showing the busiest locations only; the quietest were left off.`
    : `${base}${districtContext}`
})

/**
 * Shown regardless of whether a district is selected: it affects whether
 * this range's coordinates look reliable at all, which matters before
 * anyone clicks, not just within one district's drill-down.
 */
const addressInconsistencyNote = computed(() => {
  const count = props.addressInconsistentCount ?? 0
  if (count <= 0) return null
  return (
    `${numberFormat.format(count)} located ${count === 1 ? 'stop is' : 'stops are'} left off: ` +
    "the address recorded for each one doesn't agree with itself about where it is."
  )
})

function districtStyle(feature?: GeoJSON.Feature): L.PathOptions {
  const district = String(feature?.properties?.district ?? '')
  const isSelected = selectedDistrict.value === district
  const dimmed = selectedDistrict.value !== null && !isSelected
  return {
    className: `district-polygon district-${district}`,
    fillColor: districtFillColor(valueFor(district), maxValue.value),
    // Faint on purpose once a district is selected, so the outlined district
    // and its circles stay the clear focus instead of competing with seven
    // other tinted shapes for attention.
    fillOpacity: dimmed ? 0.06 : 0.55,
    color: isSelected ? '#ffffff' : '#1b1c1d',
    weight: isSelected ? 2 : 1,
    opacity: dimmed ? 0.25 : 0.85
  }
}

function restyleDistricts() {
  districtLayer?.setStyle(districtStyle)
  districtLayer?.eachLayer((layer) => {
    const district = districtOf(layer)
    if (district) layer.setTooltipContent(tooltipLabelFor(district))
  })
}

function districtOf(layer: L.Layer): string | null {
  for (const [district, candidate] of districtLayers) {
    if (candidate === layer) return district
  }
  return null
}

function handleDistrictClick(district: string) {
  if (!reliable.value) return
  selectedDistrict.value = selectedDistrict.value === district ? null : district
}

function rebuildCircles() {
  if (!map || !circleLayer) return
  circleLayer.clearLayers()
  if (!showCircles.value) return

  const highest = maxStopCount(detailLocations.value)
  for (const location of detailLocations.value) {
    L.circleMarker([location.latitude, location.longitude], {
      className: 'stop-circle',
      radius: markerRadius(location.count, highest),
      // Same reasoning as the old StopMap: thin and translucent, because busy
      // corridors stack circles several deep and an opaque one hides them.
      color: '#54c8ff',
      weight: 1,
      opacity: 0.85,
      fillColor: '#54c8ff',
      fillOpacity: 0.28
    })
      .bindPopup(popupHtml(location))
      .addTo(circleLayer)
  }
}

function fitToCurrentView() {
  if (!map) return
  if (selectedDistrict.value === null) {
    if (cityBounds) map.fitBounds(cityBounds, { padding: [16, 16] })
    return
  }
  if (showCircles.value) {
    const bounds = boundingBox(detailLocations.value)
    if (bounds) {
      map.fitBounds(bounds, { padding: [24, 24] })
      return
    }
  }
  const layer = districtLayers.get(selectedDistrict.value)
  if (layer && 'getBounds' in layer) map.fitBounds((layer as L.Polygon).getBounds())
}

function buildDistrictLayer() {
  if (!map || !boundaries.value) return
  districtLayer = L.geoJSON(boundaries.value, {
    style: districtStyle,
    onEachFeature: (feature, layer) => {
      const district = String(feature.properties?.district ?? '')
      districtLayers.set(district, layer)
      // Not permanent: several of the city's districts (the dense central
      // ones especially) are small enough on screen, relative to the two or
      // three that stretch out toward the lake and the marsh, that always-on
      // labels for all 8 stack on top of each other and become unreadable.
      // Color alone still distinguishes them at a glance; hovering gets the
      // exact count.
      layer.bindTooltip(tooltipLabelFor(district), {
        direction: 'center',
        className: 'district-count-label'
      })
      layer.on('click', () => handleDistrictClick(district))
    }
  }).addTo(map)
  cityBounds = districtLayer.getBounds()
  fitToCurrentView()
}

onMounted(async () => {
  if (!container.value) return

  map = L.map(container.value, {
    center: [29.9511, -90.0715],
    zoom: 11,
    scrollWheelZoom: false,
    renderer: canvasAvailable() ? L.canvas() : undefined
  })

  L.tileLayer(TILE_URL, {
    attribution: TILE_ATTRIBUTION,
    maxNativeZoom: MAX_NATIVE_ZOOM,
    maxZoom: 19
  }).addTo(map)

  circleLayer = L.layerGroup().addTo(map)

  try {
    boundaries.value = await loadDistrictBoundaries()
    buildDistrictLayer()
  } catch (cause) {
    boundaryError.value = cause instanceof Error ? cause.message : 'Could not load district shapes'
  }
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
  districtLayer = null
  circleLayer = null
  districtLayers.clear()
})

watch(() => props.districtCounts, restyleDistricts)
watch([mode, effectiveStopType], restyleDistricts)
watch(selectedDistrict, () => {
  restyleDistricts()
  rebuildCircles()
  fitToCurrentView()
})
watch(() => props.locations, rebuildCircles)
</script>

<template>
  <section class="relative w-full">
    <!-- Leaflet sizes itself from this element, so the height is fixed rather
         than content-derived. -->
    <div ref="container" class="h-[80vh] min-h-[32rem] w-full overflow-hidden"></div>

    <div
      class="border-nola-border bg-nola-surface mt-4 w-full rounded-lg border p-4 shadow-xl lg:absolute lg:top-4 lg:right-4 lg:z-[1001] lg:mt-0 lg:max-h-[calc(100%-2rem)] lg:w-full lg:max-w-sm lg:overflow-y-auto"
    >
      <div class="flex flex-col items-center gap-1 pb-3 text-center">
        <h2 class="text-nola-muted text-xs font-semibold tracking-wide uppercase">
          Recorded Stops
        </h2>
        <p class="tabular text-nola-blue-bright flex items-center gap-2 text-3xl font-light">
          <NSpin v-if="loading" size="small" />
          <span>{{ formattedCount }}</span>
        </p>
        <p class="text-nola-muted text-xs">{{ rangeLabel }}</p>
        <NButton v-if="selectedDistrict" size="small" quaternary @click="selectedDistrict = null">
          Show all districts
        </NButton>
      </div>

      <div class="border-nola-border flex items-center gap-2 border-t pt-3 pb-1">
        <NButton
          size="tiny"
          :type="mode === 'count' ? 'primary' : 'default'"
          quaternary
          @click="mode = 'count'"
        >
          By Count
        </NButton>
        <NButton
          size="tiny"
          :type="mode === 'composition' ? 'primary' : 'default'"
          quaternary
          @click="mode = 'composition'"
        >
          By Stop Type
        </NButton>
      </div>
      <NSelect
        v-if="mode === 'composition'"
        :value="effectiveStopType"
        :options="stopTypeOptions"
        size="small"
        class="pb-2"
        @update:value="chosenStopType = $event"
      />

      <div>
        <div
          v-if="rankedDistrictRows.length === 0 && !loading"
          class="text-nola-muted py-4 text-center text-sm"
        >
          No stops recorded for this range.
        </div>
        <div v-else class="space-y-1.5">
          <button
            v-for="row in rankedDistrictRows"
            :key="row.district"
            type="button"
            class="flex w-full items-center gap-2 text-left text-sm"
            @click="handleDistrictClick(row.district)"
          >
            <span class="text-nola-muted w-16 shrink-0">District {{ row.district }}</span>
            <div class="bg-nola-ink/40 h-3 flex-1 overflow-hidden rounded">
              <div
                class="bg-nola-blue-bright h-full rounded"
                :style="{ width: `${row.barFraction}%` }"
              />
            </div>
            <span class="tabular text-nola-muted w-28 shrink-0 text-right text-xs">
              {{ row.trailingLabel }}
            </span>
          </button>
        </div>
      </div>

      <p class="text-nola-muted pt-3 text-xs">{{ caption }}</p>
      <p v-if="addressInconsistencyNote" class="text-nola-muted pt-2 text-xs">
        {{ addressInconsistencyNote }}
      </p>
      <p v-if="boundaryError" class="text-nola-muted pt-2 text-xs">
        District shapes could not be loaded; try reloading the page.
      </p>

      <div class="flex items-center gap-2 pt-3 text-xs">
        <span class="text-nola-muted">{{ mode === 'count' ? 'Fewer stops' : 'Lower share' }}</span>
        <span
          class="h-2 w-16 rounded"
          style="background: linear-gradient(to right, #2185d0, #54c8ff)"
        />
        <span class="text-nola-muted">{{ mode === 'count' ? 'More stops' : 'Higher share' }}</span>
      </div>

      <p class="text-nola-muted pt-3 text-xs">
        Every stop is assigned a district regardless of whether its exact location was recorded —
        all 720,425 stops, 1991 onward. Circles, when shown, are recorded at the nearest
        intersection or block, not at an exact address.
      </p>
    </div>
  </section>
</template>
