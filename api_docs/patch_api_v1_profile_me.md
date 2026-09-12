# PATCH `/api/v1/profile/me`

Update Profile Data

- Authentication: Bearer token required
- Operation ID: `update_profile_data_api_v1_profile_me_patch`
- Backend implementation: [`backend/app/router/profile.py:34`](../backend/app/router/profile.py#L34)

## Frontend connections

- [`frontend/app/settings/github/page.tsx:206`](../frontend/app/settings/github/page.tsx#L206): `/profile/me`
- [`frontend/app/u/[username]/profile/edit/page.tsx:191`](../frontend/app/u/[username]/profile/edit/page.tsx#L191): `/profile/me`

## Request schema

Model: `update_profile_data`

```json
{
  "username": "string",
  "display_name": "string",
  "bio": "string",
  "avatar_url": "string",
  "banner_url": "string",
  "github_url": "string",
  "linkedin_url": "string",
  "portfolio_url": "string",
  "instagram_url": "string",
  "location": "string",
  "current_build": "string"
}
```

## Return schema — HTTP 200

Model: `update_profile_data`

```json
{
  "username": "string",
  "display_name": "string",
  "bio": "string",
  "avatar_url": "string",
  "banner_url": "string",
  "github_url": "string",
  "linkedin_url": "string",
  "portfolio_url": "string",
  "instagram_url": "string",
  "location": "string",
  "current_build": "string"
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
