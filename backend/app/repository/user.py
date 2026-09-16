import uuid

from fastapi import HTTPException , status
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
    clerk_user_id: str,
    email: str,
):
    # 1. First try to find user by Clerk ID
    existing_user = await db.scalar(
        select(User).where(
            User.clerk_user_id == clerk_user_id
        )
    )

    if existing_user:
        email_owner = await db.scalar(
            select(User).where(
                User.email == email,
                User.id != existing_user.id,
            )
        )
        if email_owner:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already linked to another Clerk account",
            )

        # Email is owned by Clerk, so it is always refreshed.
        existing_user.email = email

        # IMPORTANT:
        # Profile fields are owned by the user once onboarding has set them.
        # Clerk values (which are often null for email/password signups) may
        # only fill a gap, never overwrite what the user chose. Without this,
        # every sign-in wiped the onboarding display name back to Clerk's
        # fullName.
        if data.github_url:
            existing_user.github_url = data.github_url

        if data.github_username:
            existing_user.github_username = data.github_username

        if data.github_user_id:
            existing_user.github_user_id = data.github_user_id

        if not existing_user.display_name and data.display_name:
            existing_user.display_name = data.display_name

        if not existing_user.avatar_url and data.avatar_url:
            existing_user.avatar_url = data.avatar_url

        await db.commit()
        await db.refresh(existing_user)

        return existing_user

    # 2. If Clerk ID not found, check by email
    email_user = await db.scalar(
        select(User).where(
            User.email == email
        )
    )

    if email_user:
        # Never move an existing account to a different Clerk subject inside
        # a public request. Legacy account linking must use an audited admin
        # migration or a verified Clerk webhook.
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already linked to another Clerk account",
        )

    # 3. Create new user only when BOTH clerk_user_id and email are new
    generated_username = f"user_{uuid.uuid4().hex[:8]}"

    new_user = User(
        clerk_user_id=clerk_user_id,
        email=email,
        display_name=data.display_name,
        avatar_url=data.avatar_url,

        github_url=data.github_url,
        github_username=data.github_username,
        github_user_id=data.github_user_id,

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
    clerk_user_id: str,
):

    existing_user = await db.scalar(
        select(User).where(
            User.clerk_user_id == clerk_user_id
        )
    )

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    clean_username = data.username.strip()
    username_lower = clean_username.lower()

    username_exists = await db.scalar(
        select(User).where(
            User.username_lower == username_lower
        )
    )

    if username_exists and username_exists.id != existing_user.id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken",
        )

    existing_user.username = clean_username
    existing_user.username_lower = username_lower

    existing_user.display_name = data.display_name.strip()

    existing_user.bio = data.bio
    existing_user.avatar_url = data.avatar_url
    existing_user.banner_url = data.banner_url

    existing_user.github_url = data.github_url
    existing_user.linkedin_url = data.linkedin_url
    existing_user.portfolio_url = data.portfolio_url
    existing_user.instagram_url = data.instagram_url

    existing_user.location = data.location
    existing_user.current_build = data.current_build

    existing_user.onboarding_completed = True

    await db.commit()
    await db.refresh(existing_user)

    return existing_user
