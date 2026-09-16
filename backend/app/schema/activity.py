from datetime import date, datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, HttpUrl

from app.models.enums import (
    ActivityClass,
    ActivityType,
    EntrySource,
    EventSource,
)


# ============================================================
# ACTIVITY ENTRY
# ============================================================


class ActivityEntryCreate(BaseModel):
    project_id: UUID | None = None

    title: str = Field(
        min_length=1,
        max_length=255,
    )

    activity_class: ActivityClass
    activity_type: ActivityType

    description: str | None = None
    problem: str | None = None
    solution: str | None = None
    impact: str | None = None

    evidence_url: HttpUrl | None = None

    occurred_on: date

    metadata: dict[str, Any] = Field(
        default_factory=dict,
    )


class ActivityEntryUpdate(BaseModel):
    project_id: UUID | None = None

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    activity_class: ActivityClass | None = None
    activity_type: ActivityType | None = None

    description: str | None = None
    problem: str | None = None
    solution: str | None = None
    impact: str | None = None

    evidence_url: HttpUrl | None = None

    occurred_on: date | None = None

    metadata: dict[str, Any] | None = None


class ActivityEntryResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

    id: UUID

    user_id: UUID
    project_id: UUID | None

    title: str

    activity_class: ActivityClass
    activity_type: ActivityType

    description: str | None
    problem: str | None
    solution: str | None
    impact: str | None

    source: EntrySource

    evidence_url: HttpUrl | None

    occurred_on: date

    created_at: datetime
    updated_at: datetime

    edit_locked_at: datetime | None

    content_hash: str

    # SQLAlchemy attribute is metadata_,
    # API response remains "metadata".
    metadata: dict[str, Any] = Field(
        validation_alias="metadata_",
        default_factory=dict,
    )


# ============================================================
# ACTIVITY EVENT
# ============================================================


class ActivityEventCreate(BaseModel):
    project_id: UUID | None = None

    source: EventSource

    external_id: str = Field(
        min_length=1,
        max_length=255,
    )

    event_type: str = Field(
        min_length=1,
        max_length=100,
    )

    activity_class: ActivityClass
    activity_type: ActivityType

    occurred_at: datetime

    payload: dict[str, Any] = Field(
        default_factory=dict,
    )


class ActivityEventResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID

    user_id: UUID
    project_id: UUID | None

    source: EventSource

    external_id: str
    event_type: str

    activity_class: ActivityClass
    activity_type: ActivityType

    occurred_at: datetime
    occurred_on: date

    payload: dict[str, Any]

    ingested_at: datetime