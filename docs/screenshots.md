---
layout: default
redirect_from:
  - /screenshots.html

title: Screenshots
description: UI screenshots from localhost deployment
---

Screenshots of **Dynamic API Platform v1.3** running at `http://localhost:8080`.

> The admin panel supports **light** and **dark** themes (slate + cyan) — toggle via the header sun/moon button.

## Login

![Login page](https://raw.githubusercontent.com/Dynamic-API-Platform/Dynamic-API-Platform/main/docs/screenshots/login.png)

**URL:** `/login` · **Default:** `admin` / `Admin123!`

## Dashboard

![Dashboard](https://raw.githubusercontent.com/Dynamic-API-Platform/Dynamic-API-Platform/main/docs/screenshots/dashboard.png)

**URL:** `/` — stats, charts, user activity

## Endpoints

![Endpoints](https://raw.githubusercontent.com/Dynamic-API-Platform/Dynamic-API-Platform/main/docs/screenshots/endpoints.png)

**URL:** `/endpoints` — grouped tables, search, filters

## API Schema (ER diagram)

![API Schema](https://raw.githubusercontent.com/Dynamic-API-Platform/Dynamic-API-Platform/main/docs/screenshots/api-schema.png)

**URL:** `/api-schema` — read-only diagram of endpoints, groups, and FK arrows

## API Docs (Swagger)

![API Docs](https://raw.githubusercontent.com/Dynamic-API-Platform/Dynamic-API-Platform/main/docs/screenshots/api-docs.png)

**URL:** `/api-docs` — embedded OpenAPI / Swagger UI

## Endpoint Handler (JavaScript)

![Endpoint Handler](https://raw.githubusercontent.com/Dynamic-API-Platform/Dynamic-API-Platform/main/docs/screenshots/endpoint-handler.png)

**URL:** `/endpoints/:id` → **Handler** tab — custom `async function handler(req, db)`

## Cron Jobs

![Cron Jobs](https://raw.githubusercontent.com/Dynamic-API-Platform/Dynamic-API-Platform/main/docs/screenshots/cron-jobs.png)

**URL:** `/cron` — scheduled JavaScript, HTTP, or endpoint actions

## Webhooks

![Webhooks](https://raw.githubusercontent.com/Dynamic-API-Platform/Dynamic-API-Platform/main/docs/screenshots/webhooks.png)

**URL:** `/webhooks` — outbound event subscriptions

## API Keys

![API Keys](https://raw.githubusercontent.com/Dynamic-API-Platform/Dynamic-API-Platform/main/docs/screenshots/api-keys.png)

**URL:** `/api-keys` — machine-to-machine authentication

## Database Explorer

![Database Explorer](https://raw.githubusercontent.com/Dynamic-API-Platform/Dynamic-API-Platform/main/docs/screenshots/database.png)

**URL:** `/database` — raw MongoDB JSON browser (requires `manage_users`)

## Settings

![Settings](https://raw.githubusercontent.com/Dynamic-API-Platform/Dynamic-API-Platform/main/docs/screenshots/settings.png)

**URL:** `/settings` — auth, rate limits, logs, **project export/import**

## System

![System](https://raw.githubusercontent.com/Dynamic-API-Platform/Dynamic-API-Platform/main/docs/screenshots/system.png)

**URL:** `/system` — CPU, memory, disk, network

[← Back to home]({{ '/' | relative_url }})
