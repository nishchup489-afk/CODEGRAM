# POST `/api/v1/projects/analyze-repo`

Analyze Repository

- Authentication: Public
- Operation ID: `analyze_repository_api_v1_projects_analyze_repo_post`
- Backend implementation: [`backend/app/router/project.py:124`](../backend/app/router/project.py#L124)

## Frontend connections

- No direct frontend API call was found.

## Request schema

Model: `AnalyzeRepoRequest`

```json
{
  "github_url": "string"
}
```

## Return schema — HTTP 200

Model: `unspecified`

```json
"value"
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
