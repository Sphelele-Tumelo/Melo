from uuid import UUID

from schemas.user import UserCreate, UserSignIn
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.security import hash_password, verify_password
from ..models.user import User


async def create_user(
    db: AsyncSession,
    user_id: UUID,
    user_create: UserCreate
) -> User:
    # Check if the user already exists in the database
    result = await db.execute(select(User).where(User.email == user_create.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise ValueError("User already exists")

    new_user = User(
        id=user_id,
        email=user_create.email,
        password_hash=hash_password(user_create.password),
        display_name=user_create.display_name,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user



async def logging_in_user(
   db: AsyncSession,
   user_login: UserSignIn,
) -> User:
    # Check if user does not exist on database 
    result = await db.execute(select(User).where(User.email == user_login.email))
    existing_user = result.scalar_one_or_none()
    if existing_user is None:
        raise ValueError("User does not exist")

    # Check if the password is correct
    if not verify_password(user_login.password, existing_user.password_hash):
        raise ValueError("Incorrect password")
    
    return existing_user