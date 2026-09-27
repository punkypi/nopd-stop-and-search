/**
 * Builds URLs for files served alongside the app from `public/`.
 *
 * These cannot be written as plain absolute paths, because the site is served
 * from a repository subpath on GitHub Pages (`/stop_and_search/`) but from the
 * root during local development.
 *
 * Vite exposes that prefix as `import.meta.env.BASE_URL`, but it does not
 * guarantee a trailing slash: it reflects whatever `base` was configured with,
 * and `actions/configure-pages` reports its `base_path` output without one. So
 * interpolating it directly produced requests for
 * `/stop_and_searchdata/snapshot.json`, which 404s. Joining through here keeps
 * that from depending on how the base happened to be spelled.
 */

/** Joins a base prefix and a relative path with exactly one slash between them. */
export function joinBase(base: string, path: string): string {
  const prefix = base.endsWith('/') ? base : `${base}/`
  const suffix = path.startsWith('/') ? path.slice(1) : path
  return `${prefix}${suffix}`
}

/** Resolves a path inside `public/` against the app's configured base URL. */
export function withBase(path: string): string {
  return joinBase(import.meta.env.BASE_URL ?? '/', path)
}
