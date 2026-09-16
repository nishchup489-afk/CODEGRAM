# GET `/api/v1/live-projects/{slug}/latest-commit`

Get Latest Commit

- Authentication: Public; bearer token enables viewer-specific fields
- Operation ID: `get_latest_commit_api_v1_live_projects__slug__latest_commit_get`
- Backend implementation: [`backend\app\router\live_projects.py:55`](../backend\app\router\live_projects.py#L55)

## Frontend connections

- No direct frontend API call was found.

## Return schema — HTTP 200

Model: `unspecified`

```json
"value"
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
