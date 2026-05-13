from uuid import UUID

from pydantic import BaseModel
from pydantic import EmailStr


class UserSync(BaseModel):

    clerk_user_id: str
    email: EmailStr
    display_name: str | None = None
    avatar_url: str | None = None


class UserOnboarding(BaseModel):

    clerk_user_id: str
    username: str
    display_name: str
    bio: str | None = None
    avatar_url: str | None = None
    banner_url: str | None = None
    github_url: str | None = None
    linkedin_url: str | None = None
    portfolio_url: str | None = None


class UserResponse(BaseModel):

    clerk_user_id: str
    username: str
    display_name: str | None
    email: str
    bio: str | None
    avatar_url: str | None
    banner_url: str | None
    github_url: str | None
    linkedin_url: str | None
    portfolio_url: str | None
    reputation_score: int
    followers_count: int
    following_count: int
    posts_count: int
    project_count: int
    class Config:
        from_attributes = True
