---
layout: default
title: FAQ
---

## General

### What is Dynamic API Platform?

An open-source platform for creating REST APIs through a web interface. Define endpoints, schemas, and access rules — the platform serves them at runtime without writing backend code.

### Who is it for?

- Prototyping APIs quickly
- Internal tools and admin backends
- Teams needing a lightweight BaaS alternative
- Learning full-stack TypeScript architecture

### Is it production-ready?

Version 1.0 is functional for small-to-medium deployments. For production:
- Change all default secrets
- Use HTTPS
- Don't expose MongoDB publicly
- Review [Security Policy](https://github.com/Developer-RU/dynamic-api-platform/blob/main/SECURITY.md)

---

## Endpoints

### Can I use the same path for GET and POST?

Yes. Data is shared via `resourcePath`. Classic REST pattern works out of the box.

### Can I delete system endpoints?

No. Endpoints like `/api/auth/login` are marked `isSystem: true` and protected.

### What HTTP methods are supported?

GET, POST, PUT, PATCH, DELETE.

### Can I add custom business logic?

Not in v1.0. The engine handles CRUD with schema validation only. For custom logic, extend the backend service layer.

---

## Authentication

### How do tokens work?

- **Access token** — short-lived JWT in `Authorization: Bearer` header
- **Refresh token** — long-lived, used to get new access tokens via `/api/auth/refresh`

### Can I disable self-registration?

Yes. Settings → Authentication → Disable registration.

### What happens after too many failed logins?

IP is temporarily locked out (configurable attempts and duration in Settings).

---

## Data

### Where is endpoint data stored?

MongoDB `endpointdatas` collection, linked by `endpointId` and `resourcePath`.

### What happens if I change the schema?

Existing records are **not** automatically migrated. New validation applies on write.

---

## Deployment

### Why is frontend on port 8080?

Default Docker mapping `8080:80`. Change in `docker-compose.yml` if port 8080 is occupied.

### Can I use external MongoDB?

Yes. Set `MONGODB_URI` to your MongoDB Atlas or managed instance URL.

### Does it work on ARM (Apple Silicon)?

Yes. All Docker images support multi-arch.

---

## UI

### How does endpoint grouping work?

Create groups in **Endpoint Groups**, assign endpoints to groups. The **Endpoints** page shows collapsible sections per group.

### Is there dark mode only?

Yes, v1.0 ships with a dark theme inspired by 3x-ui panel style.

---

## Open source

### What license?

MIT — free for commercial and personal use.

### How to contribute?

See [CONTRIBUTING.md](https://github.com/Developer-RU/dynamic-api-platform/blob/main/CONTRIBUTING.md).
