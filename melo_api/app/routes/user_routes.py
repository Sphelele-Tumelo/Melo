from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.security import hash_password, verify_password
from ..data.database import get_db
from ..models.user import User
from schemas.user import UserCreate, UserSignIn

router = APIRouter()

DB_DEPENDENCY = Depends(get_db)



@router.post("/sign_in", status_code=status.HTTP_200_OK)
async def sign_in(user: UserSignIn, db: AsyncSession = DB_DEPENDENCY):
     
    # Check if the user exists in the database
    result = await db.execute(select(User).where(User.email == user.email))
    existing_user = result.scalar_one_or_none()
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Verify the password (you may want to hash and compare)
    if not verify_password(user.password, existing_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
        )

    return {"message": "Sign-in successful"}



@router.post("/sign_up", status_code=status.HTTP_201_CREATED)
async def sign_up(user: UserCreate, db: AsyncSession = DB_DEPENDENCY):
    # Check if the user already exists in the database
    result = await db.execute(select(User).where(User.email == user.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists",
        )

    new_user = User(
        email=user.email,
        password_hash=hash_password(user.password),
        display_name=user.display_name,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return {"message": "Sign-up successful", "user_id": new_user.id}