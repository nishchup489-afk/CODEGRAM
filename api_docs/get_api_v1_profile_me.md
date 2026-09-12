# GET `/api/v1/profile/me`

Get My Profile

- Authentication: Bearer token required
- Operation ID: `get_my_profile_api_v1_profile_me_get`
- Backend implementation: [`backend/app/router/profile.py:12`](../backend/app/router/profile.py#L12)

## Frontend connections

- [`frontend/app/_lib/currentUser.ts:41`](../frontend/app/_lib/currentUser.ts#L41): `/profile/me`
- [`frontend/app/settings/account/page.tsx:96`](../frontend/app/settings/account/page.tsx#L96): `/profile/me`
- [`frontend/app/settings/github/page.tsx:156`](../frontend/app/settings/github/page.tsx#L156): `/profile/me`
- [`frontend/app/settings/profile/page.tsx:72`](../frontend/app/settings/profile/page.tsx#L72): `/profile/me`
- [`frontend/app/u/[username]/layout.tsx:80`](../frontend/app/u/[username]/layout.tsx#L80): `/profile/me`

## Return schema — HTTP 200

Model: `PrivateProfileResponse`

```json
{
  "id": "uuid",
  "username": "string",
  "display_name": "string",
  "bio": "string",
  "avatar_url": "string",
  "banner_url": "string",
  "github_url": "string",
  "linkedin_url": "string",
  "portfolio_url": "string",
  "reputation_score": 0,
  "followers_count": 0,
  "following_count": 0,
  "posts_count": 0,
  "project_count": 0,
  "instagram_url": "string",
  "location": "string",
  "current_build": "string",
  "joined_date": "string",
  "clerk_user_id": "string",
  "email": "string"
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
