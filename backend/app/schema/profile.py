from pydantic import BaseModel, ConfigDict
from uuid import UUID

class PublicProfileResponse(BaseModel):
    id: UUID
    username: str
    display_name: str | None
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
    instagram_url: str | None = None

    location: str | None = None

    current_build: str | None = None

    joined_date: str | None = None
    model_config = ConfigDict(from_attributes=True)


class PrivateProfileResponse(PublicProfileResponse):
    clerk_user_id: str
    email: str


# Compatibility alias for internal call sites; public routes must explicitly use
# PublicProfileResponse so provider identifiers are never serialized by mistake.
get_profile_data = PrivateProfileResponse


class update_profile_data(BaseModel):
    username: str
    display_name: str | None = None
    bio: str | None = None

    avatar_url: str | None = None
    banner_url: str | None = None

    github_url: str | None = None
    linkedin_url: str | None = None
    portfolio_url: str | None = None
    instagram_url: str | None = None

    location: str | None = None
    current_build: str | None = None


class PublicUser(BaseModel):

    id: UUID

    username: str

    display_name: str | None

    avatar_url: str | None

    current_build: str | None

    model_config = ConfigDict(from_attributes=True)
