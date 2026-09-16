# GET `/api/v1/changelog`

Get Changelogs Route

- Authentication: Public
- Operation ID: `get_changelogs_route_api_v1_changelog_get`
- Backend implementation: [`backend\app\router\changelog.py:60`](../backend\app\router\changelog.py#L60)

## Frontend connections

- No direct frontend API call was found.

## Return schema — HTTP 200

Model: `ChangelogListResponse`

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "string",
      "slug": "string",
      "version": "string",
      "summary": "string",
      "content": "string",
      "changelog_type": "string",
      "tags": [
        "string"
      ],
      "is_published": false,
      "published_at": "date-time",
      "created_at": "date-time",
      "updated_at": "date-time"
    }
  ],
  "total": 0,
  "limit": 0,
  "offset": 0
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
