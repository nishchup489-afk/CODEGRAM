# DELETE `/api/v1/admin/changelogs/{changelog_id}`

Delete Admin Changelog

- Authentication: Admin bearer token required
- Operation ID: `delete_admin_changelog_api_v1_admin_changelogs__changelog_id__delete`
- Backend implementation: [`backend/app/router/admin.py:264`](../backend/app/router/admin.py#L264)

## Frontend connections

- [`frontend/app/admin/changelog/page.tsx:423`](../frontend/app/admin/changelog/page.tsx#L423): `/admin/changelogs/${item.id}?${adminQuery}`

## Return schema — HTTP 200

Model: `unspecified`

```json
"value"
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
