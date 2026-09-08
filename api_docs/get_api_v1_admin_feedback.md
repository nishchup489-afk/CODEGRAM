# GET `/api/v1/admin/feedback`

List Admin Feedback

- Authentication: Admin bearer token required
- Operation ID: `list_admin_feedback_api_v1_admin_feedback_get`
- Backend implementation: [`backend/app/router/admin.py:58`](../backend/app/router/admin.py#L58)

## Frontend connections

- [`frontend/app/admin/feedback/page.tsx:301`](../frontend/app/admin/feedback/page.tsx#L301): `/admin/feedback`

## Return schema — HTTP 200

Model: `array[AdminFeedbackItem]`

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "feedback_type": "general",
    "status": "new",
    "sentiment": "positive",
    "rating": 0,
    "title": "string",
    "message": "string",
    "page_url": "string",
    "contact_email": "string",
    "admin_notes": "string",
    "created_at": "date-time",
    "updated_at": "date-time"
  }
]
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
