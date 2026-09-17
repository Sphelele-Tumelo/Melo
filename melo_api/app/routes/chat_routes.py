from uuid import UUID

from app.controllers.chat_controller import (
    create_message_controller,
    delete_message_controller,
    get_messages_controller,
    update_message_controller,
)
from app.core.dependencies import get_current_user
from app.data.database import get_db
from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException, status
from schemas.chat import ChatResponse, MessageCreate, MessageResponse
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(tags=["Chat"])

DB_DEPENDENCY = Depends(get_db)
CURRENT_USER = Depends(get_current_user)


@router.post(
    "/create_message",
    status_code=status.HTTP_201_CREATED,
    response_model=ChatResponse,
)
async def create_message(
    conversation_id: UUID,
    message_data: MessageCreate,
    db: AsyncSession = DB_DEPENDENCY,
    current_user: User = CURRENT_USER,
):
    try:
        new_message = await create_message_controller(
            db=db,
            conversation_id=conversation_id,
            user_id=current_user.id,
            message_data=message_data,
        )

        return new_message

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("/get_messages", status_code=status.HTTP_200_OK, response_model=list[MessageResponse])
async def get_messages(
    conversation_id: UUID,
    db: AsyncSession = DB_DEPENDENCY,
    current_user: User = CURRENT_USER,
):
    try:
        return await get_messages_controller(
            db=db,
            conversation_id=conversation_id,
            user_id=current_user.id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

@router.put("/update_message", status_code=status.HTTP_200_OK, response_model=ChatResponse)
async def update_message(
    conversation_id: UUID,
    message_id: UUID,
    message_data: MessageCreate,
    db: AsyncSession = DB_DEPENDENCY,
    current_user: User = CURRENT_USER,
):
    return await update_message_controller(
        db=db,
        conversation_id=conversation_id,
        message_id=message_id,
        user_id=current_user.id,
        message_data=message_data,
    )

@router.delete("/delete_message", status_code=status.HTTP_200_OK)
async def delete_message(
    conversation_id: UUID,
    message_id: UUID,
    db: AsyncSession = DB_DEPENDENCY,
    current_user: User = CURRENT_USER,
):
    return await delete_message_controller(
        db=db,
        conversation_id=conversation_id,
        message_id=message_id,
        user_id=current_user.id,
    )