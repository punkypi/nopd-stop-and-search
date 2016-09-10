## Starting Local Development Server

Run `npm start .` and navigate to `localhost:8080`.

### Adding Changes

Be sure to compile your source files into `bin/` so it can be referenced when
the source file is imported via `System.import(...)`:
`jspm bundle app/[file] bin/[file] --inject`
