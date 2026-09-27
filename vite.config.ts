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
 */
const base = process.env.BASE_PATH ?? '/'

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
