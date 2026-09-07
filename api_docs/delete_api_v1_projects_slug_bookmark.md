# DELETE `/api/v1/projects/{slug}/bookmark`

Unbookmark Project

- Authentication: Bearer token required
- Operation ID: `unbookmark_project_api_v1_projects__slug__bookmark_delete`
- Backend implementation: [`backend/app/router/project.py:411`](../backend/app/router/project.py#L411)

## Frontend connections

- [`frontend/app/project/[slug]/page.tsx:378`](../frontend/app/project/[slug]/page.tsx#L378): `/projects/${projectData.slug}/bookmark`
- [`frontend/app/u/[username]/bookmarks/page.tsx:376`](../frontend/app/u/[username]/bookmarks/page.tsx#L376): `/projects/${slug}/bookmark`
- [`frontend/app/u/[username]/projects/page.tsx:359`](../frontend/app/u/[username]/projects/page.tsx#L359): `/projects/${project.slug}/bookmark`

## Return schema — HTTP 200

Model: `ProjectBookmarkStatus`

```json
{
  "project_id": "uuid",
  "is_bookmarked": false
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
