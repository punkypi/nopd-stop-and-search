# Stop and Search Queries

A small static site over New Orleans' public
[Stop and Search (Field Interviews)](https://data.nola.gov/d/nfft-hjwi) dataset,
showing how many traffic stops were recorded in a date range and which vehicle
makes and models turn up in them.

Live at <https://punkypi.github.io/stop_and_search>.

## Stack

| Concern    | Tool                                      |
| ---------- | ----------------------------------------- |
| Build      | Vite 8                                    |
| UI         | Vue 3 (Composition API, `<script setup>`) |
| Components | naive-ui (MIT)                            |
| Styling    | Tailwind CSS 4                            |
| Types      | TypeScript, checked with `vue-tsc`        |
| Tests      | Vitest + `@vue/test-utils` (jsdom)        |
| Lint       | ESLint 10 + `eslint-plugin-vue`, Prettier |
| Deploy     | GitHub Actions → GitHub Pages             |

Node 26 is required; the version is pinned in `.nvmrc`.

```bash
nvm use          # or: fnm use
npm install
npm run dev
```

## Scripts

| Command                | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `npm run dev`          | Dev server with hot reload                             |
| `npm run bake`         | Refresh `public/data/snapshot.json` from data.nola.gov |
| `npm run build`        | Bake, typecheck, then build to `dist/`                 |
| `npm run build:nobake` | Build without re-baking (CI bakes as its own step)     |
| `npm run preview`      | Serve the built `dist/` locally                        |
| `npm test`             | Run the test suite once                                |
| `npm run test:watch`   | Run tests in watch mode                                |
| `npm run typecheck`    | `vue-tsc` over `.ts` and `.vue`                        |
| `npm run lint`         | ESLint                                                 |

## How the data works

The dataset holds ~440,000 traffic-violation records, with events spanning
1991 to November 2025. Aggregation happens **server-side** via SoQL: the app asks
Socrata for `count(*)` and for counts grouped by `vehiclemake, vehiclemodel`,
rather than downloading rows and counting them locally.

There are two paths to a number on the page:

1. **The default range** (the month containing the newest event) is read from
   `public/data/snapshot.json`, produced at build time by
   `scripts/bake-data.mjs`. First paint needs no API request at all.
2. **Any other range** the user picks is queried live from the browser. An
   in-flight request is aborted when the range changes again, so a slow earlier
   response cannot land after a faster later one.

Baking is deliberately non-fatal. If data.nola.gov is unreachable during a
build, the committed snapshot is reused and the build continues with a warning.
The deploy workflow also re-bakes monthly on a schedule, so the published
snapshot keeps up without a code change.

`SOCRATA_APP_TOKEN` is optional in both the script and the app. Socrata app
tokens are rate-limit identifiers rather than credentials, and every query here
works without one.

## Deployment

Pushing to `main` (or `master`) runs `.github/workflows/deploy.yml`, which
typechecks, tests, bakes, builds, and publishes `dist/` straight to GitHub Pages
as a build artifact.

There is no longer a `gh-pages` branch holding compiled output — Pages reads the
artifact directly. **One-time setup:** in the repository's
_Settings → Pages → Build and deployment_, set **Source** to **GitHub Actions**.

The site is served from a repository subpath, so the build needs
`BASE_PATH=/stop_and_search/`. The workflow derives this automatically via
`actions/configure-pages`; `npm run dev` and `npm run preview` serve from `/`.

## Notes on the toolchain

`typescript` is held at 6.x because `vue-tsc` cannot run on TypeScript 7: the
TS 7 native compiler removed the `typescript/lib/tsc` entry point and exposes its
API only under `./unstable/*`, which the Volar-based type checkers are still
waiting on. This affects `npm run typecheck` alone — Vite strips types without
checking them, so the shipped bundle is unaffected. Bump to `^7` once `vue-tsc`
supports it.

## License

GPL-3.0. See [LICENSE](LICENSE).
