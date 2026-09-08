from fastapi import APIRouter

from app.router import (
    admin,
    app_notice,
    bookmark,
    changelog,
    dashboard,
    dashboard_layout,
    early_access,
    feed_event,
    feedback,
    follow,
    idea,
    live_projects,
    operations,
    profile,
    project,
    search,
    support,
    user,
)


router = APIRouter()

for child_router in (
    user.router,
    profile.router,
    project.router,
    bookmark.router,
    live_projects.router,
    feed_event.router,
    dashboard.router,
    support.router,
    feedback.router,
    admin.router,
    follow.router,
    search.router,
    changelog.router,
    app_notice.router,
    early_access.router,
    operations.router,
):
    router.include_router(child_router)


__all__ = [
    "admin",
    "app_notice",
    "bookmark",
    "changelog",
    "dashboard",
    "dashboard_layout",
    "early_access",
    "feed_event",
    "feedback",
    "follow",
    "idea",
    "live_projects",
    "operations",
    "profile",
    "project",
    "router",
    "search",
    "support",
    "user",
]
