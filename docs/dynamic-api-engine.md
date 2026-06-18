---
layout: default
title: Dynamic API Engine
---

# Dynamic API Engine

The dynamic engine is the core feature of the platform — it serves REST APIs defined in MongoDB at runtime without server restarts or code deployments.

## How it works

1. Admin creates an **Endpoint** document: path, HTTP method, schema, access rules
2. Incoming HTTP request hits `dynamic.routes.ts` (registered last in Express)
3. Engine looks up matching endpoint by **normalized path + method**
4. Access control is enforced
5. For write operations, request body is validated against schema
6. Data is stored in **EndpointData** collection
7. Response returned as JSON; call count incremented; action logged

## Path matching

Paths are normalized:
- Leading `/` added if missing
- Trailing `/` removed (except root)

Dynamic parameters supported:

```
/api/users/:id  →  matches /api/users/507f1f77bcf86cd799439011
```

Parameters extracted and available in handlers.

## Schema field types

| Type | Validation | Example |
|------|------------|---------|
| `string` | typeof string | `"hello"` |
| `number` | typeof number | `42` |
| `boolean` | typeof boolean | `true` |
| `array` | Array.isArray | `["a","b"]` |
| `object` | Plain object | `{ "key": "val" }` |
| `datetime` | Valid ISO date | `"2026-01-15T10:00:00Z"` |
| `json` | Any JSON value | accepted as-is |

### Nested objects

Define `children` array on object fields for nested validation.

### Defaults

Set `defaultValue` on schema fields — applied on create if field omitted.

## Data storage model

**EndpointData** documents:

```json
{
  "endpointId": "ObjectId",
  "resourcePath": "/api/products",
  "data": { "name": "Laptop", "price": 999 },
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Shared resource path

Multiple methods on the **same path** share data:

| Endpoint | Method | Shares data with |
|----------|--------|------------------|
| `/api/products` | GET | POST on `/api/products` |
| `/api/products` | POST | GET on `/api/products` |

This allows classic REST patterns: POST to create, GET to list.

## CRUD behavior

### GET `/api/resource`

Returns paginated list of all records for `resourcePath`.

### GET `/api/resource/:id`

Returns single record. `:id` is MongoDB `_id`.

### POST `/api/resource`

Validates body → creates EndpointData → returns created record with `_id`.

### PUT `/api/resource/:id`

Full replace of `data` field after validation.

### PATCH `/api/resource/:id`

Merge update into existing `data`.

### DELETE `/api/resource/:id`

Removes record.

## System endpoints

Endpoints with `isSystem: true` are:
- Shown with lock icon in UI
- **Cannot be deleted**
- Managed by platform code (auth, users, groups routes handle actual logic)

They appear in the endpoint list for documentation and testing purposes.

## Auto-documentation

For any endpoint, the platform generates:

- **Examples** (`GET /api/endpoints/:id/examples`) — sample request/response JSON
- **Docs** (`GET /api/endpoints/:id/docs`) — structured documentation with parameters table

Generated from schema fields automatically.

## Built-in tester

The **Test** tab in endpoint editor calls `POST /api/endpoints/:id/test` which:
1. Executes the endpoint logic internally
2. Returns request details, response status, body, and timing
3. Does not require external tools

## Limitations (v1.0)

- No custom JavaScript hooks per endpoint
- No relational joins between endpoint data collections
- No built-in file upload field type
- Schema changes do not migrate existing data
- Rate limiting is global, not per-endpoint

## Example: complete CRUD API

Create four endpoints sharing path `/api/tasks`:

| Method | Name | Purpose |
|--------|------|---------|
| GET | List Tasks | Paginated list |
| POST | Create Task | Add new task |
| PUT | Update Task | `path: /api/tasks/:id` |
| DELETE | Delete Task | `path: /api/tasks/:id` |

Schema fields: `title` (string), `done` (boolean), `dueDate` (datetime).
