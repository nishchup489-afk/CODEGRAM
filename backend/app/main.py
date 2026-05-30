from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.router.user import router as user_router
from app.router.dashboard_layout import router as dashboard_router
from app.router.profile import router as profile_router
from app.router.project import router as project_router
from app.router.bookmark import router as bookmark_router

app = FastAPI()


app.include_router(user_router)
app.include_router(dashboard_router)
app.include_router(profile_router)
app.include_router(project_router)
app.include_router(bookmark_router)

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
    return {"message": "CODEGRAM API"}