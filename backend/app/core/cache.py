from redis.asyncio import Redis

from app.core.config import settings


redis = Redis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
)


async def ping_redis() -> bool:
    return bool(await redis.ping())


async def close_redis() -> None:
    await redis.aclose()