# GET `/api/v1/bookmarks/me`

Get Bookmarked Projects

- Authentication: Bearer token required
- Operation ID: `get_bookmarked_projects_api_v1_bookmarks_me_get`
- Backend implementation: [`backend\app\router\bookmark.py:25`](../backend\app\router\bookmark.py#L25)

## Frontend connections

- [`frontend\app\u\[username]\bookmarks\page.tsx:67`](../frontend\app\u\[username]\bookmarks\page.tsx#L67): `/bookmarks/me`

## Return schema — HTTP 200

Model: `array[GetProject]`

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "title": "string",
    "slug": "string",
    "description": "string",
    "github_url": "string",
    "live_url": "string",
    "thumbnail_url": "string",
    "demo_video_url": "string",
    "gallery_urls": [
      "string"
    ],
    "tech_stack": [
      "string"
    ],
    "stars_count": 0,
    "views_count": 0,
    "comments_count": 0,
    "is_featured": false,
    "is_starred": false,
    "is_bookmarked": false,
    "user": {
      "username": "string",
      "avatar_url": "string",
      "location": "string"
    },
    "created_at": "date-time",
    "updated_at": "date-time"
  }
]
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
