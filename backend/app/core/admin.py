from fastapi import Depends, HTTPException, status

from app.core.config import settings
from app.core.auth import get_current_user
from app.models.user import User


def require_admin(
    current_user: User = Depends(get_current_user),
) -> str:
    if current_user.clerk_user_id not in settings.admin_clerk_user_id_list:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user.clerk_user_id
