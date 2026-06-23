---
layout: default
---

<img class="banner" src="https://raw.githubusercontent.com/Dynamic-API-Platform/Dynamic-API-Platform/main/docs/banner.png" alt="Dynamic API Platform">

**Create, manage, and test REST APIs without writing backend code.**

Dynamic API Platform is an open-source full-stack application that lets you define REST endpoints through a web UI, attach JSON schemas, enforce access control, and serve data instantly — powered by MongoDB and a runtime API engine.

## About

The platform's defining capability is **zero-downtime API creation**: every endpoint you add or edit in the admin panel is registered in MongoDB and served on the next HTTP request. There is no need to restart Node.js, reload nginx, or redeploy containers when you ship a new route.

That sets it apart from tools like **Strapi**, **Directus**, and bespoke Express backends, where content models and routes are usually baked into code at build time or require a restart to pick up changes. Here, the route table is dynamic — save an endpoint in the UI and call it right away with `curl` or your frontend.

Ideal when you need APIs that evolve quickly: internal admin backends, MVPs, integration layers, or a lightweight alternative to a full headless CMS when you only need REST + schemas + access control.

## What's new

| Update | Summary |
|--------|---------|
| **v1.3 — Cron** | Scheduled jobs (JavaScript, HTTP, internal endpoint) at `/cron` |
| **v1.3 — Webhooks** | Outbound event subscriptions with optional HMAC at `/webhooks` |
| **v1.3 — MCP** | JSON-RPC server at `POST /api/mcp` for AI agent tool integration |
| **v1.3 — API keys** | Machine-to-machine auth via `X-API-Key` at `/api-keys` |
| **v1.3 — API versioning** | Serve `/api/v1/...` alongside `/api/...` per endpoint |
| **v1.2 — OpenAPI** | Auto-generated spec at `/api/openapi.json`, Swagger UI at `/api-docs` |
| **v1.2 — JS handlers** | Custom `async function handler(req, db)` per endpoint |
| **v1.2 — Export / import** | Full project backup and restore in Settings |
| **`reference` fields** | Foreign keys between endpoints; validate links on write; `?populate=` on GET |
| **Network access** | Restrict dynamic APIs by allowed domains and IP/CIDR pools (group + endpoint) |
| **Database Explorer** | Raw MongoDB browser/editor at `/database` (requires `manage_users`) |
| **API Schema** | Read-only ER diagram of endpoints, groups, and reference links at `/api-schema` |
| **Zero-downtime routes** | Save an endpoint in the UI — callable immediately, no restart |
| **Auth improvements** | Redirect to login when session expires; fixed JWT refresh permissions |
| **UI themes** | Light and dark themes (slate + cyan); toggle in header or login page |
| **License** | Apache License 2.0 |

Details: [Automation & Integrations]({{ '/automation/' | relative_url }}) · [Changelog on GitHub](https://github.com/Dynamic-API-Platform/Dynamic-API-Platform/blob/main/CHANGELOG.md)

<p class="quick-links">
  <a href="{{ '/getting-started/' | relative_url }}">Quick Start</a> ·
  <a href="{{ '/architecture/' | relative_url }}">Architecture</a> ·
  <a href="{{ '/automation/' | relative_url }}">Automation</a> ·
  <a href="{{ '/api-reference/' | relative_url }}">API Reference</a> ·
  <a href="https://github.com/Dynamic-API-Platform/Dynamic-API-Platform">GitHub</a> ·
  <a href="https://github.com/Developer-RU">Developer</a>
</p>

## Features

| Category | Capabilities |
|----------|-------------|
| **Dynamic APIs** | CRUD endpoints defined in UI, **available instantly without server restart**, schema validation, path params, **`reference` fields (foreign keys)**, `?populate=` on GET, **network access (domains / IP pools)**, **API versioning**, grouped organization |
| **Automation** | **Cron scheduler**, **outbound webhooks**, **JavaScript handlers**, **MCP server** for AI agents, **API keys** for M2M auth |
| **OpenAPI** | Auto-generated spec, Swagger UI, embedded **API Docs** in admin panel |
| **Security** | JWT auth with refresh, RBAC, **API keys**, **network access rules**, rate limiting, login lockout, audit logs, Helmet, CORS |
| **Admin Panel** | Dashboard, endpoint editor, **Handler tab**, **API Schema (ER diagram)**, **API Docs**, **Cron / Webhooks / API Keys**, linked-endpoint picker, **Network Access** tab, **Database Explorer (raw JSON)**, API tester, users & groups, **project export/import** |
| **DevOps** | Docker Compose one-command deploy, health checks, persistent volumes |
| **Search** | Full-text search on all data list pages (client + server side) |

## Quick Start

```bash
git clone https://github.com/Dynamic-API-Platform/Dynamic-API-Platform.git
cd Dynamic-API-Platform
docker compose up -d
```

| Service | URL |
|---------|-----|
| Admin UI | http://localhost:8080 |
| Backend API | http://localhost:3001 |
| MongoDB | localhost:27017 |

**Default login:** `admin` / `Admin123!` — change immediately in production.

## Documentation

| Document | Description |
|----------|-------------|
| [Getting Started]({{ '/getting-started/' | relative_url }}) | Installation, first endpoint, curl examples |
| [Architecture]({{ '/architecture/' | relative_url }}) | System design, layers, data flow |
| [API Reference]({{ '/api-reference/' | relative_url }}) | All management API endpoints |
| [RBAC]({{ '/rbac/' | relative_url }}) | Permissions, groups, access types |
| [Dynamic API Engine]({{ '/dynamic-api-engine/' | relative_url }}) | How runtime endpoints work |
| [API Schema]({{ '/api-schema/' | relative_url }}) | ER-style diagram of endpoints and references |
| [Database Explorer]({{ '/database/' | relative_url }}) | Raw MongoDB admin UI and API |
| [Network Access]({{ '/network-access/' | relative_url }}) | Domain and IP/CIDR restrictions for dynamic APIs |
| [Automation]({{ '/automation/' | relative_url }}) | Cron, webhooks, MCP, API keys, JS handlers, OpenAPI |
| [Deployment]({{ '/deployment/' | relative_url }}) | Docker, production, reverse proxy |
| [Configuration]({{ '/configuration/' | relative_url }}) | Environment variables & Settings UI |
| [Development]({{ '/development/' | relative_url }}) | Local dev setup, project conventions |
| [Screenshots]({{ '/screenshots/' | relative_url }}) | UI gallery |
| [FAQ]({{ '/faq/' | relative_url }}) | Common questions |
| [Troubleshooting]({{ '/troubleshooting/' | relative_url }}) | Known issues and fixes |

## Preview

![Dashboard preview](https://raw.githubusercontent.com/Dynamic-API-Platform/Dynamic-API-Platform/main/docs/screenshots/dashboard.png)

[Full screenshot gallery →]({{ '/screenshots/' | relative_url }})

## Tech Stack

- **Backend:** Node.js 20, Express, TypeScript, Mongoose, MongoDB 7
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Recharts
- **Infrastructure:** Docker, Docker Compose, Nginx

## License

[Apache License 2.0](https://github.com/Dynamic-API-Platform/Dynamic-API-Platform/blob/main/LICENSE)
