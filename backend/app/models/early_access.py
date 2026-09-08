import uuid

from sqlalchemy import (
    Column,
    DateTime,
    String,
    Text,
    func,
)

from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class EarlyAccessSignup(Base):
    """A single email captured from the pre-launch / maintenance page.

    Deliberately minimal: no IP address and no user agent, so the table holds
    nothing beyond what someone knowingly typed into the form.
    """

    __tablename__ = "early_access_signups"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )

    # Stored normalised (stripped + lowercased) so the unique index is a real
    # duplicate guard rather than a case-sensitive one. 320 = RFC max length.
    email = Column(
        String(320),
        nullable=False,
        unique=True,
        index=True,
    )

    # Where the signup came from, so a later landing page or campaign can be
    # told apart from the maintenance page without another table.
    source = Column(
        String(64),
        nullable=False,
        server_default="maintenance",
        index=True,
    )

    referrer = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )
