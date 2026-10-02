import hashlib
import hmac
import json

from fastapi import APIRouter, Header, HTTPException, Request, status

from app.core.config import settings


router = APIRouter(
    prefix="/github",
    tags=["GitHub"],
)


def verify_github_signature(
    body: bytes,
    signature: str | None,
) -> None:
    secret = settings.GITHUB_WEBHOOK_SECRET

    if not secret:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GitHub webhook secret is not configured",
        )

    if not signature:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing GitHub signature",
        )

    expected = (
        "sha256="
        + hmac.new(
            secret.encode("utf-8"),
            body,
            hashlib.sha256,
        ).hexdigest()
    )

    if not hmac.compare_digest(expected, signature):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid GitHub signature",
        )


@router.post("/webhook")
async def github_webhook(
    request: Request,
    x_github_event: str | None = Header(
        default=None,
        alias="X-GitHub-Event",
    ),
    x_github_delivery: str | None = Header(
        default=None,
        alias="X-GitHub-Delivery",
    ),
    x_hub_signature_256: str | None = Header(
        default=None,
        alias="X-Hub-Signature-256",
    ),
):
    body = await request.body()

    verify_github_signature(
        body,
        x_hub_signature_256,
    )

    try:
        payload = json.loads(body)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=400,
            detail="Invalid JSON payload",
        ) from exc

    if not x_github_event:
        raise HTTPException(
            status_code=400,
            detail="Missing GitHub event type",
        )

    # temporary until github_engine is wired
    return {
        "received": True,
        "event": x_github_event,
        "delivery": x_github_delivery,
    }