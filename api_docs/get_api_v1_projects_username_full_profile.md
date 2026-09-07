# GET `/api/v1/projects/{username}/full-profile`

Get Full Profile

- Authentication: Public; bearer token enables viewer-specific fields
- Operation ID: `get_full_profile_api_v1_projects__username__full_profile_get`
- Backend implementation: [`backend/app/router/project.py:104`](../backend/app/router/project.py#L104)

## Frontend connections

- [`frontend/app/u/[username]/me/page.tsx:42`](../frontend/app/u/[username]/me/page.tsx#L42): `/projects/${username}/full-profile`

## Return schema — HTTP 200

Model: `UserFullProfileResponse`

```json
{
  "id": "uuid",
  "username": "string",
  "display_name": "string",
  "bio": "string",
  "avatar_url": "string",
  "banner_url": "string",
  "github_url": "string",
  "linkedin_url": "string",
  "portfolio_url": "string",
  "location": "string",
  "current_build": "string",
  "reputation_score": 0,
  "followers_count": 0,
  "following_count": 0,
  "posts_count": 0,
  "project_count": 0,
  "projects": [
    {
      "id": "uuid",
      "title": "string",
      "slug": "string",
      "description": "string",
      "github_url": "string",
      "live_url": "string",
      "thumbnail_url": "string",
      "tech_stack": [
        "string"
      ],
      "stars_count": 0,
      "views_count": 0,
      "comments_count": 0,
      "created_at": "date-time"
    }
  ],
  "live_projects": [
    {
      "id": "uuid",
      "title": "string",
      "slug": "string",
      "goal": "string",
      "progress_percentage": 0,
      "status": "string",
      "tech_stack": [
        "string"
      ],
      "journal_count": 0,
      "views_count": 0,
      "created_at": "date-time"
    }
  ],
  "stack_stats": [
    {
      "id": "uuid",
      "stack_name": "string",
      "projects_count": 0,
      "live_projects_count": 0,
      "journal_entries_count": 0,
      "score": 0,
      "level": 0,
      "last_used_at": "date-time"
    }
  ]
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
