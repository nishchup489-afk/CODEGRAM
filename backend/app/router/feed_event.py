from fastapi import (
    APIRouter,
    Depends,
    Query,
)
from datetime import datetime
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.schema.liveProjects import (
    GetFeedEvent,
)

from app.service.LiveProjects import (
    get_feed_events,
)


router = APIRouter(

    prefix="/feed-events",

    tags=["Feed Events"],

)


# =========================================================
# GET FEED EVENTS
# =========================================================

@router.get(

    "",

    response_model=list[GetFeedEvent],

)

async def get_feed(

    limit: int = Query(default=50, ge=1, le=100),

    cursor: datetime | None = Query(default=None),

    cursor_id: UUID | None = Query(default=None),

    db: AsyncSession = Depends(get_db),

):

    return await get_feed_events(

        db=db,

        limit=limit,

        cursor=cursor,

        cursor_id=cursor_id,

    )
