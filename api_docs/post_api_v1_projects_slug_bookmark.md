# POST `/api/v1/projects/{slug}/bookmark`

Bookmark Project

- Authentication: Bearer token required
- Operation ID: `bookmark_project_api_v1_projects__slug__bookmark_post`
- Backend implementation: [`backend/app/router/project.py:390`](../backend/app/router/project.py#L390)

## Frontend connections

- [`frontend/app/project/[slug]/page.tsx:400`](../frontend/app/project/[slug]/page.tsx#L400): `/projects/${projectData.slug}/bookmark`
- [`frontend/app/u/[username]/projects/page.tsx:371`](../frontend/app/u/[username]/projects/page.tsx#L371): `/projects/${project.slug}/bookmark`

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
