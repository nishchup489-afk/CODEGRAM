# DELETE `/api/v1/admin/app-notices/{notice_id}`

Delete Admin App Notice

- Authentication: Admin bearer token required
- Operation ID: `delete_admin_app_notice_api_v1_admin_app_notices__notice_id__delete`
- Backend implementation: [`backend/app/api/v1/admin.py:332`](../backend/app/api/v1/admin.py#L332)

## Frontend connections

- [`frontend/app/admin/app-notice/page.tsx:392`](../frontend/app/admin/app-notice/page.tsx#L392): `/admin/app-notices/${item.id}?${adminQuery}`

## Return schema — HTTP 200

Model: `unspecified`

```json
"value"
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
