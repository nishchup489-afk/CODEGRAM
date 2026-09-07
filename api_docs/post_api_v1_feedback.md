# POST `/api/v1/feedback`

Create Feedback

- Authentication: Public; bearer token enables viewer-specific fields
- Operation ID: `create_feedback_api_v1_feedback_post`
- Backend implementation: [`backend/app/api/v1/feedback.py:60`](../backend/app/api/v1/feedback.py#L60)

## Frontend connections

- [`frontend/app/settings/feedback/page.tsx:280`](../frontend/app/settings/feedback/page.tsx#L280): `/feedback`

## Request schema

Model: `FeedbackCreate`

```json
{
  "feedback_type": "general",
  "rating": 0,
  "title": "string",
  "message": "string",
  "page_url": "string",
  "source": "string",
  "allow_contact": false,
  "contact_email": "string",
  "diagnostics": {}
}
```

## Return schema — HTTP 201

Model: `FeedbackResponse`

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
  "reviewed_at": "date-time"
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
