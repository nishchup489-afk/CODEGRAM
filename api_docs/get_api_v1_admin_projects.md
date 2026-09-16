# GET `/api/v1/admin/projects`

List Admin Projects

- Authentication: Admin bearer token required
- Operation ID: `list_admin_projects_api_v1_admin_projects_get`
- Backend implementation: [`backend\app\router\admin.py:176`](../backend\app\router\admin.py#L176)

## Frontend connections

- [`frontend\app\admin\projects\page.tsx:182`](../frontend\app\admin\projects\page.tsx#L182): `/admin/projects`

## Return schema — HTTP 200

Model: `array[AdminProjectItem]`

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "title": "string",
    "slug": "string",
    "description": "string",
    "github_url": "string",
    "live_url": "string",
    "thumbnail_url": "string",
    "stars_count": 0,
    "views_count": 0,
    "comments_count": 0,
    "is_featured": false,
    "created_at": "date-time",
    "updated_at": "date-time"
  }
]
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
