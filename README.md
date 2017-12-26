# Stop and Search Queries

[![CircleCI](https://circleci.com/gh/punkypi/stop_and_search.svg?style=svg)](https://circleci.com/gh/punkypi/stop_and_search)

## Running the App

`npm start` will run `server.js`, making the application accessible on
`localhost:8080`.

## Adding Changes

Be sure to compile your source files into `out/` so it can be referenced when
the source file is imported via `System.import(...)`:
`jspm bundle app/[file] out/[file]`

## Testing Changes

`npm test` will handle all code quality and feature specs.
