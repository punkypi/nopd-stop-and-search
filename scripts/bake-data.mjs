#!/usr/bin/env node
/**
 * Fetches a snapshot of the NOLA Stop and Search dataset at build time and
 * writes it into `public/data/`, so the deployed page paints real numbers with
 * no network round-trip.
 *
 * Why bake at all: the original app made three Socrata requests before it could
 * show anything, including one just to discover the latest event date. That put
 * a third-party API on the critical path of every page load, for data that
 * changes at most monthly.
 *
 * What is baked is only the *default* view (the dataset's latest 12 months —
 * see `defaultRange` below). Custom date ranges are still queried live from the
 * browser, because pre-computing every possible range is not possible. So the
 * page is instant on load, and remains fully interactive afterwards.
 *
 * Failure is non-fatal on purpose. A deploy should not break because
 * data.nola.gov had a bad minute; if the fetch fails and a previous snapshot is
 * present, this keeps the old one and warns.
 */

import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'public', 'data')

const DOMAIN = process.env.SOCRATA_DOMAIN ?? 'data.nola.gov'
const DATASET = process.env.SOCRATA_DATASET ?? 'nfft-hjwi'
/** Optional: a rate-limit identifier, not a credential. Requests work without it. */
const APP_TOKEN = process.env.SOCRATA_APP_TOKEN
const TIMEOUT_MS = Number(process.env.BAKE_TIMEOUT_MS ?? 60_000)

/**
 * NOPD's 8 police district boundaries. Same `data.nola.gov` host as the main
 * dataset, but a different resource and endpoint shape (GeoJSON, not SoQL),
 * and baked independently below since the polygons don't change with the
 * selected range — see `loadDistrictBoundaries` in src/lib/districtBoundaries.ts.
 */
const DISTRICTS_URL = `https://${DOMAIN}/resource/e2he-xim8.geojson`

const MAX_GROUPS = 50_000
/** Keep in step with MAX_LOCATIONS in src/lib/stops.ts, which explains the value. */
const MAX_LOCATIONS = 45_000
/** The dataset holds 12 kinds of stop; the rest is slack. */
const MAX_STOP_TYPES = 500

/**
 * Mirrors NOLA_BOUNDS in src/lib/stopLocations.ts. Keep the two in step.
 *
 * Duplicated rather than imported because this script runs as plain Node against
 * the repository, with no Vite resolution for the `@` alias or for TypeScript —
 * the same reason `vehicleGroup` below is a copy of `buildVehicleGroup`.
 */
const BOUNDS = { minLatitude: 28.8, maxLatitude: 30.4, minLongitude: -90.6, maxLongitude: -89.5 }

const COORDINATE_WHERE =
  `latitude between ${BOUNDS.minLatitude} and ${BOUNDS.maxLatitude} ` +
  `AND longitude between ${BOUNDS.minLongitude} and ${BOUNDS.maxLongitude}`

function soqlUrl(params) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(`$${key}`, String(value))
  }
  return `https://${DOMAIN}/resource/${DATASET}.json?${search}`
}

async function query(params) {
  const url = soqlUrl(params)
  const headers = { Accept: 'application/json' }
  if (APP_TOKEN) headers['X-App-Token'] = APP_TOKEN

  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS)
  })
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`)
  }
  return response.json()
}

/** `2025-11-09T20:10:00.000` -> `{ year: 2025, month: 11, day: 9 }` */
function toCalendarDay(timestamp) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(timestamp).trim())
  if (!match) return null
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) }
}

/** Mirrors subtractDays in src/lib/dates.ts. `n` days before `day`. */
function subtractDays(day, n) {
  const native = new Date(day.year, day.month - 1, day.day)
  native.setDate(native.getDate() - n)
  return { year: native.getFullYear(), month: native.getMonth() + 1, day: native.getDate() }
}

/** Mirrors laterOf in src/lib/dates.ts. The later of two days, compared as plain numbers. */
function laterOf(a, b) {
  const asNumber = (d) => d.year * 10000 + d.month * 100 + d.day
  return asNumber(a) >= asNumber(b) ? a : b
}

function isoDate({ year, month, day }) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * Inclusive on both ends: the upper bound has to carry an end-of-day time.
 *
 * No stop-type clause. Queries used to narrow to TRAFFIC VIOLATION, which left
 * 280,374 of the dataset's stops off the page entirely; the kinds of stop are
 * reported now instead. See the header comment in src/lib/stops.ts.
 */
function rangeWhere(range) {
  return (
    'eventdate between ' +
    `'${isoDate(range.start)}T00:00:00.000' and '${isoDate(range.end)}T23:59:59.999'`
  )
}

/** Mirrors buildStopLocation in src/lib/stopLocations.ts. Returns null when unplottable. */
function stopLocation(latitude, longitude, count, address) {
  const lat = Number(latitude)
  const lon = Number(longitude)
  const stops = Number(count)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  if (lat < BOUNDS.minLatitude || lat > BOUNDS.maxLatitude) return null
  if (lon < BOUNDS.minLongitude || lon > BOUNDS.maxLongitude) return null
  if (!Number.isFinite(stops) || stops <= 0) return null
  return { latitude: lat, longitude: lon, count: stops, address: (address ?? '').trim() }
}

/** Keep in step with MAX_ADDRESS_COORDINATE_SPREAD_METERS in src/lib/stopLocations.ts. */
const MAX_ADDRESS_COORDINATE_SPREAD_METERS = 200

/** Mirrors metersBetween in src/lib/stopLocations.ts. */
function metersBetween(a, b) {
  const metersPerDegreeLat = 111_320
  const metersPerDegreeLon = 111_320 * Math.cos((((a.latitude + b.latitude) / 2) * Math.PI) / 180)
  const dLat = (a.latitude - b.latitude) * metersPerDegreeLat
  const dLon = (a.longitude - b.longitude) * metersPerDegreeLon
  return Math.sqrt(dLat * dLat + dLon * dLon)
}

/** Mirrors consistentLocations/inconsistentAddressLocations in src/lib/stopLocations.ts. */
function partitionByAddressConsistency(locations) {
  const byAddress = new Map()
  for (const location of locations) {
    if (!location.address) continue
    const group = byAddress.get(location.address)
    if (group) group.push(location)
    else byAddress.set(location.address, [location])
  }

  const isolated = new Set()
  for (const group of byAddress.values()) {
    if (group.length <= 1) continue
    for (const candidate of group) {
      const hasNearbySibling = group.some(
        (sibling) =>
          sibling !== candidate &&
          metersBetween(candidate, sibling) < MAX_ADDRESS_COORDINATE_SPREAD_METERS
      )
      if (!hasNearbySibling) isolated.add(candidate)
    }
  }

  return {
    consistent: locations.filter((location) => !isolated.has(location)),
    inconsistentCount: locations
      .filter((location) => isolated.has(location))
      .reduce((sum, l) => sum + l.count, 0)
  }
}

function vehicleGroup(make, model, count) {
  const trimmedMake = (make ?? '').trim()
  const trimmedModel = (model ?? '').trim()
  let makeAndModel
  if (!trimmedMake && !trimmedModel) makeAndModel = 'Not Supplied'
  else if (!trimmedMake) makeAndModel = trimmedModel
  else if (!trimmedModel) makeAndModel = trimmedMake
  else makeAndModel = `${trimmedMake} ${trimmedModel}`
  return { make: trimmedMake, model: trimmedModel, count, makeAndModel }
}

async function bake() {
  process.stdout.write(`Baking ${DATASET} from ${DOMAIN}\n`)

  const [bounds] = await query({
    select: 'min(eventdate) as earliest, max(eventdate) as latest, count(*) as total'
  })

  const latest = toCalendarDay(bounds?.latest)
  const earliest = toCalendarDay(bounds?.earliest)
  if (!latest || !earliest) {
    throw new Error('Dataset reported no events')
  }

  // The default view is the latest 12 months on record, anchored to the
  // dataset's own newest event rather than the wall clock — this script can run
  // long after the data it's baking stops being current. Mirrors
  // DATE_RANGE_PRESETS['latest-12-months'] in src/lib/dateRangePresets.ts; keep
  // the two in step. Clamped to `earliest` so a young dataset (or a narrow test
  // fixture) never asks for a start before its own first event.
  const defaultRange = {
    start: laterOf(subtractDays(latest, 364), earliest),
    end: latest
  }
  const where = rangeWhere(defaultRange)

  const [[countRow], groupRows, locationRows, stopTypeRows, yearlyRows, districtRows] =
    await Promise.all([
      query({ select: 'count(*) as total', where }),
      query({
        select: 'vehiclemake, vehiclemodel, count(*) as total',
        where,
        group: 'vehiclemake, vehiclemodel',
        order: 'total desc',
        limit: MAX_GROUPS
      }),
      query({
        select: 'latitude, longitude, count(*) as total, max(blockaddress) as address',
        where: `${where} AND ${COORDINATE_WHERE}`,
        group: 'latitude, longitude',
        order: 'total desc',
        // One past the cap, so hitting it is detectable without a second query.
        limit: MAX_LOCATIONS + 1
      }),
      // All-time rather than range-scoped: this is provenance, telling a reader what
      // the whole record is made of before they read any single range out of it.
      query({
        select: 'stopdescription, count(*) as total',
        group: 'stopdescription',
        order: 'total desc',
        limit: MAX_STOP_TYPES
      }),
      // Backs the reporting-volume sparkline next to the date picker. All-time,
      // one row per year that has at least one stop — Socrata's GROUP BY omits a
      // year with none rather than returning it with a zero, so the gaps (1992-98,
      // 2006) are filled in client-side by fillYearGaps in src/lib/stopsOverTime.ts,
      // not here. `located` is how many of that year's stops have a usable
      // coordinate — computed alongside `total` rather than as a second query, so
      // the sparkline can show location coverage per year, not just stop volume.
      // 2010 has 62,006 stops and exactly 1 located; coordinates don't become
      // reliable until 2018, years after the stop-count cliff.
      query({
        select:
          'date_extract_y(eventdate) as yr, count(*) as total, ' +
          `sum(case(${COORDINATE_WHERE}, 1, true, 0)) as located`,
        group: 'yr',
        order: 'yr'
      }),
      // Backs the district breakdown — the primary spatial panel, shown for every
      // range. Unlike coordinates, `district` is populated for all 720,425 stops
      // dataset-wide, confirmed live, so this query needs no coordinate filter and
      // no fallback for a thin or ungeocoded range.
      query({
        select: 'district, count(*) as total',
        where,
        group: 'district',
        order: 'total desc'
      })
    ])

  const builtLocations = locationRows
    .map((row) => stopLocation(row.latitude, row.longitude, row.total, row.address))
    .filter((location) => location !== null)
  const { consistent, inconsistentCount: addressInconsistentCount } =
    partitionByAddressConsistency(builtLocations)
  const locationsTruncated = consistent.length > MAX_LOCATIONS
  const stopLocations = locationsTruncated ? consistent.slice(0, MAX_LOCATIONS) : consistent

  const snapshot = {
    bakedAt: new Date().toISOString(),
    domain: DOMAIN,
    dataset: DATASET,
    earliestEventDate: earliest,
    latestEventDate: latest,
    totalStops: Number(bounds?.total ?? 0),
    stopTypes: stopTypeRows.map((row) => ({
      description: (row.stopdescription ?? '').trim(),
      count: Number(row.total ?? 0)
    })),
    defaultRange,
    defaultRangeCount: Number(countRow?.total ?? 0),
    defaultRangeVehicleGroups: groupRows.map((row) =>
      vehicleGroup(row.vehiclemake, row.vehiclemodel, Number(row.total ?? 0))
    ),
    defaultRangeStopLocations: stopLocations,
    defaultRangeLocationsTruncated: locationsTruncated,
    defaultRangeAddressInconsistentCount: addressInconsistentCount,
    // Mirrors buildDistrictCount in src/lib/stops.ts. No `?? ''`/filter needed —
    // `district` has no nulls dataset-wide, confirmed live.
    defaultRangeDistrictCounts: districtRows.map((row) => ({
      district: (row.district ?? '').trim(),
      count: Number(row.total ?? 0)
    })),
    yearlyStopCounts: yearlyRows.map((row) => ({
      year: Number(row.yr),
      count: Number(row.total ?? 0),
      locatedCount: Number(row.located ?? 0)
    }))
  }

  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(join(OUT_DIR, 'snapshot.json'), `${JSON.stringify(snapshot, null, 2)}\n`)

  process.stdout.write(
    `  events        ${isoDate(earliest)} .. ${isoDate(latest)}\n` +
      `  total stops   ${snapshot.totalStops.toLocaleString('en-US')} ` +
      `across ${snapshot.stopTypes.length} kinds of stop\n` +
      `  default range ${isoDate(defaultRange.start)} .. ${isoDate(defaultRange.end)}\n` +
      `  in range      ${snapshot.defaultRangeCount.toLocaleString('en-US')} stops, ` +
      `${snapshot.defaultRangeVehicleGroups.length.toLocaleString('en-US')} make/model pairs\n` +
      `  located       ${stopLocations.length.toLocaleString('en-US')} distinct coordinates` +
      `${locationsTruncated ? ' (capped)' : ''}, ` +
      `${addressInconsistentCount.toLocaleString('en-US')} stops excluded (address disagreed with itself)\n` +
      `  yearly        ${snapshot.yearlyStopCounts.length.toLocaleString('en-US')} years with at least one stop\n` +
      `  districts     ${snapshot.defaultRangeDistrictCounts.length.toLocaleString('en-US')} in range\n` +
      `  wrote         public/data/snapshot.json\n`
  )
}

async function existingSnapshot() {
  try {
    return JSON.parse(await readFile(join(OUT_DIR, 'snapshot.json'), 'utf8'))
  } catch {
    return null
  }
}

async function fileExists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

/**
 * Independent of `bake()` on purpose: the boundaries don't change with the
 * selected range, so a hiccup fetching them shouldn't block refreshing the
 * snapshot, and vice versa. Failure is non-fatal when a previous file is on
 * disk, same reasoning as the snapshot's own fallback above.
 */
async function bakeDistrictBoundaries() {
  const outPath = join(OUT_DIR, 'nopd-districts.geojson')
  try {
    const response = await fetch(DISTRICTS_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) })
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText} for ${DISTRICTS_URL}`)
    }
    const geojson = await response.json()
    if (!Array.isArray(geojson?.features) || geojson.features.length === 0) {
      throw new Error('district boundaries response had no features')
    }
    await mkdir(OUT_DIR, { recursive: true })
    await writeFile(outPath, `${JSON.stringify(geojson)}\n`)
    process.stdout.write(`  districts     ${geojson.features.length} boundary features written\n`)
  } catch (error) {
    if (await fileExists(outPath)) {
      process.stderr.write(
        `\nWARNING: could not refresh district boundaries (${error.message}).\n` +
          `Keeping the committed file. The build continues.\n\n`
      )
    } else {
      process.stderr.write(
        `\nERROR: could not fetch district boundaries and no previous file exists.\n${error.message}\n\n`
      )
      process.exitCode = 1
    }
  }
}

try {
  await bake()
} catch (error) {
  const previous = await existingSnapshot()
  if (previous) {
    process.stderr.write(
      `\nWARNING: could not refresh the snapshot (${error.message}).\n` +
        `Keeping the committed one from ${previous.bakedAt}. The build continues.\n\n`
    )
  } else {
    process.stderr.write(
      `\nERROR: could not bake data and no previous snapshot exists.\n${error.message}\n\n` +
        `Run with BAKE_TIMEOUT_MS=120000 if the API is merely slow.\n`
    )
    process.exitCode = 1
  }
}

await bakeDistrictBoundaries()
