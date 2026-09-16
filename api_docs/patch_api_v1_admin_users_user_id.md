# PATCH `/api/v1/admin/users/{user_id}`

Update Admin User

- Authentication: Admin bearer token required
- Operation ID: `update_admin_user_api_v1_admin_users__user_id__patch`
- Backend implementation: [`backend\app\router\admin.py:154`](../backend\app\router\admin.py#L154)

## Frontend connections

- [`frontend\app\admin\users\page.tsx:192`](../frontend\app\admin\users\page.tsx#L192): `/admin/users/${userId}`

## Request schema

Model: `AdminUpdateUser`

```json
{
  "is_verified": false,
  "is_active": false,
  "is_banned": false
}
```

## Return schema — HTTP 200

Model: `AdminUserItem`

```json
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
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
