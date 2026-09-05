from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.auth import ClerkPrincipal, get_clerk_principal, get_clerk_primary_email

from app.schema.user import (
    UserSync,
    UserOnboarding,
    UserResponse,
)

from app.service.user import (
    sync_user,
    complete_onboarding,
    get_user_by_clerk_id,
)


router = APIRouter(
    prefix="/sync_user",
    tags=["Sync User"],
)


# =========================================================
# SYNC USER
# =========================================================

@router.post(
    "/",
    response_model=UserResponse,
)
async def sync_user_route(
    data: UserSync,
    principal: ClerkPrincipal = Depends(get_clerk_principal),
    db: AsyncSession = Depends(get_db),
):

    email = await get_clerk_primary_email(principal)

    return await sync_user(
        db=db,
        data=data,
        clerk_user_id=principal.user_id,
        email=email,
    )


# =========================================================
# COMPLETE ONBOARDING
# =========================================================

@router.post(
    "/onboarding",
    response_model=UserResponse,
)
async def complete_onboarding_route(
    data: UserOnboarding,
    principal: ClerkPrincipal = Depends(get_clerk_principal),
    db: AsyncSession = Depends(get_db),
):

    return await complete_onboarding(
        db=db,
        data=data,
        clerk_user_id=principal.user_id,
    )


# =========================================================
# GET USER DATA
# =========================================================

@router.get(
    "/onboarding",
    response_model=UserResponse,
)
async def get_user_data(
    principal: ClerkPrincipal = Depends(get_clerk_principal),
    db: AsyncSession = Depends(get_db),
):

    return await get_user_by_clerk_id(
        db=db,
        clerk_user_id=principal.user_id,
    )
