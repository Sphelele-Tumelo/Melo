# app/services/auth_service.py

from uuid import UUID

import jwt
from app.core.dependencies import get_current_user
from app.core.security import decode_access_token
from app.data.database import get_db
from app.models import User
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

bearer_scheme = HTTPBearer()

DB_DEPENDENCY = Depends(get_db)
USER_DEPENDENCY = Depends(get_current_user)
SCHEME_DEPENDENCY = Depends(bearer_scheme)


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = SCHEME_DEPENDENCY,
) -> UUID:
    """
    Decodes the bearer token and returns the user_id from the 'sub' claim.
    Use this on any route that only needs the id (most routes).
    """
    token = credentials.credentials

    try:
        payload = decode_access_token(token)
        user_id_str = payload.get("sub")

        if user_id_str is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token.",
            )

        return UUID(user_id_str)

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please sign in again.",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )
    except (ValueError, TypeError):
        # UUID(...) raises ValueError if the 'sub' claim isn't a valid UUID string
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )


async def get_current_user(
    user_id: UUID = USER_DEPENDENCY,
    db: AsyncSession = DB_DEPENDENCY,
) -> User:
    """
    Full user object dependency — use when a route needs more than the id
    (e.g. checking email, subscription tier, etc.)
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )

    return user