from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models  # noqa: F401
from app.core.config import settings
from app.core.operations import configure_operational_middleware
from app.router import router



app = FastAPI(
    title=f"{settings.APP_NAME} API",
    version="1.0.0",
    debug=settings.DEBUG,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

configure_operational_middleware(app)


# Versioned routes are the canonical API contract. The unversioned mount keeps
# the current frontend working during its later migration and is intentionally
# hidden from generated API documentation.
app.include_router(router, prefix=settings.API_V1_PREFIX)
app.include_router(router, include_in_schema=False)


@app.get("/")
async def root():
    return {"message": "DevManiac API"}
