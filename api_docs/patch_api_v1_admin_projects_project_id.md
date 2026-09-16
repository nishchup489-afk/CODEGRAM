# PATCH `/api/v1/admin/projects/{project_id}`

Update Admin Project

- Authentication: Admin bearer token required
- Operation ID: `update_admin_project_api_v1_admin_projects__project_id__patch`
- Backend implementation: [`backend\app\router\admin.py:192`](../backend\app\router\admin.py#L192)

## Frontend connections

- [`frontend\app\admin\projects\page.tsx:212`](../frontend\app\admin\projects\page.tsx#L212): `/admin/projects/${projectId}`

## Request schema

Model: `AdminUpdateProject`

```json
{
  "is_featured": false
}
```

## Return schema — HTTP 200

Model: `AdminProjectItem`

```json
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
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
