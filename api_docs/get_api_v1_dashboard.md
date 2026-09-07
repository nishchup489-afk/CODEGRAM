# GET `/api/v1/dashboard`

Get Dashboard

- Authentication: Bearer token required
- Operation ID: `get_dashboard_api_v1_dashboard_get`
- Backend implementation: [`backend/app/router/dashboard.py:17`](../backend/app/router/dashboard.py#L17)

## Frontend connections

- [`frontend/app/u/[username]/page.tsx:133`](../frontend/app/u/[username]/page.tsx#L133): `/dashboard?clerk_user_id=${currentUser.clerk_user_id}`

## Return schema — HTTP 200

Model: `DashboardResponse`

```json
{
  "username": "string",
  "display_name": "string",
  "avatar_url": "string",
  "stats": {
    "total_projects": 0,
    "total_live_projects": 0,
    "total_views": 0,
    "total_stars": 0,
    "total_comments": 0,
    "total_journals": 0
  },
  "recent_projects": [
    {
      "id": "uuid",
      "title": "string",
      "slug": "string",
      "views_count": 0,
      "stars_count": 0,
      "comments_count": 0,
      "tech_stack": [
        "string"
      ],
      "created_at": "date-time"
    }
  ],
  "active_live_projects": [
    {
      "id": "uuid",
      "title": "string",
      "slug": "string",
      "goal": "string",
      "current_goal": "string",
      "progress_percentage": 0,
      "status": "string",
      "views_count": 0,
      "journal_count": 0,
      "tech_stack": [
        "string"
      ],
      "created_at": "date-time",
      "updated_at": "date-time"
    }
  ],
  "top_stacks": [
    {
      "stack_name": "string",
      "projects_count": 0,
      "live_projects_count": 0,
      "score": 0
    }
  ],
  "recent_activity": [
    {
      "id": "uuid",
      "event_type": "string",
      "content": "string",
      "created_at": "date-time"
    }
  ]
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
