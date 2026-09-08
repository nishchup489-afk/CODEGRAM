from pydantic import BaseModel, ConfigDict, EmailStr, Field


class EarlyAccessCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr

    source: str | None = Field(
        default=None,
        max_length=64,
    )

    referrer: str | None = Field(
        default=None,
        max_length=500,
    )


class EarlyAccessResponse(BaseModel):
    # Intentionally identical whether or not the address was already stored.
    # Saying "you are already on the list" would turn this public endpoint into
    # an email-enumeration oracle.
    detail: str
