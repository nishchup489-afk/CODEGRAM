# GET `/api/v1/admin/changelogs`

List Admin Changelogs

- Authentication: Admin bearer token required
- Operation ID: `list_admin_changelogs_api_v1_admin_changelogs_get`
- Backend implementation: [`backend/app/api/v1/admin.py:214`](../backend/app/api/v1/admin.py#L214)

## Frontend connections

- No direct frontend API call was found.

## Return schema — HTTP 200

Model: `array[AdminChangelogItem]`

```json
[
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
]
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
