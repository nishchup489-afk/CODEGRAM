from sqlalchemy.ext.asyncio import AsyncSession 
from sqlalchemy import select , func
from app.models.user import User 
from fastapi import HTTPException 
from app.models.project import ProjectBookmark , Project, ProjectStar
from sqlalchemy.orm import selectinload


async def get_my_bookmarks(
    db: AsyncSession,
    clerk_user_id: str,
):

    user = await db.scalar(
        select(User).where(
            User.clerk_user_id == clerk_user_id
        )
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    bookmarks = await db.scalars(

        select(ProjectBookmark)

        .options(

            selectinload(
                ProjectBookmark.project
            ).selectinload(
                Project.user
            )
        )

        .where(
            ProjectBookmark.user_id == user.id
        )

        .order_by(
            ProjectBookmark.created_at.desc()
        )
    )

    bookmarks = bookmarks.all()

    serialized_projects = []

    for bookmark in bookmarks:

        project = bookmark.project

        stars_count = await db.scalar(
            select(func.count(ProjectStar.id))
            .where(
                ProjectStar.project_id == project.id
            )
        )

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

            "gallery_urls": project.gallery_urls,

            "tech_stack": project.tech_stack,

            "stars_count": stars_count,

            "views_count": project.views_count,

            "comments_count": project.comments_count,

            "is_featured": project.is_featured,

            "is_starred": False,

            "is_bookmarked": True,

            "created_at": project.created_at,

            "updated_at": project.updated_at,

            "user": {

                "username": project.user.username,

                "avatar_url": project.user.avatar_url,

                "location": project.user.location,
            }
        })

    return serialized_projects