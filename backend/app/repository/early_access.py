from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.early_access import EarlyAccessSignup


def normalise_email(email: str) -> str:
    return email.strip().lower()


async def register_early_access(
    db: AsyncSession,
    *,
    email: str,
    source: str | None = None,
    referrer: str | None = None,
) -> bool:
    """Record an email, returning True when this call created the row.

    ON CONFLICT DO NOTHING keeps a double-submit (or two browser tabs) from
    raising IntegrityError, so the endpoint is idempotent without a
    read-then-write race.
    """

    statement = (
        pg_insert(EarlyAccessSignup)
        .values(
            email=normalise_email(email),
            source=source or "maintenance",
            referrer=referrer,
        )
        .on_conflict_do_nothing(
            index_elements=[EarlyAccessSignup.email],
        )
        .returning(EarlyAccessSignup.id)
    )

    inserted_id = await db.scalar(statement)

    await db.commit()

    return inserted_id is not None
