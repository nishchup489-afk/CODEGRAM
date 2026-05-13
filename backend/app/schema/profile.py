from pydantic import BaseModel 
import uuid 

class get_profile_data(BaseModel):

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


class update_profile_data(BaseModel):
    username: str
    display_name: str | None
    bio: str | None
    avatar_url: str | None
    banner_url: str | None
    github_url: str | None
    linkedin_url: str | None
    portfolio_url: str | None
