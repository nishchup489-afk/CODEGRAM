from fastapi import APIRouter

from app.api.v1.admin import router as admin_router
from app.api.v1.feedback import router as feedback_router
from app.api.v1.support import router as support_router
from app.router import (
    app_notice,
    bookmark,
    changelog,
    dashboard,
    dashboard_layout,
    feed_event,
    follow,
    idea,
    live_projects,
    operations,
    profile,
    project,
    search,
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
    support_router,
    feedback_router,
    admin_router,
    follow.router,
    search.router,
    changelog.router,
    app_notice.router,
    operations.router,
):
    router.include_router(child_router)


__all__ = [
    "app_notice",
    "bookmark",
    "changelog",
    "dashboard",
    "dashboard_layout",
    "feed_event",
    "follow",
    "idea",
    "live_projects",
    "operations",
    "profile",
    "project",
    "router",
    "search",
    "user",
]
