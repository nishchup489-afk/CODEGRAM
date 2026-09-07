from fastapi import APIRouter

from app.api.v1.admin import router as admin_router
from app.api.v1.feedback import router as feedback_router
from app.api.v1.support import router as support_router
from app.router.app_notice import router as app_notice_router
from app.router.bookmark import router as bookmark_router
from app.router.changelog import router as changelog_router
from app.router.dashboard import router as main_dashboard_router
from app.router.feed_event import router as feed_event_router
from app.router.follow import router as follow_router
from app.router.live_projects import router as live_project_router
from app.router.operations import router as operations_router
from app.router.profile import router as profile_router
from app.router.project import router as project_router
from app.router.search import router as search_router
from app.router.user import router as user_router


router = APIRouter()

for child_router in (
    user_router,
    profile_router,
    project_router,
    bookmark_router,
    live_project_router,
    feed_event_router,
    main_dashboard_router,
    support_router,
    feedback_router,
    admin_router,
    follow_router,
    search_router,
    changelog_router,
    app_notice_router,
    operations_router,
):
    router.include_router(child_router)


__all__ = ["router"]
