# GET `/api/v1/admin/app-notices`

List Admin App Notices

- Authentication: Admin bearer token required
- Operation ID: `list_admin_app_notices_api_v1_admin_app_notices_get`
- Backend implementation: [`backend/app/api/v1/admin.py:282`](../backend/app/api/v1/admin.py#L282)

## Frontend connections

- No direct frontend API call was found.

## Return schema — HTTP 200

Model: `array[AdminAppNoticeItem]`

```json
[
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
]
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
