# Changelog

All notable changes to **Dynamic API Platform** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Cron scheduler for periodic tasks
- Outbound webhooks on platform events
- MCP server for AI agent tools
- API versioning (`/api/v1/...`)
- API keys for machine-to-machine auth

## [1.2.0] - 2026-06-18

### Added
- **OpenAPI / Swagger** — auto-generated spec at `/api/openapi.json` and interactive UI at `/api/swagger`
- **Project export/import** — download/upload `project.json` from Settings (endpoint groups, endpoints, optional data & settings)
- **JavaScript handlers** — `async function handler(req, db)` on endpoints; replaces default CRUD when enabled; no restart required
- Admin UI: **API Docs** page (`/api-docs`), **Handler** tab in endpoint editor

### Changed
- OpenAPI, Swagger, and project routes excluded from dynamic engine catch-all

## [1.1.0] - 2026-06-18

### Added
- **`reference` schema field type** — link records between endpoints (foreign keys)
  - Target endpoint selector in the schema editor (**Linked endpoint**)
  - Validation on create/update: referenced record must exist in the target collection
  - **`?populate=true`** or **`?populate=fieldName`** on GET requests to embed linked records
- **Database Explorer** — admin UI (`/database`) and REST API (`/api/database/*`) for raw MongoDB access
  - Whitelisted collections: users, groups, endpoints, endpointgroups, endpointdatas, logs, systemsettings
  - View, create, edit, delete documents as JSON; search and pagination
  - Requires `manage_users`; sensitive user fields redacted; changes audit-logged
- **Network access rules** — restrict dynamic endpoints by allowed **domains** and **IP/CIDR pools**
  - Configurable on **endpoint groups** and individual **endpoints** (Network Access tab/section)
  - Group inheritance with merged rules; enforced at runtime before JWT access-type checks
  - Admin tester can simulate client IP and `Origin` header
- **API Schema** — read-only ER diagram of endpoints, groups, and reference links (`/api-schema`)
- **Light theme** — slate + cyan UI aligned with WASH-PHO-CRM dashboard; toggle in header
- Documentation: [Network Access](docs/network-access.md), [Database Explorer](docs/database.md), [API Schema](docs/api-schema.md)
- Session handling: centralized `UnauthorizedError` and auth state sync on token expiry
- Zero-downtime API creation documented (no server restart on new routes); comparison with Strapi/Directus

### Changed
- License changed from MIT to **Apache License 2.0**
- GitHub Pages and repository URLs migrated to `Dynamic-API-Platform` organization
- Admin UI layout: top header bar with user info, theme toggle, and logout
- System endpoints **List Users** and **List Groups**: `accessType` set to `authenticated` (documented as management API; RBAC enforced on the real route)
- Seed migration: existing system endpoints get updated `accessType` and descriptions on backend startup

### Fixed
- **Session expiry UX** — expired or invalid tokens redirect to `/login` instead of showing "Failed to load dashboard"
- **JWT refresh bug** — access tokens issued after refresh had empty `permissions` when user groups were populated from MongoDB
- **System endpoint tester** — built-in test for `/api/users`, `/api/groups`, `/api/profile` now calls real management APIs with RBAC
- **Dynamic engine** — GET/PUT/DELETE on paths with parameters (e.g. `/api/products/:id`) now resolve records using the collection base path
- Broken images in `docs/screenshots.md` on GitHub (use raw.githubusercontent.com URLs)
- Nginx `proxy_pass` in frontend container — full API paths (e.g. `/api/auth/login`) now reach backend

## [1.0.0] - 2026-06-18

### Added

#### Platform core
- Full-stack Dynamic API Platform deployable via `docker compose up -d`
- Node.js / Express / TypeScript backend with MongoDB persistence
- React / TypeScript / Tailwind CSS admin panel with dark theme
- Dynamic REST API engine — endpoints stored in MongoDB and executed at runtime
- Repository + Service layer architecture on the backend
- Automatic database seeding (admin user, system groups, system endpoints, endpoint groups, default settings)

#### Authentication & security
- JWT access + refresh token authentication
- bcrypt password hashing
- Role-based access control (RBAC) with permission checks
- Login lockout after failed attempts (configurable in Settings)
- API rate limiting (configurable window and max requests)
- Helmet security headers, CORS, CSRF token endpoint
- Audit logging for auth, CRUD, and API calls

#### Dynamic API engine
- Create custom REST endpoints via UI (GET, POST, PUT, PATCH, DELETE)
- Schema builder with field types: `string`, `number`, `boolean`, `object`, `array`, `datetime`, `json`
- Nested object fields support
- Data validation against schema on write operations
- Shared `resourcePath` storage for CRUD on the same path
- Dynamic path parameters (`/api/users/:id`)
- Access types: `public`, `authenticated`, `group`
- Built-in API tester (Postman-like) in endpoint editor
- Auto-generated documentation and request/response examples

#### System endpoints (non-deletable)
- `/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh`, `/api/auth/register`
- `/api/users`, `/api/groups`, `/api/profile`
- `/api/health`, `/api/csrf-token`

#### Admin UI pages
- **Dashboard** — users, endpoints, requests, errors, groups stats + charts
- **Endpoints** — grouped collapsible tables per endpoint group, quick edit, full editor
- **Endpoint Groups** — CRUD with name, description, color, display order
- **Users** — CRUD with groups assignment, server-side pagination and search
- **User Groups** — RBAC groups with permissions, system groups protected
- **Audit Logs** — filter by action, server-side pagination and text search
- **System** — OS, CPU, memory, disk, files, network interfaces with search
- **Settings** — auth lockout, JWT lifetimes, registration toggle, rate limits, log retention, pagination defaults

#### Search
- Unified `SearchInput` component across all dynamic data sections
- Client-side search: Endpoints, User Groups, Endpoint Groups, System network, Schema fields
- Server-side search: Users, Audit Logs

#### DevOps
- Docker Compose with health checks for MongoDB, backend, frontend
- Named volumes: `dap_mongodb_data`, `dap_backend_logs`
- Nginx frontend proxy to backend API in production container
- GitHub Actions CI workflow
- GitHub Pages documentation site (`/docs`)
- Wiki mirror in `/wiki` folder

### Default credentials (change after first login!)
- Login: `admin`
- Password: `Admin123!`

### Default RBAC groups
- Super Admin, Admin, Editor, Manager, User

### Default endpoint groups
- CRM, SHOP, DEVICES

[1.2.0]: https://github.com/Dynamic-API-Platform/Dynamic-API-Platform/releases/tag/v1.2.0
[1.1.0]: https://github.com/Dynamic-API-Platform/Dynamic-API-Platform/releases/tag/v1.1.0
[1.0.0]: https://github.com/Dynamic-API-Platform/Dynamic-API-Platform/releases/tag/v1.0.0
