# DELETE `/api/v1/projects/{slug}/star`

Unstar Project

- Authentication: Bearer token required
- Operation ID: `unstar_project_api_v1_projects__slug__star_delete`
- Backend implementation: [`backend\app\router\project.py:254`](../backend\app\router\project.py#L254)

## Frontend connections

- [`frontend\app\project\[slug]\page.tsx:317`](../frontend\app\project\[slug]\page.tsx#L317): `/projects/${projectData.slug}/star`
- [`frontend\app\u\[username]\projects\page.tsx:413`](../frontend\app\u\[username]\projects\page.tsx#L413): `/projects/${slug}/star`

## Return schema — HTTP 200

Model: `GetProject`

```json
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
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
