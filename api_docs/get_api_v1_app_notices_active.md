# GET `/api/v1/app-notices/active`

Get Active App Notice

- Authentication: Public
- Operation ID: `get_active_app_notice_api_v1_app_notices_active_get`
- Backend implementation: [`backend\app\router\app_notice.py:16`](../backend\app\router\app_notice.py#L16)

## Frontend connections

- No direct frontend API call was found.

## Return schema — HTTP 200

Model: `PublicAppNoticeItem | null`

```json
{
  "id": "uuid",
  "title": "string",
  "message": "string",
  "notice_type": "string",
  "cta_label": "string",
  "cta_href": "string",
  "show_once": false
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
