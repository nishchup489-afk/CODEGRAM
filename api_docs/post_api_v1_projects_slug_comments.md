# POST `/api/v1/projects/{slug}/comments`

Create Comment

- Authentication: Bearer token required
- Operation ID: `create_comment_api_v1_projects__slug__comments_post`
- Backend implementation: [`backend/app/router/project.py:275`](../backend/app/router/project.py#L275)

## Frontend connections

- [`frontend/app/project/[slug]/page.tsx:226`](../frontend/app/project/[slug]/page.tsx#L226): `/projects/${slug}/comments`

## Request schema

Model: `AddComment`

```json
{
  "content": "string",
  "parent_id": "uuid"
}
```

## Return schema — HTTP 201

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
