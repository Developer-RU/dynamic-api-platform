---
layout: default
title: Role-Based Access Control
description: Permissions, groups, and access types
---

## Overview

Dynamic API Platform uses **permission-based RBAC**. Users belong to one or more **groups**, and each group has a set of **permissions**.

## Permissions

| Permission | Description |
|------------|-------------|
| `view` | Read access to dashboard, system info |
| `create` | Create resources |
| `update` | Modify resources |
| `delete` | Delete resources |
| `manage_users` | User and group management, settings |
| `manage_api` | Endpoint and endpoint group management |
| `view_logs` | Access audit logs |

Permissions are checked in middleware via `requirePermission('perm1', 'perm2')` — user needs **at least one** of the listed permissions.

## System groups (seeded)

| Group | Permissions |
|-------|-------------|
| **Super Admin** | All permissions |
| **Admin** | All permissions |
| **Editor** | view, create, update, manage_api |
| **Manager** | view, create, update, manage_api, view_logs |
| **User** | view only |

System group **names** cannot be changed. System groups cannot be deleted.

## Custom groups

Create via **User Groups** page (`/groups`) or `POST /api/groups`.

Assign permissions by toggling badges in the create/edit modal.

## User assignment

Users can belong to multiple groups. Effective permissions are the **union** of all group permissions.

Assign groups in **Users** → Edit → Groups (multi-select).

## Endpoint access types

Separate from RBAC — controls who can call a **dynamic** endpoint at runtime:

| Access Type | Who can access |
|-------------|----------------|
| `public` | Anyone (no token) |
| `authenticated` | Any logged-in user |
| `group` | Users in endpoint's `allowedGroupIds` |

Management API endpoints always use RBAC permissions regardless of endpoint access type.

## Permission matrix (management API)

| Endpoint area | Required permission |
|---------------|---------------------|
| Dashboard stats | `view` |
| System info | `view` |
| Audit logs | `view_logs` |
| Users CRUD | `manage_users` (view for GET list) |
| Groups CRUD | `manage_users` for write, `view` for read |
| Endpoints CRUD | `manage_api` (view for GET) |
| Settings | `manage_users` OR `manage_api` |

## Best practices

1. **Principle of least privilege** — give users only needed permissions
2. **Don't use Super Admin** for daily operations — create role-specific groups
3. **Review group assignments** when team members change roles
4. **Use `group` access type** on sensitive dynamic endpoints
5. **Disable registration** in Settings for internal deployments

## Checking permissions in code

```typescript
// backend/src/middleware/index.ts
requirePermission('manage_api', 'view')
// Passes if user has manage_api OR view
```

Frontend hides navigation items based on user permissions from JWT/profile (extend as needed).
