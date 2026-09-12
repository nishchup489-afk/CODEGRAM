# DELETE `/api/v1/projects/{slug}`

Delete Project

- Authentication: Bearer token required
- Operation ID: `delete_project_api_v1_projects__slug__delete`
- Backend implementation: [`backend/app/router/project.py:192`](../backend/app/router/project.py#L192)

## Frontend connections

- [`frontend/app/project/[slug]/edit/page.tsx:222`](../frontend/app/project/[slug]/edit/page.tsx#L222): `/projects/${slug}`
- [`frontend/app/project/[slug]/page.tsx:556`](../frontend/app/project/[slug]/page.tsx#L556): `/projects/${projectData.slug}`
- [`frontend/app/u/[username]/projects/page.tsx:113`](../frontend/app/u/[username]/projects/page.tsx#L113): `/projects/${project.slug}`

## Return schema — HTTP 200

Model: `unspecified`

```json
"value"
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
