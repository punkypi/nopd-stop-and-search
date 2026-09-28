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
 * What is baked is only the *default* view (the most recent month holding
 * events). Custom date ranges are still queried live from the browser, because
 * pre-computing every possible range is not possible. So the page is instant on
 * load, and remains fully interactive afterwards.
 *
 * Failure is non-fatal on purpose. A deploy should not break because
 * data.nola.gov had a bad minute; if the fetch fails and a previous snapshot is
 * present, this keeps the old one and warns.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'public', 'data')

const DOMAIN = process.env.SOCRATA_DOMAIN ?? 'data.nola.gov'
const DATASET = process.env.SOCRATA_DATASET ?? 'nfft-hjwi'
/** Optional: a rate-limit identifier, not a credential. Requests work without it. */
const APP_TOKEN = process.env.SOCRATA_APP_TOKEN
const TIMEOUT_MS = Number(process.env.BAKE_TIMEOUT_MS ?? 60_000)

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

function startOfMonth(day) {
  return { year: day.year, month: day.month, day: 1 }
}

function endOfMonth(day) {
  // Day 0 of the next month is the last day of this one.
  return { year: day.year, month: day.month, day: new Date(day.year, day.month, 0).getDate() }
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

  // The default view is the whole month containing the newest event, which is
  // what the app opened on before.
  const defaultRange = { start: startOfMonth(latest), end: endOfMonth(latest) }
  const where = rangeWhere(defaultRange)

  const [[countRow], groupRows, locationRows, stopTypeRows] = await Promise.all([
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
    })
  ])

  const locationsTruncated = locationRows.length > MAX_LOCATIONS
  const stopLocations = (locationsTruncated ? locationRows.slice(0, MAX_LOCATIONS) : locationRows)
    .map((row) => stopLocation(row.latitude, row.longitude, row.total, row.address))
    .filter((location) => location !== null)

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
    defaultRangeLocationsTruncated: locationsTruncated
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
      `${locationsTruncated ? ' (capped)' : ''}\n` +
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
