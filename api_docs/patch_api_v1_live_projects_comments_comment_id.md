# PATCH `/api/v1/live-projects/comments/{comment_id}`

Update Journal Comment

- Authentication: Bearer token required
- Operation ID: `update_journal_comment_api_v1_live_projects_comments__comment_id__patch`
- Backend implementation: [`backend/app/router/live_projects.py:477`](../backend/app/router/live_projects.py#L477)

## Frontend connections

- No direct frontend API call was found.

## Request schema

Model: `UpdateLiveProjectJournalComment`

```json
{
  "content": "string"
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
