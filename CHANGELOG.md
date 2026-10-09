# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [3.3.1] - 2026-10-08

### Fixed

- The drill-down caption read "X of Y stops in District N have a recorded
  location," implying X is a subset of Y. It isn't quite: measured on the
  default range, 4.4% of located stops are recorded under one district but
  geocode into a different district's shape (mostly a neighboring one, range
  3.4%-7.2% per district). Nothing is lost to this — those stops still count
  in the district's tabular total and still render as a circle under
  whichever shape they actually fall in — but the caption now states both
  figures as independent facts instead of implying one contains the other.

## [3.3.0] - 2026-10-08

### Added

- District choropleth: NOPD's 8 police district boundaries, baked from
  `data.nola.gov`'s NOPD Districts dataset into
  `public/data/nopd-districts.geojson`, colored and labeled (on hover) by
  stop count. Click a district to drill into its own intersection-level
  locations — membership is decided by testing each stop's coordinate
  against the real boundary polygon (`featureContainsPoint`/
  `locationsInDistrict` in `src/lib/districtBoundaries.ts`), not by a tabular
  field, so a drill-down circle is always inside the outline drawn around it.
- `isLegibleDensity`/`MAX_LEGIBLE_LOCATIONS` in `src/lib/stopLocations.ts` —
  a district's own locations only render as circles below ~1,500 distinct
  points, the threshold past which they stop being visually distinguishable.
- `consistentLocations`/`inconsistentAddressLocations` in
  `src/lib/stopLocations.ts`: excludes a location when its own recorded
  address also appears at another coordinate 200m or further away within the
  same batch — the dataset's own data disagreeing with itself about where
  that address is, not just a border-line judgment call. Measured live: 3.8%
  of the default range's located stops are excluded. Disclosed on the map
  rather than silently dropped.

### Changed

- Replaced the always-conditional intersection map (`StopMap.vue`) with one
  interactive map (`DistrictMap.vue`): the choropleth is the default,
  unconditional view — unlike coordinates, `district` has no era where it's
  unreliable — and intersection-level circles are now a drill-down, not a
  separate panel.
- `boundingBox()` now frames the view on the core of a location set (97% of
  weighted stop count) rather than its full extent, so a handful of distant
  but real locations no longer drag the default zoom out and compress the
  dense core into a sliver.
- `DistrictBreakdown.vue`'s caption no longer tracks a second map's
  visibility; it always points at the map below.

### Fixed

- District boundary data loaded into a plain `ref()`, deep-wrapping every
  nested coordinate in a reactive proxy. The point-in-polygon check in
  `locationsInDistrict` read those coordinates millions of times per click;
  switched to `shallowRef()`, cutting click-to-render from 2.9-7.3 seconds
  down to under 15ms.

## [3.2.0] - 2026-10-07

### Added

- "By District" — stops grouped by NOPD's 8 police districts, now the
  predominant spatial panel. `district` is populated for all 720,425 stops,
  confirmed live back to 1991, with none of the coordinate field's own
  reliability problem: 2010 has only 1 located stop out of 62,006, but a
  complete, real 8-way district split.
- `fetchDistrictCounts`/`DistrictCount` in `src/lib/stops.ts`, and
  `locatedShare`/`isLocationCoverageReliable` in `src/lib/stopLocations.ts` —
  the first reuses this session's recurring "how much of this range does X
  cover" shape (see `vehicleCoverage`); the second is new.

### Changed

- The intersection map now renders only when the selected range's own
  location coverage clears 50% (`LOCATION_COVERAGE_THRESHOLD`) — previously
  it rendered unconditionally, including for ranges like 2010 where it showed
  a single point against 62,006 real stops. District carries the "where"
  question below that line instead, with a caption explaining why the map
  isn't there rather than a near-empty one standing in its place.

## [3.1.2] - 2026-10-07

### Added

- Location coverage, per year, on the "Stops by year" sparkline — a bright
  cap at the top of each bar showing the share of that year's stops with a
  usable coordinate. A second, later cliff from the stop-count one: 2010
  already has 62,006 stops on record but only 1 located, and the share stays
  under 1% until 2018. A reader who clicks an early year and finds the map
  nearly empty can now see why beforehand instead of discovering it as a
  surprise. Each bar's tooltip states the located count too, not just the
  total.

## [3.1.1] - 2026-10-07

### Fixed

- The "Stops by year" sparkline's bars never actually rendered — each one set
  `height` as a CSS percentage, which only resolves against an ancestor with a
  _definite_ height, and the flex container sizing them (`items-end`, sized by
  its own content) never had one. Every bar silently computed to 0px, leaving
  the whole chart a large blank card. Heights are now computed in pixels
  directly instead of relying on percentage resolution.

## [3.1.0] - 2026-10-07

### Changed

- The default view is now the dataset's latest 12 months, not "the month
  containing the newest event." The old default was structurally broken: the
  newest month always lags in reporting, so it opened every visitor on a
  near-empty window (404 stops in November 2025, against 2,000-4,000 in a
  typical month).

### Added

- "Quick ranges": always-visible preset buttons (Latest Month, Latest 30
  Days, Latest 90 Days, Latest 12 Months, Calendar Year, All Time) next to the
  date picker. Named "Latest," not "Last" — a relative label implying "as of
  right now" goes stale the moment real time passes the data, which it
  already has by about eleven months in this environment. Every preset shows
  its resolved calendar span as a subtitle, so nobody has to take the label on
  faith.
- A "Stops by year" sparkline next to the date picker, covering the whole
  34-year record. It exists because the record's reporting density turned out
  to be far more uneven than month-to-month lag: fewer than 700 stops are on
  record across all of 1991-2009 combined (1992-1998 and 2006 have zero rows),
  against 39,000+ most years since 2010 — not two quiet decades, but when
  NOPD's electronic field-interview system started being populated. The chart
  makes that visible before anyone picks a date; clicking a year filters to it.
- `src/lib/dateRangePresets.ts` and `src/lib/stopsOverTime.ts`, both pure and
  unit-tested, plus `subtractDays`, `startOfYear`, `laterOf`, `earlierOf` and
  `toMonthYearString` in `src/lib/dates.ts`.
- A paragraph in the About panel stating what a date-filtered figure actually
  claims: the record for that window, not a claim about what happened then.

## [3.0.0] - 2026-09-27

### Added

- `stopTypes` in the baked snapshot: how the whole record divides by kind of
  stop. The About panel lists it with each kind's share, so the composition is
  named from data rather than asserted in prose.
- The About panel states that the kinds of stop are not interchangeable. Search
  rate conditional on a stop runs 8.7% for Black drivers against 4.4% for white
  drivers among traffic stops, but 16.7% against 11.3% pooled across every kind,
  so a pooled figure compresses the difference and needs its mix shown beside it.
- The vehicle breakdown states how much of a range recorded a vehicle at all,
  e.g. "371 of 404 stops in this range recorded a vehicle". A stop of someone on
  foot has no car to record, which the traffic-only filter used to hide.
- `vehicleCoverage` in `src/lib/stops.ts`, with unit tests, and a component test
  covering the vehicle panel's disclosure copy.

### Changed

- The page now covers every kind of stop the record holds rather than only
  traffic violations. The filter hid 280,374 of the dataset's 720,425 stops,
  among them the `SUSPECT PERSON` and `CITIZEN CONTACT` categories that the
  phrase "stop and search" most describes.
- Raised the map's coordinate cap from 25,000 to 45,000. All of time holds 37,773
  distinct in-bounds coordinates; the old cap was chosen while queries were still
  traffic-only and all-time held roughly 20,700, so leaving it would have
  silently truncated the map for any range covering the whole dataset.
- The headline panel reads "Recorded Stops" in place of "Traffic Violations".
- Renamed `src/lib/trafficViolations.ts` to `src/lib/stops.ts`,
  `useViolationData` to `useStopData` and `ViolationTotal` to `StopTotal`. The
  snapshot's `totalViolations` field is now `totalStops`.

## [2.1.0] - 2026-09-27

### Added

- A map of where stops happened, drawn with Leaflet over Esri's dark basemap.
  Stops are grouped by coordinate server-side and drawn as circles whose **area**
  is proportional to the count; clicking one names the block or intersection.
  Radius scales on the square root so a location with ten times the stops does
  not appear a hundred times heavier.
- The map states how much of the selected range it accounts for, e.g. "352 of
  366 stops have a recorded location, at 172 places". Coordinates were only
  recorded from 2018 onward and roughly 63% of all rows carry a placeholder
  `0, 0`, so the map is routinely a subset of the headline total and now says by
  how much.
- Stop locations for the default range are baked into the snapshot, so the map
  paints on first load without an API request like the rest of the page.
- `bin/soql`, a shell front end to the dataset's SoQL API, so checking real
  values before designing a feature does not mean hand-encoding a URL.
- `npm run verify`, running lint, typecheck and test as one gate.

### Changed

- CI now runs `npm run verify` in place of separate typecheck and test steps.
  Lint had not been enforced anywhere, locally or in CI.

## [2.0.0] - 2026-09-26

### Changed

- Rewrote the app on Vue 3 + Vite + TypeScript, replacing React 16 and
  create-react-app. `react-scripts` 1.0.14 had been unmaintained for years and
  create-react-app itself is deprecated.
- Replaced Semantic UI React with naive-ui. Semantic UI React is unmaintained,
  and its icon fonts alone accounted for over 1 MB of the published payload.
- Replaced `@blueprintjs/datetime`'s `DateRangeInput` with naive-ui's date
  picker.
- Replaced `moment` with native `Date` and `Intl`; replaced the `Date` class with
  plain `CalendarDay` values in `src/lib/dates.ts`.
- Replaced `soda-js` with a small `fetch`-based SoQL client in
  `src/lib/socrata.ts`, dropping the app token from the client entirely.
- Replaced the `TrafficViolation*Request` class hierarchy with async functions in
  `src/lib/trafficViolations.ts`.
- The default date range now comes from a snapshot baked at build time, so the
  first paint makes no API request. Other ranges are still queried live.
- Provenance figures in the about panel are read from the snapshot instead of
  being written into the prose, which had drifted: it claimed event data began in
  1999 when the earliest record is from 1991.
- Deployment moved from a `gh-pages` branch to GitHub Actions publishing the
  build artifact directly to GitHub Pages.
- CI moved from CircleCI to GitHub Actions.
- Node 26 is now required, up from Node 7.

### Fixed

- Inclusive date ranges now cover their final day. `toDBString` compared against
  midnight, so every stop recorded after 00:00:00 on a range's last day was
  omitted from both the total and the vehicle breakdown.
- The vehicle table no longer keys rows on `Math.random()`, which defeated list
  reconciliation on every re-render.
- The page no longer fires a query for the current month on startup only to
  discard it once the real default range is known.
- A slow response for an earlier date range can no longer overwrite the figures
  for a newer one; superseded requests are aborted.
- Assets resolved against the base URL 404d on GitHub Pages while working
  locally. `actions/configure-pages` reports its `base_path` without a trailing
  slash and Vite passes `base` through to `import.meta.env.BASE_URL` verbatim, so
  interpolation produced `/stop_and_searchdata/snapshot.json`. That broke the
  favicon and the baked snapshot, which silently fell the page back to querying
  the current month, where there is no event data.
- Returning visitors were served the old React page from cache. The previous
  build registered a service worker that precached `index.html` and served it
  cache-first, so removing it was not enough; `public/service-worker.js` now
  replaces it with one that clears the caches, unregisters itself, and reloads.

### Removed

- `Mix` and `Hideable`. Vue composables and a plain `ref` cover what the mixin
  machinery existed to share.
- `SearchableDropdown`, `OptionalLabel`, `DateRangeForm`, `Month`,
  `NotImplementedError`, `RuntimeError`, `ValidationError`, `URI`, `Validate`,
  and `registerServiceWorker` — all unused or superseded.
- `immutable`, `lodash`, `kind-of`, `es6-error`, `urijs`, `validate.js`,
  `prop-types`, `documentation`, `normalize.css`, and `react-addons-css-transition-group`.
- `.jshintrc`, `.htmlhintrc`, and `circle.yml`.
- `./bin/deploy`, `./bin/doc`, and `./bin/doc_server`.

## [1.23.0] - 2026-08-24

### Changed

- `VehicleGroupStatistics` now defaults to "descending" sort.

## [1.22.0] - 2026-08-24

### Added

- `MostRecentEventDateRequest` does what it says, gets the most recent event date.
- `Date.fromDBString(dbString)` helper method to convert DB date strings to a `Date` object.

### Changed

- `App` now changes date selection after component load to the latest month with
  event data in it. If none found, then the current month is still the default range.
- `AboutUs` component now explains the latest event data is from 2025.

## [1.21.0] - 2018-02-18

### Changed

- `VehicleGroupStatistics` can now be sorted by count, make, or model, in
  ascending or descending order.

## [1.20.0] - 2018-02-14

### Added

- `./bin/deploy` shortcut for `yarn deploy`.

### Changed

- Documented `hideable` constructor.

## [1.19.0] - 2018-02-13

### Added

- `./bin/dev_server` shortcut for running `yarn start`.
- `Hideable` mixin, to contain sharable hidden/visibility logic.

### Changed

- `VehicleGroupStatistics` now mixes in `Hideable`.

### Removed

- `VehicleGroupStatistics#hidden`, now mixed in from `Hideable`.
- `VehicleGroupStatistics#visible`, now mixed in from `Hideable`.

## [1.18.0] - 2018-02-12

### Added

- `lodash` (https://lodash.com/docs).
- `kind-of` (https://github.com/jonschlinkert/kind-of).
- `VehicleGroupStatistics#visible` property, opposite of `#hidden`.

### Changed

- Documented `App`.
- Documented `TrafficViolations`.

## [1.17.0] - 2018-02-11

### Added

- `VehicleGroupStatistics.defaultProps`.
- `VehicleGroupStatistics#hidden()`, what is the current hidden state.
- `VehicleGroupStatistics#hideButtonText`, what the Hide button currently says.
- `VehicleGroupStatistics#onHideButtonClick(event)`, handles hiding/unhiding.

### Changed

- `VehicleGroupStatistics` can now be hidden via a menu button.

## [1.16.0] - 2018-02-04

### Added

- `documentation` lib.
- `./bin/doc` to generate `src/**` `HTML` documentation in `docs/index.html`.
- `./bin/doc_server` to generate and watch `src/**` `HTML` documentation at
  `localhost:4001`.

### Changed

- `VehicleGroupStatistics` documented.

## [1.15.0] - 2018-02-03

### Added

- Search input to `VehicleGroupStatistics`, users can now search for data in
  `VehicleGroup#count`, `#make`, or `#model`.
- `VehicleGroupStatistics.searchableData`, the `VehicleGroup` properties a user
  may search through.
- `VehicleGroupStatistics#onSearchChange(event)`, updates `#searchTerm` when
  the user edits the search input.
- `VehicleGroupStatistics#searchTerm`, the user's current search input value.
- `VehicleGroupStatistics#searchableData`, a convenience reference to
  `.searchableData`.

### Changed

- `VehicleGroupStatistics#vehicleGroups` now filters in any `VehicleGroup`
  instances including the `#searchTerm` in the data white listed in
  `#searchableData`.

## [1.14.0] - 2018-02-03

### Added

- `src/VehicleGroupStatistic.css`, for custom styling.

### Changed

- `body` `background-color` now inverted.
- `src/AboutUs.js` now inverted.
- `src/App.js` now inverted.
- `src/AppBody.js` now inverted.
- `src/AppFooter.js` now inverted.
- `src/AppHeader.js` now inverted.
- `src/TrafficViolations.js` now inverted.
- `src/VehicleGroupStatistic.js` now inverted.
- `src/VehicleGroupStatistics.js` now inverted.

### Removed

- `src/NullLabel.js`, no longer needed.

## [1.13.0] - 2018-01-29

### Added

- "Favorite Colours" list to `src/App.css`.
- `favicon.ico` to `AppHeader` menu header.

### Changed

- `public/fleur_de_lis_blue.ico` now a lighter shade of blue (copied to
  `public/favicon.ico`).

## [1.12.0] - 2018-01-28

### Added

- `public/favicon.ico`, a copy of `public/fleur_de_lis_blue.ico`.
- `Image` of `public/favicon.ico` to `AppHeader`.

### Changed

- `public/manifest.json` now points to `public/favicon.ico` again.
- `DateRangeFilter` input field tags now same color as `public/favicon.ico`
  (`#3e46b3`).

### Fixed

- `DateRangeFilter` input fields no longer extend outside of `Menu.Item`.
- `DateRangeFilter` "End" tag point no longer extends into "E".

## [1.11.0] - 2018-01-27

### Added

- `App.defaultProps`.
- `App.propTypes`.
- `App#endDate`, for an app-wide end date.
- `App#onDateRangeChange`, for when the user updates the app's date range.
- `App#startDate`, for an app-wide start date.
- `DateRangeFiler.js`, for menu-embeded date range forms.
- `src/TextColors.css` for `color` styling shortcuts.

### Changed

- `AppHeader` is now `stackable` and wraps its children in `stackable`
  `Menu.Item` tags.
- `TrafficViolations` now does not manage internal date range state and updates
  its traffic information when its date range via props changes.

## [1.10.0] - 2018-01-15

### Changed

- `public/manifest.json` `"short_name"` now `"NOLA SAS"`.
- `public/manifest.json` `"name"` now `"NOLA Stop and Search Data"`.

### Fixed

- `public/manifest.json` `192x192` icon now `fleur_de_lis_blue.ico`.

### Removed

- Starter `create-recate-app` doc-comments in `public/index.html`.

## [1.9.3] - 2018-01-15

### Fixed

- `VehicleGroupStatistics` columns overlapping at different screen sizes.

## [1.9.2] - 2018-01-15

### Fixed

- Bug causing `TrafficViolations`' `DateRangeForm` to overlap with
  the "total" statistic.

## [1.9.1] - 2018-01-14

### Fixed

- Incorrect reference to `this.title` in `AboutUs`, now `this.props.title`.

## [1.9.0] - 2018-01-14

### Changed

- `AppHeader` component's `title` defaults to `'NOLA Stop and Search Data'`
  when not given.

## [1.8.0] - 2018-01-14

### Added

- `prop-types` library.

### Changed

- `AboutUs` component's `title` defaults to `'About Us'` when not given.

## [1.7.0] - 2018-01-14

### Changed

- `AboutUs` component now accepts a `title` prop.

## [1.6.0] - 2018-01-14

### Added

- `AboutUs` component created from `AppFooter`'s `#info` element.

### Changed

- `AppFooter` component now renders children components.

### Fixed

- Typo in `src/AppFooter.js` (was `AppHeader`, now `AppFooter`).

## [1.5.0] - 2018-01-14

### Changed

- `AppBody` component now renders children components.

## [1.4.0] - 2018-01-14

### Changed

- `AppHeader` component now accepts a `title` prop.

## [1.3.0] - 2018-01-14

### Changed

- `AppHeader` component now renders children components.

## [1.2.0] - 2018-01-14

### Added

- `public/fleur_de_lis_black.ico`.
- `public/fleur_de_lis_blue.ico`.

### Changed

- `public/index.html` show uses `fluer_de_lis_blue.ico` as its shortcut icon.

## [1.1.0] - 2018-01-07

### Changed

- `AppHeader` now has a fixed, inverted `SemanticUI` `Menu` instead of `Header`.

## [1.0.0] - 2017-12-29

### Added

- `NullLabel` renders a "NOT PROVIDED" label (when information was not
  supplied to the S.A.S. database).
