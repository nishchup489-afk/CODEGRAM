# POST `/api/v1/projects/`

Create Project

- Authentication: Bearer token required
- Operation ID: `create_project_api_v1_projects__post`
- Backend implementation: [`backend/app/router/project.py:63`](../backend/app/router/project.py#L63)

## Frontend connections

- [`frontend/app/u/[username]/create/project/page.tsx:282`](../frontend/app/u/[username]/create/project/page.tsx#L282): `/projects/?clerk_user_id=${currentUser?.clerk_user_id}`

## Request schema

Model: `CreateProject`

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

## Return schema — HTTP 201

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
