# PATCH `/api/v1/projects/{slug}`

Update Project

- Authentication: Bearer token required
- Operation ID: `update_project_api_v1_projects__slug__patch`
- Backend implementation: [`backend/app/router/project.py:211`](../backend/app/router/project.py#L211)

## Frontend connections

- [`frontend/app/project/[slug]/edit/page.tsx:180`](../frontend/app/project/[slug]/edit/page.tsx#L180): `/projects/${slug}`

## Request schema

Model: `UpdateProject`

```json
{
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
  ]
}
```

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
