from uuid import uuid4

from app.controllers.user_controller import (
    create_user_controller,
    logging_in_user_controller,
)
from app.services.auth_service import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from schemas.user import UserCreate, UserSignIn
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User

from ..core.security import create_access_token
from ..data.database import get_db

router = APIRouter(prefix="/user", tags=["User"])

DB_DEPENDENCY = Depends(get_db)


@router.post("/sign_up", status_code=status.HTTP_201_CREATED)
async def sign_up(
    user_create: UserCreate,
    db: AsyncSession = DB_DEPENDENCY,
):
    try:
        user_id = uuid4()

        new_user = await create_user_controller(
            db=db,
            user_id=user_id,
            user_create=user_create,
        )

        return {
            "message": "User created successfully",
            "user_id": str(new_user.id),
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/sign_in", status_code=status.HTTP_200_OK)
async def sign_in(
    user_login: UserSignIn,
    db: AsyncSession = DB_DEPENDENCY,
):
    try:
        logged_in_user = await logging_in_user_controller(
            db=db,
            user_login=user_login,
        )

        access_token = create_access_token(
            data={"sub": str(logged_in_user.id)}
        )

        return {
            "message": "User logged in successfully",
            "access_token": access_token,
            "token_type": "bearer",
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


USER_DEPENDENCY = Depends(get_current_user)

@router.get("/me", status_code=status.HTTP_200_OK)
async def get_me(user: User = USER_DEPENDENCY):
    return {
        "user_id": str(user.id),
        "display_name": user.display_name,
        "email": user.email,
    }