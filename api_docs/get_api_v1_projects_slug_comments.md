# GET `/api/v1/projects/{slug}/comments`

Fetch Project Comments

- Authentication: Public
- Operation ID: `fetch_project_comments_api_v1_projects__slug__comments_get`
- Backend implementation: [`backend\app\router\project.py:299`](../backend\app\router\project.py#L299)

## Frontend connections

- [`frontend\app\project\[slug]\page.tsx:267`](../frontend\app\project\[slug]\page.tsx#L267): `/projects/${slug}/comments`

## Return schema — HTTP 200

Model: `array[GetComment]`

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "project_id": "uuid",
    "parent_id": "uuid",
    "content": "string",
    "upvotes_count": 0,
    "downvotes_count": 0,
    "score": 0,
    "is_edited": false,
    "created_at": "date-time",
    "updated_at": "date-time",
    "user": {
      "id": "uuid",
      "username": "string",
      "display_name": "string",
      "avatar_url": "string"
    },
    "replies": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "project_id": "uuid",
        "parent_id": "uuid",
        "content": "string",
        "upvotes_count": 0,
        "downvotes_count": 0,
        "score": 0,
        "is_edited": false,
        "created_at": "date-time",
        "updated_at": "date-time",
        "user": {
          "id": "uuid",
          "username": "string",
          "display_name": "string",
          "avatar_url": "string"
        }
      }
    ]
  }
]
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
