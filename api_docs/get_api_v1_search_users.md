# GET `/api/v1/search/users`

Search Users

- Authentication: Public
- Operation ID: `search_users_api_v1_search_users_get`
- Backend implementation: [`backend\app\router\search.py:19`](../backend\app\router\search.py#L19)

## Frontend connections

- [`frontend\app\search\SearchClient.tsx:81`](../frontend\app\search\SearchClient.tsx#L81): `/search/users`

## Return schema — HTTP 200

Model: `unspecified`

```json
"value"
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
