# PATCH `/api/v1/admin/app-notices/{notice_id}`

Update Admin App Notice

- Authentication: Admin bearer token required
- Operation ID: `update_admin_app_notice_api_v1_admin_app_notices__notice_id__patch`
- Backend implementation: [`backend\app\router\admin.py:314`](../backend\app\router\admin.py#L314)

## Frontend connections

- [`frontend\app\admin\app-notice\page.tsx:341`](../frontend\app\admin\app-notice\page.tsx#L341): `/admin/app-notices/${editingId}`
- [`frontend\app\admin\app-notice\page.tsx:416`](../frontend\app\admin\app-notice\page.tsx#L416): `/admin/app-notices/${item.id}`

## Request schema

Model: `AdminUpdateAppNotice`

```json
{
  "title": "string",
  "message": "string",
  "notice_type": "info",
  "cta_label": "string",
  "cta_href": "string",
  "is_active": false,
  "show_once": false,
  "priority": 0,
  "starts_at": "date-time",
  "expires_at": "date-time"
}
```

## Return schema — HTTP 200

Model: `AdminAppNoticeItem`

```json
{
  "id": "uuid",
  "title": "string",
  "message": "string",
  "notice_type": "string",
  "cta_label": "string",
  "cta_href": "string",
  "is_active": false,
  "show_once": false,
  "priority": 0,
  "starts_at": "date-time",
  "expires_at": "date-time",
  "created_at": "date-time",
  "updated_at": "date-time"
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
