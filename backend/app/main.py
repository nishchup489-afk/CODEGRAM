from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.router.user import router as user_router
from app.router.dashboard_layout import router as dashboard_router
from app.router.profile import router as profile_router
from app.router.project import router as project_router
from app.router.bookmark import router as bookmark_router
from app.router.live_projects import router as live_project_router
from app.router.feed_event import router as feed_event_router 
from app.router.dashboard import router as main_dashboard_router
from app.api.v1.support import router as support_router
from app.api.v1.feedback import router as feedback_router
from app.api.v1 import admin
from app.router.follow import router as follow_router
from app.router.search import router as search_router
from app.router.changelog import router as changelog_router

app = FastAPI()


app.include_router(user_router)
app.include_router(dashboard_router)
app.include_router(profile_router)
app.include_router(project_router)
app.include_router(bookmark_router)
app.include_router(live_project_router)
app.include_router(feed_event_router)
app.include_router(main_dashboard_router)
app.include_router(support_router)
app.include_router(feedback_router)
app.include_router(admin.router)
app.include_router(follow_router)
app.include_router(search_router)
app.include_router(changelog_router)


origins = [
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "DevManiac API"}