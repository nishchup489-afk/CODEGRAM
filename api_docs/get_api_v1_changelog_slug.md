# GET `/api/v1/changelog/{slug}`

Get Single Changelog Route

- Authentication: Public
- Operation ID: `get_single_changelog_route_api_v1_changelog__slug__get`
- Backend implementation: [`backend\app\router\changelog.py:90`](../backend\app\router\changelog.py#L90)

## Frontend connections

- No direct frontend API call was found.

## Return schema — HTTP 200

Model: `GetChangelog`

```json
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
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
