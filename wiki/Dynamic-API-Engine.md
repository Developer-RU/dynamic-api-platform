# Dynamic API Engine

Full guide: [Dynamic API Engine](https://developer-ru.github.io/dynamic-api-platform/dynamic-api-engine.html)

Endpoints defined in MongoDB are served at runtime without restart.

## Schema types

`string`, `number`, `boolean`, `object`, `array`, `datetime`, `json`

## Data sharing

GET and POST on same path share `EndpointData` via `resourcePath`.

## Features

- Schema validation on write
- Path parameters (`:id`)
- Auto docs and examples
- Built-in API tester
