import os
import ipaddress
import re
import secrets
import socket
from urllib.parse import urljoin, urlsplit, urlunsplit

from anyio import to_thread
from fastapi import HTTPException
import httpx
from sqlalchemy import select

from app.models.project import Project


# =========================================================
# CONFIG
# =========================================================

# Optional. Unauthenticated GitHub API = 60 req/hour per IP.
# With a token = 5000 req/hour. Set GITHUB_TOKEN in env.
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

# Shared timeout for all outbound calls. Without this a hung
# remote host hangs the whole request indefinitely.
HTTP_TIMEOUT = httpx.Timeout(10.0)
MAX_LIVE_URL_REDIRECTS = 5
ALLOWED_LIVE_URL_PORTS = {80, 443}


def _github_headers():

    headers = {
        "Accept": "application/vnd.github+json",
    }

    if GITHUB_TOKEN:

        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

    return headers


# =========================================================
# FETCH + VERIFY GITHUB REPOSITORY
# =========================================================

async def fetch_github_url(
    github_url: str,
):

    github_url = github_url.strip()

    # -----------------------------------------------------
    # VALIDATE URL FORMAT
    # -----------------------------------------------------

    github_pattern = (
        r"^https:\/\/github\.com\/"
        r"([A-Za-z0-9_.-]+)\/"
        r"([A-Za-z0-9_.-]+)\/?$"
    )

    match = re.match(
        github_pattern,
        github_url,
    )

    if not match:

        raise HTTPException(
            status_code=400,
            detail="Invalid GitHub repository URL",
        )

    # -----------------------------------------------------
    # EXTRACT OWNER + REPO
    # -----------------------------------------------------

    owner = match.group(1)

    repo = match.group(2)

    # Strip a trailing ".git" if the user pasted a clone URL.
    if repo.endswith(".git"):

        repo = repo[:-4]

    github_api_url = (
        f"https://api.github.com/repos/{owner}/{repo}"
    )

    # -----------------------------------------------------
    # ONE CLIENT FOR BOTH CALLS (reuses the connection pool)
    # -----------------------------------------------------

    async with httpx.AsyncClient(
        timeout=HTTP_TIMEOUT,
        headers=_github_headers(),
    ) as client:

        # --- verify repository exists ---

        try:

            response = await client.get(github_api_url)

        except httpx.RequestError:

            raise HTTPException(
                status_code=502,
                detail="Could not reach GitHub",
            )

        if response.status_code == 404:

            raise HTTPException(
                status_code=404,
                detail="GitHub repository not found",
            )

        if response.status_code == 403:

            # Almost always rate limiting on the API.
            raise HTTPException(
                status_code=429,
                detail="GitHub API rate limit exceeded",
            )

        if response.status_code != 200:

            raise HTTPException(
                status_code=502,
                detail="GitHub verification failed",
            )

        github_data = response.json()

        # --- fetch languages ---

        tech_stack = []

        languages_url = github_data.get("languages_url")

        if languages_url:

            try:

                languages_response = await client.get(
                    languages_url
                )

                if languages_response.status_code == 200:

                    tech_stack = list(
                        languages_response.json().keys()
                    )

            except httpx.RequestError:

                # Languages are non-critical; degrade gracefully.
                tech_stack = []

    verified_github_url = github_url

    return (
        verified_github_url,
        github_data,
        tech_stack,
    )


# =========================================================
# VERIFY LIVE PROJECT URL
# =========================================================

def _normalize_live_url(live_url: str) -> str:
    clean_live_url = live_url.strip()
    if not clean_live_url:
        raise HTTPException(status_code=400, detail="Live project URL is required")

    if not clean_live_url.startswith(("https://", "http://")):
        clean_live_url = f"https://{clean_live_url}"

    try:
        parsed = urlsplit(clean_live_url)
        port = parsed.port
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid live project URL") from None

    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise HTTPException(status_code=400, detail="Invalid live project URL")
    if parsed.username is not None or parsed.password is not None:
        raise HTTPException(status_code=400, detail="Live project URL cannot contain credentials")

    effective_port = port or (443 if parsed.scheme == "https" else 80)
    if effective_port not in ALLOWED_LIVE_URL_PORTS:
        raise HTTPException(status_code=400, detail="Live project URL uses a blocked port")

    return urlunsplit((parsed.scheme, parsed.netloc, parsed.path or "/", parsed.query, ""))


def _resolve_host(hostname: str, port: int) -> set[str]:
    try:
        return {str(ipaddress.ip_address(hostname.strip("[]")))}
    except ValueError:
        records = socket.getaddrinfo(
            hostname,
            port,
            type=socket.SOCK_STREAM,
        )
        return {record[4][0] for record in records}


async def _require_public_live_url(url: str) -> None:
    parsed = urlsplit(url)
    port = parsed.port or (443 if parsed.scheme == "https" else 80)
    try:
        addresses = await to_thread.run_sync(_resolve_host, parsed.hostname, port)
    except (socket.gaierror, OSError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="Invalid or unreachable live URL",
        ) from None

    if not addresses:
        raise HTTPException(status_code=400, detail="Live project host did not resolve")

    for address in addresses:
        try:
            parsed_address = ipaddress.ip_address(address)
        except ValueError:
            raise HTTPException(status_code=400, detail="Live project host is invalid") from None
        if not parsed_address.is_global:
            raise HTTPException(
                status_code=400,
                detail="Live project URL targets a non-public address",
            )


async def _send_live_url_probe(
    client: httpx.AsyncClient,
    method: str,
    url: str,
) -> tuple[int, str | None]:
    await _require_public_live_url(url)
    request = client.build_request(method, url)
    response = await client.send(request, stream=True)
    try:
        return response.status_code, response.headers.get("location")
    finally:
        await response.aclose()

async def verify_live_url(
    live_url: str | None,
):

    if not live_url:

        return None

    clean_live_url = _normalize_live_url(live_url)

    # -----------------------------------------------------
    # VERIFY SITE IS REACHABLE
    #
    # HEAD first (cheap — no body download). Some servers
    # reject HEAD with 405, so fall back to GET in that case.
    # -----------------------------------------------------

    try:

        async with httpx.AsyncClient(
            follow_redirects=False,
            timeout=HTTP_TIMEOUT,
            trust_env=False,
        ) as client:
            current_url = clean_live_url
            method = "HEAD"
            for _ in range(MAX_LIVE_URL_REDIRECTS + 1):
                response_status, redirect_location = await _send_live_url_probe(
                    client,
                    method,
                    current_url,
                )

                if response_status == 405 and method == "HEAD":
                    method = "GET"
                    response_status, redirect_location = await _send_live_url_probe(
                        client,
                        method,
                        current_url,
                    )

                if response_status in {301, 302, 303, 307, 308}:
                    if not redirect_location:
                        raise HTTPException(status_code=400, detail="Invalid live URL redirect")
                    current_url = _normalize_live_url(
                        urljoin(current_url, redirect_location)
                    )
                    method = "HEAD"
                    continue

                if response_status >= 400:
                    raise HTTPException(
                        status_code=400,
                        detail="Live project URL is unreachable",
                    )
                return clean_live_url

            raise HTTPException(
                status_code=400,
                detail="Live project URL has too many redirects",
            )

    except httpx.RequestError:

        raise HTTPException(
            status_code=400,
            detail="Invalid or unreachable live URL",
        )

    raise HTTPException(status_code=400, detail="Live project URL verification failed")


# =========================================================
# SLUG GENERATION
# =========================================================

def get_project_slug(project_title):

    project_slug = project_title.lower().strip()

    # Drop anything that isn't a lowercase letter, digit,
    # whitespace, or hyphen.
    project_slug = re.sub(
        r"[^a-z0-9\s-]",
        "",
        project_slug,
    )

    # Whitespace runs -> single hyphen.
    project_slug = re.sub(
        r"\s+",
        "-",
        project_slug,
    )

    # Collapse repeated hyphens (e.g. "a -- b" -> "a-b").
    project_slug = re.sub(
        r"-+",
        "-",
        project_slug,
    )

    # No leading / trailing hyphen.
    project_slug = project_slug.strip("-")

    # Fallback if the title was entirely symbols/emoji.
    return project_slug or "project"


async def slug_exists(
    db,
    model,
    slug,
    user_id=None,
):

    query = select(model.id).where(
        model.slug == slug
    )

    if user_id:

        query = query.where(
            model.user_id == user_id
        )

    result = await db.execute(query)

    return result.first() is not None



async def generate_unique_slug(
    db,
    title,
    model,
    user_id=None,
):
    """
    Returns a readable, collision-free slug.

    Clean slug first.
    Entropy suffix only on collision.
    """

    base = get_project_slug(title)

    slug = base

    while await slug_exists(
        db=db,
        model=model,
        slug=slug,
        user_id=user_id,
    ):

        suffix = secrets.token_hex(3)

        slug = f"{base}-{suffix}"

    return slug
