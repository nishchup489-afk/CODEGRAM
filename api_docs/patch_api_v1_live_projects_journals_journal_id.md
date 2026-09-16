# PATCH `/api/v1/live-projects/journals/{journal_id}`

Update Journal Entry

- Authentication: Bearer token required
- Operation ID: `update_journal_entry_api_v1_live_projects_journals__journal_id__patch`
- Backend implementation: [`backend\app\router\live_projects.py:371`](../backend\app\router\live_projects.py#L371)

## Frontend connections

- No direct frontend API call was found.

## Request schema

Model: `UpdateLiveProjectJournal`

```json
{
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
