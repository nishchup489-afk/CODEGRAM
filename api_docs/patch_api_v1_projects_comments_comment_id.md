# PATCH `/api/v1/projects/comments/{comment_id}`

Edit Comment

- Authentication: Bearer token required
- Operation ID: `edit_comment_api_v1_projects_comments__comment_id__patch`
- Backend implementation: [`backend\app\router\project.py:324`](../backend\app\router\project.py#L324)

## Frontend connections

- No direct frontend API call was found.

## Request schema

Model: `UpdateComment`

```json
{
  "content": "string"
}
```

## Return schema — HTTP 200

Model: `CommentOut`

```json
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
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
