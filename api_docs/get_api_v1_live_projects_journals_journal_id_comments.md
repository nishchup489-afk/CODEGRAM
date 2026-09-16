# GET `/api/v1/live-projects/journals/{journal_id}/comments`

Get Journal Comments

- Authentication: Public; bearer token enables viewer-specific fields
- Operation ID: `get_journal_comments_api_v1_live_projects_journals__journal_id__comments_get`
- Backend implementation: [`backend\app\router\live_projects.py:434`](../backend\app\router\live_projects.py#L434)

## Frontend connections

- No direct frontend API call was found.

## Return schema — HTTP 200

Model: `array[GetLiveProjectJournalComment]`

```json
[
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
]
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
