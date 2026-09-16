import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models  # noqa: F401
from app.core.config import settings
from app.core.operations import configure_operational_middleware
from app.router import router


logger = logging.getLogger(__name__)



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


if not settings.clerk_configured:
    # Production refuses to boot without this (see Settings), so reaching here
    # means development. Warn loudly: every authenticated route returns 503
    # until CLERK_ISSUER is set, and that reads like a backend outage.
    logger.warning(
        "CLERK_ISSUER is not set. Authenticated routes will return 503 until "
        "it is configured with the Clerk Frontend API URL (see .env.example)."
    )


# Versioned routes are the sole public API contract.
app.include_router(router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    return {"message": "DevManiac API"}
