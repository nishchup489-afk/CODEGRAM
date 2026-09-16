# GET `/api/v1/feedback/me/{feedback_id}`

Get My Feedback

- Authentication: Bearer token required
- Operation ID: `get_my_feedback_api_v1_feedback_me__feedback_id__get`
- Backend implementation: [`backend\app\router\feedback.py:117`](../backend\app\router\feedback.py#L117)

## Frontend connections

- No direct frontend API call was found.

## Return schema — HTTP 200

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
