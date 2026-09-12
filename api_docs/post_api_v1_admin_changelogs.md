# POST `/api/v1/admin/changelogs`

Create Admin Changelog

- Authentication: Admin bearer token required
- Operation ID: `create_admin_changelog_api_v1_admin_changelogs_post`
- Backend implementation: [`backend/app/router/admin.py:230`](../backend/app/router/admin.py#L230)

## Frontend connections

- [`frontend/app/admin/changelog/page.tsx:379`](../frontend/app/admin/changelog/page.tsx#L379): `/admin/changelogs`

## Request schema

Model: `AdminCreateChangelog`

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

Model: `AdminChangelogItem`

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
