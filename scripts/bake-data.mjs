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

const TRAFFIC_VIOLATION_WHERE = "stopdescription = 'TRAFFIC VIOLATION'"
const MAX_GROUPS = 50_000

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

/** Inclusive on both ends: the upper bound has to carry an end-of-day time. */
function rangeWhere(range) {
  return (
    `${TRAFFIC_VIOLATION_WHERE} AND eventdate between ` +
    `'${isoDate(range.start)}T00:00:00.000' and '${isoDate(range.end)}T23:59:59.999'`
  )
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
    select: 'min(eventdate) as earliest, max(eventdate) as latest, count(*) as total',
    where: TRAFFIC_VIOLATION_WHERE
  })

  const latest = toCalendarDay(bounds?.latest)
  const earliest = toCalendarDay(bounds?.earliest)
  if (!latest || !earliest) {
    throw new Error('Dataset reported no traffic violation events')
  }

  // The default view is the whole month containing the newest event, which is
  // what the app opened on before.
  const defaultRange = { start: startOfMonth(latest), end: endOfMonth(latest) }
  const where = rangeWhere(defaultRange)

  const [[countRow], groupRows] = await Promise.all([
    query({ select: 'count(*) as total', where }),
    query({
      select: 'vehiclemake, vehiclemodel, count(*) as total',
      where,
      group: 'vehiclemake, vehiclemodel',
      order: 'total desc',
      limit: MAX_GROUPS
    })
  ])

  const snapshot = {
    bakedAt: new Date().toISOString(),
    domain: DOMAIN,
    dataset: DATASET,
    earliestEventDate: earliest,
    latestEventDate: latest,
    totalViolations: Number(bounds?.total ?? 0),
    defaultRange,
    defaultRangeCount: Number(countRow?.total ?? 0),
    defaultRangeVehicleGroups: groupRows.map((row) =>
      vehicleGroup(row.vehiclemake, row.vehiclemodel, Number(row.total ?? 0))
    )
  }

  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(join(OUT_DIR, 'snapshot.json'), `${JSON.stringify(snapshot, null, 2)}\n`)

  process.stdout.write(
    `  events        ${isoDate(earliest)} .. ${isoDate(latest)}\n` +
      `  total stops   ${snapshot.totalViolations.toLocaleString('en-US')}\n` +
      `  default range ${isoDate(defaultRange.start)} .. ${isoDate(defaultRange.end)}\n` +
      `  in range      ${snapshot.defaultRangeCount.toLocaleString('en-US')} stops, ` +
      `${snapshot.defaultRangeVehicleGroups.length.toLocaleString('en-US')} make/model pairs\n` +
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
