from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.feedback import (
    FeedbackStatus,
    FeedbackType,
    FeedbackSentiment,
)

from app.models.support import (
    TicketCategory,
    TicketPriority,
    TicketStatus,
)


# =========================================================
# ADMIN DASHBOARD
# =========================================================

class AdminDashboardStats(BaseModel):
    total_users: int
    total_projects: int
    total_live_projects: int
    new_feedback: int
    open_support_tickets: int
    active_users: int


class AdminRecentUser(BaseModel):
    id: UUID
    clerk_user_id: str
    username: str
    display_name: str
    email: str | None = None
    is_active: bool
    is_banned: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminRecentProject(BaseModel):
    id: UUID
    title: str
    slug: str
    stars_count: int
    views_count: int
    is_featured: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminDashboardResponse(BaseModel):
    stats: AdminDashboardStats
    recent_users: list[AdminRecentUser]
    recent_projects: list[AdminRecentProject]


# =========================================================
# ADMIN FEEDBACK
# =========================================================

class AdminFeedbackItem(BaseModel):
    id: UUID
    user_id: UUID | None = None

    feedback_type: FeedbackType
    status: FeedbackStatus
    sentiment: FeedbackSentiment | None = None

    rating: int | None = None
    title: str | None = None
    message: str
    page_url: str | None = None
    contact_email: str | None = None

    admin_notes: str | None = None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminUpdateFeedback(BaseModel):
    status: FeedbackStatus | None = None
    sentiment: FeedbackSentiment | None = None
    admin_notes: str | None = None


# =========================================================
# ADMIN SUPPORT
# =========================================================

class AdminSupportTicketItem(BaseModel):
    id: UUID
    ticket_number: str

    user_id: UUID | None = None
    project_id: UUID | None = None

    category: TicketCategory
    status: TicketStatus
    priority: TicketPriority

    subject: str
    description: str

    internal_notes: str | None = None
    resolved_at: datetime | None = None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminUpdateSupportTicket(BaseModel):
    status: TicketStatus | None = None
    priority: TicketPriority | None = None
    internal_notes: str | None = None


# =========================================================
# ADMIN USERS
# =========================================================

class AdminUserItem(BaseModel):
    id: UUID
    clerk_user_id: str

    username: str
    display_name: str
    email: str | None = None

    project_count: int
    reports_count: int

    is_verified: bool
    is_active: bool
    is_private: bool
    is_banned: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminUpdateUser(BaseModel):
    is_verified: bool | None = None
    is_active: bool | None = None
    is_banned: bool | None = None


# =========================================================
# ADMIN PROJECTS
# =========================================================

class AdminProjectItem(BaseModel):
    id: UUID
    user_id: UUID

    title: str
    slug: str
    description: str

    github_url: str
    live_url: str | None = None
    thumbnail_url: str | None = None

    stars_count: int
    views_count: int
    comments_count: int

    is_featured: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminUpdateProject(BaseModel):
    is_featured: bool | None = None