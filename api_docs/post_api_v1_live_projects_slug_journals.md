# POST `/api/v1/live-projects/{slug}/journals`

Create Journal Entry

- Authentication: Bearer token required
- Operation ID: `create_journal_entry_api_v1_live_projects__slug__journals_post`
- Backend implementation: [`backend/app/router/live_projects.py:168`](../backend/app/router/live_projects.py#L168)

## Frontend connections

- [`frontend/app/live_project/[slug]/page.tsx:170`](../frontend/app/live_project/[slug]/page.tsx#L170): `/live-projects/${slug}/journals?clerk_user_id=${user.id}`

## Request schema

Model: `CreateLiveProjectJournal`

```json
{
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
  "progress_percentage": 0
}
```

## Return schema — HTTP 200

Model: `GetLiveProjectJournal`

```json
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
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
