# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
