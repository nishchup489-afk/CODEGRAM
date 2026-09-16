import uuid

from sqlalchemy import (
    Column,
    String,
    Text,
    Date,
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
    Index,
    func,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.enums import ActivityClass, ActivityType, EntrySource , EventSource


class ActivityEntry(Base):
    __tablename__ = "activity_entries"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    project_id = Column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    title = Column(
        String(255),
        nullable=False,
    )

    activity_class = Column(
        SqlEnum(
                    ActivityClass,
                    name="activity_class_enum",
                    native_enum=True,
                ),
        nullable=False,
        index=True,
    )

    activity_type = Column(
        SqlEnum(
            ActivityType,
            name="activity_type_enum",
            native_enum=True,
        ),
        nullable=False,
        index=True,
    )

    description = Column(
        Text,
        nullable=True,
    )

    problem = Column(
        Text,
        nullable=True,
    )

    solution = Column(
        Text,
        nullable=True,
    )

    impact = Column(
        Text,
        nullable=True,
    )

    source = Column(
        SqlEnum(
            EntrySource,
            name="entry_source_enum",
            native_enum=True,
        ),
        nullable=False,
        index=True,
    )

    evidence_url = Column(
        Text,
        nullable=True,
    )

    occurred_on = Column(
        Date,
        nullable=False,
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    edit_locked_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    content_hash = Column(
        String(64),
        nullable=False,
        index=True,
    )

    # "metadata" is reserved by SQLAlchemy's declarative Base,
    # so the Python attribute must have another name.
    metadata_ = Column(
        "metadata",
        JSONB,
        nullable=False,
        default=dict,
        server_default="{}",
    )

    # Relationships
    user = relationship(
        "User",
        lazy="selectin",
    )

    project = relationship(
        "Project",
        lazy="selectin",
    )

    __table_args__ = (
        Index(
            "ix_activity_entries_user_occurred_on",
            "user_id",
            "occurred_on",
        ),
        Index(
            "ix_activity_entries_user_class",
            "user_id",
            "activity_class",
        ),
    )


import uuid

from sqlalchemy import (
    Column,
    String,
    Date,
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
    Index,
    UniqueConstraint,
    func,
)


class ActivityEvent(Base):
    __tablename__ = "activity_events"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    project_id = Column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    source = Column(
        SqlEnum(
            EventSource,
            name="event_source_enum",
            values_callable=lambda enum: [item.value for item in enum],
        ),
        nullable=False,
    )

    external_id = Column(
        String(255),
        nullable=False,
    )

    event_type = Column(
        String(100),
        nullable=False,
        index=True,
    )

    activity_class = Column(
        SqlEnum(
            ActivityClass,
            name="activity_class_enum",
            values_callable=lambda enum: [item.value for item in enum],
        ),
        nullable=False,
        index=True,
    )

    activity_type = Column(
        SqlEnum(
            ActivityType,
            name="activity_type_enum",
            values_callable=lambda enum: [item.value for item in enum],
        ),
        nullable=False,
        index=True,
    )

    occurred_at = Column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )

    occurred_on = Column(
        Date,
        nullable=False,
        index=True,
    )

    payload = Column(
        JSONB,
        nullable=False,
        default=dict,
        server_default="{}",
    )

    ingested_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    user = relationship(
        "User",
        lazy="selectin",
    )

    project = relationship(
        "Project",
        lazy="selectin",
    )

    __table_args__ = (
        UniqueConstraint(
            "source",
            "external_id",
            name="uq_activity_events_source_external_id",
        ),

        Index(
            "ix_activity_events_user_occurred_at",
            "user_id",
            "occurred_at",
        ),

        Index(
            "ix_activity_events_user_occurred_on",
            "user_id",
            "occurred_on",
        ),

        Index(
            "ix_activity_events_source_event_type",
            "source",
            "event_type",
        ),
    )