# POST `/api/v1/changelog`

Create Changelog Route

- Authentication: Admin bearer token required
- Operation ID: `create_changelog_route_api_v1_changelog_post`
- Backend implementation: [`backend\app\router\changelog.py:41`](../backend\app\router\changelog.py#L41)

## Frontend connections

- No direct frontend API call was found.

## Request schema

Model: `CreateChangelog`

```json
{
  "title": "string",
  "slug": "string",
  "version": "string",
  "summary": "string",
  "content": "string",
  "changelog_type": "release",
  "tags": [
    "string"
  ],
  "is_published": false
}
```

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
