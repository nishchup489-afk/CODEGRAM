from fastapi import HTTPException

from sqlalchemy import delete, func, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, Follow


# =========================================================
# HELPERS
# =========================================================

async def get_user_by_username(
    db: AsyncSession,
    username: str,
):
    result = await db.execute(
        select(User).where(
            User.username_lower == username.lower()
        )
    )

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Target user not found",
        )

    return user


async def get_existing_follow(
    db: AsyncSession,
    follower_id,
    following_id,
):
    result = await db.execute(
        select(Follow).where(
            Follow.follower_id == follower_id,
            Follow.following_id == following_id,
        )
    )

    return result.scalar_one_or_none()


# =========================================================
# FOLLOW USER
# =========================================================

async def follow_user(
    db: AsyncSession,
    current_user: User,
    username: str,
):
    target_user = await get_user_by_username(
        db=db,
        username=username,
    )

    if current_user.id == target_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot follow yourself",
        )

    # Lock both counter owners in a deterministic order. This serializes all
    # follow changes that share either user and avoids reciprocal-follow
    # deadlocks.
    locked_users = await db.scalars(
        select(User)
        .where(User.id.in_((current_user.id, target_user.id)))
        .order_by(User.id)
        .with_for_update()
    )
    users_by_id = {user.id: user for user in locked_users.all()}
    current_user = users_by_id[current_user.id]
    target_user = users_by_id[target_user.id]

    follow_id = await db.scalar(
        pg_insert(Follow)
        .values(
            follower_id=current_user.id,
            following_id=target_user.id,
        )
        .on_conflict_do_nothing(constraint="uq_follower_following")
        .returning(Follow.id)
    )

    if follow_id is None:
        await db.rollback()
        raise HTTPException(
            status_code=409,
            detail="You are already following this user",
        )

    current_user.following_count = await db.scalar(
        select(func.count(Follow.id)).where(
            Follow.follower_id == current_user.id
        )
    )
    target_user.followers_count = await db.scalar(
        select(func.count(Follow.id)).where(
            Follow.following_id == target_user.id
        )
    )

    await db.commit()

    return {
        "is_following": True,
        "followers_count": target_user.followers_count,
        "following_count": current_user.following_count,
    }


# =========================================================
# UNFOLLOW USER
# =========================================================

async def unfollow_user(
    db: AsyncSession,
    current_user: User,
    username: str,
):
    target_user = await get_user_by_username(
        db=db,
        username=username,
    )

    if current_user.id == target_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot unfollow yourself",
        )

    locked_users = await db.scalars(
        select(User)
        .where(User.id.in_((current_user.id, target_user.id)))
        .order_by(User.id)
        .with_for_update()
    )
    users_by_id = {user.id: user for user in locked_users.all()}
    current_user = users_by_id[current_user.id]
    target_user = users_by_id[target_user.id]

    removed_follow_id = await db.scalar(
        delete(Follow)
        .where(
            Follow.follower_id == current_user.id,
            Follow.following_id == target_user.id,
        )
        .returning(Follow.id)
    )

    if removed_follow_id is None:
        await db.rollback()
        raise HTTPException(
            status_code=404,
            detail="You are not following this user",
        )

    current_user.following_count = await db.scalar(
        select(func.count(Follow.id)).where(
            Follow.follower_id == current_user.id
        )
    )
    target_user.followers_count = await db.scalar(
        select(func.count(Follow.id)).where(
            Follow.following_id == target_user.id
        )
    )

    await db.commit()

    return {
        "is_following": False,
        "followers_count": target_user.followers_count,
        "following_count": current_user.following_count,
    }


# =========================================================
# CHECK FOLLOW STATUS
# =========================================================

async def check_follow_status(
    db: AsyncSession,
    current_user: User,
    username: str,
):
    target_user = await get_user_by_username(
        db=db,
        username=username,
    )

    existing_follow = await get_existing_follow(
        db=db,
        follower_id=current_user.id,
        following_id=target_user.id,
    )

    return {
        "is_following": existing_follow is not None,
        "followers_count": target_user.followers_count,
        "following_count": current_user.following_count,
    }
