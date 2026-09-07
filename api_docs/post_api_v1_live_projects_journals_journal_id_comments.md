# POST `/api/v1/live-projects/journals/{journal_id}/comments`

Create Journal Comment

- Authentication: Bearer token required
- Operation ID: `create_journal_comment_api_v1_live_projects_journals__journal_id__comments_post`
- Backend implementation: [`backend/app/router/live_projects.py:244`](../backend/app/router/live_projects.py#L244)

## Frontend connections

- No direct frontend API call was found.

## Request schema

Model: `CreateLiveProjectJournalComment`

```json
{
  "content": "string",
  "parent_id": "uuid"
}
```

## Return schema — HTTP 200

Model: `GetLiveProjectJournalComment`

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "journal_id": "uuid",
  "parent_id": "uuid",
  "content": "string",
  "likes_count": 0,
  "is_edited": false,
  "deleted_at": "date-time",
  "created_at": "date-time",
  "updated_at": "date-time"
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
