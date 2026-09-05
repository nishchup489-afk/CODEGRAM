from uuid import UUID

from fastapi import HTTPException

from sqlalchemy import delete, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.project import (
    Project,
    ProjectBookmark,
    ProjectStar,
)


# =========================================================
# ADD PROJECT BOOKMARK
# =========================================================

async def add_project_bookmark(
    db: AsyncSession,
    slug: str,
    user_id: UUID,
):

    project = await db.scalar(
        select(Project).where(
            Project.slug == slug
        )
    )

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    await db.execute(
        pg_insert(ProjectBookmark)
        .values(user_id=user_id, project_id=project.id)
        .on_conflict_do_nothing(constraint="unique_project_bookmark")
    )
    await db.commit()

    return {
        "project_id": project.id,
        "is_bookmarked": True,
    }


# =========================================================
# REMOVE PROJECT BOOKMARK
# =========================================================

async def remove_project_bookmark(
    db: AsyncSession,
    slug: str,
    user_id: UUID,
):

    project = await db.scalar(
        select(Project).where(
            Project.slug == slug
        )
    )

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    await db.execute(
        delete(ProjectBookmark).where(
            ProjectBookmark.user_id == user_id,
            ProjectBookmark.project_id == project.id,
        )
    )
    await db.commit()

    return {
        "project_id": project.id,
        "is_bookmarked": False,
    }


# =========================================================
# GET MY BOOKMARKS
# =========================================================

async def get_my_bookmarks(
    db: AsyncSession,
    user_id: UUID,
):
    bookmarks_result = await db.execute(
        select(ProjectBookmark)
        .options(
            selectinload(
                ProjectBookmark.project
            ).selectinload(
                Project.user
            )
        )
        .where(
            ProjectBookmark.user_id == user_id
        )
        .order_by(
            ProjectBookmark.created_at.desc()
        )
    )

    bookmarks = bookmarks_result.scalars().all()

    project_ids = [
        bookmark.project_id
        for bookmark in bookmarks
    ]

    starred_project_ids = set()

    if project_ids:

        stars_result = await db.execute(
            select(ProjectStar.project_id).where(
                ProjectStar.user_id == user_id,
                ProjectStar.project_id.in_(project_ids),
            )
        )

        starred_project_ids = set(
            stars_result.scalars().all()
        )

    serialized_projects = []

    for bookmark in bookmarks:

        project = bookmark.project

        serialized_projects.append({
            "id": project.id,
            "user_id": project.user_id,

            "title": project.title,
            "slug": project.slug,
            "description": project.description,

            "github_url": project.github_url,
            "live_url": project.live_url,

            "thumbnail_url": project.thumbnail_url,
            "demo_video_url": project.demo_video_url,

            "gallery_urls": project.gallery_urls or [],
            "tech_stack": project.tech_stack or [],

            "stars_count": project.stars_count,
            "views_count": project.views_count,
            "comments_count": project.comments_count,

            "is_featured": project.is_featured,

            "is_starred": project.id in starred_project_ids,
            "is_bookmarked": True,

            "created_at": project.created_at,
            "updated_at": project.updated_at,

            "user": {
                "username": project.user.username,
                "avatar_url": project.user.avatar_url,
                "location": project.user.location,
            },
        })

    return serialized_projects
