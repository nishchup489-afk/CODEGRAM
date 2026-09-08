# PATCH `/api/v1/feedback/admin/{feedback_id}`

Admin Update Feedback

- Authentication: Admin bearer token required
- Operation ID: `admin_update_feedback_api_v1_feedback_admin__feedback_id__patch`
- Backend implementation: [`backend/app/router/feedback.py:199`](../backend/app/router/feedback.py#L199)

## Frontend connections

- No direct frontend API call was found.

## Request schema

Model: `FeedbackAdminUpdate`

```json
{
  "status": "new",
  "sentiment": "positive",
  "admin_notes": "string"
}
```

## Return schema — HTTP 200

Model: `FeedbackAdminResponse`

```json
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
  "source": "string",
  "allow_contact": false,
  "contact_email": "string",
  "created_at": "date-time",
  "updated_at": "date-time",
  "reviewed_at": "date-time",
  "diagnostics": {},
  "admin_notes": "string",
  "reviewed_by_user_id": "uuid"
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
