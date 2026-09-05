from datetime import datetime
from uuid import UUID
from typing import List

from fastapi import (
    APIRouter,
    Depends,
    Query,
    status,
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

from app.schema.project import (
    AnalyzeRepoRequest,
    CreateProject,
    PaginatedProjects,
    UpdateProject,
    GetProject,
    CommentOut,
    GetComment,
    AddComment,
    UpdateComment,
    AddVote,
    ProjectBookmarkStatus,
)

from app.service.project import (
    create_new_project,
    delete_existing_project,
    get_existing_project,
    get_projects,
    get_users_all_profile,
    update_existing_project,
    add_project_star,
    remove_project_star,
    add_project_comment,
    update_project_comment,
    delete_project_comment,
    get_project_comments,
    vote_on_comment,
    
    
)
from app.service.bookmark import add_project_bookmark, remove_project_bookmark
from app.models.user import User
from app.core.auth import get_current_user, get_current_user_optional
from app.schema.ProfileAnalytics import UserFullProfileResponse


router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


# =========================================================
# CREATE PROJECT
# =========================================================

@router.post(
    "/",
    response_model=GetProject,
    status_code=status.HTTP_201_CREATED,
)
async def create_project(
    data: CreateProject,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await create_new_project(
        db=db,
        data=data,
        user_id=current_user.id,
    )


# =========================================================
# GET SINGLE PROJECT
# =========================================================

@router.get(
    "/{slug}",
    response_model=GetProject,
)
async def get_project(
    slug: str,
    current_user: User | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):

    return await get_existing_project(
        db=db,
        slug=slug,
        clerk_user_id=current_user.clerk_user_id if current_user else None,
    )


# =========================================================
# GET ALL PROJECTS OF A USER
# =========================================================
@router.get(
    "/{username}/full-profile",
    response_model=UserFullProfileResponse,
)
async def get_full_profile(
    username: str,
    current_user: User | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    return await get_users_all_profile(
        db=db,
        username=username,
        viewer_user_id=current_user.id if current_user else None,
    )


# =========================================================
# ANALYZE REPOSITORY
# =========================================================

@router.post("/analyze-repo")
async def analyze_repository(
    data: AnalyzeRepoRequest,
):

    github_url = data.github_url



    # temporary fake response
    # later this becomes:
    # github api analysis
    # language analysis
    # repo scraping
    # ai architecture analysis

    return {

        "repo_name": "Detected Repo",

        "description":
            "Repository analysis connected successfully.",

        "detected_stack": [
            "Next.js",
            "FastAPI",
            "PostgreSQL",
            "Tailwind",
        ],

        "stars": 12,

        "thumbnail_url": "",
    }

# =========================================================
# GET ALL PROJECTS
# =========================================================

@router.get(
    "/",
    response_model=PaginatedProjects,
)
async def fetch_projects(
    limit: int = Query(default=20, le=100),
    cursor: datetime = Query(default=None),

    db: AsyncSession = Depends(get_db),

    current_user: User | None = Depends(
        get_current_user_optional
    ),
):

    return await get_projects(
        db=db,
        limit=limit,
        cursor=cursor,
        current_user=current_user,
    )


# =========================================================
# DELETE PROJECT
# =========================================================

@router.delete(
    "/{slug}",
)
async def delete_project(
    slug: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await delete_existing_project(
        db=db,
        slug=slug,
        clerk_user_id=current_user.clerk_user_id,
    )


# =========================================================
# UPDATE PROJECT
# =========================================================

@router.patch(
    "/{slug}",
    response_model=GetProject,
)
async def update_project(
    slug: str,
    data: UpdateProject,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await update_existing_project(
        db=db,
        slug=slug,
        data=data,
        user_id=current_user.id,
    )


# =========================================================
# STAR PROJECT
# =========================================================

@router.post(
    "/{slug}/star",
    response_model=GetProject,
)
async def star_project(
    slug: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):

    return await add_project_star(
        db=db,
        slug=slug,
        user_id=current_user.id,
    )


# =========================================================
# UNSTAR PROJECT
# =========================================================

@router.delete(
    "/{slug}/star",
    response_model=GetProject,
)
async def unstar_project(
    slug: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):

    return await remove_project_star(
        db=db,
        slug=slug,
        user_id=current_user.id,
    )


# =========================================================
# ADD COMMENT
# =========================================================

@router.post(
    "/{slug}/comments",
    response_model=CommentOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_comment(
    slug: str,
    data: AddComment,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):

    return await add_project_comment(
        db=db,
        slug=slug,
        data=data,
        user_id=current_user.id,
    )


# =========================================================
# GET PROJECT COMMENTS
# =========================================================

@router.get(
    "/{slug}/comments",
    response_model=List[GetComment],
)
async def fetch_project_comments(
    slug: str,
    db: AsyncSession = Depends(get_db),
):

    return await get_project_comments(
        db=db,
        slug=slug,
    )


# =========================================================
# UPDATE COMMENT
# =========================================================

@router.patch(
    "/comments/{comment_id}",
    response_model=CommentOut,
)
async def edit_comment(
    comment_id: UUID,
    data: UpdateComment,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):

    return await update_project_comment(
        db=db,
        comment_id=comment_id,
        data=data,
        user_id=current_user.id,
    )


# =========================================================
# DELETE COMMENT
# =========================================================

@router.delete(
    "/comments/{comment_id}",
)
async def remove_comment(
    comment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):

    return await delete_project_comment(
        db=db,
        comment_id=comment_id,
        user_id=current_user.id,
    )


# =========================================================
# VOTE COMMENT
# =========================================================

@router.post(
    "/comments/{comment_id}/vote",
    response_model=CommentOut,
)
async def vote_comment(
    comment_id: UUID,
    data: AddVote,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):

    return await vote_on_comment(
        db=db,
        comment_id=comment_id,
        data=data,
        user_id=current_user.id,
    )


# =========================================================
# ADD BOOKMARK
# =========================================================

@router.post(
    "/{slug}/bookmark",
    response_model=ProjectBookmarkStatus,
)
async def bookmark_project(
    slug: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):

    return await add_project_bookmark(
        db=db,
        slug=slug,
        user_id=current_user.id,
    )


# =========================================================
# REMOVE BOOKMARK
# =========================================================

@router.delete(
    "/{slug}/bookmark",
    response_model=ProjectBookmarkStatus,
)
async def unbookmark_project(
    slug: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):

    return await remove_project_bookmark(
        db=db,
        slug=slug,
        user_id=current_user.id,
    )
