# DELETE `/api/v1/users/{username}/follow`

Unfollow Single User

- Authentication: Bearer token required
- Operation ID: `unfollow_single_user_api_v1_users__username__follow_delete`
- Backend implementation: [`backend/app/router/follow.py:53`](../backend/app/router/follow.py#L53)

## Frontend connections

- [`frontend/app/u/[username]/projects/page.tsx:565`](../frontend/app/u/[username]/projects/page.tsx#L565): `/users/${username}/follow`

## Return schema — HTTP 200

Model: `FollowStatus`

```json
{
  "is_following": false,
  "followers_count": 0,
  "following_count": 0
}
```

---

Generated from the backend OpenAPI contract. Run `cd backend && poetry run python generate_api_docs.py` to refresh.
