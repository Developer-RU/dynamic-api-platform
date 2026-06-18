---
layout: default
title: Troubleshooting
---

# Troubleshooting

## Docker

### Containers not starting

```bash
docker compose ps
docker compose logs backend
docker compose logs mongodb
```

**MongoDB not healthy:** Wait 30s for first start. Check port 27017 not in use.

**Backend unhealthy:** Verify `wget` can reach `http://localhost:3001/api/health` inside container.

### Port already in use

```
Error: bind: address already in use
```

Change ports in `docker-compose.yml`:

```yaml
frontend:
  ports:
    - "8090:80"   # was 8080
backend:
  ports:
    - "3002:3001" # was 3001
```

Update `CORS_ORIGIN` accordingly.

### Frontend shows API errors / blank after login

- Ensure `VITE_API_URL` build arg is `""` in Docker (uses nginx proxy)
- Check backend is healthy: `curl http://localhost:3001/api/health`
- Check browser console for CORS errors → fix `CORS_ORIGIN`

---

## Authentication

### "Session expired" immediately

- Check JWT secrets haven't changed between restarts (invalidates tokens)
- Clear localStorage and log in again
- Verify system clock is correct

### Login returns 401

- Default credentials: `admin` / `Admin123!`
- Check if IP is locked out (wait lockout duration or restart backend)
- Check `ADMIN_PASSWORD` env matches what you're using (only applies to seeded admin)

### Registration returns 403

Registration disabled in Settings. Enable or create users via admin panel.

---

## Endpoints

### Dynamic endpoint returns 404

1. Endpoint exists and `enabled: true`
2. Path matches exactly (check trailing slashes)
3. HTTP method matches definition
4. Backend was not restarted needed — changes are immediate from DB

### Validation errors on POST

Request body doesn't match schema. Check required fields and types in endpoint editor.

### GET returns empty array

No data created yet. POST a record first.

---

## Database

### Reset everything

```bash
docker compose down -v
docker compose up -d
```

This deletes all data and re-seeds on startup.

### Connection refused to MongoDB

Local dev: ensure MongoDB running on `localhost:27017`.

Docker: use `mongodb://mongodb:27017/dynamic_api` (service name, not localhost).

---

## Build errors

### Backend TypeScript errors

```bash
cd backend && rm -rf dist && npm run build
```

### Frontend build fails

```bash
cd frontend && rm -rf dist node_modules && npm install && npm run build
```

---

## Performance

### Slow with many records

- EndpointData queries use pagination — ensure clients pass `page` and `limit`
- Add MongoDB indexes if scaling beyond thousands of records per endpoint
- Review rate limit settings if legitimate traffic is throttled

---

## Getting help

1. Check [FAQ](faq.html)
2. Search [GitHub Issues](https://github.com/Developer-RU/dynamic-api-platform/issues)
3. Open a new issue with logs and reproduction steps (no secrets!)
