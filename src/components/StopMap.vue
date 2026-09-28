<script setup lang="ts">
/**
 * Located traffic stops, one circle per coordinate, sized by how many stops it
 * holds.
 *
 * Leaflet is driven imperatively here rather than through a wrapper library: it
 * owns its own DOM subtree and mutating it directly is both fewer dependencies
 * and closer to Leaflet's own documentation. Everything that decides *what* a
 * viewer sees — which rows are plottable, how big a circle is, where the view
 * lands — lives in `@/lib/stopLocations` as pure functions, so this file holds
 * only the wiring.
 */
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { NButton, NSpin } from 'naive-ui'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'

import {
  boundingBox,
  markerRadius,
  maxStopCount,
  NOLA_CENTER,
  popupHtml,
  totalPlottedStops,
  type StopLocation
} from '@/lib/stopLocations'

const props = defineProps<{
  locations: readonly StopLocation[]
  /** Stops in the range overall, including those with no recorded location. */
  rangeTotal: number | null
  /** True when the location cap was reached and the quietest places were dropped. */
  truncated?: boolean
  loading?: boolean
}>()

/**
 * Esri's World Dark Gray Canvas: a muted basemap built to sit *under* data,
 * which is what keeps the circles legible, and served without an API key.
 *
 * Note the `{z}/{y}/{x}` order — Esri puts the row before the column, the
 * reverse of the `{z}/{x}/{y}` nearly every other tile service uses. Swapping
 * them yields tiles of the wrong place rather than an error.
 *
 * CARTO's dark basemap was the obvious alternative and is no longer usable
 * without a key: its tiles still return HTTP 200, but the image is a slab
 * reading "API KEY REQUIRED". Anything that checks tile loading by status code
 * alone will report that as healthy, so check the picture.
 */
const TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'

/** Verbatim from the service's own `copyrightText`, which Esri requires be shown. */
const TILE_ATTRIBUTION =
  '<a href="https://www.esri.com" target="_blank" rel="noreferrer">Esri</a>, HERE, Garmin, ' +
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> ' +
  'contributors, and the GIS user community'

/**
 * The deepest level Esri actually has tiles for. Past it the service returns a
 * "no data" placeholder rather than a 404, so Leaflet cannot detect the gap on
 * its own; telling it the native limit makes it upscale level 16 instead.
 */
const MAX_NATIVE_ZOOM = 16

const container = useTemplateRef<HTMLDivElement>('container')
const collapsed = ref(false)

let map: L.Map | null = null
let markers: L.LayerGroup | null = null

/**
 * Whether a 2D canvas context can actually be obtained.
 *
 * Probed per component instance rather than per module: everything declared in
 * `<script setup>` is compiled into `setup()`, so this is instance state like
 * `map` and `markers` above. That is what those two need, and the page only ever
 * mounts one map, so the throwaway element costs nothing worth restructuring for.
 *
 * Leaflet's default SVG renderer creates one DOM node per circle, which a
 * multi-year range (thousands of coordinates) turns into a visibly janky page.
 * Canvas draws them all into one element and stays smooth. But a canvas context
 * is not always available — jsdom has no 2D context at all — and asking Leaflet
 * for a canvas renderer there throws, so this falls back to SVG rather than
 * assuming.
 */
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

const plottedStops = computed(() => totalPlottedStops(props.locations))

/**
 * States how much of the range the map actually accounts for.
 *
 * The dataset only began recording coordinates in 2018, and even now a few
 * stops arrive without them, so the map is routinely a subset of the headline
 * total. Saying so is the difference between a map that informs and one that
 * quietly under-reports.
 */
const coverageLabel = computed(() => {
  const places = props.locations.length
  if (places === 0) return null
  const placeNoun = places === 1 ? 'place' : 'places'
  const base =
    props.rangeTotal === null || props.rangeTotal <= 0
      ? `${numberFormat.format(plottedStops.value)} stops at ${numberFormat.format(places)} ${placeNoun}`
      : `${numberFormat.format(plottedStops.value)} of ${numberFormat.format(props.rangeTotal)} stops have a recorded location, at ${numberFormat.format(places)} ${placeNoun}`
  return `${base}.`
})

function rebuildMarkers() {
  if (!map || !markers) return
  markers.clearLayers()

  const highest = maxStopCount(props.locations)
  for (const location of props.locations) {
    L.circleMarker([location.latitude, location.longitude], {
      radius: markerRadius(location.count, highest),
      // Deliberately thin and translucent: dense corridors overlap heavily, and
      // opaque circles would hide every point underneath the topmost one.
      color: '#54c8ff',
      weight: 1,
      opacity: 0.85,
      fillColor: '#54c8ff',
      fillOpacity: 0.28
    })
      .bindPopup(popupHtml(location))
      .addTo(markers)
  }

  const bounds = boundingBox(props.locations)
  if (bounds) map.fitBounds(bounds, { padding: [24, 24] })
}

onMounted(() => {
  if (!container.value) return

  map = L.map(container.value, {
    center: [...NOLA_CENTER] as L.LatLngTuple,
    zoom: 11,
    // Scroll should scroll the page; the map zooms on double-click, pinch, or
    // the zoom control. A map that swallows the wheel traps a reader mid-page.
    scrollWheelZoom: false,
    renderer: canvasAvailable() ? L.canvas() : undefined
  })

  L.tileLayer(TILE_URL, {
    attribution: TILE_ATTRIBUTION,
    maxNativeZoom: MAX_NATIVE_ZOOM,
    maxZoom: 19
  }).addTo(map)
  markers = L.layerGroup().addTo(map)
  rebuildMarkers()
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
  markers = null
})

watch(() => props.locations, rebuildMarkers)

/**
 * Leaflet measures its container once, at creation. While collapsed the
 * container has no size, so the map has to be re-measured on the way back out or
 * it renders as a single stretched tile.
 */
watch(collapsed, async (isCollapsed) => {
  if (isCollapsed) return
  await nextTick()
  map?.invalidateSize()
  rebuildMarkers()
})
</script>

<template>
  <section class="border-nola-border bg-nola-surface rounded-lg border">
    <header class="border-nola-border flex flex-wrap items-center gap-3 border-b px-4 py-3">
      <h2 class="text-nola-blue-bright mr-auto text-base font-semibold">Where Stops Happened</h2>
      <NSpin v-if="loading" size="small" />
      <NButton size="small" quaternary @click="collapsed = !collapsed">
        {{ collapsed ? 'Show' : 'Hide' }}
      </NButton>
    </header>

    <div v-show="!collapsed" class="px-2 py-2">
      <p class="text-nola-muted px-2 pb-2 text-xs">
        <span v-if="coverageLabel">{{ coverageLabel }}</span>
        <span v-else-if="!loading">
          No stops in this range have a recorded location. Coordinates were not recorded before
          2018.
        </span>
        <span v-if="truncated">
          Showing the busiest locations only; the quietest were left off.
        </span>
      </p>

      <!-- Leaflet sizes itself from this element, so the height is fixed rather
           than content-derived. -->
      <div ref="container" class="h-[26rem] w-full overflow-hidden rounded-md sm:h-[32rem]"></div>

      <p class="text-nola-muted px-2 pt-2 text-xs">
        Circle area is proportional to the number of stops recorded at that point. Stops are
        recorded at the nearest intersection or block, not at an exact address.
      </p>
    </div>
  </section>
</template>
