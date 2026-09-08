# POST `/api/v1/admin/app-notices`

Create Admin App Notice

- Authentication: Admin bearer token required
- Operation ID: `create_admin_app_notice_api_v1_admin_app_notices_post`
- Backend implementation: [`backend/app/router/admin.py:298`](../backend/app/router/admin.py#L298)

## Frontend connections

- [`frontend/app/admin/app-notice/page.tsx:349`](../frontend/app/admin/app-notice/page.tsx#L349): `/admin/app-notices?${adminQuery}`

## Request schema

Model: `AdminCreateAppNotice`

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
