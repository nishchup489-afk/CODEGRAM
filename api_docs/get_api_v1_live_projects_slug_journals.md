# GET `/api/v1/live-projects/{slug}/journals`

Get Project Journals

- Authentication: Public; bearer token enables viewer-specific fields
- Operation ID: `get_project_journals_api_v1_live_projects__slug__journals_get`
- Backend implementation: [`backend/app/router/live_projects.py:202`](../backend/app/router/live_projects.py#L202)

## Frontend connections

- [`frontend/app/live_project/[slug]/page.tsx:100`](../frontend/app/live_project/[slug]/page.tsx#L100): `/live-projects/${slug}/journals`

## Return schema — HTTP 200

Model: `array[GetLiveProjectJournal]`

```json
[
  {
    "id": "uuid",
    "live_project_id": "uuid",
    "user_id": "uuid",
    "day_number": 0,
    "content": "string",
    "entry_type": "string",
    "media_urls": [
      "string"
    ],
    "code_snippets": [
      "string"
    ],
    "problem_solutions": [
      {
        "problem": "string",
        "solution": "string"
      }
    ],
    "progress_percentage": 0,
    "likes_count": 0,
    "comments_count": 0,
    "created_at": "date-time",
    "updated_at": "date-time"
  }
]
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
