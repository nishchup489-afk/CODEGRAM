# API route documentation

This directory is generated from FastAPI's canonical OpenAPI contract. Each operation includes its backend source, detected frontend call sites, request model, and return shape.

Canonical application routes use `/api/v1`. Unversioned compatibility aliases are intentionally omitted.

| Method | Route | Documentation |
| --- | --- | --- |
| GET | `/` | [Root](get_root.md) |
| GET | `/api/v1/admin/app-notices` | [List Admin App Notices](get_api_v1_admin_app_notices.md) |
| POST | `/api/v1/admin/app-notices` | [Create Admin App Notice](post_api_v1_admin_app_notices.md) |
| DELETE | `/api/v1/admin/app-notices/{notice_id}` | [Delete Admin App Notice](delete_api_v1_admin_app_notices_notice_id.md) |
| PATCH | `/api/v1/admin/app-notices/{notice_id}` | [Update Admin App Notice](patch_api_v1_admin_app_notices_notice_id.md) |
| GET | `/api/v1/admin/changelogs` | [List Admin Changelogs](get_api_v1_admin_changelogs.md) |
| POST | `/api/v1/admin/changelogs` | [Create Admin Changelog](post_api_v1_admin_changelogs.md) |
| DELETE | `/api/v1/admin/changelogs/{changelog_id}` | [Delete Admin Changelog](delete_api_v1_admin_changelogs_changelog_id.md) |
| PATCH | `/api/v1/admin/changelogs/{changelog_id}` | [Update Admin Changelog](patch_api_v1_admin_changelogs_changelog_id.md) |
| GET | `/api/v1/admin/dashboard` | [Get Admin Dashboard](get_api_v1_admin_dashboard.md) |
| GET | `/api/v1/admin/feedback` | [List Admin Feedback](get_api_v1_admin_feedback.md) |
| PATCH | `/api/v1/admin/feedback/{feedback_id}` | [Update Admin Feedback](patch_api_v1_admin_feedback_feedback_id.md) |
| GET | `/api/v1/admin/projects` | [List Admin Projects](get_api_v1_admin_projects.md) |
| PATCH | `/api/v1/admin/projects/{project_id}` | [Update Admin Project](patch_api_v1_admin_projects_project_id.md) |
| GET | `/api/v1/admin/support-tickets` | [List Admin Support Tickets](get_api_v1_admin_support_tickets.md) |
| PATCH | `/api/v1/admin/support-tickets/{ticket_id}` | [Update Admin Support Ticket](patch_api_v1_admin_support_tickets_ticket_id.md) |
| GET | `/api/v1/admin/users` | [List Admin Users](get_api_v1_admin_users.md) |
| PATCH | `/api/v1/admin/users/{user_id}` | [Update Admin User](patch_api_v1_admin_users_user_id.md) |
| GET | `/api/v1/app-notices/active` | [Get Active App Notice](get_api_v1_app_notices_active.md) |
| GET | `/api/v1/bookmarks/me` | [Get Bookmarked Projects](get_api_v1_bookmarks_me.md) |
| GET | `/api/v1/changelog` | [Get Changelogs Route](get_api_v1_changelog.md) |
| POST | `/api/v1/changelog` | [Create Changelog Route](post_api_v1_changelog.md) |
| GET | `/api/v1/changelog/admin/all` | [Get Admin Changelogs Route](get_api_v1_changelog_admin_all.md) |
| DELETE | `/api/v1/changelog/{changelog_id}` | [Delete Changelog Route](delete_api_v1_changelog_changelog_id.md) |
| PATCH | `/api/v1/changelog/{changelog_id}` | [Update Changelog Route](patch_api_v1_changelog_changelog_id.md) |
| GET | `/api/v1/changelog/{slug}` | [Get Single Changelog Route](get_api_v1_changelog_slug.md) |
| GET | `/api/v1/dashboard` | [Get Dashboard](get_api_v1_dashboard.md) |
| GET | `/api/v1/feed-events` | [Get Feed](get_api_v1_feed_events.md) |
| POST | `/api/v1/feedback` | [Create Feedback](post_api_v1_feedback.md) |
| GET | `/api/v1/feedback/admin` | [Admin List Feedback](get_api_v1_feedback_admin.md) |
| GET | `/api/v1/feedback/admin/{feedback_id}` | [Admin Get Feedback](get_api_v1_feedback_admin_feedback_id.md) |
| PATCH | `/api/v1/feedback/admin/{feedback_id}` | [Admin Update Feedback](patch_api_v1_feedback_admin_feedback_id.md) |
| PATCH | `/api/v1/feedback/admin/{feedback_id}/archive` | [Admin Archive Feedback](patch_api_v1_feedback_admin_feedback_id_archive.md) |
| GET | `/api/v1/feedback/me` | [List My Feedback](get_api_v1_feedback_me.md) |
| GET | `/api/v1/feedback/me/{feedback_id}` | [Get My Feedback](get_api_v1_feedback_me_feedback_id.md) |
| GET | `/api/v1/live-projects` | [Get Live Projects](get_api_v1_live_projects.md) |
| POST | `/api/v1/live-projects` | [Create New Live Project](post_api_v1_live_projects.md) |
| DELETE | `/api/v1/live-projects/comments/{comment_id}` | [Delete Journal Comment](delete_api_v1_live_projects_comments_comment_id.md) |
| PATCH | `/api/v1/live-projects/comments/{comment_id}` | [Update Journal Comment](patch_api_v1_live_projects_comments_comment_id.md) |
| DELETE | `/api/v1/live-projects/journals/{journal_id}` | [Delete Journal Entry](delete_api_v1_live_projects_journals_journal_id.md) |
| PATCH | `/api/v1/live-projects/journals/{journal_id}` | [Update Journal Entry](patch_api_v1_live_projects_journals_journal_id.md) |
| GET | `/api/v1/live-projects/journals/{journal_id}/comments` | [Get Journal Comments](get_api_v1_live_projects_journals_journal_id_comments.md) |
| POST | `/api/v1/live-projects/journals/{journal_id}/comments` | [Create Journal Comment](post_api_v1_live_projects_journals_journal_id_comments.md) |
| DELETE | `/api/v1/live-projects/journals/{journal_id}/like` | [Unlike Journal](delete_api_v1_live_projects_journals_journal_id_like.md) |
| POST | `/api/v1/live-projects/journals/{journal_id}/like` | [Like Journal](post_api_v1_live_projects_journals_journal_id_like.md) |
| DELETE | `/api/v1/live-projects/{slug}` | [Delete Single Live Project](delete_api_v1_live_projects_slug.md) |
| GET | `/api/v1/live-projects/{slug}` | [Get Live Project By Slug](get_api_v1_live_projects_slug.md) |
| PATCH | `/api/v1/live-projects/{slug}` | [Update Single Live Project](patch_api_v1_live_projects_slug.md) |
| GET | `/api/v1/live-projects/{slug}/journals` | [Get Project Journals](get_api_v1_live_projects_slug_journals.md) |
| POST | `/api/v1/live-projects/{slug}/journals` | [Create Journal Entry](post_api_v1_live_projects_slug_journals.md) |
| GET | `/api/v1/live-projects/{slug}/latest-commit` | [Get Latest Commit](get_api_v1_live_projects_slug_latest_commit.md) |
| GET | `/api/v1/profile/me` | [Get My Profile](get_api_v1_profile_me.md) |
| PATCH | `/api/v1/profile/me` | [Update Profile Data](patch_api_v1_profile_me.md) |
| GET | `/api/v1/profile/{username}` | [Get User Profile](get_api_v1_profile_username.md) |
| GET | `/api/v1/projects/` | [Fetch Projects](get_api_v1_projects.md) |
| POST | `/api/v1/projects/` | [Create Project](post_api_v1_projects.md) |
| POST | `/api/v1/projects/analyze-repo` | [Analyze Repository](post_api_v1_projects_analyze_repo.md) |
| DELETE | `/api/v1/projects/comments/{comment_id}` | [Remove Comment](delete_api_v1_projects_comments_comment_id.md) |
| PATCH | `/api/v1/projects/comments/{comment_id}` | [Edit Comment](patch_api_v1_projects_comments_comment_id.md) |
| POST | `/api/v1/projects/comments/{comment_id}/vote` | [Vote Comment](post_api_v1_projects_comments_comment_id_vote.md) |
| DELETE | `/api/v1/projects/{slug}` | [Delete Project](delete_api_v1_projects_slug.md) |
| GET | `/api/v1/projects/{slug}` | [Get Project](get_api_v1_projects_slug.md) |
| PATCH | `/api/v1/projects/{slug}` | [Update Project](patch_api_v1_projects_slug.md) |
| DELETE | `/api/v1/projects/{slug}/bookmark` | [Unbookmark Project](delete_api_v1_projects_slug_bookmark.md) |
| POST | `/api/v1/projects/{slug}/bookmark` | [Bookmark Project](post_api_v1_projects_slug_bookmark.md) |
| GET | `/api/v1/projects/{slug}/comments` | [Fetch Project Comments](get_api_v1_projects_slug_comments.md) |
| POST | `/api/v1/projects/{slug}/comments` | [Create Comment](post_api_v1_projects_slug_comments.md) |
| DELETE | `/api/v1/projects/{slug}/star` | [Unstar Project](delete_api_v1_projects_slug_star.md) |
| POST | `/api/v1/projects/{slug}/star` | [Star Project](post_api_v1_projects_slug_star.md) |
| GET | `/api/v1/projects/{username}/full-profile` | [Get Full Profile](get_api_v1_projects_username_full_profile.md) |
| GET | `/api/v1/search/users` | [Search Users](get_api_v1_search_users.md) |
| GET | `/api/v1/support/admin/tickets` | [Admin List Tickets](get_api_v1_support_admin_tickets.md) |
| PATCH | `/api/v1/support/admin/tickets/{ticket_id}` | [Admin Update Ticket](patch_api_v1_support_admin_tickets_ticket_id.md) |
| GET | `/api/v1/support/tickets` | [List My Tickets](get_api_v1_support_tickets.md) |
| POST | `/api/v1/support/tickets` | [Create Ticket](post_api_v1_support_tickets.md) |
| GET | `/api/v1/support/tickets/open` | [List My Open Tickets](get_api_v1_support_tickets_open.md) |
| GET | `/api/v1/support/tickets/{ticket_id}` | [Get My Ticket](get_api_v1_support_tickets_ticket_id.md) |
| PATCH | `/api/v1/support/tickets/{ticket_id}/close` | [Close My Ticket](patch_api_v1_support_tickets_ticket_id_close.md) |
| PATCH | `/api/v1/support/tickets/{ticket_id}/resolve` | [Resolve My Ticket](patch_api_v1_support_tickets_ticket_id_resolve.md) |
| POST | `/api/v1/sync_user/` | [Sync User Route](post_api_v1_sync_user.md) |
| GET | `/api/v1/sync_user/onboarding` | [Get User Data](get_api_v1_sync_user_onboarding.md) |
| POST | `/api/v1/sync_user/onboarding` | [Complete Onboarding Route](post_api_v1_sync_user_onboarding.md) |
| DELETE | `/api/v1/users/{username}/follow` | [Unfollow Single User](delete_api_v1_users_username_follow.md) |
| POST | `/api/v1/users/{username}/follow` | [Follow Single User](post_api_v1_users_username_follow.md) |
| GET | `/api/v1/users/{username}/follow-status` | [Get Follow Status](get_api_v1_users_username_follow_status.md) |
| GET | `/health` | [Operational health probe](get_health.md) |
| GET | `/health/live` | [Operational health probe](get_health_live.md) |
| GET | `/health/ready` | [Operational health probe](get_health_ready.md) |

Regenerate after changing routes or schemas:

```bash
cd backend
poetry run python generate_api_docs.py
```
