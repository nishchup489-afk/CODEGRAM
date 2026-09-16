# PATCH `/api/v1/admin/feedback/{feedback_id}`

Update Admin Feedback

- Authentication: Admin bearer token required
- Operation ID: `update_admin_feedback_api_v1_admin_feedback__feedback_id__patch`
- Backend implementation: [`backend\app\router\admin.py:76`](../backend\app\router\admin.py#L76)

## Frontend connections

- [`frontend\app\admin\feedback\page.tsx:337`](../frontend\app\admin\feedback\page.tsx#L337): `/admin/feedback/${feedbackId}`
- [`frontend\app\admin\feedback\page.tsx:381`](../frontend\app\admin\feedback\page.tsx#L381): `/admin/feedback/${item.id}`

## Request schema

Model: `AdminUpdateFeedback`

```json
{
  "status": "new",
  "sentiment": "positive",
  "admin_notes": "string"
}
```

## Return schema — HTTP 200

Model: `AdminFeedbackItem`

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
  "contact_email": "string",
  "admin_notes": "string",
  "created_at": "date-time",
  "updated_at": "date-time"
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
