# POST `/api/v1/sync_user/onboarding`

Complete Onboarding Route

- Authentication: Public
- Operation ID: `complete_onboarding_route_api_v1_sync_user_onboarding_post`
- Backend implementation: [`backend\app\router\user.py:55`](../backend\app\router\user.py#L55)

## Frontend connections

- [`frontend\app\onboarding\page.tsx:162`](../frontend\app\onboarding\page.tsx#L162): `/sync_user/onboarding`

## Request schema

Model: `UserOnboarding`

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

Model: `UserResponse`

```json
{
  "clerk_user_id": "string",
  "username": "string",
  "display_name": "string",
  "email": "string",
  "bio": "string",
  "avatar_url": "string",
  "banner_url": "string",
  "github_url": "string",
  "linkedin_url": "string",
  "portfolio_url": "string",
  "instagram_url": "string",
  "location": "string",
  "current_build": "string",
  "reputation_score": 0,
  "followers_count": 0,
  "following_count": 0,
  "posts_count": 0,
  "project_count": 0,
  "onboarding_completed": false
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
