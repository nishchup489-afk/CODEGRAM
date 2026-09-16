# GET `/api/v1/admin/dashboard`

Get Admin Dashboard

- Authentication: Admin bearer token required
- Operation ID: `get_admin_dashboard_api_v1_admin_dashboard_get`
- Backend implementation: [`backend\app\router\admin.py:41`](../backend\app\router\admin.py#L41)

## Frontend connections

- [`frontend\app\admin\page.tsx:138`](../frontend\app\admin\page.tsx#L138): `/admin/dashboard`

## Return schema — HTTP 200

Model: `AdminDashboardResponse`

```json
{
  "stats": {
    "total_users": 0,
    "total_projects": 0,
    "total_live_projects": 0,
    "new_feedback": 0,
    "open_support_tickets": 0,
    "active_users": 0
  },
  "recent_users": [
    {
      "id": "uuid",
      "clerk_user_id": "string",
      "username": "string",
      "display_name": "string",
      "email": "string",
      "is_active": false,
      "is_banned": false,
      "created_at": "date-time"
    }
  ],
  "recent_projects": [
    {
      "id": "uuid",
      "title": "string",
      "slug": "string",
      "stars_count": 0,
      "views_count": 0,
      "is_featured": false,
      "created_at": "date-time"
    }
  ]
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
