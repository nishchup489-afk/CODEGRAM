import uuid

from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
)

from sqlalchemy.dialects.postgresql import (
    UUID,
    JSONB,
)

from sqlalchemy.orm import relationship

from sqlalchemy.sql import func

from app.core.database import Base


# =========================================================
# PROJECTS
# =========================================================

class Project(Base):

    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    title = Column(String(200), nullable=False)

    slug = Column(String(200), unique=True, nullable=False)

    description = Column(Text, nullable=False)

    github_url = Column(Text, nullable=True)

    live_url = Column(Text, nullable=True)

    thumbnail_url = Column(Text, nullable=True)

    tech_stack = Column(JSONB, nullable=True)

    stars_count = Column(Integer, default=0, nullable=False)

    views_count = Column(Integer, default=0, nullable=False)

    is_featured = Column(Boolean, default=False, nullable=False)

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

    user = relationship("User", back_populates="projects")


# =========================================================
# PROJECT STARS
# =========================================================

class ProjectStar(Base):

    __tablename__ = "project_stars"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    project_id = Column(
        UUID(as_uuid=True),
        ForeignKey("projects.id"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
