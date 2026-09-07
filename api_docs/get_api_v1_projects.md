# GET `/api/v1/projects/`

Fetch Projects

- Authentication: Public; bearer token enables viewer-specific fields
- Operation ID: `fetch_projects_api_v1_projects__get`
- Backend implementation: [`backend/app/router/project.py:163`](../backend/app/router/project.py#L163)

## Frontend connections

- [`frontend/app/u/[username]/projects/page.tsx:138`](../frontend/app/u/[username]/projects/page.tsx#L138): `/projects`

## Return schema — HTTP 200

Model: `PaginatedProjects`

```json
{
  "items": [
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
  ],
  "next_cursor": "date-time",
  "next_cursor_id": "uuid",
  "has_more": false
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
