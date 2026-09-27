/**
 * A small SoQL client for Socrata's OData-ish JSON API, replacing `soda-js`.
 *
 * Socrata endpoints are plain HTTPS GETs whose query string carries `$select`,
 * `$where`, `$group`, `$order` and `$limit`, so a dependency buys very little
 * over `URLSearchParams`. Building the URL here also means the same code runs in
 * the browser and in the Node build script that bakes data.
 */

/** The NOLA Stop and Search (Field Interviews) dataset. */
export const DEFAULT_DOMAIN = 'data.nola.gov'
export const DEFAULT_DATASET = 'nfft-hjwi'

/**
 * Socrata app tokens are rate-limit identifiers, not secrets — they carry no
 * privileges and are designed to sit in client-side code. Requests work without
 * one, just against a lower shared quota, so this stays optional.
 */
const APP_TOKEN: string | undefined =
  (import.meta.env?.VITE_SOCRATA_APP_TOKEN as string | undefined) || undefined

export interface SoQLQuery {
  select?: string
  where?: string
  group?: string
  order?: string
  limit?: number
  offset?: number
}

export interface SocrataOptions {
  domain?: string
  dataset?: string
  appToken?: string
  signal?: AbortSignal
}

export class SocrataError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly url?: string
  ) {
    super(message)
    this.name = 'SocrataError'
  }
}

export function buildUrl(query: SoQLQuery, options: SocrataOptions = {}): string {
  const domain = options.domain ?? DEFAULT_DOMAIN
  const dataset = options.dataset ?? DEFAULT_DATASET
  const params = new URLSearchParams()

  if (query.select) params.set('$select', query.select)
  if (query.where) params.set('$where', query.where)
  if (query.group) params.set('$group', query.group)
  if (query.order) params.set('$order', query.order)
  if (query.limit !== undefined) params.set('$limit', String(query.limit))
  if (query.offset !== undefined) params.set('$offset', String(query.offset))

  return `https://${domain}/resource/${dataset}.json?${params.toString()}`
}

/**
 * Runs a query and returns its rows.
 *
 * Every value comes back as a string — Socrata JSON does not type numbers — so
 * callers are responsible for coercing counts.
 */
export async function runQuery<Row = Record<string, string>>(
  query: SoQLQuery,
  options: SocrataOptions = {}
): Promise<Row[]> {
  const url = buildUrl(query, options)
  const token = options.appToken ?? APP_TOKEN
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) headers['X-App-Token'] = token

  let response: Response
  try {
    response = await fetch(url, { headers, signal: options.signal })
  } catch (cause) {
    // An aborted request is a normal consequence of the user moving the date
    // range again before the previous query finished; let callers detect it.
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new SocrataError(`Could not reach ${options.domain ?? DEFAULT_DOMAIN}`, undefined, url)
  }

  if (!response.ok) {
    throw new SocrataError(
      `Socrata responded ${response.status} ${response.statusText}`,
      response.status,
      url
    )
  }

  return (await response.json()) as Row[]
}

/** Escapes a string literal for interpolation into a SoQL `where` clause. */
export function soqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}
