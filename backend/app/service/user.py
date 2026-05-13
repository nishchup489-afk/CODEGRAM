import uuid

from sqlalchemy import select

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User

from app.schema.user import (
    UserSync,
    UserOnboarding,
)


async def get_user_by_clerk_id(
    db: AsyncSession,
    clerk_user_id: str,
):

    user = await db.scalar(
        select(User).where(
            User.clerk_user_id == clerk_user_id
        )
    )

    return user



async def sync_user(
    db: AsyncSession,
    data: UserSync,
):

    existing_user = await db.scalar(
        select(User).where(
            User.clerk_user_id == data.clerk_user_id
        )
    )

    # USER ALREADY EXISTS
    if existing_user:
        return existing_user
    
    generated_username = f"user_{uuid.uuid4().hex[:8]}"

    # CREATE MINIMAL USER
    new_user = User(

        clerk_user_id=data.clerk_user_id,

        email=data.email,

        display_name=data.display_name,

        avatar_url=data.avatar_url,

        username=generated_username,

        username_lower=generated_username.lower(),
    )

    db.add(new_user)

    await db.commit()

    await db.refresh(new_user)

    return new_user






async def complete_onboarding(
    db: AsyncSession,
    data: UserOnboarding,
):

    existing_user = await db.scalar(
        select(User).where(
            User.clerk_user_id == data.clerk_user_id
        )
    )


    username_exists = await db.scalar(
        select(User).where(
            User.username_lower == data.username.lower()
        )
    )

    if username_exists and username_exists.id != existing_user.id:
        return {
            "message": "Username already taken"
        }

    existing_user.username = data.username

    existing_user.username_lower = data.username.lower()

    existing_user.display_name = data.display_name

    existing_user.bio = data.bio

    existing_user.avatar_url = data.avatar_url

    existing_user.banner_url = data.banner_url

    existing_user.github_url = data.github_url

    existing_user.linkedin_url = data.linkedin_url

    existing_user.portfolio_url = data.portfolio_url

    existing_user.onboarding_completed = True

    await db.commit()

    await db.refresh(existing_user)

    return existing_user