/**
 * Tombstone for the service worker the old create-react-app build installed.
 *
 * That build called `registerServiceWorker()`, which precached `index.html` and
 * served it cache-first. Anyone who visited the React version still has that
 * worker installed, and it will keep serving them the old page from CacheStorage
 * no matter what this site deploys — a plain reload cannot get past it, because
 * the worker intercepts the request before the HTTP cache is consulted.
 *
 * Simply deleting the file is not enough. Browsers only re-check a worker's
 * script on navigation, and that navigation is itself answered from the stale
 * cache, so the old worker can survive for a day or more.
 *
 * So this file has to keep existing at the original path and scope
 * (`/stop_and_search/service-worker.js`) in order to replace the old worker,
 * drop every cache it created, unregister itself, and reload any open tab onto
 * the real site. Nothing in the current app registers a service worker, so a
 * visitor who never saw the React build will never fetch this.
 *
 * Safe to delete once enough time has passed that no stale registrations remain.
 */

self.addEventListener('install', () => {
  // Take over from the old worker immediately rather than waiting for every tab
  // using it to close.
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(names.map((name) => caches.delete(name)))

      await self.registration.unregister()

      // Reload open tabs, which are still showing the old cached shell.
      const clients = await self.clients.matchAll({ type: 'window' })
      for (const client of clients) {
        client.navigate(client.url)
      }
    })()
  )
})
