# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
