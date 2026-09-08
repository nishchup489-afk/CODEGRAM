# GET `/api/v1/feedback/me`

List My Feedback

- Authentication: Bearer token required
- Operation ID: `list_my_feedback_api_v1_feedback_me_get`
- Backend implementation: [`backend/app/router/feedback.py:90`](../backend/app/router/feedback.py#L90)

## Frontend connections

- No direct frontend API call was found.

## Return schema — HTTP 200

Model: `array[FeedbackResponse]`

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
    "source": "string",
    "allow_contact": false,
    "contact_email": "string",
    "created_at": "date-time",
    "updated_at": "date-time",
    "reviewed_at": "date-time"
  }
]
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
