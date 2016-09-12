## Starting Local Development Server

This actually isn't needed. Since the application is a static page,
it's suggested to compile as you develop and test via loading the static
`/index.html`.

To start the server, run `npm start .` and navigate to `localhost:8080`.

### Adding Changes

Be sure to compile your source files into `bin/` so it can be referenced when
the source file is imported via `System.import(...)`:
`jspm bundle app/[file] bin/[file]`

### Testing Changes

`npm test` will handle all code quality and feature specs.
