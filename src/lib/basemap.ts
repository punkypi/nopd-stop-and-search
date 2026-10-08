/**
 * Shared tile-layer configuration for both map components. Plain data, no
 * Leaflet import, so it's legal for `src/lib` under the project's layering
 * rule while still keeping this out of each component.
 */

/**
 * Esri's World Dark Gray Canvas: a muted basemap built to sit *under* data,
 * which is what keeps circles and polygons legible, and served without an
 * API key.
 *
 * Note the `{z}/{y}/{x}` order — Esri puts the row before the column, the
 * reverse of the `{z}/{x}/{y}` nearly every other tile service uses. Swapping
 * them yields tiles of the wrong place rather than an error.
 *
 * CARTO's dark basemap was the obvious alternative and is no longer usable
 * without a key: its tiles still return HTTP 200, but the image is a slab
 * reading "API KEY REQUIRED". Anything that checks tile loading by status
 * code alone will report that as healthy, so check the picture.
 */
export const TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'

/** Verbatim from the service's own `copyrightText`, which Esri requires be shown. */
export const TILE_ATTRIBUTION =
  '<a href="https://www.esri.com" target="_blank" rel="noreferrer">Esri</a>, HERE, Garmin, ' +
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> ' +
  'contributors, and the GIS user community'

/**
 * The deepest level Esri actually has tiles for. Past it the service returns a
 * "no data" placeholder rather than a 404, so Leaflet cannot detect the gap on
 * its own; telling it the native limit makes it upscale level 16 instead.
 */
export const MAX_NATIVE_ZOOM = 16
