# GET `/api/v1/users/{username}/follow-status`

Get Follow Status

- Authentication: Bearer token required
- Operation ID: `get_follow_status_api_v1_users__username__follow_status_get`
- Backend implementation: [`backend\app\router\follow.py:75`](../backend\app\router\follow.py#L75)

## Frontend connections

- [`frontend\app\u\[username]\projects\page.tsx:197`](../frontend\app\u\[username]\projects\page.tsx#L197): `/users/${username}/follow-status`

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
