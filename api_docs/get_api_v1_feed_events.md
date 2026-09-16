# GET `/api/v1/feed-events`

Get Feed

- Authentication: Public
- Operation ID: `get_feed_api_v1_feed_events_get`
- Backend implementation: [`backend\app\router\feed_event.py:35`](../backend\app\router\feed_event.py#L35)

## Frontend connections

- [`frontend\app\u\[username]\live_projects\page.tsx:43`](../frontend\app\u\[username]\live_projects\page.tsx#L43): `/feed-events`

## Return schema — HTTP 200

Model: `array[GetFeedEvent]`

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "user": {
      "id": "uuid",
      "username": "string",
      "display_name": "string",
      "avatar_url": "string",
      "current_build": "string"
    },
    "live_project_id": "uuid",
    "live_project": {
      "id": "uuid",
      "title": "string",
      "slug": "string",
      "description": "string",
      "current_status": "string",
      "progress_percentage": 0,
      "status": "string",
      "tech_stack": [
        "string"
      ],
      "thumbnail_url": "string"
    },
    "event_type": "string",
    "content": "string",
    "event_metadata": {},
    "likes_count": 0,
    "comments_count": 0,
    "is_public": false,
    "created_at": "date-time"
  }
]
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
