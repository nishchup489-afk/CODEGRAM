# GET `/api/v1/projects/{slug}`

Get Project

- Authentication: Public; bearer token enables viewer-specific fields
- Operation ID: `get_project_api_v1_projects__slug__get`
- Backend implementation: [`backend/app/router/project.py:84`](../backend/app/router/project.py#L84)

## Frontend connections

- [`frontend/app/project/[slug]/edit/page.tsx:61`](../frontend/app/project/[slug]/edit/page.tsx#L61): `/projects/${slug}`
- [`frontend/app/project/[slug]/page.tsx:163`](../frontend/app/project/[slug]/page.tsx#L163): `/projects/${slug}`

## Return schema — HTTP 200

Model: `GetProject`

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
  "demo_video_url": "string",
  "gallery_urls": [
    "string"
  ],
  "tech_stack": [
    "string"
  ],
  "stars_count": 0,
  "views_count": 0,
  "comments_count": 0,
  "is_featured": false,
  "is_starred": false,
  "is_bookmarked": false,
  "user": {
    "username": "string",
    "avatar_url": "string",
    "location": "string"
  },
  "created_at": "date-time",
  "updated_at": "date-time"
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
