# DELETE `/api/v1/admin/app-notices/{notice_id}`

Delete Admin App Notice

- Authentication: Admin bearer token required
- Operation ID: `delete_admin_app_notice_api_v1_admin_app_notices__notice_id__delete`
- Backend implementation: [`backend\app\router\admin.py:332`](../backend\app\router\admin.py#L332)

## Frontend connections

- [`frontend\app\admin\app-notice\page.tsx:388`](../frontend\app\admin\app-notice\page.tsx#L388): `/admin/app-notices/${item.id}`

## Return schema — HTTP 200

Model: `unspecified`

```json
"value"
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
