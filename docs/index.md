---
layout: default
---

<img class="banner" src="{{ '/banner.png' | relative_url }}" alt="Dynamic API Platform">

**Create, manage, and test REST APIs without writing backend code.**

Dynamic API Platform is an open-source full-stack application that lets you define REST endpoints through a web UI, attach JSON schemas, enforce access control, and serve data instantly — powered by MongoDB and a runtime API engine.

<p class="quick-links">
  <a href="{{ '/getting-started/' | relative_url }}">Quick Start</a> ·
  <a href="{{ '/architecture/' | relative_url }}">Architecture</a> ·
  <a href="{{ '/api-reference/' | relative_url }}">API Reference</a> ·
  <a href="https://github.com/Developer-RU/dynamic-api-platform">GitHub</a>
</p>

## Features

| Category | Capabilities |
|----------|-------------|
| **Dynamic APIs** | CRUD endpoints defined in UI, schema validation, path params, grouped organization |
| **Security** | JWT auth, RBAC, rate limiting, login lockout, audit logs, Helmet, CORS |
| **Admin Panel** | Dashboard, endpoint editor, API tester, auto-docs, users & groups management |
| **DevOps** | Docker Compose one-command deploy, health checks, persistent volumes |
| **Search** | Full-text search on all data list pages (client + server side) |

## Quick Start

```bash
git clone https://github.com/Developer-RU/dynamic-api-platform.git
cd dynamic-api-platform
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
| [Deployment]({{ '/deployment/' | relative_url }}) | Docker, production, reverse proxy |
| [Configuration]({{ '/configuration/' | relative_url }}) | Environment variables & Settings UI |
| [Development]({{ '/development/' | relative_url }}) | Local dev setup, project conventions |
| [Screenshots]({{ '/screenshots/' | relative_url }}) | UI gallery |
| [FAQ]({{ '/faq/' | relative_url }}) | Common questions |
| [Troubleshooting]({{ '/troubleshooting/' | relative_url }}) | Known issues and fixes |

## Preview

<img src="{{ '/screenshots/dashboard.png' | relative_url }}" alt="Dashboard">

[Full screenshot gallery →]({{ '/screenshots/' | relative_url }})

## Tech Stack

- **Backend:** Node.js 20, Express, TypeScript, Mongoose, MongoDB 7
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Recharts
- **Infrastructure:** Docker, Docker Compose, Nginx

## License

[MIT License](https://github.com/Developer-RU/dynamic-api-platform/blob/main/LICENSE)
