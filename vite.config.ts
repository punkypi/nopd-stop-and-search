import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
// vitest/config re-exports Vite's defineConfig with the `test` key typed.
import { defineConfig } from 'vitest/config'

/**
 * GitHub Pages serves this project from https://<user>.github.io/stop_and_search/,
 * so every asset URL needs that repository-name prefix. Deploys driven by the
 * Pages workflow set BASE_PATH; `npm run dev` and `vite preview` leave it unset
 * and serve from the root.
 *
 * The trailing slash is forced on because `actions/configure-pages` reports its
 * `base_path` output without one, and Vite surfaces `base` verbatim through
 * `import.meta.env.BASE_URL`. Without this, anything resolved against that value
 * came out as `/stop_and_searchdata/snapshot.json` and 404d in production while
 * working locally.
 */
const rawBase = process.env.BASE_PATH ?? '/'
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

export default defineConfig({
  base,
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    // Source maps make the deployed bundle debuggable from the browser without
    // a local checkout, which matters for a site touched once every few years.
    sourcemap: true
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test/setup.ts'],
    // naive-ui ships ESM that Vitest must not externalize, otherwise component
    // tests fail to resolve its internal style injection.
    server: {
      deps: { inline: ['naive-ui'] }
    }
  }
})
