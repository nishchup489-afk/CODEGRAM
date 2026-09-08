# GET `/api/v1/admin/users`

List Admin Users

- Authentication: Admin bearer token required
- Operation ID: `list_admin_users_api_v1_admin_users_get`
- Backend implementation: [`backend/app/router/admin.py:138`](../backend/app/router/admin.py#L138)

## Frontend connections

- [`frontend/app/admin/users/page.tsx:157`](../frontend/app/admin/users/page.tsx#L157): `/admin/users`

## Return schema — HTTP 200

Model: `array[AdminUserItem]`

```json
[
  {
    "id": "uuid",
    "clerk_user_id": "string",
    "username": "string",
    "display_name": "string",
    "email": "string",
    "project_count": 0,
    "reports_count": 0,
    "is_verified": false,
    "is_active": false,
    "is_private": false,
    "is_banned": false,
    "created_at": "date-time",
    "updated_at": "date-time"
  }
]
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
