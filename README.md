# Stop and Search Queries

[![CircleCI](https://circleci.com/gh/punkypi/stop_and_search.svg?style=svg)](https://circleci.com/gh/punkypi/stop_and_search)

## Running the App

Since the application is a static page, it's suggested to compile as you
develop and test via loading the static `/index.html`.

### Adding Changes

Be sure to compile your source files into `out/` so it can be referenced when
the source file is imported via `System.import(...)`:
`jspm bundle app/[file] out/[file]`

### Testing Changes

`npm test` will handle all code quality and feature specs.
