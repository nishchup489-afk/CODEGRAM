from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    func,
)

from sqlalchemy.dialects.postgresql import UUID, JSONB

from sqlalchemy.orm import relationship

from app.core.database import Base

import uuid


# =========================================================
# USERS
# =========================================================

class User(Base):

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    clerk_user_id = Column(String, unique=True, nullable=False, index=True)

    username = Column(String(32), unique=True, nullable=False, index=True)

    username_lower = Column(String(32), unique=True, nullable=False, index=True)

    display_name = Column(String(100), nullable=True)

    email = Column(String, unique=True, nullable=False, index=True)

    bio = Column(String(280), nullable=True)

    avatar_url = Column(Text, nullable=True)

    banner_url = Column(Text, nullable=True)

    github_url = Column(Text, nullable=True)

    linkedin_url = Column(Text, nullable=True)

    portfolio_url = Column(Text, nullable=True)

    reputation_score = Column(Integer, default=0, nullable=False)

    followers_count = Column(Integer, default=0, nullable=False)

    following_count = Column(Integer, default=0, nullable=False)

    posts_count = Column(Integer, default=0, nullable=False)

    project_count = Column(Integer, default=0, nullable=False)

    reports_count = Column(Integer, default=0, nullable=False)

    onboarding_completed = Column(Boolean, default=False, nullable=False)

    is_verified = Column(Boolean, default=False, nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)

    is_private = Column(Boolean, default=False, nullable=False)

    is_banned = Column(Boolean, default=False, nullable=False)

    deleted_at = Column(DateTime(timezone=True), nullable=True)

    last_seen_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    posts = relationship("Post", back_populates="user")

    projects = relationship("Project", back_populates="user")


# =========================================================
# FOLLOWS
# =========================================================

class Follow(Base):

    __tablename__ = "follows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    follower_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    following_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )













