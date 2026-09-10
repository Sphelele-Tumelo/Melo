from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from ...schemas.user import UserCreate, UserSignIn
from .services.user_service import create_user, logging_in_user


async def create_user_controller(
    db: AsyncSession,
    user_id: UUID,
    user_create: UserCreate
):
    return await create_user(
        db=db,
        user_id=user_id,
        user_create=user_create,
    )

async def logging_in_user_controller(
    db: AsyncSession,
    user_id: UUID,
    user_login: UserSignIn
):
    return await logging_in_user(
        db=db,
        user_id=user_id,
        user_login=user_login,
    )