# POST `/api/v1/live-projects`

Create New Live Project

- Authentication: Bearer token required
- Operation ID: `create_new_live_project_api_v1_live_projects_post`
- Backend implementation: [`backend/app/router/live_projects.py:30`](../backend/app/router/live_projects.py#L30)

## Frontend connections

- [`frontend/app/live_project/create/page.tsx:122`](../frontend/app/live_project/create/page.tsx#L122): `/live-projects`

## Request schema

Model: `CreateLiveProject`

```json
{
  "title": "string",
  "slug": "string",
  "goal": "string",
  "description": "string",
  "current_status": "string",
  "current_goal": "string",
  "progress_percentage": 0,
  "category": "string",
  "github_url": "string",
  "live_url": "string",
  "demo_video_url": "string",
  "thumbnail_url": "string",
  "gallery_urls": [
    "string"
  ],
  "tech_stack": [
    "string"
  ],
  "is_public": false,
  "is_draft": false
}
```

## Return schema — HTTP 200

Model: `GetLiveProject`

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "user": {
    "id": "uuid",
    "username": "string",
    "display_name": "string",
    "avatar_url": "string",
    "current_build": "string"
  },
  "title": "string",
  "slug": "string",
  "goal": "string",
  "description": "string",
  "github_url": "string",
  "live_url": "string",
  "demo_video_url": "string",
  "thumbnail_url": "string",
  "gallery_urls": [
    "string"
  ],
  "tech_stack": [
    "string"
  ],
  "progress_percentage": 0,
  "current_status": "string",
  "current_goal": "string",
  "status": "string",
  "category": "string",
  "is_public": false,
  "is_featured": false,
  "views_count": 0,
  "journal_count": 0,
  "days_count": 0,
  "completed_at": "date-time",
  "created_at": "date-time",
  "updated_at": "date-time"
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
