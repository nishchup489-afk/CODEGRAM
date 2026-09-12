# POST `/api/v1/early-access`

Create Early Access Signup

- Authentication: Public
- Operation ID: `create_early_access_signup_api_v1_early_access_post`
- Backend implementation: [`backend/app/router/early_access.py:18`](../backend/app/router/early_access.py#L18)

## Frontend connections

- No direct frontend API call was found.

## Request schema

Model: `EarlyAccessCreate`

```json
{
  "email": "string",
  "source": "string",
  "referrer": "string"
}
```

## Return schema — HTTP 200

Model: `EarlyAccessResponse`

```json
{
  "detail": "string"
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
